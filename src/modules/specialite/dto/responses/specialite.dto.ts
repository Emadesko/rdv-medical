import { ServiceMedicalDto } from '../../../service-medical/dto/responses/service-medical.dto';

export class SpecialiteDto {
  id: number;

  nom: string;

  description: string;

  serviceMedicals: ServiceMedicalDto[];
}
