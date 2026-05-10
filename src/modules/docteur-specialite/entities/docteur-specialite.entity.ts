import { AbstractEntity } from '../../../core/common/entities/abstract.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Docteur } from '../../docteur/entities/docteur.entity';
import { Specialite } from '../../specialite/entities/specialite.entity';

@Entity()
export class DocteurSpecialite extends AbstractEntity {
  @ManyToOne(() => Docteur, (docteur) => docteur.specialites, {
    onDelete: 'CASCADE',
  })
  docteur: Docteur;

  @ManyToOne(() => Specialite, (specialite) => specialite.docteurs, {
    onDelete: 'CASCADE',
    eager: true,
  })
  specialite: Specialite;
}
