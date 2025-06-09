import { DefaultSession } from 'next-auth';
import { AdminConfig } from './schema';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      adminConfig?: AdminConfig;
    } & DefaultSession['user']
  }

  interface User {
    id: string;
    adminConfig?: AdminConfig;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    adminConfig?: AdminConfig;
  }
} 