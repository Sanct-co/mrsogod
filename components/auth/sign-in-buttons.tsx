"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithGoogle,
  signInWithFacebook,
  signOutEverywhere,
  consumeRedirectResult,
} from "@/lib/auth/client-session";

export function SignInButtons() {
  const router = useRouter();
  const [pending, setPending] = useState<"google" | "facebook" | "signout" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    consumeRedirectResult()
      .then(() => router.refresh())
      .catch((err) => setError(err instanceof Error ? err.message : String(err)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handle(action: "google" | "facebook" | "signout") {
    setError(null);
    setPending(action);
    try {
      if (action === "google") await signInWithGoogle();
      else if (action === "facebook") await signInWithFacebook();
      else await signOutEverywhere();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          onClick={() => handle("google")}
          disabled={pending !== null}
          className="rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {pending === "google" ? "Signing in…" : "Sign in with Google"}
        </button>
        {/* <button
          onClick={() => handle("facebook")}
          disabled={pending !== null}
          className="rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {pending === "facebook" ? "Signing in…" : "Sign in with Facebook"}
        </button> */}
        <button
          onClick={() => handle("signout")}
          disabled={pending !== null}
          className="rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {pending === "signout" ? "Signing out…" : "Sign out"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
