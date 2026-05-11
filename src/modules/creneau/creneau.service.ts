import { Injectable } from '@nestjs/common';
import { CreateCreneauDto } from './dto/create-creneau.dto';
import { UpdateCreneauDto } from './dto/update-creneau.dto';
import { GenericService } from '../../core/common/services/generic.service';
import { Creneau } from './entities/creneau.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Docteur } from '../docteur/entities/docteur.entity';
import { StatutCreneau } from './enums/statut-creneau';
import { ForbiddenException } from '../../core/utils/exceptions/forbidden.exception';
import { ConflictException } from '../../core/utils/exceptions/conflict.exception';

@Injectable()
export class CreneauService extends GenericService<Creneau> {
  constructor(
    @InjectRepository(Creneau)
    protected repo: Repository<Creneau>,
  ) {
    super(repo, 'Aucun creneau ne correspond a cet identifiant');
  }

  async creation(docteur: Docteur, createCreneauDto: CreateCreneauDto) {
    this.validateCreneauRequest(createCreneauDto);

    const generated = this.genererCreneaux(createCreneauDto);

    const entities: Creneau[] = [];

    for (const creneau of generated) {
      await this.verifierConflit(
        docteur,
        createCreneauDto.date,
        creneau.heureDebut,
        creneau.heureFin,
      );

      const entity = this.repo.create({
        date: this.buildSimpleDate(createCreneauDto.date),
        heureDebut: creneau.heureDebut,
        heureFin: creneau.heureFin,
        statut: StatutCreneau.DISPONIBLE,
        docteur,
      });

      entities.push(entity);
    }

    return await this.repo.save(entities);
  }

  updating(id: number, updateCreneauDto: UpdateCreneauDto) {
    return `This action updates a #${id} creneau`;
  }

  findDisponiblesByDocteurAndDate(docteur: Docteur, date: string) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return this.repo.find({
      where: {
        docteur: { id: docteur.id },
        statut: StatutCreneau.DISPONIBLE,
        date: Between(start, end),
      },
      order: {
        heureDebut: 'ASC',
      },
    });
  }

  async findAgendaByDocteur(docteur: Docteur, start?: string, end?: string) {
    const now = new Date();

    const startDate = start ? new Date(start) : now;

    const endDate = end
      ? new Date(end)
      : new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return this.repo.find({
      where: {
        docteur: { id: docteur.id },
        date: Between(startDate, endDate),
      },
      order: {
        date: 'ASC',
        heureDebut: 'ASC',
      },
    });
  }

  validateCreneauRequest(dto: CreateCreneauDto) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [year, month, day] = dto.date.split('-').map(Number);

    const date = new Date(year, month - 1, day);

    if (date < today) {
      throw new ForbiddenException('La date ne peut pas être dans le passé');
    }

    const [hDebut, mDebut] = dto.heureDebut.split(':').map(Number);

    const [hFin, mFin] = dto.heureFin.split(':').map(Number);

    const debutMinutes = hDebut * 60 + mDebut;

    const finMinutes = hFin * 60 + mFin;

    if (debutMinutes < 8 * 60) {
      throw new ForbiddenException(
        "L'heure de début ne peut pas être avant 08:00",
      );
    }

    if (finMinutes > 17 * 60) {
      throw new ForbiddenException("L'heure de fin ne peut pas dépasser 17:00");
    }

    if (debutMinutes >= finMinutes) {
      throw new ForbiddenException(
        "L'heure de début doit être avant l'heure de fin",
      );
    }

    const isToday = date.toDateString() === new Date().toDateString();

    if (isToday) {
      const now = new Date();

      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      if (debutMinutes <= nowMinutes) {
        throw new ForbiddenException(
          "L'heure de début doit être après l'heure actuelle",
        );
      }
    }
  }

  private genererCreneaux(dto: CreateCreneauDto) {
    const [hDebut, mDebut] = dto.heureDebut.split(':').map(Number);

    const [hFin, mFin] = dto.heureFin.split(':').map(Number);

    let debutMinutes = hDebut * 60 + mDebut;

    const finMinutes = hFin * 60 + mFin;

    const creneaux: {
      heureDebut: string;
      heureFin: string;
    }[] = [];

    while (debutMinutes < finMinutes) {
      const finCreneau =
        debutMinutes + dto.duree > finMinutes
          ? finMinutes
          : debutMinutes + dto.duree;

      creneaux.push({
        heureDebut: this.minutesToTime(debutMinutes),
        heureFin: this.minutesToTime(finCreneau),
      });

      debutMinutes = finCreneau;
    }

    return creneaux;
  }

  private async verifierConflit(
    docteur: Docteur,
    date: string,
    heureDebut: string,
    heureFin: string,
  ) {
    const conflit = await this.repo
      .createQueryBuilder('c')
      .where('c.docteurId = :docteurId', {
        docteurId: docteur.id,
      })
      .andWhere('c.date = :date', {
        date,
      })
      .andWhere(':heureDebut < c.heureFin AND :heureFin > c.heureDebut', {
        heureDebut,
        heureFin,
      })
      .getOne();

    if (conflit) {
      throw new ConflictException(
        `Un créneau existe déjà sur la plage horaire ${heureDebut} - ${heureFin}`,
      );
    }
  }

  private minutesToTime(minutes: number): string {
    const h = Math.floor(minutes / 60)
      .toString()
      .padStart(2, '0');

    const m = (minutes % 60).toString().padStart(2, '0');

    return `${h}:${m}`;
  }

  private buildSimpleDate(date: string): Date {
    const [year, month, day] = date.split('-').map(Number);

    return new Date(year, month - 1, day);
  }
}
