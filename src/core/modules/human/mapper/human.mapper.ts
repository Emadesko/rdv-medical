import { HumanResponseDto } from '../dto/responses/human-response.dto';
import { Human } from '../../user/entities/human';

export abstract class HumanMapper {
  static toDto(human: Human): HumanResponseDto {
    const dto = new HumanResponseDto();
    dto.email = human.user.email;
    dto.telephone = human.telephone;
    dto.nom = human.nom;
    dto.prenom = human.prenom;
    return dto;
  }
}
