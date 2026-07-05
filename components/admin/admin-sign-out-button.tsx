"use client";

import { useRouter } from "next/navigation";
import { signOutEverywhere } from "@/lib/auth/client-session";

export function AdminSignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await signOutEverywhere();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="text-xs font-bold uppercase tracking-[0.2em] text-gold-mid hover:text-gold-solid"
    >
      Sign Out
    </button>
  );
}
