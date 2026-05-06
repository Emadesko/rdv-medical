import { Module } from '@nestjs/common';
import { HumanService } from './human.service';
import { HumanController } from './human.controller';
import { PatientModule } from '../../../modules/patient/patient.module';
import { DocteurModule } from '../../../modules/docteur/docteur.module';

@Module({
  imports: [PatientModule, DocteurModule],
  controllers: [HumanController],
  providers: [HumanService],
  exports: [HumanService],
})
export class HumanModule {}
