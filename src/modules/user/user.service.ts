import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository, UpdateResult } from 'typeorm';

import type { UpdateUserDto } from './dto';
import type { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';
import type { User } from './user.interface';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

  public async findByUsername(username: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  public async findByChatId(chatId: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { chatId } });
  }

  public async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }

  public async updateUser(id: number, dto: UpdateUserDto): Promise<User> {
    return this.userRepository
      .createQueryBuilder()
      .update(dto)
      .returning('*')
      .where({ id })
      .execute()
      .then((result: UpdateResult) => (<[User]>result.raw)[0]);
  }
}
