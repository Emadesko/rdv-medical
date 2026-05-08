import { Specialite } from '../entities/specialite.entity';
import { SpecialiteDto } from '../dto/responses/specialite.dto';
import { ServiceMedicalMapper } from '../../service-medical/mapper/service-medical.mapper';

export abstract class SpecialiteMapper {
  static toDto(specialite: Specialite): SpecialiteDto {
    const dto = new SpecialiteDto();
    dto.id = specialite.id;
    dto.nom = specialite.nom;
    dto.description = specialite.description;
    dto.serviceMedicals = specialite.serviceMedicals.map(ServiceMedicalMapper.toDto)
    return dto;
  }
}
