"use client";
import { useState } from "react";
import Link from "next/link";

import { signUp } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import OauthBtn from "../OauthBtn";

export const defaultFormData = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
};

const Page = () => {
  const [formData, setFormData] = useState(defaultFormData);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.password ||
      !formData.firstname ||
      !formData.lastname
    )
      return toast.error("All fields are required");

    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters long");

    const res = await signUp(formData);

    if (res?.error) {
      return toast.error(res.error);
    }

    if (!res.success) return toast.error("Something went wrong!");

    toast.success(res.success);
    redirect("/");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="flex h-screen w-full justify-center items-center">
      <div className="flex flex-col gap-4 mx-auto max-w-sm w-full">
        <h2 className="text-2xl font-medium">Sign Up</h2>
        <p className="text-gray-500 text-sm">Get started today!</p>

        <form className="w-full mt-3" onSubmit={handleSignup}>
          <div className="mb-4">
            <Label className="mb-2" htmlFor="firstname">
              First Name
            </Label>
            <Input
              value={formData.firstname}
              id="firstname"
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <Label className="mb-2" htmlFor="lastname">
              Last Name
            </Label>
            <Input
              value={formData.lastname}
              id="lastname"
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <Label className="mb-2" htmlFor="email">
              Email
            </Label>
            <Input value={formData.email} id="email" onChange={handleChange} />
          </div>

          <div className="mb-4">
            <Label className="mb-2" htmlFor="password">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <Button
            variant="blue"
            type="submit"
            className="px-3 py-6 w-full mt-4 text-md"
          >
            Create your account
          </Button>
        </form>

        <p className="text-center text-foreground/40">Or</p>

        <OauthBtn />

        <div className="flex gap-1 text-sm justify-center mt-3">
          <p className="text-gray-500">Don't have an account?</p>
          <Link
            className="text-blue-700 dark:text-blue-300 hover:underline transition"
            href="/auth/login"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Page;
