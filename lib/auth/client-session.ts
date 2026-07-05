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

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/popup-closed-by-user": "Sign-in was cancelled.",
  "auth/cancelled-popup-request": "Sign-in was cancelled.",
  "auth/popup-blocked": "Your browser blocked the sign-in popup. Please try again.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
  "auth/unauthorized-domain": "Sign-in isn't available from this site right now.",
  "auth/account-exists-with-different-credential":
    "An account already exists with a different sign-in method.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/internal-error": "Something went wrong signing you in. Please try again.",
};

export function getAuthErrorMessage(err: unknown): string {
  const code = typeof err === "object" && err !== null ? (err as { code?: unknown }).code : undefined;
  if (typeof code === "string") {
    return AUTH_ERROR_MESSAGES[code] ?? "Something went wrong signing you in. Please try again.";
  }
  if (err instanceof Error && err.message === "Failed to establish server session") {
    return "Couldn't complete sign-in. Please try again.";
  }
  return "Something went wrong. Please try again.";
}

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
