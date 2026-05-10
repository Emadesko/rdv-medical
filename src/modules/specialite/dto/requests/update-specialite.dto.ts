import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateServiceMedicalDto } from '../../../service-medical/dto/requests/create-service-medical.dto';

export class UpdateSpecialiteDto {
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
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

  @IsOptional()
  servicesToRemoveIds: number[];
}
