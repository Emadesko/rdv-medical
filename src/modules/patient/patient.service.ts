import { Injectable } from '@nestjs/common';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../core/modules/user/entities/user.entity';
import { NotFoundException } from '../../core/utils/exceptions/not-found.exception';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly repo: Repository<Patient>,
  ) {}

  create(patient: Patient) {
    return this.repo.save(patient);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} patient`;
  }

  update(id: number, updatePatientDto: UpdatePatientDto) {
    return `This action updates a #${id} patient`;
  }

  remove(id: number) {
    return `This action removes a #${id} patient`;
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
