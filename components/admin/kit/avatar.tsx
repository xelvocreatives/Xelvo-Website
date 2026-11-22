import Image from "next/image";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/admin-format";

const sizes = { sm: "size-9 text-xs", md: "size-11 text-sm", lg: "size-16 text-lg" } as const;
const px = { sm: 36, md: 44, lg: 64 } as const;

export function XaAvatar({
  name,
  src,
  size = "md",
  className,
}: {
  name: string;
  src?: string | null;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#242424] font-bold text-xa-ink/85 ring-1 ring-white/10",
        sizes[size],
        className,
      )}
    >
      {src ? (
        <Image src={src} alt="" width={px[size]} height={px[size]} className="size-full object-cover" />
      ) : (
        <span aria-hidden>{initials(name)}</span>
      )}
    </span>
  );
}
