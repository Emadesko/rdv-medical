import { Human } from '../../../core/modules/human/entities/human';
import { Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Creneau } from '../../creneau/entities/creneau.entity';
import { Specialite } from '../../specialite/entities/specialite.entity';

@Entity()
export class Docteur extends Human {
  @OneToMany(() => Creneau, (c) => c.docteur)
  creneaux: Creneau[];

  @ManyToMany(() => Specialite, (specialite) => specialite.docteurs)
  @JoinTable()
  specialites: Specialite[];
}
