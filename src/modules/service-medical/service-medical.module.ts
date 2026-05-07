import { Module } from '@nestjs/common';
import { ServiceMedicalService } from './service-medical.service';
import { ServiceMedicalController } from './service-medical.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceMedical } from './entities/service-medical.entity';
import { UniqueServiceValidator } from './validators/unique-service.validator';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceMedical])],
  controllers: [ServiceMedicalController],
  providers: [ServiceMedicalService, UniqueServiceValidator],
  exports: [ServiceMedicalService],
})
export class ServiceMedicalModule {}
