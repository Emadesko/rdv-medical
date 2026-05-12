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

@Module({
  imports: [
    PatientModule,
    TypeOrmModule.forFeature([
      Rdv,
      Specialite,
      Docteur,
      Creneau,
      ServiceMedical,
    ]),
  ],
  controllers: [RdvController],
  providers: [RdvService],
})
export class RdvModule {}
