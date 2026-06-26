import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, CloudflareEnv } from './src/db/index';
import { users } from './src/db/schema';
import { eq } from 'drizzle-orm';
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
          const db = getDb(env.DB);
          
          const user = await db.select().from(users).where(eq(users.email, credentials.email as string)).get();
          
          if (!user || !user.password) {
            return null; // User not found or no password set
          }

          const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password);
          
          if (!isPasswordValid) {
            return null;
          }
          
          if (user.role !== 'admin') {
            return null;
          }

          return {
            id: user.uid,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role
          };
        } catch (e) {
          console.error("Credentials error:", e);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // This callback controls whether a user is allowed to sign in.
    async signIn({ user }) {
      try {
        const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
        const db = getDb(env.DB);

        if (!user.email) return false;

        // 1. Check if this specific user is already in the database
        const existingUser = await db.select().from(users).where(eq(users.email, user.email)).get();
        if (existingUser) {
          // Only allow them in if they are an admin
          return existingUser.role === 'admin';
        }

        // 2. If user doesn't exist, check if the database has ANY users at all
        const anyUser = await db.select().from(users).limit(1).get();
        if (!anyUser) {
          // This is the VERY FIRST user logging in. Make them the admin!
          await db.insert(users).values({
            uid: user.id || crypto.randomUUID(),
            email: user.email,
            role: 'admin'
          });
          return true; // Allow sign in
        }

        // 3. If users exist but this person isn't one of them, reject them
        return false;
      } catch (e) {
        console.error("Sign in error:", e);
        return false;
      }
    },
    // Adding user details to the token
    async jwt({ token, user }) {
      if (user) {
        // If they successfully signed in through the logic above, they are an admin
        token.role = (user as any).role || "admin";
        token.image = user.image;
        token.name = user.name;
      }
      return token;
    },
    // Exposing the role on the session object
    async session({ session, token }) {
      if (session.user) {
        // @ts-expect-error adding extra fields
        session.user.role = token.role;
        // @ts-expect-error
        session.user.image = token.image as string | undefined || session.user.image;
        // @ts-expect-error
        session.user.name = token.name as string | undefined || session.user.name;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login?error=AccessDenied", // Redirect here if signIn callback returns false
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
});
