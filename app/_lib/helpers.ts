import { redis } from "@/lib/db";
import { auth } from "./auth";
import { User } from "../types";

export const currentUser = async function () {
  const session = await auth();
  return session?.user;
};

export const getUserKey = async function (email: string | null | undefined) {
  const key = await redis.get(`user:email:${email}`);
  return key as string | undefined;
};

export const getUser = async function (key: string | null | undefined) {
  if (!key) return null;

  const user = await redis.hgetall(key);
  return user as User;
};
