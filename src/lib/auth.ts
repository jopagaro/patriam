import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from './db';
import { UserRole } from '@/types/auth';
import { JWT } from 'next-auth/jwt';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        const user = await prisma.user.findFirst({
          where: {
            username: {
              equals: credentials.username,
              mode: 'insensitive'
            }
          },
        });

        if (!user || !user.passwordHash) {
          throw new Error('Invalid credentials');
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        // Return user data with numeric ID and ensure role is uppercase
        return {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role.toUpperCase() as UserRole,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Ensure we're setting numeric ID and uppercase role
        const numericId = typeof user.id === 'string' ? parseInt(user.id) : user.id;
        
        return {
          ...token,
          id: numericId,
          username: user.username,
          role: user.role.toUpperCase() as UserRole,
        } as JWT;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.username,
          role: token.role.toUpperCase() as UserRole,
        },
      };
    },
  },
};
