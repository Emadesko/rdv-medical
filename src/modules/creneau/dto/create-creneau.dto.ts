import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateCreneauDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
  heureDebut: string;

  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
  heureFin: string;

  @IsNumber()
  @Min(1)
  duree: number;
}
