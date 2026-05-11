import { Module } from '@nestjs/common';
import { CreneauService } from './creneau.service';
import { CreneauController } from './creneau.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Creneau } from './entities/creneau.entity';
import { DocteurModule } from '../docteur/docteur.module';

@Module({
  imports: [DocteurModule, TypeOrmModule.forFeature([Creneau])],
  controllers: [CreneauController],
  providers: [CreneauService],
})
export class CreneauModule {}
