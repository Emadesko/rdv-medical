import { Injectable } from '@nestjs/common';
import { CreateSpecialiteDto } from './dto/create-specialite.dto';
import { UpdateSpecialiteDto } from './dto/update-specialite.dto';
import { GenericService } from '../../core/common/services/generic.service';
import { Specialite } from './entities/specialite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SpecialiteService extends GenericService<Specialite> {
  constructor(
    @InjectRepository(Specialite) protected repo: Repository<Specialite>,
  ) {
    super(repo, 'Aucune spécialité ne correspond à cet identifiant');
  }
  creation(createSpecialiteDto: CreateSpecialiteDto) {
    return 'This action adds a new specialite';
  }

  updating(id: number, updateSpecialiteDto: UpdateSpecialiteDto) {
    return `This action updates a #${id} specialite`;
  }
}
