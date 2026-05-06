import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { StatutCreneau } from '../enums/statut-creneau';
import { Docteur } from '../../docteur/entities/docteur.entity';
import { Rdv } from '../../rdv/entities/rdv.entity';

@Entity()
export class Creneau {
  @PrimaryGeneratedColumn()
  id: number;

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
