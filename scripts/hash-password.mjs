// Turns an admin password into the ADMIN_PASSWORD_HASH value for .env.
// Usage: node scripts/hash-password.mjs
// Output format: scrypt:<salt hex>:<hash hex>  (no "$" characters, so .env
// variable expansion can't corrupt it).
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline/promises";

const rl = createInterface({ input: process.stdin, output: process.stdout });
const password = await rl.question("Admin password: ");
rl.close();

if (password.length < 10) {
  console.error("Use at least 10 characters.");
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);
console.log(`\nADMIN_PASSWORD_HASH="scrypt:${salt.toString("hex")}:${hash.toString("hex")}"`);
