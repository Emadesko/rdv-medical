import { AbstractEntity } from '../../../core/common/entities/abstract.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Docteur } from '../../docteur/entities/docteur.entity';
import { ServiceMedical } from '../../service-medical/entities/service-medical.entity';

@Entity()
export class Specialite extends AbstractEntity {
  @Column({ unique: true })
  nom: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Docteur, (docteur) => docteur.specialites)
  docteurs: Docteur[];

  @ManyToMany(() => ServiceMedical, (service) => service.specialites, {
    cascade: true,
  })
  @JoinTable()
  serviceMedicals: ServiceMedical[];
}
