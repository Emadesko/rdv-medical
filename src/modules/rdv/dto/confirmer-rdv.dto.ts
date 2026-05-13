import { IsOptional, IsString } from 'class-validator';

export class ConfirmerRdvDto {
  @IsOptional()
  @IsString()
  notesMedicales?: string;
}
