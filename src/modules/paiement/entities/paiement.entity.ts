import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { Rdv } from '../../rdv/entities/rdv.entity';
import { StatutPaiement } from '../enums/statut-paiement';
import { AbstractEntity } from '../../../core/common/entities/abstract.entity';

@Entity()
export class Paiement extends AbstractEntity {
  @Column()
  lien: string;

  @Column()
  montant: number;

  @Column()
  reference: string;

  @Column({
    type: 'enum',
    enum: StatutPaiement,
    default: StatutPaiement.EN_ATTENTE,
  })
  statut: StatutPaiement;

  @OneToOne(() => Rdv, (rdv) => rdv.paiement)
  @JoinColumn()
  rdv: Rdv;
}
