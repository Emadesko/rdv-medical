import { Column, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { AbstractEntity } from '../../../common/entities/abstract.entity';

export abstract class Human extends AbstractEntity {
  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column()
  telephone: string;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn()
  user: User;
}
