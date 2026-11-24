import type { Metadata } from "next";
import { auth } from "@/auth";
import { getAdminCounts } from "@/lib/data";
import { AdminShell } from "@/components/admin/kit/shell";
import { XaToaster } from "@/components/admin/kit/toaster";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Xelvo admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [session, counts] = await Promise.all([auth(), getAdminCounts()]);

  return (
    <AdminShell counts={counts} email={session?.user?.email ?? ""}>
      {children}
      <XaToaster />
    </AdminShell>
  );
}
