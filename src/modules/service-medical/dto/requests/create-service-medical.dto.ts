import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { IsServiceUnique } from '../../validators/is-service-unique';

export class CreateServiceMedicalDto {
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  @IsServiceUnique()
  @IsString()
  nom: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNumber({}, { message: 'Le prix est obligatoire' })
  @Min(500, { message: 'Le prix minimum est de 500 fcfa' })
  prix: number;

  @IsNumber({}, { message: 'La duree est obligatoire' })
  @Min(10, { message: 'Le duree minimum est de 10 minutes' })
  duree: number;

  @IsBoolean({
    message: 'Il est nécessaire de préciser si le service est actif ou non',
  })
  actif: boolean;
}
