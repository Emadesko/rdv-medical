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
import { ServiceMedical } from '../service-medical/entities/service-medical.entity';
import { StatutRdv } from './enums/statut-rdv';
import { PatientService } from '../patient/patient.service';
import { User } from '../../core/modules/user/entities/user.entity';
import { PaginationRequest } from '../../core/common/dto/requests/pagination.request';
import { PaginationResponse } from '../../core/common/dto/responses/rest.response';
import { ConflictException } from '../../core/utils/exceptions/conflict.exception';
import { DocteurService } from '../docteur/docteur.service';

@Injectable()
export class RdvService extends GenericService<Rdv> {
  constructor(
    @InjectRepository(Rdv) protected readonly repo: Repository<Rdv>,
    @InjectRepository(Specialite)
    private specialiteRepo: Repository<Specialite>,

    @InjectRepository(ServiceMedical)
    private serviceMedicalRepo: Repository<ServiceMedical>,

    @InjectRepository(Docteur)
    private docteurRepo: Repository<Docteur>,

    @InjectRepository(Creneau)
    private creneauRepo: Repository<Creneau>,
    private patientService: PatientService,
    private docteurService: DocteurService,
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
    });
    if (!creneau) throw new NotFoundException('Créneau non disponible');

    const service = await this.serviceMedicalRepo.findOne({
      where: { id: createRdvDto.serviceMedicalId, actif: true },
    });
    if (!service) throw new NotFoundException('Service non trouvé');

    const rdv = new Rdv();
    rdv.creneau = creneau;
    rdv.patient = patient;
    rdv.service = service;
    rdv.motif = createRdvDto.motif;
    rdv.statut = StatutRdv.EN_ATTENTE;

    creneau.statut = StatutCreneau.EN_ATTENTE;
    await this.creneauRepo.save(creneau);

    return await this.repo.save(rdv);
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
      .map((ss) => ss.serviceMedical)
      .filter((s) => s.actif)
      .map((s) => ({
        id: s.id,
        nom: s.nom,
        description: s.description,
        prix: s.prix,
        duree: s.duree,
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
      .leftJoinAndSelect('rdv.service', 'service')
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
      .leftJoinAndSelect('rdv.service', 'service')
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
                date: this.formatDateLong(new Date(prochainRdv.creneau.date)),
                heure: prochainRdv.creneau.heureDebut,
                docteur: `Dr. ${prochainRdv.creneau.docteur.prenom} ${prochainRdv.creneau.docteur.nom}`,
              }
            : null,
        },
        rdvs: rdvs.map((r) => ({
          id: r.id,
          statut: r.statut,
          prix: r.service.prix,
          service: r.service.nom,
          docteur: {
            nom: `Dr. ${r.creneau.docteur.prenom} ${r.creneau.docteur.nom}`,
            avatar: r.creneau.docteur.avatar,
          },
          date: this.formatDateLong(new Date(r.creneau.date)),
          heure: r.creneau.heureDebut,
          peutAnnuler: [StatutRdv.EN_ATTENTE, StatutRdv.VALIDE].includes(
            r.statut,
          ),
        })),
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
      .leftJoinAndSelect('rdv.service', 'service')
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
        service: r.service.nom,
        prix: r.service.prix,
        date: this.formatDateLong(new Date(r.creneau.date)),
        heure: r.creneau.heureDebut,
      })),
      pagination: new PaginationResponse(total, size, page),
    };
  }

  private formatDateLong(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}
