import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../../enums/user.role';

export class CreateUserDto {
  @IsNotEmpty({ message: "L'email est obligatoire" })
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
  @IsString()
  password: string;

  @IsEnum(UserRole, { message: 'Role invalide' })
  role: UserRole;

  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  @IsString()
  nom: string;

  @IsNotEmpty({ message: 'Le prenom est obligatoire' })
  @IsString()
  prenom: string;

  @IsNotEmpty({ message: 'Le téléphone est obligatoire' })
  @IsString()
  telephone: string;
}
