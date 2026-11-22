"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { deleteInquiry } from "@/app/actions/inquire";
import { deleteApplication } from "@/app/actions/career";
import { XaButton } from "./kit/button";
import { ConfirmDialog } from "./kit/confirm-dialog";

export function DeleteRecordButton({
  kind,
  id,
  name,
}: {
  kind: "lead" | "application";
  id: string;
  name: string;
}) {
  const router = useRouter();
  const noun = kind === "lead" ? "lead" : "job application";

  return (
    <ConfirmDialog
      trigger={
        <XaButton variant="ghost" size="sm" className="text-xa-muted hover:text-xa-red">
          <Trash2 />
          Delete {noun}
        </XaButton>
      }
      title={`Delete this ${noun}?`}
      description={
        <>
          <span className="font-semibold text-xa-ink">{name}</span>&apos;s {noun} and its details will be removed
          permanently. Use this for spam or duplicates. This can&apos;t be undone.
        </>
      }
      confirmLabel={`Delete ${noun}`}
      onConfirm={async () => {
        const result = kind === "lead" ? await deleteInquiry(id) : await deleteApplication(id);
        if (result.success) {
          toast.success(`${kind === "lead" ? "Lead" : "Application"} deleted.`, { description: name });
          router.push(kind === "lead" ? "/admin/inquiries" : "/admin/careers");
        } else {
          toast.error(result.error ?? "Couldn't delete. Please try again.");
        }
      }}
    />
  );
}
