import NextAuth from "next-auth";
import { authConfig } from "./app/_lib/auth";
import { authRoute, DEFAULT_REDIRECT, protectedRoutes } from "./app/routes";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

// This function can be marked `async` if using `await` inside
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAuthRoute = nextUrl.pathname.startsWith(authRoute);
  const isProtected = protectedRoutes.includes(nextUrl.pathname);

  if (isAuthRoute && isLoggedIn)
    return NextResponse.redirect(new URL(DEFAULT_REDIRECT, nextUrl.origin));

  if (isProtected && !isLoggedIn)
    return NextResponse.redirect(new URL(authRoute, nextUrl.origin));

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
