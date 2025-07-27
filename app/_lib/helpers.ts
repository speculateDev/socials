import { auth } from "./auth";

export const currentUser = async function () {
  const session = await auth();
  return session?.user;
};
