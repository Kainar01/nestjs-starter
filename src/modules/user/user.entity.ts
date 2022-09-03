import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { User, UserRole } from './user.interface';

@Entity('user')
export class UserEntity implements User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('varchar', { nullable: false, name: 'chatId' })
  chatId!: string;

  @Column('varchar', { nullable: true, name: 'name' })
  name!: string | null;

  @Column('varchar', { nullable: true, name: 'username' })
  username!: string | null;

  @Column({ type: 'enum', enum: UserRole, nullable: true, name: 'role' })
  role!: UserRole | null;

  @Column('varchar', { nullable: true, name: 'password' })
  password!: string | null;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
