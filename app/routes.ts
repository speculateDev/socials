/**
 * An array of routes that are accessible to teh public
 * These routes do not require auth
 * @type {string []}
 */

export const protectedRoutes = ["/"];

/**
 * An array of routes that are used for auth
 * these routes will redirect logged in users to /
 * @type {string[]}
 */
export const authRoute = "/auth";

/**
 * the prefix for API authentication routes
 * Routes that start with the prefix are used for API auth purposes
 * @type {string}
 */

export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after login
 * @type {string}
 */
export const DEFAULT_REDIRECT = "/";
