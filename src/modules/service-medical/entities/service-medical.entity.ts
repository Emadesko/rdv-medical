import { Entity, Column, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../core/common/entities/abstract.entity';
import { ServiceSpecialite } from '../../service-specialite/entities/service-specialite.entity';

@Entity()
export class ServiceMedical extends AbstractEntity {
  @Column()
  nom: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  prix: number;

  @Column()
  duree: number;

  @Column({ default: true })
  actif: boolean;

  @OneToMany(() => ServiceSpecialite, (specialite) => specialite.serviceMedical)
  specialites: ServiceSpecialite[];
}
