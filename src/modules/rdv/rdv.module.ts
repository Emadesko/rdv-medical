import { Module } from '@nestjs/common';
import { RdvService } from './rdv.service';
import { RdvController } from './rdv.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rdv } from './entities/rdv.entity';
import { Specialite } from '../specialite/entities/specialite.entity';
import { Docteur } from '../docteur/entities/docteur.entity';
import { Creneau } from '../creneau/entities/creneau.entity';
import { ServiceMedical } from '../service-medical/entities/service-medical.entity';
import { PatientModule } from '../patient/patient.module';
import { DocteurModule } from '../docteur/docteur.module';
import { BictorysService } from '../../common/bictorys/bictorys.service';
import { MailService } from '../../common/mail/mail.service';
import { RedisService } from '../../common/redis/redis.service';
import { ScheduleModule } from '@nestjs/schedule';
import { RdvExpirationCron } from './crons/rdv-expiration.cron';

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
      ServiceMedical,
    ]),
  ],
  controllers: [RdvController],
  providers: [
    RdvService,
    BictorysService,
    MailService,
    RedisService,
    RdvExpirationCron,
  ],
  exports: [RdvService],
})
export class RdvModule {}
