import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import type { QueryDocumentSnapshot, DocumentSnapshot } from "firebase-admin/firestore";

export type Candidate = {
  id: string;
  name: string;
  barangay: string;
  bio: string;
  photoUrl: string;
  socialLinks: { facebook?: string; instagram?: string };
  voteCount: number;
  sashNumber: number;
  order: number;
  isActive: boolean;
};

function toCandidate(doc: QueryDocumentSnapshot | DocumentSnapshot): Candidate {
  const data = doc.data()!;
  return {
    id: doc.id,
    name: data.name,
    barangay: data.barangay,
    bio: data.bio,
    photoUrl: data.photoUrl,
    socialLinks: data.socialLinks ?? {},
    voteCount: data.voteCount ?? 0,
    sashNumber: data.sashNumber,
    order: data.order ?? 0,
    isActive: data.isActive ?? false,
  };
}

export async function getActiveCandidates(): Promise<Candidate[]> {
  const snap = await adminDb
    .collection("candidates")
    .where("isActive", "==", true)
    .orderBy("order", "asc")
    .get();
  return snap.docs.map(toCandidate);
}

export async function getCandidateById(id: string): Promise<Candidate | null> {
  const doc = await adminDb.collection("candidates").doc(id).get();
  if (!doc.exists) return null;
  return toCandidate(doc);
}

export async function getAllCandidatesAdmin(): Promise<Candidate[]> {
  const snap = await adminDb.collection("candidates").orderBy("order", "asc").get();
  return snap.docs.map(toCandidate);
}
