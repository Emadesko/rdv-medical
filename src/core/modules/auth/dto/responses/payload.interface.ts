import { UserRole } from '../../../user/enums/user.role';

export class PayloadInterface {
  id: number;
  email: string;
  role: UserRole;
}
