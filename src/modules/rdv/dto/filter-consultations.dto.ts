import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { StatutRdv } from '../enums/statut-rdv';
import { Transform } from 'class-transformer';

export enum FiltreDate {
  AUJOURD_HUI = 'aujourd_hui',
  CETTE_SEMAINE = 'cette_semaine',
  CE_MOIS = 'ce_mois',
  PLAGE = 'plage',
}

export class FilterConsultationsDto {
  @IsOptional()
  @IsEnum(StatutRdv)
  statut?: StatutRdv;

  @IsOptional()
  @IsEnum(FiltreDate)
  date?: FiltreDate;

  @IsOptional()
  @IsString()
  dateDebut?: string;

  @IsOptional()
  @IsString()
  dateFin?: string;

  @IsOptional()
  @IsString()
  recherche?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  page: number = 0;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  size: number = 10;
}
