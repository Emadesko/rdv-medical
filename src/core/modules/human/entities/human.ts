import { Column, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { AbstractEntity } from '../../../common/entities/abstract.entity';

export abstract class Human extends AbstractEntity {
  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column()
  telephone: string;

  @Column()
  avatar: string;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE', eager: true })
  @JoinColumn()
  user: User;
}
