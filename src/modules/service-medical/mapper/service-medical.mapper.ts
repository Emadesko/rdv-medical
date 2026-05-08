import { ServiceMedical } from '../entities/service-medical.entity';
import { ServiceMedicalDto } from '../dto/responses/service-medical.dto';

export abstract class ServiceMedicalMapper {
  static toDto(specialite: ServiceMedical): ServiceMedicalDto {
    const dto = new ServiceMedicalDto();
    dto.id = specialite.id;
    dto.nom = specialite.nom;
    dto.description = specialite.description;
    dto.duree = specialite.duree;
    dto.actif = specialite.actif;
    dto.prix = specialite.prix;
    return dto;
  }
}
