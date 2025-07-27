"use client";

import { useState } from "react";
import Link from "next/link";

import { signinWithCredentials } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    signinWithCredentials({ email, password });
  }

  return (
    <div className="flex flex-col gap-6 mx-auto max-w-sm w-full">
      <h2 className="text-2xl font-medium">Login</h2>
      <p className="text-gray-500">Welcome back!</p>

      <form className="w-full" onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label className="mb-2" htmlFor="email">
            Email
          </Label>
          <Input
            value={email}
            id="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <Label className="mb-2" htmlFor="password">
            Password
          </Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit" className="px-3 py-5 w-full mt-6">
          Login
        </Button>
      </form>

      <p className="text-center text-foreground/40">Or</p>

      <Button className="px-3 py-6" variant="secondary">
        <img
          className="size-6"
          src="https://authjs.dev/img/providers/google.svg"
          alt=""
        />
        <span>Continue with Google</span>
      </Button>

      <div className="flex gap-1 text-sm justify-center mt-6">
        <p className="text-gray-500">Don't have an account?</p>
        <Link
          className="text-blue-700 dark:text-blue-300 hover:underline transition"
          href="/auth/signup"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default LoginCard;
