import "server-only";
import { scryptSync, timingSafeEqual } from "node:crypto";

/*
 * Admin accounts live in environment variables (1-2 admins, no database
 * table needed):
 *   ADMIN_EMAIL   / ADMIN_PASSWORD_HASH      - first admin (required)
 *   ADMIN_EMAIL_2 / ADMIN_PASSWORD_HASH_2    - optional second admin
 * Hashes come from `node scripts/hash-password.mjs`:
 *   scrypt:<salt hex>:<hash hex>
 */

type AdminAccount = { email: string; passwordHash: string };

function getAdminAccounts(): AdminAccount[] {
  return [
    [process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD_HASH],
    [process.env.ADMIN_EMAIL_2, process.env.ADMIN_PASSWORD_HASH_2],
  ]
    .filter((pair): pair is [string, string] => Boolean(pair[0] && pair[1]))
    .map(([email, passwordHash]) => ({
      email: email.trim().toLowerCase(),
      passwordHash: passwordHash.trim(),
    }));
}

// Used when the email is unknown, so a wrong email takes as long as a wrong
// password and response timing doesn't reveal which admin emails exist.
const DUMMY_HASH = `scrypt:${"0".repeat(32)}:${"0".repeat(128)}`;

function verifyPassword(password: string, stored: string): boolean {
  const [scheme, saltHex, hashHex] = stored.split(":");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;

  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** Returns the admin's email when the credentials are valid, otherwise null. */
export function verifyAdmin(email: string, password: string): string | null {
  const normalized = email.trim().toLowerCase();
  const account = getAdminAccounts().find((a) => a.email === normalized);
  const ok = verifyPassword(password, account?.passwordHash ?? DUMMY_HASH);
  return account && ok ? account.email : null;
}
