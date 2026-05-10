import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { SpecialiteService } from '../specialite.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueSpecialiteValidator implements ValidatorConstraintInterface {
  constructor(private readonly specialiteService: SpecialiteService) {}

  async validate(nom: string): Promise<boolean> {
    if (!nom) return true;
    const existing = await this.specialiteService.findByNom(nom);
    return !existing;
  }

  defaultMessage(args: ValidationArguments) {
    return `Le nom "${args.value}" existe déjà pour une spécialité`;
  }
}
