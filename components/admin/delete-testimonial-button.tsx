"use client";

import { deleteTestimonial } from "@/app/actions/testimonials";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export function DeleteTestimonialButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 hover:bg-[#333] hover:text-red-500"
      disabled={isPending}
      onClick={() => {
        if (confirm("Are you sure you want to delete this testimonial?")) {
          startTransition(() => {
            deleteTestimonial(id);
          });
        }
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
