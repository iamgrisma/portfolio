import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, CloudflareEnv } from './src/db/index';
import { users } from './src/db/schema';
import { eq } from 'drizzle-orm';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // This callback controls whether a user is allowed to sign in.
    async signIn({ user }) {
      try {
        const { env } = (await getCloudflareContext()) as unknown as { env: CloudflareEnv };
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
        token.role = "admin";
      }
      return token;
    },
    // Exposing the role on the session object
    async session({ session, token }) {
      if (session.user) {
        // @ts-expect-error adding role to session
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login?error=AccessDenied", // Redirect here if signIn callback returns false
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
});
