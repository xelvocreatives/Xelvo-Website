import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

export function SignOutButton() {
  return (
    <form
      action={logout}
      className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full"
    >
      <button
        type="submit"
        className="flex w-full items-center gap-4 px-5 py-4 rounded-[18px] text-red-500/80 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all group group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:rounded-xl"
      >
        <LogOut className="w-5 h-5 shrink-0 group-hover:rotate-12 transition-transform group-data-[collapsible=icon]:w-4 group-data-[collapsible=icon]:h-4" />
        <span className="font-black uppercase tracking-[0.2em] text-[10px] group-data-[collapsible=icon]:hidden truncate">
          Initialize Exit
        </span>
      </button>
    </form>
  );
}
