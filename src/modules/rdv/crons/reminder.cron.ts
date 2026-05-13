import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from '../../../common/mail/mail.service';
import { Rdv } from '../entities/rdv.entity';
import { StatutRdv } from '../enums/statut-rdv';
import { DateFormatHelper } from '../../../common/helpers/date-format.helper';

@Injectable()
export class ReminderCron {
  constructor(
    @InjectRepository(Rdv) private rdvRepo: Repository<Rdv>,
    private mailService: MailService,
  ) {}

  @Cron('0 15 * * *')
  async sendDailyReminders() {
    const demain = new Date();
    demain.setDate(demain.getDate() + 1);
    const demainStr = demain.toISOString().split('T')[0];

    // Récupérer tous les RDV PAYE dont la date = demain
    const rdvs = await this.rdvRepo
      .createQueryBuilder('rdv')
      .leftJoinAndSelect('rdv.creneau', 'creneau')
      .leftJoinAndSelect('creneau.docteur', 'docteur')
      .leftJoinAndSelect('rdv.patient', 'patient')
      .leftJoinAndSelect('patient.user', 'user')
      .leftJoinAndSelect('rdv.service', 'ss')
      .leftJoinAndSelect('ss.serviceMedical', 'service')
      .where('rdv.statut = :statut', { statut: StatutRdv.PAYE })
      .andWhere('creneau.date = :demain', { demain: demainStr })
      .getMany();

    console.log(`📧 Rappels J-1 : ${rdvs.length} patient(s) à notifier`);

    for (const rdv of rdvs) {
      try {
        await this.mailService.sendRappel(
          rdv.patient.user.email,
          `${rdv.patient.prenom} ${rdv.patient.nom}`,
          {
            service: rdv.service.serviceMedical.nom,
            date: DateFormatHelper.formatDateLong(new Date(rdv.creneau.date)),
            heure: rdv.creneau.heureDebut,
            docteur: `Dr. ${rdv.creneau.docteur.prenom} ${rdv.creneau.docteur.nom}`,
            prix: rdv.service.serviceMedical.prix,
          },
        );
        console.log(`✅ Rappel envoyé à ${rdv.patient.user.email}`);
      } catch (error) {
        console.error(`❌ Échec rappel pour ${rdv.patient.user.email}:`, error);
      }
    }
  }
}
