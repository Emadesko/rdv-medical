import { Human } from '../../../core/modules/human/entities/human';
import { Entity, OneToMany } from 'typeorm';
import { Rdv } from '../../rdv/entities/rdv.entity';

@Entity()
export class Patient extends Human {
  @OneToMany(() => Rdv, (rdv) => rdv.patient)
  rdvs: Rdv[];
}
