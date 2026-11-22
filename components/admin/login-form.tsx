"use client";

import * as React from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { login } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
import { XaButton } from "./kit/button";
import { inputClass } from "./kit/field";

export function LoginForm() {
  const [state, formAction, pending] = React.useActionState(login, { error: null, email: "" });
  const [showPassword, setShowPassword] = React.useState(false);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  // After a failed attempt, put the cursor back in the password field.
  React.useEffect(() => {
    if (state.error) passwordRef.current?.focus();
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="login-email" className="text-sm font-semibold text-xa-ink">
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          key={state.email}
          defaultValue={state.email}
          autoComplete="username"
          required
          autoFocus={!state.email}
          className={cn(inputClass, "h-12")}
          placeholder="you@xelvocreatives.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="login-password" className="text-sm font-semibold text-xa-ink">
          Password
        </label>
        <div className="relative">
          <input
            ref={passwordRef}
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            aria-invalid={state.error ? true : undefined}
            aria-describedby={state.error ? "login-error" : undefined}
            className={cn(inputClass, "h-12 pr-12")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute top-1/2 right-1.5 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-xa-muted hover:bg-white/5 hover:text-xa-ink"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {state.error && (
        <p
          id="login-error"
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-xa-red/25 bg-xa-red/8 px-3.5 py-3 text-sm text-xa-red"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          That email and password don&apos;t match. Check them and try again.
        </p>
      )}

      <XaButton type="submit" variant="primary" loading={pending} className="h-12 w-full text-[15px]">
        {pending ? "Signing in…" : "Sign in"}
      </XaButton>
    </form>
  );
}
