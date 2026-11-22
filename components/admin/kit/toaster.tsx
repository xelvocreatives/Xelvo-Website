"use client";

import { Toaster } from "sonner";

export function XaToaster() {
  return (
    <Toaster
      position="bottom-right"
      offset={20}
      mobileOffset={{ bottom: 84 }}
      toastOptions={{
        classNames: {
          toast:
            "xa !rounded-xl !border !border-xa-line-strong !bg-xa-raised !text-xa-ink !shadow-[0_16px_40px_-12px_rgb(0_0_0/0.8)] !font-sans",
          description: "!text-xa-muted",
          success: "[&_[data-icon]]:!text-xa-green",
          error: "[&_[data-icon]]:!text-xa-red",
        },
      }}
    />
  );
}
