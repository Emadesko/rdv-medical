import { ServiceMedical } from '../entities/service-medical.entity';
import { ServiceMedicalDto } from '../dto/responses/service-medical.dto';

export abstract class ServiceMedicalMapper {
  static toDto(service: ServiceMedical): ServiceMedicalDto {
    const dto = new ServiceMedicalDto();
    dto.id = service.id;
    dto.nom = service.nom;
    dto.description = service.description;
    dto.duree = service.duree;
    dto.actif = service.actif;
    dto.prix = service.prix;
    return dto;
  }
}
