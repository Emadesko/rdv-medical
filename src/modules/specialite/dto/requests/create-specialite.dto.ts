import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateServiceMedicalDto } from '../../../service-medical/dto/requests/create-service-medical.dto';
import { IsSpecialiteUnique } from '../../validators/is-specialite-unique';
import { Type } from 'class-transformer';

export class CreateSpecialiteDto {
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  @IsSpecialiteUnique()
  @IsString()
  nom: string;

  @IsOptional()
  @IsString()
  description: string;

  @ValidateNested()
  @IsArray()
  @Type(() => CreateServiceMedicalDto)
  @IsOptional()
  serviceMedicals: CreateServiceMedicalDto[];

  @IsOptional()
  servicesIds: number[];
}
