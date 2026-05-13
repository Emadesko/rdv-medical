import { AbstractEntity } from '../../../core/common/entities/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Specialite } from '../../specialite/entities/specialite.entity';
import { ServiceMedical } from '../../service-medical/entities/service-medical.entity';

@Entity()
export class ServiceSpecialite extends AbstractEntity {
  @ManyToOne(() => Specialite, (specialite) => specialite.serviceMedicals, {
    onDelete: 'CASCADE',
  })
  specialite: Specialite;

  @ManyToOne(() => ServiceMedical, (service) => service.specialites, {
    cascade: true,
    eager: true,
  })
  serviceMedical: ServiceMedical;

  @Column({ default: true })
  actif: boolean;
}
