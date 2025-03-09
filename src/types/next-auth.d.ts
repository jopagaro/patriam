import 'next-auth';

type UserRole = 'admin' | 'writer' | 'reader';

declare module 'next-auth' {
  interface User {
    id: string;
    username: string;
    email?: string | null;
    role: UserRole;
  }

  interface Session {
    user: {
      id: string;
      username: string;
      email?: string | null;
      role: UserRole;
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
    email?: string | null;
    role: UserRole;
  }
}
