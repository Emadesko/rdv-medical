import { Column, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

export abstract class Human {
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
