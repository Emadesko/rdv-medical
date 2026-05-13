import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Patient } from '../../patient/entities/patient.entity';
import { StatutRdv } from '../enums/statut-rdv';
import { Creneau } from '../../creneau/entities/creneau.entity';
import { Paiement } from '../../paiement/entities/paiement.entity';
import { AbstractEntity } from '../../../core/common/entities/abstract.entity';
import { ServiceSpecialite } from '../../service-specialite/entities/service-specialite.entity';

@Entity()
export class Rdv extends AbstractEntity {
  @ManyToOne(() => Patient, (patient) => patient.rdvs)
  @JoinColumn()
  patient: Patient;

  @Column({ nullable: true, type: 'text' })
  notesMedicales: string | null;

  @Column({ nullable: true })
  motif: string;

  @Column({ nullable: true })
  motifRejet: string;

  @Column({ default: false })
  alreadyValidate: boolean;

  @Column({
    type: 'enum',
    enum: StatutRdv,
    default: StatutRdv.EN_ATTENTE,
  })
  statut: StatutRdv;

  @ManyToOne(() => Creneau, (c) => c.rdvs)
  @JoinColumn()
  creneau: Creneau;

  @ManyToOne(() => ServiceSpecialite)
  @JoinColumn()
  service: ServiceSpecialite;

  @OneToOne(() => Paiement, (p) => p.rdv, {
    cascade: true,
    eager: true,
  })
  paiement: Paiement;
}
