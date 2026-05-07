import { Injectable } from '@nestjs/common';
import { CreateCreneauDto } from './dto/create-creneau.dto';
import { UpdateCreneauDto } from './dto/update-creneau.dto';
import { GenericService } from '../../core/common/services/generic.service';
import { Creneau } from './entities/creneau.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CreneauService extends GenericService<Creneau> {
  constructor(@InjectRepository(Creneau) protected repo: Repository<Creneau>) {
    super(repo, 'Aucun creneau ne correspond a cet identifiant');
  }
  creation(createCreneauDto: CreateCreneauDto) {
    return 'This action adds a new creneau';
  }

  updating(id: number, updateCreneauDto: UpdateCreneauDto) {
    return `This action updates a #${id} creneau`;
  }
}
