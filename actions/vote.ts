"use server";

import { requireAdmin, verifySession } from "@/lib/auth/dal";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

const BATCH_LIMIT = 500;

export type CastVoteResult =
  | { success: true; error?: undefined }
  | {
      success?: undefined;
      error: "not-signed-in" | "voting-closed" | "already-voted" | "not-found" | "unknown";
    };

export async function castVote(candidateId: string): Promise<CastVoteResult> {
  const session = await verifySession();
  if (!session) return { error: "not-signed-in" };

  const settingsSnap = await adminDb.doc("settings/config").get();
  if (!settingsSnap.data()?.votingOpen) return { error: "voting-closed" };

  const voteRef = adminDb.doc(`votes/${session.uid}`);
  const candidateRef = adminDb.doc(`candidates/${candidateId}`);

  try {
    await adminDb.runTransaction(async (tx) => {
      const existing = await tx.get(voteRef);
      if (existing.exists) throw new Error("already-voted");

      const candidateSnap = await tx.get(candidateRef);
      if (!candidateSnap.exists) throw new Error("candidate-not-found");

      tx.set(voteRef, {
        candidateId,
        createdAt: FieldValue.serverTimestamp(),
        authProvider: session.firebase.sign_in_provider,
      });
      tx.update(candidateRef, { voteCount: FieldValue.increment(1) });
    });
  } catch (e) {
    if (e instanceof Error && e.message === "already-voted") return { error: "already-voted" };
    if (e instanceof Error && e.message === "candidate-not-found") return { error: "not-found" };
    console.error("castVote failed", e);
    return { error: "unknown" };
  }

  revalidatePath("/results");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/candidates/[id]", "page");

  return { success: true };
}

export async function resetVotes(): Promise<void> {
  await requireAdmin();

  const [voteDocs, candidateDocs] = await Promise.all([
    adminDb.collection("votes").listDocuments(),
    adminDb.collection("candidates").listDocuments(),
  ]);

  for (let i = 0; i < voteDocs.length; i += BATCH_LIMIT) {
    const batch = adminDb.batch();
    voteDocs.slice(i, i + BATCH_LIMIT).forEach((ref) => batch.delete(ref));
    await batch.commit();
  }

  for (let i = 0; i < candidateDocs.length; i += BATCH_LIMIT) {
    const batch = adminDb.batch();
    candidateDocs.slice(i, i + BATCH_LIMIT).forEach((ref) => batch.update(ref, { voteCount: 0 }));
    await batch.commit();
  }

  revalidatePath("/results");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/candidates/[id]", "page");
}
