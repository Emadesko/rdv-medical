import { AbstractEntity } from '../../../core/common/entities/abstract.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Specialite } from '../../specialite/entities/specialite.entity';
import { ServiceMedical } from '../../service-medical/entities/service-medical.entity';

@Entity()
export class ServiceSpecialite extends AbstractEntity {
  @ManyToOne(() => Specialite, (specialite) => specialite.serviceMedicals)
  @JoinColumn()
  specialite: Specialite;

  @ManyToOne(() => ServiceMedical, (service) => service.specialites, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  serviceMedical: ServiceMedical;
}
