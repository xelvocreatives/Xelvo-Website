"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export type MenuItem = {
  label: string;
  icon: React.ReactNode;
  onSelect: () => void;
  danger?: boolean;
};

/** The "…" menu on cards and rows. Always visible so it works on touch screens. */
export function ActionMenu({ items, label }: { items: MenuItem[]; label: string }) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        aria-label={label}
        className="flex size-9 items-center justify-center rounded-lg bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75 data-[state=open]:bg-black/80"
        onClick={(e) => e.stopPropagation()}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="xa z-[70] min-w-[210px] rounded-xl border border-xa-line-strong bg-xa-raised p-1.5 text-xa-ink shadow-[0_16px_40px_-12px_rgb(0_0_0/0.85)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item, index) => (
            <React.Fragment key={item.label}>
              {item.danger && index > 0 && <DropdownMenu.Separator className="my-1 h-px bg-xa-line" />}
              <DropdownMenu.Item
                onSelect={item.onSelect}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium outline-none select-none [&_svg]:size-4",
                  item.danger
                    ? "text-xa-red data-[highlighted]:bg-xa-red/10"
                    : "data-[highlighted]:bg-white/6",
                )}
              >
                {item.icon}
                {item.label}
              </DropdownMenu.Item>
            </React.Fragment>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
