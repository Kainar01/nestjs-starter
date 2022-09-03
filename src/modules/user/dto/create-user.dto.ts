import type { User } from '../user.interface';

export interface CreateUserDto extends Partial<Omit<User, 'id'>> {
  chatId: string;
}
