import { ServiceSpecialite } from '../entities/service-specialite.entity';
import { ServiceSpecialiteDto } from '../dto/responses/service-specialite.dto';

export abstract class ServiceSpecialiteMapper {
  static toDto(service: ServiceSpecialite): ServiceSpecialiteDto {
    const dto = new ServiceSpecialiteDto();
    dto.id = service.id;
    dto.serviceId = service.serviceMedical.id;
    dto.nom = service.serviceMedical.nom;
    dto.description = service.serviceMedical.description;
    dto.duree = service.serviceMedical.duree;
    dto.actif = service.serviceMedical.actif;
    dto.prix = service.serviceMedical.prix;
    return dto;
  }
}
