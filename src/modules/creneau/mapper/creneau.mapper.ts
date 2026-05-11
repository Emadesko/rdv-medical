import { Creneau } from '../entities/creneau.entity';
import { CreneauDto } from '../dto/responses/creneau.dto';

export abstract class CreneauMapper {
  static toDto(creneau: Creneau): CreneauDto {
    const dto = new CreneauDto();
    dto.id = creneau.id;
    dto.title = creneau.statut;
    dto.start = `${creneau.date}T${creneau.heureDebut}:00`;
    dto.end = `${creneau.date}T${creneau.heureFin}:00`;
    dto.statut = creneau.statut;
    return dto;
  }
}
