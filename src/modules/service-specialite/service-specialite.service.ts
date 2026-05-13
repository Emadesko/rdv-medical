import { Injectable } from '@nestjs/common';
import { CreateServiceSpecialiteDto } from './dto/create-service-specialite.dto';
import { UpdateServiceSpecialiteDto } from './dto/update-service-specialite.dto';
import { GenericService } from '../../core/common/services/generic.service';
import { ServiceSpecialite } from './entities/service-specialite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '../../core/utils/exceptions/not-found.exception';

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

  async findInactif(specialiteId: number, serviceMedicalId: number) {
    return await this.repo.findOne({
      where: {
        specialite: { id: specialiteId },
        serviceMedical: { id: serviceMedicalId },
        actif: false,
      },
    });
  }

  async reactiver(id: number) {
    const ss = await this.repo.findOne({ where: { id } });
    if (!ss) throw new NotFoundException('Service non trouvé');
    ss.actif = true;
    return await this.repo.save(ss);
  }

  async desactiver(id: number) {
    const ss = await this.repo.findOne({ where: { id } });
    if (!ss) throw new NotFoundException('Service non trouvé');
    ss.actif = false;
    return await this.repo.save(ss);
  }
}
