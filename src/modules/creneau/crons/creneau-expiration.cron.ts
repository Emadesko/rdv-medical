import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Creneau } from '../entities/creneau.entity';
import { StatutCreneau } from '../enums/statut-creneau';

@Injectable()
export class CreneauExpirationCron {
  constructor(
    @InjectRepository(Creneau) private creneauRepo: Repository<Creneau>,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handlePassedCreneaux() {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const heureActuelle = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const creneauxDispo = await this.creneauRepo
      .createQueryBuilder('creneau')
      .where('creneau.statut = :statut', { statut: StatutCreneau.DISPONIBLE })
      .andWhere('creneau.date = :today', { today })
      .andWhere('creneau.heureDebut <= :heureActuelle', { heureActuelle })
      .getMany();

    for (const creneau of creneauxDispo) {
      creneau.statut = StatutCreneau.DEPASSE;
      await this.creneauRepo.save(creneau);
    }
  }
}
