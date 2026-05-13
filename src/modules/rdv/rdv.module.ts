import { Module } from '@nestjs/common';
import { RdvService } from './rdv.service';
import { RdvController } from './rdv.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rdv } from './entities/rdv.entity';
import { Specialite } from '../specialite/entities/specialite.entity';
import { Docteur } from '../docteur/entities/docteur.entity';
import { Creneau } from '../creneau/entities/creneau.entity';
import { PatientModule } from '../patient/patient.module';
import { DocteurModule } from '../docteur/docteur.module';
import { BictorysService } from '../../common/bictorys/bictorys.service';
import { MailService } from '../../common/mail/mail.service';
import { RedisService } from '../../common/redis/redis.service';
import { ScheduleModule } from '@nestjs/schedule';
import { RdvExpirationCron } from './crons/rdv-expiration.cron';
import { ServiceSpecialite } from '../service-specialite/entities/service-specialite.entity';
import { ReminderCron } from './crons/reminder.cron';

@Module({
  imports: [
    DocteurModule,
    PatientModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      Rdv,
      Specialite,
      Docteur,
      Creneau,
      ServiceSpecialite,
    ]),
  ],
  controllers: [RdvController],
  providers: [
    RdvService,
    BictorysService,
    MailService,
    RedisService,
    RdvExpirationCron,
    ReminderCron,
  ],
  exports: [RdvService],
})
export class RdvModule {}
