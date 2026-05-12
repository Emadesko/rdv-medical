import { Module } from '@nestjs/common';
import { PaiementService } from './paiement.service';
import { PaiementController } from './paiement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paiement } from './entities/paiement.entity';
import { RdvModule } from '../rdv/rdv.module';
import { RedisService } from '../../common/redis/redis.service';

@Module({
  imports: [RdvModule, TypeOrmModule.forFeature([Paiement])],
  controllers: [PaiementController],
  providers: [PaiementService, RedisService],
  exports: [PaiementService],
})
export class PaiementModule {}
