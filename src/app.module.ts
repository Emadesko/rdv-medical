import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisService } from './common/redis/redis.service';
import dbConfig from './core/config/dbConfig';
import { UserModule } from './core/modules/user/user.module';
import { PatientModule } from './modules/patient/patient.module';
import { DocteurModule } from './modules/docteur/docteur.module';
import { RdvModule } from './modules/rdv/rdv.module';
import { AuthModule } from './core/modules/auth/auth.module';
import { CreneauModule } from './modules/creneau/creneau.module';
import { ServiceMedicalModule } from './modules/service-medical/service-medical.module';
import { PaiementModule } from './modules/paiement/paiement.module';
import { HumanModule } from './core/modules/human/human.module';
import { SpecialiteModule } from './modules/specialite/specialite.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dbConfig()),
    UserModule,
    PatientModule,
    DocteurModule,
    RdvModule,
    AuthModule,
    CreneauModule,
    ServiceMedicalModule,
    PaiementModule,
    HumanModule,
    SpecialiteModule,
  ],
  controllers: [AppController],
  providers: [AppService, RedisService],
  exports: [RedisService],
})
export class AppModule {}
