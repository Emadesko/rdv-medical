import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { StatutCreneau } from '../enums/statut-creneau';
import { Docteur } from '../../docteur/entities/docteur.entity';
import { Rdv } from '../../rdv/entities/rdv.entity';
import { AbstractEntity } from '../../../core/common/entities/abstract.entity';

@Entity()
export class Creneau extends AbstractEntity {
  @Column()
  date: Date;

  @Column()
  heureDebut: string;

  @Column()
  heureFin: string;

  @Column({
    type: 'enum',
    enum: StatutCreneau,
    default: StatutCreneau.DISPONIBLE,
  })
  statut: StatutCreneau;

  @ManyToOne(() => Docteur, (d) => d.creneaux)
  @JoinColumn()
  docteur: Docteur;

  @OneToMany(() => Rdv, (rdv) => rdv.creneau)
  rdvs: Rdv[];
}
