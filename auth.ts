import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyAdmin } from "@/lib/admin-credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 12 }, // 12 hours
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        const email =
          typeof credentials?.email === "string" ? credentials.email : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";
        if (!email || !password) return null;

        const adminEmail = verifyAdmin(email, password);
        return adminEmail
          ? { id: adminEmail, email: adminEmail, name: "Admin" }
          : null;
      },
    }),
  ],
});
