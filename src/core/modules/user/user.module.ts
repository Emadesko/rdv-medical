import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PatientModule } from '../../../modules/patient/patient.module';
import { DocteurModule } from '../../../modules/docteur/docteur.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PatientModule, DocteurModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
