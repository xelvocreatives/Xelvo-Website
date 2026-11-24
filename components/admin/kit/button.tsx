import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "whatsapp";
type Size = "sm" | "md" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-xa-accent text-xa-on-accent hover:bg-xa-accent-hover",
  secondary:
    "bg-xa-raised text-xa-ink border border-xa-line-strong hover:border-white/25 hover:bg-[#222]",
  ghost: "text-xa-muted hover:text-xa-ink hover:bg-white/5",
  danger: "bg-[#3a1512] text-xa-red border border-xa-red/25 hover:bg-[#4a1915]",
  whatsapp:
    "bg-xa-whatsapp/12 text-xa-whatsapp border border-xa-whatsapp/25 hover:bg-xa-whatsapp/20",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px] gap-1.5 rounded-lg",
  md: "h-11 px-5 text-sm gap-2 rounded-xl",
  icon: "h-9 w-9 rounded-lg",
};

export type XaButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  asChild?: boolean;
};

export const XaButton = React.forwardRef<HTMLButtonElement, XaButtonProps>(
  function XaButton(
    { variant = "secondary", size = "md", loading, asChild, className, children, disabled, ...props },
    ref,
  ) {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        disabled={asChild ? undefined : disabled || loading}
        aria-busy={loading || undefined}
        className={cn(
          "inline-flex shrink-0 items-center justify-center font-semibold whitespace-nowrap transition-[background-color,border-color,color,transform] duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {loading && <Loader2 className="animate-spin" aria-hidden />}
            {children}
          </>
        )}
      </Comp>
    );
  },
);
