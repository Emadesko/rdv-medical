import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from '../enums/user.role';

export class CreateUserDto {
  @IsNotEmpty({ message: "L'email est obligatoire" })
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
  @IsString()
  @IsStrongPassword()
  password: string;

  @IsEnum(UserRole, { message: 'Role invalide' })
  role: UserRole;
}
