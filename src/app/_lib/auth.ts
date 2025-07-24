import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials;

        console.log({ email, password });

        const testUser = {
          id: "1",
          name: "Test User",
          email: "test@example.com",
          password: "password123", // In production, never store plain passwords!
        };

        return {
          id: testUser.id,
          name: testUser.name,
          email: testUser.email,
        };
      },
    }),
  ],
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
