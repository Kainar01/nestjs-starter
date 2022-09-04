export interface User {
  id: number;
  chatId: string;
  name: string | null;
  username: string | null;
  password: string | null;
  role: UserRole | null;
  lastAssignmentNotification: Date | null;
  lastAssignmentRequest: Date | null;
}

export enum UserRole {
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}
