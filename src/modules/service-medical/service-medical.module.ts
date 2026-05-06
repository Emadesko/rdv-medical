import { Module } from '@nestjs/common';
import { ServiceMedicalService } from './service-medical.service';
import { ServiceMedicalController } from './service-medical.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceMedical } from './entities/service-medical.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceMedical])],
  controllers: [ServiceMedicalController],
  providers: [ServiceMedicalService],
})
export class ServiceMedicalModule {}
