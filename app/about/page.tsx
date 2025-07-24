"use client";
import { signIn } from "next-auth/react";

function AboutPage() {
  return (
    <div className="flex gap-5">
      <button
        className="bg-white text-black p-1"
        onClick={() => signIn("google")}
      >
        Google
      </button>
      <button
        className="bg-white text-black p-1"
        onClick={() => signIn("github")}
      >
        Github
      </button>
    </div>
  );
}

export default AboutPage;
