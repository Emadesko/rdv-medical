import { AbstractEntity } from '../../../core/common/entities/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { DocteurSpecialite } from '../../docteur-specialite/entities/docteur-specialite.entity';
import { ServiceSpecialite } from '../../service-specialite/entities/service-specialite.entity';

@Entity()
export class Specialite extends AbstractEntity {
  @Column({ unique: true })
  nom: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => ServiceSpecialite, (service) => service.specialite, {
    cascade: true,
    eager: true,
  })
  serviceMedicals: ServiceSpecialite[];

  @OneToMany(() => DocteurSpecialite, (specialite) => specialite.specialite)
  docteurs: DocteurSpecialite[];
}
