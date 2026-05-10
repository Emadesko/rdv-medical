import { Injectable } from '@nestjs/common';
import { CreateServiceMedicalDto } from './dto/requests/create-service-medical.dto';
import { UpdateServiceMedicalDto } from './dto/requests/update-service-medical.dto';
import { GenericService } from '../../core/common/services/generic.service';
import { ServiceMedical } from './entities/service-medical.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class ServiceMedicalService extends GenericService<ServiceMedical> {
  constructor(
    @InjectRepository(ServiceMedical)
    protected repo: Repository<ServiceMedical>,
  ) {
    super(repo, 'Aucun service medical ne correspond à cet identifiant');
  }
  creation(createServiceMedicalDto: CreateServiceMedicalDto) {
    return 'This action adds a new serviceMedical';
  }

  updating(id: number, updateServiceMedicalDto: UpdateServiceMedicalDto) {
    return `This action updates a #${id} serviceMedical`;
  }

  findByNom(nom?: string) {
    if (nom) return this.repo.findOne({ where: { nom: ILike(nom.trim()) } });
    else return this.repo.findOne({ where: { nom } });
  }

  findAllByNom(nom?: string) {
    if (nom) return this.repo.find({ where: { nom: ILike(nom.trim()) } });
    else return this.repo.find({ where: { nom } });
  }
}
