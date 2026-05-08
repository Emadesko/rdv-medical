import { Module } from '@nestjs/common';
import { ServiceSpecialiteService } from './service-specialite.service';
import { ServiceSpecialiteController } from './service-specialite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceSpecialite } from './entities/service-specialite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceSpecialite])],
  controllers: [ServiceSpecialiteController],
  providers: [ServiceSpecialiteService],
})
export class ServiceSpecialiteModule {}
