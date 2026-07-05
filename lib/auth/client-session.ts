import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  type User,
  type AuthProvider,
} from "firebase/auth";
import { clientAuth } from "@/lib/firebase/client";

function isInAppBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /FBAN|FBAV|Instagram/i.test(ua);
}

async function establishServerSession(user: User): Promise<void> {
  const idToken = await user.getIdToken();
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) throw new Error("Failed to establish server session");
}

async function signInWithProvider(provider: AuthProvider): Promise<void> {
  if (isInAppBrowser()) {
    await signInWithRedirect(clientAuth, provider);
    return; // page navigates away; result is handled by consumeRedirectResult() on return
  }

  try {
    const result = await signInWithPopup(clientAuth, provider);
    await establishServerSession(result.user);
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;
    if (code === "auth/popup-blocked" || code === "auth/cancelled-popup-request") {
      await signInWithRedirect(clientAuth, provider);
      return;
    }
    throw err;
  }
}

export function signInWithGoogle(): Promise<void> {
  return signInWithProvider(new GoogleAuthProvider());
}

export function signInWithFacebook(): Promise<void> {
  return signInWithProvider(new FacebookAuthProvider());
}

/**
 * Call once on mount to finish a signInWithRedirect flow, if one is in progress.
 * Returns true when a redirect sign-in was completed (server session established).
 */
export async function consumeRedirectResult(): Promise<boolean> {
  const result = await getRedirectResult(clientAuth);
  if (result?.user) {
    await establishServerSession(result.user);
    return true;
  }
  return false;
}

export async function signOutEverywhere(): Promise<void> {
  await fetch("/api/auth/session", { method: "DELETE" });
  await signOut(clientAuth);
}
