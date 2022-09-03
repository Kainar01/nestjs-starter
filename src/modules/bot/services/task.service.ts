import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { TaskEntity } from '../entities';

@Injectable()
export class TaskService {
  constructor(@InjectRepository(TaskEntity) private taskRepository: Repository<TaskEntity>) {}

  public async findAll(): Promise<TaskEntity[]> {
    return this.taskRepository.find();
  }
}
