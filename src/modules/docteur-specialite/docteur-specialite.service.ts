import { Injectable } from '@nestjs/common';
import { CreateDocteurSpecialiteDto } from './dto/create-docteur-specialite.dto';
import { UpdateDocteurSpecialiteDto } from './dto/update-docteur-specialite.dto';

@Injectable()
export class DocteurSpecialiteService {
  create(createDocteurSpecialiteDto: CreateDocteurSpecialiteDto) {
    return 'This action adds a new docteurSpecialite';
  }

  findAll() {
    return `This action returns all docteurSpecialite`;
  }

  findOne(id: number) {
    return `This action returns a #${id} docteurSpecialite`;
  }

  update(id: number, updateDocteurSpecialiteDto: UpdateDocteurSpecialiteDto) {
    return `This action updates a #${id} docteurSpecialite`;
  }

  remove(id: number) {
    return `This action removes a #${id} docteurSpecialite`;
  }
}
