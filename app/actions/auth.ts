"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

export type LoginState = { error: string | null; email: string };

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  try {
    await signIn("credentials", {
      email,
      password: formData.get("password"),
      redirectTo: "/admin",
    });
    return { error: null, email };
  } catch (error) {
    if (error instanceof AuthError) {
      // Slow down password guessing a little.
      await new Promise((resolve) => setTimeout(resolve, 800));
      // Return the email so the form can keep it (React resets form fields
      // after every action).
      return { error: "Invalid email or password.", email };
    }
    // signIn throws a redirect on success; let Next.js handle it.
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
