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
import { Patient } from '../patient/entities/patient.entity';
import { ServiceMedical } from '../service-medical/entities/service-medical.entity';
import { StatutRdv } from './enums/statut-rdv';
import { PatientService } from '../patient/patient.service';
import { User } from '../../core/modules/user/entities/user.entity';

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
    const creneaux = await this.creneauRepo.find({
      where: {
        docteur: { id: docteurId },
        date: new Date(date),
        statut: In([StatutCreneau.DISPONIBLE, StatutCreneau.EN_ATTENTE]),
      },
      order: { heureDebut: 'ASC' },
    });

    return creneaux.map((c) => ({
      id: c.id,
      start: c.heureDebut,
      end: c.heureFin,
    }));
  }
}
