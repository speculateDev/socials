"use server";
import { redis } from "@/lib/db";
import { signIn } from "../_lib/auth";
import { currentUser } from "../_lib/helpers";
import { DEFAULT_REDIRECT } from "../routes";
import { AuthError } from "next-auth";
import { defaultFormData } from "../auth/signup/SignupForm";
import bcrypt from "bcryptjs";

/*
export async function checkAuthStatus() {
  const user = await currentUser();
  if (!user) return { success: false };

  // namespaces are really important to understand in redis
  const userId = `user:${user.id}`;

  const existingUser = await redis.hgetall(userId);

  // Sign up case: bc user is visiting our platform for the first time
  if (!existingUser || Object.keys(existingUser).length === 0) {
    const image = user.picture ? user.picture : "";

    await redis.hset(userId, {
      id: user.id,
      email: user.email,
      name: `${user.given_name} ${user.family_name}`,
      image,
    });
  }

  return { success: true };
}
*/

export const signUp = async (values: typeof defaultFormData) => {
  const { email, password, firstname, lastname } = values;

  // Check empty fields
  if (!email || !password || !firstname || !lastname)
    return { error: "All fields are required" };

  // Check password length
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long" };
  }

  try {
    // Check if user already exists based on email lookup
    const userKey = (await redis.get(`user:email:${email}`)) as string;

    if (userKey) {
      const existingUser = await redis.hgetall(userKey);

      if (existingUser && Object.keys(existingUser).length > 0) {
        return { error: "Email already in use!" };
      }
    }

    // Populate the session with an id
    await signIn("credentials", { email, password, redirect: false });
    const user = await currentUser();

    if (!user) throw new Error("something went wrong");

    // Create the user in the db
    const userId = `user:${user.id}`;
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into redis
    await redis.hset(userId, {
      id: user.id,
      email: user.email,
      password: hashedPassword,
      name: `${firstname} ${lastname}`,
      image: "/user-placeholder.png",
    });

    // Create email lookup
    await redis.set(`user:email:${email}`, userId);

    return { success: "User created successfully" };
  } catch (error) {
    throw error;
  }
};
