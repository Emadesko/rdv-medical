import { Injectable } from '@nestjs/common';
import { CreateRdvDto } from './dto/create-rdv.dto';
import { UpdateRdvDto } from './dto/update-rdv.dto';

@Injectable()
export class RdvService {
  create(createRdvDto: CreateRdvDto) {
    return 'This action adds a new rdv';
  }

  findAll() {
    return `This action returns all rdv`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rdv`;
  }

  update(id: number, updateRdvDto: UpdateRdvDto) {
    return `This action updates a #${id} rdv`;
  }

  remove(id: number) {
    return `This action removes a #${id} rdv`;
  }
}
