import { Module } from '@nestjs/common';
import { DocteurService } from './docteur.service';
import { DocteurController } from './docteur.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Docteur } from './entities/docteur.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Docteur])],
  controllers: [DocteurController],
  providers: [DocteurService],
  exports: [DocteurService],
})
export class DocteurModule {}
