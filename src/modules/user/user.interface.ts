export interface User {
  id: number;
  chatId: string;
  name: string | null;
  username: string | null;
  password: string | null;
  role: UserRole | null;
}

export enum UserRole {
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}
