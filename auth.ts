import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// The allowed admin email address. Only this user can log in.
const ADMIN_EMAIL = "kamalbaral@mail.com";

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
      if (user.email === ADMIN_EMAIL) {
        return true; // Allow sign in
      }
      return false; // Deny sign in for everyone else
    },
    // Adding user details to the token
    async jwt({ token, user }) {
      if (user) {
        token.role = user.email === ADMIN_EMAIL ? "admin" : "user";
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
