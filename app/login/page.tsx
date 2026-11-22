"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-[#111111] font-sans items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}

function LoginForm() {
  const [state, formAction, pending] = useActionState(login, {
    error: null,
    email: "",
  });
  const errorMessage = state.error;

  return (
    <div className="w-full max-w-md bg-[#181818] p-8 rounded-2xl border border-[#333] shadow-2xl">
      <div className="flex justify-center mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Access</h1>
      </div>

      <form action={formAction} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            // `key` remounts the input so the kept email shows after a failed try.
            key={state.email}
            defaultValue={state.email}
            autoComplete="username"
            required
            className="w-full bg-[#111] border border-[#333] rounded-lg p-3 text-white focus:outline-none focus:border-[#FF6600] transition-colors"
            placeholder="admin@xelvo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Password
          </label>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full bg-[#111] border border-[#333] rounded-lg p-3 text-white focus:outline-none focus:border-[#FF6600] transition-colors"
            placeholder="••••••••"
          />
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-500 text-sm">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 w-full bg-linear-to-r from-[#FF6600] to-[#E69700] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {pending ? "Verifying..." : "Login"}
        </button>
      </form>
    </div>
  );
}
