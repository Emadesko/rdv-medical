import { UserRole } from '../../enums/user.role';

export class UserResponseDto {
  id: number;
  email: string;
  role: UserRole;
  actif: boolean;
  dateCreation: string;
}
