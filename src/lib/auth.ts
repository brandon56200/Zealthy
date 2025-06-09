import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { FormFragment } from '@/types/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function generateToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function getTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get('auth-token')?.value;
}

export async function setTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function removeTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          include: {
            adminConfig: true,
            personalInfo: true
          }
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        // Map the adminConfig to use our schema's FormFragment type
        const mappedAdminConfig = user.adminConfig ? {
          ...user.adminConfig,
          stepTwoFragments: user.adminConfig.stepTwoFragments.map(fragment => fragment as FormFragment),
          stepThreeFragments: user.adminConfig.stepThreeFragments.map(fragment => fragment as FormFragment),
          unusedFragments: user.adminConfig.unusedFragments.map(fragment => fragment as FormFragment)
        } : undefined;

        // Construct name from personalInfo if available, otherwise use email
        const name = user.personalInfo 
          ? `${user.personalInfo.firstName} ${user.personalInfo.lastName}`
          : user.email;

        return {
          id: user.id,
          email: user.email,
          name,
          adminConfig: mappedAdminConfig
        };
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.adminConfig = user.adminConfig;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.adminConfig = token.adminConfig;
      }
      return session;
    }
  }
};

export { authOptions }; 