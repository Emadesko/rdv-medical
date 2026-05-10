import { Specialite } from '../entities/specialite.entity';
import {
  SpecialiteDetailDto,
  SpecialiteDto,
} from '../dto/responses/specialite-detail.dto';
import { ServiceSpecialiteMapper } from '../../service-specialite/mapper/service-specialite.mapper';

export abstract class SpecialiteMapper {
  static toDto(specialite: Specialite): SpecialiteDto {
    const dto = new SpecialiteDto();
    dto.id = specialite.id;
    dto.nom = specialite.nom;
    dto.description = specialite.description;
    return dto;
  }

  static toDtoDetail(specialite: Specialite): SpecialiteDetailDto {
    const dto = new SpecialiteDetailDto();
    dto.id = specialite.id;
    dto.nom = specialite.nom;
    dto.description = specialite.description;
    dto.serviceMedicals = specialite.serviceMedicals.map(
      ServiceSpecialiteMapper.toDto,
    );
    return dto;
  }
}
