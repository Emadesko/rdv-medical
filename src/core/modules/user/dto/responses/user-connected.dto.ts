import { UserRole } from '../../enums/user.role';

export class UserConnectedDto {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  role: UserRole;
}
