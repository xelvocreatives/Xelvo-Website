import "server-only";
import { auth } from "@/auth";

/**
 * Server actions are public HTTP endpoints, so every admin action must check
 * the session itself; the /admin redirect in proxy.ts only protects pages.
 */
export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return Boolean(session?.user?.email);
}

export const UNAUTHORIZED = "Unauthorized: You must be logged in.";
