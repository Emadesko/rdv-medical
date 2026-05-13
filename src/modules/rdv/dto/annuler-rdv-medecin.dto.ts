import { IsNotEmpty, IsString } from 'class-validator';

export class AnnulerRdvMedecinDto {
  @IsString()
  @IsNotEmpty()
  motif: string;
}
