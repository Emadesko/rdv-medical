import { DocteurSpecialite } from '../entities/docteur-specialite.entity';
import { DocteurSpecialiteDto } from '../dto/responses/docteur-specialite.dto';

export class DocteurSpecialiteMapper {
  static toDto(docteur: DocteurSpecialite): DocteurSpecialiteDto {
    const dto = new DocteurSpecialiteDto();
    dto.id = docteur.id;
    dto.specialiteId = docteur.specialite.id;
    dto.nom = docteur.specialite.nom;
    return dto;
  }
}
