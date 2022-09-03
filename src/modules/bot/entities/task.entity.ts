import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Task, TaskType } from '../interfaces';


@Entity('task')
export class TaskEntity implements Task {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('varchar', { nullable: false, name: 'name' })
  name!: string;

  @Column({ type: 'enum', enum: TaskType, nullable: false, name: 'type' })
  type!: TaskType;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  deadline!: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
