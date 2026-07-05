import "server-only";
import { adminDb } from "@/lib/firebase/admin";

export type FraudFlag = { window: string; count: number };

const WINDOW_MS = 60_000;
const THRESHOLD = 10;

/**
 * Informational only (PRD 4.1) — flags minutes with an unusual number of votes.
 * A spike is expected during a viral share, so this never blocks anything.
 */
export async function getFraudFlags(): Promise<FraudFlag[]> {
  const snap = await adminDb.collection("votes").orderBy("createdAt", "asc").get();
  const buckets = new Map<string, number>();

  snap.docs.forEach((doc) => {
    const createdAt = doc.data().createdAt?.toDate?.();
    if (!createdAt) return;
    const bucketStart = Math.floor(createdAt.getTime() / WINDOW_MS) * WINDOW_MS;
    const key = new Date(bucketStart).toISOString();
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  });

  return [...buckets.entries()]
    .filter(([, count]) => count > THRESHOLD)
    .map(([window, count]) => ({ window, count }))
    .sort((a, b) => b.count - a.count);
}
