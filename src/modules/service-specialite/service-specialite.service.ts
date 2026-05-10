import { Injectable } from '@nestjs/common';
import { CreateServiceSpecialiteDto } from './dto/create-service-specialite.dto';
import { UpdateServiceSpecialiteDto } from './dto/update-service-specialite.dto';
import { GenericService } from '../../core/common/services/generic.service';
import { ServiceSpecialite } from './entities/service-specialite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ServiceSpecialiteService extends GenericService<ServiceSpecialite> {
  constructor(
    @InjectRepository(ServiceSpecialite)
    protected readonly repo: Repository<ServiceSpecialite>,
  ) {
    super(repo, 'Aucun service ne corespond ç cet identifiant');
  }
  creation(createServiceSpecialiteDto: CreateServiceSpecialiteDto) {
    return 'This action adds a new serviceSpecialite';
  }

  updating(id: number, updateServiceSpecialiteDto: UpdateServiceSpecialiteDto) {
    return `This action updates a #${id} serviceSpecialite`;
  }
}
