"use server";

import { readdir } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { adminDb } from "@/lib/firebase/admin";
import { candidateCoreSchema } from "@/lib/candidate-schema";

const candidateSchema = candidateCoreSchema.extend({
  photoUrl: z.string().min(1, "Photo is required"),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});

export type CandidateFormResult = { success?: true; error?: string };

async function assertPhotoExists(photoUrl: string): Promise<void> {
  const filename = photoUrl.replace(/^\/candidates\//, "");
  const files = await listAvailablePhotos();
  if (!files.includes(filename)) {
    throw new Error(
      `Photo "${filename}" was not found in public/candidates/. Add the file first, then retry.`
    );
  }
}

export async function listAvailablePhotos(): Promise<string[]> {
  const dir = path.join(process.cwd(), "public", "candidates");
  try {
    const files = await readdir(dir);
    return files.filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
  } catch {
    return [];
  }
}

export async function createCandidate(
  _prev: CandidateFormResult | undefined,
  formData: FormData
): Promise<CandidateFormResult> {
  await requireAdmin();

  const parsed = candidateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  try {
    await assertPhotoExists(parsed.data.photoUrl);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Invalid photo" };
  }

  const countSnap = await adminDb.collection("candidates").count().get();

  await adminDb.collection("candidates").add({
    name: parsed.data.name,
    barangay: parsed.data.barangay,
    bio: parsed.data.bio,
    photoUrl: parsed.data.photoUrl,
    sashNumber: parsed.data.sashNumber,
    socialLinks: {
      facebook: parsed.data.facebook || undefined,
      instagram: parsed.data.instagram || undefined,
    },
    isActive: parsed.data.isActive ?? false,
    order: countSnap.data().count,
    voteCount: 0,
  });

  revalidatePath("/");
  revalidatePath("/admin/candidates");
  return { success: true };
}

export async function updateCandidate(
  id: string,
  _prev: CandidateFormResult | undefined,
  formData: FormData
): Promise<CandidateFormResult> {
  await requireAdmin();

  const parsed = candidateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  try {
    await assertPhotoExists(parsed.data.photoUrl);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Invalid photo" };
  }

  await adminDb.doc(`candidates/${id}`).update({
    name: parsed.data.name,
    barangay: parsed.data.barangay,
    bio: parsed.data.bio,
    photoUrl: parsed.data.photoUrl,
    sashNumber: parsed.data.sashNumber,
    socialLinks: {
      facebook: parsed.data.facebook || undefined,
      instagram: parsed.data.instagram || undefined,
    },
    isActive: parsed.data.isActive ?? false,
  });

  revalidatePath("/");
  revalidatePath(`/candidates/${id}`);
  revalidatePath("/admin/candidates");
  return { success: true };
}

export async function deleteCandidate(id: string): Promise<void> {
  await requireAdmin();
  await adminDb.doc(`candidates/${id}`).delete();
  revalidatePath("/");
  revalidatePath("/admin/candidates");
}

export async function reorderCandidates(orderedIds: string[]): Promise<void> {
  await requireAdmin();
  const batch = adminDb.batch();
  orderedIds.forEach((id, index) => {
    batch.update(adminDb.doc(`candidates/${id}`), { order: index });
  });
  await batch.commit();
  revalidatePath("/");
  revalidatePath("/admin/candidates");
}
