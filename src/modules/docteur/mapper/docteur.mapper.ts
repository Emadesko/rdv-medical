import { Docteur } from '../entities/docteur.entity';
import { DocteurDto } from '../dto/responses/docteur.dto';
import { DocteurSpecialiteMapper } from '../../docteur-specialite/mapper/docteur-specialite.mapper';
import { UserRole } from '../../../core/modules/user/enums/user.role';

export class DocteurMapper {
  static toDto(docteur: Docteur): DocteurDto {
    const dto = new DocteurDto();
    dto.id = docteur.id;
    dto.nom = docteur.nom;
    dto.prenom = docteur.prenom;
    dto.email = docteur.user.email;
    dto.avatar = docteur.avatar;
    dto.isAdmin = docteur.user.role === UserRole.ADMIN;
    dto.specialites = docteur.specialites.map(DocteurSpecialiteMapper.toDto);
    return dto;
  }
}
