import { Injectable } from '@nestjs/common';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../core/modules/user/entities/user.entity';
import { NotFoundException } from '../../core/utils/exceptions/not-found.exception';
import { GenericService } from '../../core/common/services/generic.service';

@Injectable()
export class PatientService extends GenericService<Patient> {
  constructor(
    @InjectRepository(Patient)
    protected readonly repo: Repository<Patient>,
  ) {
    super(repo, 'Aucun patient ne correspond à cet identifiant');
  }

  updating(id: number, updatePatientDto: UpdatePatientDto) {
    return `This action updates a #${id} patient`;
  }

  async getByUser(user: User): Promise<Patient> {
    const patient = await this.repo.findOne({
      where: { user: { id: user.id } },
      relations: ['user'],
    });

    if (!patient) {
      throw new NotFoundException(
        "Aucun patient n'est lié à ce compte utilisateur",
      );
    }

    return patient;
  }
}
