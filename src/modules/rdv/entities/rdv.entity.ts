import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Patient } from '../../patient/entities/patient.entity';
import { StatutRdv } from '../enums/statut-rdv';
import { Creneau } from '../../creneau/entities/creneau.entity';
import { ServiceMedical } from '../../service-medical/entities/service-medical.entity';
import { Paiement } from '../../paiement/entities/paiement.entity';
import { AbstractEntity } from '../../../core/common/entities/abstract.entity';

@Entity()
export class Rdv extends AbstractEntity {
  @ManyToOne(() => Patient, (patient) => patient.rdvs)
  @JoinColumn()
  patient: Patient;

  @Column({ nullable: true })
  motif: string;

  @Column({
    type: 'enum',
    enum: StatutRdv,
    default: StatutRdv.EN_ATTENTE,
  })
  statut: StatutRdv;

  @ManyToOne(() => Creneau, (c) => c.rdvs)
  @JoinColumn()
  creneau: Creneau;

  @ManyToOne(() => ServiceMedical)
  service: ServiceMedical;

  @OneToOne(() => Paiement, (p) => p.rdv)
  paiement: Paiement;
}
