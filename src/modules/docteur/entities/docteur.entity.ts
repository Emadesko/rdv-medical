import { Human } from '../../../core/modules/human/entities/human';
import { Entity, OneToMany } from 'typeorm';
import { Creneau } from '../../creneau/entities/creneau.entity';
import { DocteurSpecialite } from '../../docteur-specialite/entities/docteur-specialite.entity';

@Entity()
export class Docteur extends Human {
  @OneToMany(() => Creneau, (c) => c.docteur, {
    cascade: true,
  })
  creneaux: Creneau[];

  @OneToMany(() => DocteurSpecialite, (specialite) => specialite.docteur, {
    eager: true,
    cascade: true,
  })
  specialites: DocteurSpecialite[];
}
