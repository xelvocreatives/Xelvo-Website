"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-[#111111] font-sans items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}

// Client component for the form
function LoginForm() {
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setErrorMessage("");

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // Dynamic import to avoid server-side issues (though this is a client component)
      const { createClient } = await import("@/utils/supabase/client");
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        router.push("/admin");
        router.refresh(); // Ensure middleware re-runs
      }
    } catch (e) {
      console.error(e);
      setErrorMessage("An unexpected error occurred");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#181818] p-8 rounded-2xl border border-[#333] shadow-2xl">
      <div className="flex justify-center mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Access</h1>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
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
