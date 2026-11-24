"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { deletePost } from "@/app/actions/posts";
import { ActionMenu } from "../kit/action-menu";
import { ConfirmDialog } from "../kit/confirm-dialog";

export function PostRowActions({
  id,
  title,
  slug,
  live,
}: {
  id: string;
  title: string;
  slug: string;
  live: boolean;
}) {
  const router = useRouter();
  const [confirm, setConfirm] = React.useState(false);

  return (
    <>
      <ActionMenu
        label={`Options for ${title}`}
        items={[
          { label: "Edit", icon: <Pencil />, onSelect: () => router.push(`/admin/blog/${id}`) },
          {
            label: live ? "View on website" : "Preview",
            icon: <Eye />,
            onSelect: () => window.open(`/blog/${slug}${live ? "" : "?preview=1"}`, "_blank", "noopener"),
          },
          { label: "Delete", icon: <Trash2 />, danger: true, onSelect: () => setConfirm(true) },
        ]}
      />
      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title="Delete this article?"
        description={
          <>
            <span className="font-semibold text-xa-ink">{title}</span> will be removed permanently
            {live ? ", including from your website" : ""}. This can&apos;t be undone.
          </>
        }
        confirmLabel="Delete article"
        onConfirm={async () => {
          const result = await deletePost(id);
          if (result.ok) toast.success(result.message, { description: title });
          else toast.error(result.message);
        }}
      />
    </>
  );
}
