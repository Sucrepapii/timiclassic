import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'mock-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock-secret',
      // If client ID is missing in dev, NextAuth might crash, so we handle it gracefully or only add it when set.
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        isPortal: { label: 'Portal Sign In', type: 'text' }, // "true" if client signing in, otherwise "false"
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }

        const email = credentials.email.toLowerCase().trim();
        const isPortal = credentials.isPortal === 'true';

        if (isPortal) {
          // Client Portal authentication
          const client = await prisma.client.findUnique({
            where: { email },
          });

          if (!client || !client.portalPassword) {
            throw new Error('No client profile found with portal access. Contact Timiclassic.');
          }

          const isValid = await bcrypt.compare(credentials.password, client.portalPassword);
          if (!isValid) {
            throw new Error('Invalid email or password');
          }

          return {
            id: client.id,
            name: `${client.firstName} ${client.lastName}`,
            email: client.email,
            role: 'CLIENT',
            needsPasswordChange: client.needsPasswordChange,
          };
        } else {
          // Designer / Staff authentication
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            throw new Error('Invalid email or password');
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error('Invalid email or password');
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            needsPasswordChange: false,
          };
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'USER';
        token.needsPasswordChange = (user as any).needsPasswordChange || false;
      }
      
      // Allow dynamic session updates (e.g. updating user image/name)
      if (trigger === 'update' && session) {
        return { ...token, ...session };
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).needsPasswordChange = token.needsPasswordChange;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
