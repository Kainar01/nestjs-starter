import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Assignment, AssignmentStatus, AssignmentType } from '../interfaces';


@Entity('assignment')
export class AssignmentEntity implements Assignment {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('int', { nullable: false, name: 'assignment_id' })
  assignmentId!: string;

  @Column('varchar', { nullable: false, name: 'title' })
  title!: string;

  @Column('varchar', { nullable: false, name: 'link' })
  link!: string;

  @Column('varchar', { nullable: false, name: 'course_title' })
  courseTitle!: string;

  @Column({ type: 'enum', enum: AssignmentStatus, nullable: false, name: 'status' })
  status!: AssignmentStatus;

  @Column({ type: 'enum', enum: AssignmentType, nullable: false, name: 'type' })
  type!: AssignmentType;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  deadline!: Date;
}
