import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Rdv } from '../../rdv/entities/rdv.entity';
import { StatutPaiement } from '../enums/statut-paiement';

@Entity()
export class Paiement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lien: string;

  @Column({
    type: 'enum',
    enum: StatutPaiement,
    default: StatutPaiement.IMPAYE,
  })
  statut: StatutPaiement;

  @OneToOne(() => Rdv, (rdv) => rdv.paiement)
  @JoinColumn()
  rdv: Rdv;
}
