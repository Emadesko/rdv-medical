import { Module } from '@nestjs/common';
import { RdvService } from './rdv.service';
import { RdvController } from './rdv.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rdv } from './entities/rdv.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rdv])],
  controllers: [RdvController],
  providers: [RdvService],
})
export class RdvModule {}
