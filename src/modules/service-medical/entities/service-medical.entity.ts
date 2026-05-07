import { Entity, Column, ManyToMany } from 'typeorm';
import { AbstractEntity } from '../../../core/common/entities/abstract.entity';
import { Specialite } from '../../specialite/entities/specialite.entity';

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

  @ManyToMany(() => Specialite, (specialite) => specialite.serviceMedicals)
  specialites: Specialite[];
}
