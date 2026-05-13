import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientService } from '../../../modules/patient/patient.service';
import { DocteurService } from '../../../modules/docteur/docteur.service';
import { UserRole } from './enums/user.role';
import { Docteur } from '../../../modules/docteur/entities/docteur.entity';
import { Patient } from '../../../modules/patient/entities/patient.entity';
import { ConflictException } from '../../utils/exceptions/conflict.exception';
import { GenericService } from '../../common/services/generic.service';
import { UpdateUserDto } from './dto/requests/update-user.dto';
import { fakerFR_SN } from '@faker-js/faker';

@Injectable()
export class UserService extends GenericService<User> {
  constructor(
    @InjectRepository(User) protected readonly repo: Repository<User>,
    private readonly patientService: PatientService,
    private readonly docteurService: DocteurService,
  ) {
    super(repo, 'Aucun utilisateur ne correspond a cet identifiant');
  }

  async creation(createUserDto: CreateUserDto) {
    if (await this.findByEmail(createUserDto.email))
      throw new ConflictException('Un utilisateur possède déja cet email');

    const user = this.repo.create(createUserDto);
    user.email.trim();
    if (user.role === UserRole.MEDECIN || user.role === UserRole.ADMIN) {
      const docteur = new Docteur();
      docteur.user = user;
      docteur.nom = createUserDto.nom.trim().toUpperCase();
      docteur.prenom = createUserDto.prenom.trim();
      docteur.telephone = createUserDto.telephone.trim();
      docteur.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${fakerFR_SN.string.uuid()}`;
      await this.docteurService.create(docteur);
    } else {
      const patient = new Patient();
      patient.user = user;
      patient.nom = createUserDto.nom.trim().toUpperCase();
      patient.prenom = createUserDto.prenom.trim();
      patient.telephone = createUserDto.telephone.trim();
      patient.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${fakerFR_SN.string.uuid()}`;
      await this.patientService.create(patient);
    }
    return user;
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email: ILike(email.trim()) } });
  }

  updating(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
}
