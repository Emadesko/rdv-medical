import { AbstractEntity } from '../../../core/common/entities/abstract.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Docteur } from '../../docteur/entities/docteur.entity';
import { Specialite } from '../../specialite/entities/specialite.entity';

@Entity()
export class DocteurSpecialite extends AbstractEntity {
  @ManyToOne(() => Docteur, (docteur) => docteur.specialites)
  @JoinColumn()
  docteur: Docteur;

  @ManyToOne(() => Specialite, (specialite) => specialite.docteurs)
  @JoinColumn()
  specialite: Specialite;
}
