import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
} from 'typeorm';

import * as bcrypt from 'bcrypt';
import { UserRole } from '../enums/user.role';
import { AbstractEntity } from '../../../common/entities/abstract.entity';

@Entity()
export class User extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  actif: boolean;

  @CreateDateColumn()
  dateCreation: Date;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.PATIENT })
  role: UserRole;

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
