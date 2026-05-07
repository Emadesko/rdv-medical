import { Injectable, NotFoundException } from '@nestjs/common';
import { PatientService } from '../../../modules/patient/patient.service';
import { DocteurService } from '../../../modules/docteur/docteur.service';
import { User } from '../user/entities/user.entity';
import { Human } from './entities/human';
import { UserRole } from '../user/enums/user.role';

@Injectable()
export class HumanService {
  constructor(
    private readonly patientService: PatientService,
    private readonly docteurService: DocteurService,
  ) {}

  async getByUser(user: User): Promise<Human> {
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    switch (user.role) {
      case (UserRole.MEDECIN, UserRole.ADMIN):
        return await this.docteurService.getByUser(user);
      case UserRole.PATIENT:
        return await this.patientService.getByUser(user);
      default:
        throw new NotFoundException('Utilisateur non identifiable');
    }
  }
}
