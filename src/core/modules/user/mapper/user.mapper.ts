import { User } from '../entities/user.entity';
import { UserResponseDto } from '../dto/responses/user-response.dto';
import { UserConnectedDto } from '../dto/responses/user-connected.dto';
import { Human } from '../entities/human';

export abstract class UserMapper {
  static toDto(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.email = user.email;
    dto.id = user.id;
    dto.role = user.role;
    dto.dateCreation = `${user.dateCreation}`;
    dto.actif = user.actif;
    return dto;
  }

  static toDtoConnected(user: User, human: Human): UserConnectedDto {
    const dto = new UserConnectedDto();
    dto.email = user.email;
    dto.id = user.id;
    dto.role = user.role;
    dto.nom = human.nom;
    dto.prenom = human.prenom;
    dto.telephone = human.telephone;
    return dto;
  }
}
