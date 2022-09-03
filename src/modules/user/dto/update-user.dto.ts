import type { User } from '../user.interface';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UpdateUserDto extends Partial<Omit<User, 'id'>> {
}
