import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

import { User, UserRole } from '../interfaces';
import { UserScheduleEntity } from './user-schedule.entity';

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

  @Column('timestamptz', { nullable: true, name: 'last_assignment_notification' })
  lastAssignmentNotification!: Date | null;

  @Column('timestamptz', { nullable: true, name: 'last_assignment_request' })
  lastAssignmentRequest!: Date | null;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  @OneToMany(() => UserScheduleEntity, (userSchedule) => userSchedule.user, {
    cascade: true,
  })
  public userSchedules?: UserScheduleEntity[];
}
