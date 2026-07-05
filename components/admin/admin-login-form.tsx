"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, signOutEverywhere } from "@/lib/auth/client-session";

export function AdminLoginForm({ notAuthorized }: { notAuthorized: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setError(null);
    setPending(true);
    try {
      await signInWithGoogle();
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setPending(false);
    }
  }

  async function handleSignOut() {
    await signOutEverywhere();
    router.refresh();
  }

  if (notAuthorized) {
    return (
      <div className="mt-6 flex flex-col items-center gap-3">
        <p className="text-sm font-bold uppercase tracking-widest text-gold-solid/80">
          Your account isn&apos;t authorized as an admin.
        </p>
        <button
          type="button"
          onClick={handleSignOut}
          className="chamfer-btn border border-gold-mid px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-solid hover:bg-gold-mid/10"
        >
          Sign out and try a different account
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={handleSignIn}
        disabled={pending}
        className="chamfer-btn bg-gradient-to-b from-gold-start via-gold-mid to-gold-deep px-6 py-3 text-sm font-extrabold uppercase tracking-[0.2em] text-maroon-deep disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in with Google"}
      </button>
      {error && (
        <p className="text-xs font-bold uppercase tracking-widest text-gold-solid/70">{error}</p>
      )}
    </div>
  );
}
