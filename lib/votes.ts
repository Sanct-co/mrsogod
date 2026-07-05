import "server-only";
import { adminDb } from "@/lib/firebase/admin";

export async function getVotedCandidateId(uid: string): Promise<string | null> {
  const snap = await adminDb.doc(`votes/${uid}`).get();
  if (!snap.exists) return null;
  return (snap.data()?.candidateId as string) ?? null;
}
