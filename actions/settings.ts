"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { adminDb } from "@/lib/firebase/admin";

export async function setVotingOpen(open: boolean): Promise<void> {
  await requireAdmin();
  await adminDb.doc("settings/config").set({ votingOpen: open }, { merge: true });
  revalidatePath("/admin/settings");
  revalidatePath("/admin");
  revalidatePath("/");
}

export type ScheduleFormResult = { success?: true };

export async function updateVotingSchedule(
  _prev: ScheduleFormResult | undefined,
  formData: FormData
): Promise<ScheduleFormResult> {
  await requireAdmin();
  const votingStartsAt = (formData.get("votingStartsAt") as string) || null;
  const votingEndsAt = (formData.get("votingEndsAt") as string) || null;

  await adminDb.doc("settings/config").set({ votingStartsAt, votingEndsAt }, { merge: true });
  revalidatePath("/admin/settings");
  return { success: true };
}
