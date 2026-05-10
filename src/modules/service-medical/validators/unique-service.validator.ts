import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ServiceMedicalService } from '../service-medical.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueServiceValidator implements ValidatorConstraintInterface {
  constructor(private readonly serviceMedicalService: ServiceMedicalService) {}

  async validate(nom: string): Promise<boolean> {
    if (!nom) return true;
    const existing = await this.serviceMedicalService.findByNom(nom);
    return !existing;
  }

  defaultMessage(args: ValidationArguments) {
    return `Le nom "${args.value}" existe déjà pour un service medical.`;
  }
}
