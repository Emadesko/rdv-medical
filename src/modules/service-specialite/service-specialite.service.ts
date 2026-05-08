import { Injectable } from '@nestjs/common';
import { CreateServiceSpecialiteDto } from './dto/create-service-specialite.dto';
import { UpdateServiceSpecialiteDto } from './dto/update-service-specialite.dto';

@Injectable()
export class ServiceSpecialiteService {
  create(createServiceSpecialiteDto: CreateServiceSpecialiteDto) {
    return 'This action adds a new serviceSpecialite';
  }

  findAll() {
    return `This action returns all serviceSpecialite`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceSpecialite`;
  }

  update(id: number, updateServiceSpecialiteDto: UpdateServiceSpecialiteDto) {
    return `This action updates a #${id} serviceSpecialite`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviceSpecialite`;
  }
}
