import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { DecodedIdToken } from "firebase-admin/auth";
import { adminAuth } from "@/lib/firebase/admin";

export const verifySession = cache(async (): Promise<DecodedIdToken | null> => {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  try {
    return await adminAuth.verifySessionCookie(session, true /* checkRevoked */);
  } catch {
    return null;
  }
});

export async function requireAdmin() {
  const session = await verifySession();
  if (!session?.admin) redirect("/admin/login");
  return session;
}
