import { Injectable } from '@nestjs/common';
import { CreateRdvDto } from './dto/create-rdv.dto';
import { UpdateRdvDto } from './dto/update-rdv.dto';
import { GenericService } from '../../core/common/services/generic.service';
import { Rdv } from './entities/rdv.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RdvService extends GenericService<Rdv> {
  constructor(@InjectRepository(Rdv) protected readonly repo: Repository<Rdv>,) {
    super(repo, 'Aucun rendez vous ne correspond à cet identifiant');
  }
  creation(createRdvDto: CreateRdvDto) {
    return 'This action adds a new rdv';
  }

  updating(id: number, updateRdvDto: UpdateRdvDto) {
    return `This action updates a #${id} rdv`;
  }
}
