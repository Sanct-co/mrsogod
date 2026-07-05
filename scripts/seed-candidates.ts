import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { candidateSeedEntrySchema, type CandidateSeedEntry } from "../lib/candidate-schema";
import { adminDb } from "../lib/firebase/admin";

type SkipReason = { sashNumber: number | string; reason: string };

async function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error("Usage: npx tsx scripts/seed-candidates.ts <path-to-seed.json>");
    process.exit(1);
  }

  const resolvedPath = path.resolve(process.cwd(), inputPath);
  if (!existsSync(resolvedPath)) {
    console.error(`Seed file not found: ${resolvedPath}`);
    process.exit(1);
  }

  const raw = JSON.parse(readFileSync(resolvedPath, "utf-8"));
  const arrayResult = z.array(z.unknown()).safeParse(raw);
  if (!arrayResult.success) {
    console.error("Seed file must contain a JSON array of candidate entries.");
    process.exit(1);
  }

  const skipped: SkipReason[] = [];
  const validEntries: CandidateSeedEntry[] = [];

  arrayResult.data.forEach((entry, index) => {
    const parsed = candidateSeedEntrySchema.safeParse(entry);
    if (!parsed.success) {
      const sashNumber =
        typeof entry === "object" && entry !== null && "sashNumber" in entry
          ? String((entry as Record<string, unknown>).sashNumber)
          : `entry #${index}`;
      skipped.push({ sashNumber, reason: parsed.error.issues[0]?.message ?? "Invalid entry" });
      return;
    }
    validEntries.push(parsed.data);
  });

  const candidatesDir = path.join(process.cwd(), "public", "candidates");
  const toWrite: CandidateSeedEntry[] = [];
  for (const entry of validEntries) {
    const photoPath = path.join(candidatesDir, entry.photoFile);
    if (!existsSync(photoPath)) {
      skipped.push({
        sashNumber: entry.sashNumber,
        reason: `photoFile "${entry.photoFile}" not found in public/candidates/`,
      });
      continue;
    }
    toWrite.push(entry);
  }

  let created = 0;
  let updated = 0;
  let nextOrder = (await adminDb.collection("candidates").count().get()).data().count;

  for (const entry of toWrite) {
    const existingSnap = await adminDb
      .collection("candidates")
      .where("sashNumber", "==", entry.sashNumber)
      .limit(1)
      .get();

    const socialLinks: Record<string, string> = {};
    if (entry.socialLinks?.facebook) socialLinks.facebook = entry.socialLinks.facebook;
    if (entry.socialLinks?.instagram) socialLinks.instagram = entry.socialLinks.instagram;

    const docData = {
      name: entry.name,
      barangay: entry.barangay,
      bio: entry.bio,
      sashNumber: entry.sashNumber,
      photoUrl: `/candidates/${entry.photoFile}`,
      socialLinks,
    };

    if (existingSnap.empty) {
      await adminDb.collection("candidates").add({
        ...docData,
        isActive: false,
        order: nextOrder++,
        voteCount: 0,
      });
      created++;
    } else {
      await existingSnap.docs[0].ref.update(docData);
      updated++;
    }
  }

  console.log(`\nSeed complete: ${created} created, ${updated} updated, ${skipped.length} skipped.`);
  if (skipped.length > 0) {
    console.log("\nSkipped entries:");
    for (const s of skipped) {
      console.log(`  - sashNumber ${s.sashNumber}: ${s.reason}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
