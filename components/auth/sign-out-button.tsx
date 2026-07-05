"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOutEverywhere } from "@/lib/auth/client-session";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    try {
      await signOutEverywhere();
      router.push("/");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={pending}
      className="text-xs font-bold uppercase tracking-[0.2em] text-gold-mid transition-colors hover:text-gold-solid disabled:opacity-60"
    >
      {pending ? "Signing Out…" : "Sign Out"}
    </button>
  );
}
