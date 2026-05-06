import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ServiceMedical {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  prix: number;
}
