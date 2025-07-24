import NextAuth from "next-auth";
import { authConfig } from "./app/_lib/auth";

const { auth } = NextAuth(authConfig);

// This function can be marked `async` if using `await` inside
export default auth((req) => {
  console.log("auth: ", req.auth);

  return null;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
