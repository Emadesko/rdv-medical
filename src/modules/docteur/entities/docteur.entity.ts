import { Human } from '../../../core/modules/user/entities/human';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Creneau } from '../../creneau/entities/creneau.entity';

@Entity()
export class Docteur extends Human {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Creneau, (c) => c.docteur)
  creneaux: Creneau[];
}
