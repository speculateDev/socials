"use server";

import { redis } from "@/lib/db";
import { signIn, signOut } from "../_lib/auth";
import { DEFAULT_REDIRECT } from "../routes";
import { AuthError } from "next-auth";
import { defaultFormData } from "../auth/signup/SignupForm";

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

export async function signinWithCredentials(values: {
  email: string;
  password: string;
}) {
  const { email, password } = values;
  if (!email || !password)
    return { error: "Provide both the email and password!" };

  const userKey = await redis.get(`user:email:${email}`);

  if (!userKey) return { error: "Invalid credentials!" };

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials!" };
          break;

        default:
          return { error: "Something went wrong!" };
          break;
      }
    }

    throw error;
  }
}

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

    // Create the user through a callback
    await signIn("credentials", {
      email,
      password,
      signUp: true,
      name: `${firstname} ${lastname}`,
      redirectTo: DEFAULT_REDIRECT,
    });
  } catch (error) {
    throw error;
  }
};

export async function signInOauth(provider: string) {
  try {
    await signIn(provider, { redirectTo: DEFAULT_REDIRECT });
  } catch (error) {
    throw error;
  }
}
