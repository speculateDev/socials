"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

import { signinWithCredentials } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OauthBtn from "../OauthBtn";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isPending, startTransition] = useTransition();

  async function handleLoginCredentials(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const res = await signinWithCredentials({ email, password });

      if (res?.error) {
        toast.error(res.error);
        setEmail("");
        setPassword("");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6 mx-auto max-w-sm w-full">
      <h2 className="text-2xl font-medium">Login</h2>
      <p className="text-gray-500">Welcome back!</p>

      <form className="w-full" onSubmit={handleLoginCredentials}>
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
          {isPending ? (
            <>
              <Loader2Icon className="animate-spin size-6" />
              <span>Loggin in...</span>
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>

      <p className="text-center text-foreground/40">Or</p>

      <OauthBtn provider="google">
        <img
          className="size-6"
          src="https://authjs.dev/img/providers/google.svg"
          alt="Google icon"
        />
        <span>Continue with Google</span>
      </OauthBtn>

      <OauthBtn provider="github">
        <img
          className="size-6"
          src="https://authjs.dev/img/providers/github.svg"
          alt="Google icon"
        />
        <span>Continue with Google</span>
      </OauthBtn>

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
