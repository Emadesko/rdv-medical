import { setSeederFactory } from 'typeorm-extension';
import { fakerFR_SN } from '@faker-js/faker';
import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user.role';

export const UserFactory = setSeederFactory(User, () => {
  const user = new User();
  user.email = fakerFR_SN.internet.email().toLowerCase();
  user.actif = fakerFR_SN.datatype.boolean({ probability: 0.9 });
  user.role = fakerFR_SN.datatype.boolean({ probability: 0.9 })
    ? UserRole.PATIENT
    : UserRole.MEDECIN;
  user.password = 'passer123';
  return user;
});
