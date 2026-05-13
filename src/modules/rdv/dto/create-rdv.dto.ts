import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateRdvDto {
  @IsNumber()
  @IsNotEmpty()
  creneauId: number;

  @IsNumber()
  @IsNotEmpty()
  serviceSpecialiteId: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Le motif doit avoir au moins 10 caractères' })
  motif: string;
}
