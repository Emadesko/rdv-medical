import { Module } from '@nestjs/common';
import { CreneauService } from './creneau.service';
import { CreneauController } from './creneau.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Creneau } from './entities/creneau.entity';
import { DocteurModule } from '../docteur/docteur.module';
import { CreneauExpirationCron } from './crons/creneau-expiration.cron';

@Module({
  imports: [DocteurModule, TypeOrmModule.forFeature([Creneau])],
  controllers: [CreneauController],
  providers: [CreneauService, CreneauExpirationCron],
})
export class CreneauModule {}
