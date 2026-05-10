import { Module } from '@nestjs/common';
import { SpecialiteService } from './specialite.service';
import { SpecialiteController } from './specialite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialite } from './entities/specialite.entity';
import { ServiceMedicalModule } from '../service-medical/service-medical.module';
import { UniqueSpecialiteValidator } from './validators/unique-specialite.validator';
import { ServiceSpecialiteModule } from '../service-specialite/service-specialite.module';

@Module({
  imports: [
    ServiceSpecialiteModule,
    ServiceMedicalModule,
    TypeOrmModule.forFeature([Specialite]),
  ],
  controllers: [SpecialiteController],
  providers: [SpecialiteService, UniqueSpecialiteValidator],
})
export class SpecialiteModule {}
