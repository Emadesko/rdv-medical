import { Injectable } from '@nestjs/common';
import { CreateCreneauDto } from './dto/create-creneau.dto';
import { UpdateCreneauDto } from './dto/update-creneau.dto';

@Injectable()
export class CreneauService {
  create(createCreneauDto: CreateCreneauDto) {
    return 'This action adds a new creneau';
  }

  findAll() {
    return `This action returns all creneau`;
  }

  findOne(id: number) {
    return `This action returns a #${id} creneau`;
  }

  update(id: number, updateCreneauDto: UpdateCreneauDto) {
    return `This action updates a #${id} creneau`;
  }

  remove(id: number) {
    return `This action removes a #${id} creneau`;
  }
}
