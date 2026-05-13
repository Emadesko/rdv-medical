import { Injectable } from '@nestjs/common';
import { CreateRdvDto } from './dto/create-rdv.dto';
import { UpdateRdvDto } from './dto/update-rdv.dto';
import { GenericService } from '../../core/common/services/generic.service';
import { Rdv } from './entities/rdv.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { StatutCreneau } from '../creneau/enums/statut-creneau';
import { Specialite } from '../specialite/entities/specialite.entity';
import { Docteur } from '../docteur/entities/docteur.entity';
import { Creneau } from '../creneau/entities/creneau.entity';
import { NotFoundException } from '../../core/utils/exceptions/not-found.exception';
import { StatutRdv } from './enums/statut-rdv';
import { PatientService } from '../patient/patient.service';
import { User } from '../../core/modules/user/entities/user.entity';
import { PaginationRequest } from '../../core/common/dto/requests/pagination.request';
import { PaginationResponse } from '../../core/common/dto/responses/rest.response';
import { ConflictException } from '../../core/utils/exceptions/conflict.exception';
import { DocteurService } from '../docteur/docteur.service';
import { ForbiddenException } from '../../core/utils/exceptions/forbidden.exception';
import { BictorysService } from '../../common/bictorys/bictorys.service';
import { MailService } from '../../common/mail/mail.service';
import { RedisService } from '../../common/redis/redis.service';
import { RdvExpirationCron } from './crons/rdv-expiration.cron';
import { DateFormatHelper } from '../../common/helpers/date-format.helper';
import { ServiceSpecialite } from '../service-specialite/entities/service-specialite.entity';

@Injectable()
export class RdvService extends GenericService<Rdv> {
  constructor(
    @InjectRepository(Rdv) protected readonly repo: Repository<Rdv>,
    @InjectRepository(Specialite)
    private specialiteRepo: Repository<Specialite>,

    @InjectRepository(ServiceSpecialite)
    private serviceSpecialiteRepo: Repository<ServiceSpecialite>,

    @InjectRepository(Docteur)
    private docteurRepo: Repository<Docteur>,

    @InjectRepository(Creneau)
    private creneauRepo: Repository<Creneau>,
    private patientService: PatientService,
    private docteurService: DocteurService,
    private bictorysService: BictorysService,
    private mailService: MailService,
    private redisService: RedisService,
    private rdvExpirationCron: RdvExpirationCron,
  ) {
    super(repo, 'Aucun rendez vous ne correspond à cet identifiant');
  }
  async creation(user: User, createRdvDto: CreateRdvDto) {
    const patient = await this.patientService.getByUser(user);

    const creneau = await this.creneauRepo.findOne({
      where: {
        id: createRdvDto.creneauId,
        statut: In([StatutCreneau.DISPONIBLE, StatutCreneau.EN_ATTENTE]),
      },
      relations: ['docteur'], // ← ajouter pour avoir le nom du docteur
    });
    if (!creneau) throw new NotFoundException('Créneau non disponible');

    const service = await this.serviceSpecialiteRepo.findOne({
      where: { id: createRdvDto.serviceSpecialiteId },
      relations: ['serviceMedical'],
    });
    if (!service) throw new NotFoundException('Service non trouvé');
    if (!service.serviceMedical.actif)
      throw new ConflictException("Ce service n'est pas disponible");

    const rdv = new Rdv();
    rdv.creneau = creneau;
    rdv.patient = patient;
    rdv.service = service;
    rdv.motif = createRdvDto.motif;
    rdv.statut = StatutRdv.EN_ATTENTE;

    creneau.statut = StatutCreneau.EN_ATTENTE;
    await this.creneauRepo.save(creneau);
    await this.repo.save(rdv);

    await this.mailService.sendDemandeCreee(
      patient.user.email,
      `${patient.prenom} ${patient.nom}`,
      {
        service: service.serviceMedical.nom,
        date: DateFormatHelper.formatDateLong(new Date(creneau.date)),
        heure: creneau.heureDebut,
        docteur: `Dr. ${creneau.docteur.prenom} ${creneau.docteur.nom}`,
        prix: service.serviceMedical.prix,
        motif: createRdvDto.motif,
      },
    );

    return rdv;
  }

  updating(id: number, updateRdvDto: UpdateRdvDto) {
    return `This action updates a #${id} rdv`;
  }

  async getSpecialites() {
    const specialites = await this.specialiteRepo
      .createQueryBuilder('s')
      .loadRelationCountAndMap('s.nombreMedecins', 's.docteurs')
      .getMany();

    return specialites.map((s) => ({
      id: s.id,
      nom: s.nom,
      description: s.description,
      nombreMedecins: (s as any).nombreMedecins ?? 0,
    }));
  }

  async getMedecinsBySpecialite(specialiteId: number) {
    const docteurs = await this.docteurRepo
      .createQueryBuilder('d')
      .innerJoin('d.specialites', 'ds_filter')
      .innerJoin('ds_filter.specialite', 's_filter')
      .where('s_filter.id = :specialiteId', { specialiteId })
      .leftJoinAndSelect('d.specialites', 'ds')
      .leftJoinAndSelect('ds.specialite', 's')
      .getMany();

    return docteurs.map((d) => ({
      id: d.id,
      nom: d.nom,
      prenom: d.prenom,
      avatar: d.avatar,
      specialites: (d.specialites ?? [])
        .map((ds) => ds.specialite?.nom)
        .filter(Boolean),
    }));
  }

  async getServicesBySpecialite(specialiteId: number) {
    const specialite = await this.specialiteRepo.findOne({
      where: { id: specialiteId },
      relations: ['serviceMedicals', 'serviceMedicals.serviceMedical'],
    });

    if (!specialite) throw new NotFoundException('Spécialité non trouvée');

    return specialite.serviceMedicals
      .filter((ss) => ss.actif && ss.serviceMedical.actif)
      .map((ss) => ({
        id: ss.id,
        nom: ss.serviceMedical.nom,
        description: ss.serviceMedical.description,
        prix: ss.serviceMedical.prix,
        duree: ss.serviceMedical.duree,
      }));
  }

  async getJoursDisponibles(docteurId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const creneaux = await this.creneauRepo
      .createQueryBuilder('c')
      .where('c.docteurId = :docteurId', { docteurId })
      .andWhere('c.statut IN (:...statuts)', {
        statuts: [StatutCreneau.DISPONIBLE, StatutCreneau.EN_ATTENTE],
      })
      .andWhere('c.date >= :today', {
        today: today.toISOString().split('T')[0],
      })
      .orderBy('c.date', 'ASC')
      .getMany();

    if (!creneaux.length) return { jours: [], min: null, max: null };

    const joursMap = new Map<
      string,
      { date: string; nombreCreneaux: number }
    >();

    for (const c of creneaux) {
      const dateStr = new Date(c.date).toISOString().split('T')[0];
      if (!joursMap.has(dateStr)) {
        joursMap.set(dateStr, { date: dateStr, nombreCreneaux: 0 });
      }
      joursMap.get(dateStr)!.nombreCreneaux++;
    }

    const jours = Array.from(joursMap.values());

    return {
      jours,
      min: jours[0].date,
      max: jours[jours.length - 1].date,
    };
  }

  async getCreneauxByDocteurAndDate(docteurId: number, date: string) {
    const today = new Date().toISOString().split('T')[0];
    const isToday = date === today;

    const query = this.creneauRepo
      .createQueryBuilder('c')
      .where('c.docteurId = :docteurId', { docteurId })
      .andWhere('c.date = :date', { date })
      .andWhere('c.statut IN (:...statuts)', {
        statuts: [StatutCreneau.DISPONIBLE, StatutCreneau.EN_ATTENTE],
      });

    if (isToday) {
      const now = new Date();
      const heureActuelle = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      query.andWhere('c.heureDebut > :heureActuelle', { heureActuelle });
    }

    return (await query.orderBy('c.heureDebut', 'ASC').getMany()).map((c) => ({
      id: c.id,
      start: c.heureDebut,
      end: c.heureFin,
    }));
  }

  async getMesRdv(
    user: User,
    pagination: PaginationRequest,
  ): Promise<{
    data: { stats: any; rdvs: any[] };
    pagination: PaginationResponse;
  }> {
    const patient = await this.patientService.getByUser(user);
    const { page, size } = pagination;

    const [rdvs, total] = await this.repo
      .createQueryBuilder('rdv')
      .leftJoinAndSelect('rdv.creneau', 'creneau')
      .leftJoinAndSelect('creneau.docteur', 'docteur')
      .leftJoinAndSelect('rdv.service', 'ss')
      .leftJoinAndSelect('ss.serviceMedical', 'service')
      .where('rdv.patient = :patientId', { patientId: patient.id })
      .orderBy('creneau.date', 'DESC')
      .addOrderBy('creneau.heureDebut', 'DESC')
      .skip(page * size)
      .take(size)
      .getManyAndCount();

    const tousRdvs = await this.repo
      .createQueryBuilder('rdv')
      .leftJoinAndSelect('rdv.creneau', 'creneau')
      .leftJoinAndSelect('creneau.docteur', 'docteur')
      .leftJoinAndSelect('rdv.service', 'ss')
      .leftJoinAndSelect('ss.serviceMedical', 'service')
      .where('rdv.patient = :patientId', { patientId: patient.id })
      .getMany();

    const today = new Date().toISOString().split('T')[0];

    const prochainRdv =
      tousRdvs
        .filter(
          (r) =>
            r.statut === StatutRdv.PAYE &&
            new Date(r.creneau.date).toISOString().split('T')[0] >= today,
        )
        .sort(
          (a, b) =>
            new Date(a.creneau.date).getTime() -
            new Date(b.creneau.date).getTime(),
        )[0] ?? null;

    return {
      data: {
        stats: {
          enAttente: tousRdvs.filter((r) => r.statut === StatutRdv.EN_ATTENTE)
            .length,
          aPayer: tousRdvs.filter((r) => r.statut === StatutRdv.VALIDE).length,
          confirmes: tousRdvs.filter((r) => r.statut === StatutRdv.CONFIRME)
            .length,
          prochainRdv: prochainRdv
            ? {
                date: DateFormatHelper.formatDateLong(
                  new Date(prochainRdv.creneau.date),
                ),
                heure: prochainRdv.creneau.heureDebut,
                docteur: `Dr. ${prochainRdv.creneau.docteur.prenom} ${prochainRdv.creneau.docteur.nom}`,
              }
            : null,
        },
        rdvs: await Promise.all(
          rdvs.map(async (r) => ({
            id: r.id,
            statut: r.statut,
            motifRejet: r.motifRejet,

            prix: r.service.serviceMedical.prix,
            service: r.service.serviceMedical.nom,

            ttl:
              r.statut == StatutRdv.VALIDE
                ? await this.redisService.ttl(`payment_link:${r.id}`)
                : null,

            docteur: {
              nom: `Dr. ${r.creneau.docteur.prenom} ${r.creneau.docteur.nom}`,
              avatar: r.creneau.docteur.avatar,
            },

            date: DateFormatHelper.formatDateLong(new Date(r.creneau.date)),

            heure: r.creneau.heureDebut,

            peutAnnuler: [StatutRdv.EN_ATTENTE, StatutRdv.VALIDE].includes(
              r.statut,
            ),
          })),
        ),
      },
      pagination: new PaginationResponse(total, size, page),
    };
  }

  async annulerRdv(rdvId: number, user: User) {
    const patient = await this.patientService.getByUser(user);

    const rdv = await this.repo.findOne({
      where: { id: rdvId, patient: { id: patient.id } },
      relations: ['creneau', 'creneau.rdvs'],
    });

    if (!rdv) throw new NotFoundException('Rendez-vous non trouvé');

    if (![StatutRdv.EN_ATTENTE, StatutRdv.VALIDE].includes(rdv.statut)) {
      throw new ConflictException(
        `Impossible d'annuler un rendez-vous déjà "${rdv.statut.toLowerCase()}"`,
      );
    }

    rdv.statut = StatutRdv.ANNULE;
    await this.repo.save(rdv);

    const creneau = rdv.creneau;

    const autresDemandesEnAttente = creneau.rdvs.filter(
      (r) => r.id !== rdv.id && r.statut === StatutRdv.EN_ATTENTE,
    );

    if (autresDemandesEnAttente.length > 0) {
      creneau.statut = StatutCreneau.EN_ATTENTE;
    } else {
      creneau.statut = StatutCreneau.DISPONIBLE;
    }

    await this.creneauRepo.save(creneau);

    return rdv;
  }

  async getDemandes(
    user: User,
    pagination: PaginationRequest,
  ): Promise<{ data: any[]; pagination: PaginationResponse }> {
    const docteur = await this.docteurService.getByUser(user);
    const { page, size } = pagination;

    const [rdvs, total] = await this.repo
      .createQueryBuilder('rdv')
      .leftJoinAndSelect('rdv.creneau', 'creneau')
      .leftJoinAndSelect('rdv.patient', 'patient')
      .leftJoinAndSelect('patient.user', 'user')
      .leftJoinAndSelect('rdv.service', 'ss')
      .leftJoinAndSelect('ss.serviceMedical', 'service')
      .where('creneau.docteur = :docteurId', { docteurId: docteur.id })
      .andWhere('rdv.statut = :statut', { statut: StatutRdv.EN_ATTENTE })
      .orderBy('creneau.date', 'ASC')
      .addOrderBy('creneau.heureDebut', 'ASC')
      .skip(page * size)
      .take(size)
      .getManyAndCount();

    return {
      data: rdvs.map((r) => ({
        id: r.id,
        statut: r.statut,
        motif: r.motif,
        patient: {
          nom: `${r.patient.prenom} ${r.patient.nom}`,
          email: r.patient.user.email,
          telephone: r.patient.telephone,
          avatar: r.patient.avatar,
        },
        service: r.service.serviceMedical.nom,
        prix: r.service.serviceMedical.prix,
        date: DateFormatHelper.formatDateLong(new Date(r.creneau.date)),
        heure: r.creneau.heureDebut,
      })),
      pagination: new PaginationResponse(total, size, page),
    };
  }

  async valider(rdvId: number, user: User) {
    const docteur = await this.docteurService.getByUser(user);

    const rdv = await this.repo.findOne({
      where: { id: rdvId },
      relations: [
        'creneau',
        'creneau.docteur',
        'patient',
        'patient.user',
        'service',
        'service.serviceMedical',
      ],
    });

    if (!rdv) throw new NotFoundException('Rendez-vous non trouvé');

    if (rdv.creneau.docteur.id !== docteur.id)
      throw new ForbiddenException('Cette demande ne vous est pas destinée');

    const today = new Date().toISOString().split('T')[0];
    const creneauDate = new Date(rdv.creneau.date).toISOString().split('T')[0];

    if (creneauDate === today) {
      const now = new Date();
      const [h, m] = rdv.creneau.heureDebut.split(':').map(Number);
      const heureDebut = new Date();
      heureDebut.setHours(h, m, 0, 0);

      if (now > heureDebut) {
        throw new ConflictException(
          'Impossible de valider ce rendez-vous — le créneau est déjà passé',
        );
      }
    }

    if (rdv.creneau.statut === StatutCreneau.VALIDE)
      throw new ForbiddenException(
        "Un rendez-vous pour ce créneau est en attente de paiement. Veuillez patienter l'expiration du délai de paiement.",
      );

    if (rdv.statut !== StatutRdv.EN_ATTENTE)
      throw new ConflictException(
        `Impossible de valider un RDV avec le statut "${rdv.statut}"`,
      );

    rdv.statut = StatutRdv.VALIDE;
    rdv.alreadyValidate = true;
    await this.repo.save(rdv);

    rdv.creneau.statut = StatutCreneau.VALIDE;
    await this.creneauRepo.save(rdv.creneau);

    const bictorysUrl = await this.bictorysService.createPaymentLink({
      rdvId: rdv.id,
      montant: rdv.service.serviceMedical.prix,
      description: `Consultation - ${rdv.service.serviceMedical.nom}`,
      customerEmail: rdv.patient.user.email,
      customerName: `${rdv.patient.prenom} ${rdv.patient.nom}`,
      customerPhone: rdv.patient.telephone,
    });

    await this.redisService.set(
      `payment_link:${rdv.id}`,
      bictorysUrl,
      Number(process.env.PAYMENT_LINK_EXPIRES_IN),
    );

    await this.redisService.set(
      `payment_timer:${rdv.id}`,
      rdv.id.toString(),
      3600,
    );

    const paymentPageUrl = `${process.env.FRONTEND_URL}/mes-rdv?payer=${rdv.id}`;
    await this.mailService.sendPaymentLink(
      rdv.patient.user.email,
      `${rdv.patient.prenom} ${rdv.patient.nom}`,
      paymentPageUrl,
      {
        service: rdv.service.serviceMedical.nom,
        date: DateFormatHelper.formatDateLong(new Date(rdv.creneau.date)),
        heure: rdv.creneau.heureDebut,
        prix: rdv.service.serviceMedical.prix,
        docteur: `Dr. ${docteur.prenom} ${docteur.nom}`,
      },
    );

    return rdv;
  }

  async rejeter(rdvId: number, user: User, motif: string) {
    const docteur = await this.docteurService.getByUser(user);

    const rdv = await this.repo.findOne({
      where: { id: rdvId },
      relations: [
        'creneau',
        'creneau.docteur',
        'creneau.rdvs',
        'patient',
        'patient.user',
        'service',
        'service.serviceMedical',
      ],
    });

    if (!rdv) throw new NotFoundException('Rendez-vous non trouvé');

    if (rdv.creneau.docteur.id !== docteur.id)
      throw new ForbiddenException('Cette demande ne vous est pas destinée');

    if (![StatutRdv.EN_ATTENTE, StatutRdv.VALIDE].includes(rdv.statut)) {
      throw new ConflictException(
        `Impossible de rejeter un rendez-vous déjà "${rdv.statut.toLowerCase()}"`,
      );
    }

    const ancienStatut = rdv.statut;

    rdv.statut = StatutRdv.REJETE;
    rdv.motifRejet = motif;
    await this.repo.save(rdv);

    if (ancienStatut === StatutRdv.VALIDE) {
      await this.redisService.del(`payment_link:${rdv.id}`);
      await this.redisService.del(`payment_timer:${rdv.id}`);
    }

    const autresDemandesEnAttente = rdv.creneau.rdvs.filter(
      (r) => r.id !== rdv.id && r.statut === StatutRdv.EN_ATTENTE,
    );

    if (autresDemandesEnAttente.length > 0) {
      rdv.creneau.statut = StatutCreneau.EN_ATTENTE;
    } else {
      rdv.creneau.statut = StatutCreneau.DISPONIBLE;
    }
    await this.creneauRepo.save(rdv.creneau);

    await this.mailService.sendRejet(
      rdv.patient.user.email,
      `${rdv.patient.prenom} ${rdv.patient.nom}`,
      motif,
      {
        service: rdv.service.serviceMedical.nom,
        date: DateFormatHelper.formatDateLong(new Date(rdv.creneau.date)),
        heure: rdv.creneau.heureDebut,
        prix: rdv.service.serviceMedical.prix,
        docteur: `Dr. ${docteur.prenom} ${docteur.nom}`,
      },
    );

    return rdv;
  }

  async getPaymentLink(rdvId: number, user: User) {
    const patient = await this.patientService.getByUser(user);

    const rdv = await this.repo.findOne({
      where: { id: rdvId, patient: { id: patient.id } },
      relations: ['creneau', 'service'],
    });

    if (!rdv) throw new NotFoundException('Rendez-vous non trouvé');

    if (rdv.statut === StatutRdv.PAYE)
      throw new ConflictException('Ce rendez-vous a déja été payé');

    if (rdv.statut !== StatutRdv.VALIDE)
      throw new ConflictException(
        "Ce rendez-vous n'est pas en attente de paiement",
      );

    if (!(await this.redisService.get(`payment_timer:${rdvId}`))) {
      await this.rdvExpirationCron.handleExpiredPayments();
      throw new ForbiddenException(
        "Le délai d'expiration du paiement est passé!\nVeuillez attentre la revalidation du médecin",
      );
    }

    const redisKey = `payment_link:${rdvId}`;
    const lien = await this.redisService.get(redisKey);

    if (!lien) {
      return { expired: true };
    }

    if (process.env.NODE_ENV === 'development') {
      rdv.statut = StatutRdv.PAYE;
      await this.repo.save(rdv);

      rdv.creneau.statut = StatutCreneau.RESERVE;
      await this.creneauRepo.save(rdv.creneau);

      await this.redisService.del(redisKey);
      await this.redisService.del(`payment_timer:${rdvId}`);

      const rdvComplet = await this.repo.findOne({
        where: { id: rdvId },
        relations: [
          'creneau',
          'creneau.docteur',
          'patient',
          'patient.user',
          'service',
          'service.serviceMedical',
        ],
      });

      if (!rdvComplet) throw new NotFoundException('Rendez vous non trouvé');

      await this.mailService.sendConfirmationPaiement(
        rdvComplet.patient.user.email,
        `${rdvComplet.patient.prenom} ${rdvComplet.patient.nom}`,
        {
          service: rdvComplet.service.serviceMedical.nom,
          date: DateFormatHelper.formatDateLong(
            new Date(rdvComplet.creneau.date),
          ),
          heure: rdvComplet.creneau.heureDebut,
          prix: rdvComplet.service.serviceMedical.prix,
          docteur: `Dr. ${rdvComplet.creneau.docteur.prenom} ${rdvComplet.creneau.docteur.nom}`,
        },
      );

      return { expired: false, message: 'Paiement simulé avec succès' };
    }

    return { url: lien, expired: false };
  }

  async regeneratePaymentLink(rdvId: number, user: User) {
    const patient = await this.patientService.getByUser(user);

    const rdv = await this.repo.findOne({
      where: { id: rdvId, patient: { id: patient.id } },
      relations: [
        'creneau',
        'creneau.docteur',
        'patient',
        'patient.user',
        'service',
        'service.serviceMedical',
      ],
    });

    if (!rdv) throw new NotFoundException('Rendez-vous non trouvé');
    if (rdv.statut !== StatutRdv.VALIDE)
      throw new ForbiddenException(
        "Ce rendez-vous n'est pas en attente de paiement",
      );

    const timer = await this.redisService.get(`payment_timer:${rdvId}`);
    if (!timer) {
      await this.rdvExpirationCron.handleExpiredPayments();
      throw new ForbiddenException(
        'Le délai de paiement de 30 minutes est dépassé',
      );
    }

    const bictorysUrl = await this.bictorysService.createPaymentLink({
      rdvId: rdv.id,
      montant: rdv.service.serviceMedical.prix,
      description: `Consultation - ${rdv.service.serviceMedical.nom}`,
      customerEmail: rdv.patient.user.email,
      customerName: `${rdv.patient.prenom} ${rdv.patient.nom}`,
      customerPhone: rdv.patient.telephone,
    });

    await this.redisService.set(
      `payment_link:${rdvId}`,
      bictorysUrl,
      Number(process.env.PAYMENT_LINK_EXPIRES_IN),
    );

    return { url: bictorysUrl };
  }
}
