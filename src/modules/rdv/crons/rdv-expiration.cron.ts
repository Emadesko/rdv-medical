import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rdv } from '../entities/rdv.entity';
import { Creneau } from '../../creneau/entities/creneau.entity';
import { RedisService } from '../../../common/redis/redis.service';
import { StatutRdv } from '../enums/statut-rdv';
import { StatutCreneau } from '../../creneau/enums/statut-creneau';
import { MailService } from '../../../common/mail/mail.service';
import { DateFormatHelper } from '../../../common/helpers/date-format.helper';

@Injectable()
export class RdvExpirationCron {
  constructor(
    @InjectRepository(Rdv) private rdvRepo: Repository<Rdv>,
    @InjectRepository(Creneau) private creneauRepo: Repository<Creneau>,
    private redisService: RedisService,
    private mailService: MailService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredPayments() {
    const rdvsValides = await this.rdvRepo.find({
      where: { statut: StatutRdv.VALIDE },
      relations: ['creneau', 'creneau.rdvs'],
    });

    for (const rdv of rdvsValides) {
      const timer = await this.redisService.get(`payment_timer:${rdv.id}`);

      if (timer === null) {
        rdv.statut = StatutRdv.EN_ATTENTE;
        rdv.alreadyValidate = true;
        await this.rdvRepo.save(rdv);

        const autresEnAttente = rdv.creneau.rdvs.filter(
          (r) => r.id !== rdv.id && r.statut === StatutRdv.EN_ATTENTE,
        );

        rdv.creneau.statut =
          autresEnAttente.length > 0
            ? StatutCreneau.EN_ATTENTE
            : StatutCreneau.DISPONIBLE;

        await this.creneauRepo.save(rdv.creneau);

        await this.redisService.del(`payment_link:${rdv.id}`);
      }
    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handlePassedCreneaux() {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const heureActuelle = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const rdvsEnAttente = await this.rdvRepo
      .createQueryBuilder('rdv')
      .leftJoinAndSelect('rdv.creneau', 'creneau')
      .leftJoinAndSelect('rdv.patient', 'patient')
      .leftJoinAndSelect('patient.user', 'user')
      .leftJoinAndSelect('rdv.service', 'ss')
      .leftJoinAndSelect('ss.serviceMedical', 'service')
      .where('rdv.statut = :statut', { statut: StatutRdv.EN_ATTENTE })
      .andWhere('creneau.date = :today', { today })
      .andWhere('creneau.heureDebut < :heureActuelle', { heureActuelle })
      .getMany();

    for (const rdv of rdvsEnAttente) {
      rdv.statut = StatutRdv.REJETE;
      rdv.motifRejet =
        'Rendez-vous automatiquement annulé — le créneau est passé';
      await this.rdvRepo.save(rdv);

      if (
        ![StatutCreneau.RESERVE, StatutCreneau.VALIDE].includes(
          rdv.creneau.statut,
        )
      ) {
        rdv.creneau.statut = StatutCreneau.BLOQUE;
      }

      await this.creneauRepo.save(rdv.creneau);

      await this.mailService.sendRdvAutoRejete(
        rdv.patient.user.email,
        `${rdv.patient.prenom} ${rdv.patient.nom}`,
        {
          service: rdv.service.serviceMedical.nom,
          date: DateFormatHelper.formatDateLong(new Date(rdv.creneau.date)),
          heure: rdv.creneau.heureDebut,
        },
      );
    }
  }
}
