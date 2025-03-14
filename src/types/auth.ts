export type UserRole = 'ADMIN' | 'WRITER' | 'READER';

export interface User {
  id: number;
  username: string;
  email: string | null;
  role: UserRole;
}

export interface Session {
  user: {
    id: string;
    username: string;
    email: string | null;
    role: UserRole;
  };
}

export interface LoginCredentials {
  username: string;
  password: string;
}
