import { StatutCreneau } from '../../enums/statut-creneau';

export class CreneauDto {
  id: number;
  title: string;
  start: string;
  end: string;
  statut: StatutCreneau;
}
