import { Injectable } from '@nestjs/common';
import { CreatePaiementDto } from './dto/create-paiement.dto';
import { UpdatePaiementDto } from './dto/update-paiement.dto';
import { GenericService } from '../../core/common/services/generic.service';
import { Paiement } from './entities/paiement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PaiementService extends GenericService<Paiement> {
  constructor(
    @InjectRepository(Paiement) protected repo: Repository<Paiement>,
  ) {
    super(repo, 'Aucun paiement ne correspond à cet identifiant');
  }
  creation(createPaiementDto: CreatePaiementDto) {
    return 'This action adds a new paiement';
  }

  updating(id: number, updatePaiementDto: UpdatePaiementDto) {
    return `This action updates a #${id} paiement`;
  }
}
