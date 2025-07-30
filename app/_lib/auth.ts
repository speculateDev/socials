import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { redis } from "@/lib/db";
import { getUser, getUserKey } from "./helpers";
import bcrypt from "bcryptjs";
import { User } from "../types";

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),

    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),

    Credentials({
      async authorize(credentials) {
        const { email, password, name } = credentials;
        if (!email || !password) return null;

        // Check if user exists
        const key = await getUserKey(email as string);
        const user = (await getUser(key)) as User;

        if (!user || !user.password) {
          const hashedPassword = await bcrypt.hash(password as string, 10);

          return {
            email: email,
            password: hashedPassword,
            name: name,
          } as User;
        }

        // Check password
        const isMatched = await bcrypt.compare(
          password as string,
          user.password
        );

        if (isMatched) return user;

        return null;
      },
    }),
  ],
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async signIn({ user }) {
      // Don't create a user if the account already exist
      const userKey = await getUserKey(user?.email);
      const existingUser = await getUser(userKey);
      if (existingUser) return true;

      // Else create the user
      if (user.id) {
        await redis.hset(user.id, {
          id: user.id,
          email: user.email,
          name: user.name,
          ...(user.password && { password: user.password }),
          ...(user.image && { image: user.image }),
        });

        // Create the email lookup
        await redis.set(`user:email:${user.email}`, user.id);
      }

      return true;
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }

      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      // Get credentials from existing user if exists
      const userKey = await getUserKey(token?.email);
      const existingUser = await getUser(userKey);
      if (!existingUser) return token;

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.sub = existingUser.id;

      return token;
    },
  },

  pages: {
    signIn: "/auth/login",
  },
  session: { strategy: "jwt" },
  ...authConfig,
});
