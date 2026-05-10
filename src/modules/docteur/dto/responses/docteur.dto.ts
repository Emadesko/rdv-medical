import { DocteurSpecialiteDto } from '../../../docteur-specialite/dto/responses/docteur-specialite.dto';

export class DocteurDto {
  id: number;

  nom: string;

  prenom: string;

  email: string;

  avatar: string;

  isAdmin: boolean;

  specialites: DocteurSpecialiteDto[];
}
