import { Injectable } from '@nestjs/common';
import { CreateSpecialiteDto } from './dto/requests/create-specialite.dto';
import { UpdateSpecialiteDto } from './dto/requests/update-specialite.dto';
import { GenericService } from '../../core/common/services/generic.service';
import { Specialite } from './entities/specialite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ServiceMedicalService } from '../service-medical/service-medical.service';
import { ConflictException } from '../../core/utils/exceptions/conflict.exception';

@Injectable()
export class SpecialiteService extends GenericService<Specialite> {
  constructor(
    @InjectRepository(Specialite) protected repo: Repository<Specialite>,
    private serviceMedicalService: ServiceMedicalService,
  ) {
    super(repo, 'Aucune spécialité ne correspond à cet identifiant');
  }

  async creation(createSpecialiteDto: CreateSpecialiteDto) {
    const specialite = this.repo.create(createSpecialiteDto);
    specialite.serviceMedicals ??= [];

    const noms = specialite.serviceMedicals.map((s) =>
      s.nom.trim().toLowerCase(),
    );

    const uniqueNoms = new Set(noms);

    if (uniqueNoms.size !== noms.length) {
      throw new ConflictException(
        'Deux services médicaux ne peuvent pas avoir le même nom',
      );
    }

    if (createSpecialiteDto.servicesIds?.length > 0) {
      for (const serviceId of createSpecialiteDto.servicesIds) {
        specialite.serviceMedicals.push(
          await this.serviceMedicalService.findOne(serviceId),
        );
      }
    }
    return await this.create(specialite);
  }

  updating(id: number, updateSpecialiteDto: UpdateSpecialiteDto) {
    return `This action updates a #${id} specialite`;
  }

  findByNom(nom: string) {
    return this.repo.findOne({ where: { nom: ILike(nom.trim()) } });
  }
}
