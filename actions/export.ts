"use server";

import { requireAdmin } from "@/lib/auth/dal";
import { adminDb } from "@/lib/firebase/admin";

function csvField(value: string | number): string {
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function toCsv(rows: (string | number)[][]): string {
  return rows.map((row) => row.map(csvField).join(",")).join("\n");
}

export async function getResultsCsv(): Promise<string> {
  await requireAdmin();
  const snap = await adminDb.collection("candidates").orderBy("sashNumber", "asc").get();

  const rows: (string | number)[][] = [["candidate", "sashNumber", "voteCount"]];
  snap.docs.forEach((doc) => {
    const d = doc.data();
    rows.push([d.name, d.sashNumber, d.voteCount ?? 0]);
  });

  return toCsv(rows);
}

export async function getVotesCsv(): Promise<string> {
  await requireAdmin();
  const snap = await adminDb.collection("votes").orderBy("createdAt", "asc").get();

  const rows: (string | number)[][] = [["uid", "candidateId", "createdAt", "authProvider"]];
  snap.docs.forEach((doc) => {
    const d = doc.data();
    const createdAt: string = d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : "";
    rows.push([doc.id, d.candidateId, createdAt, d.authProvider ?? ""]);
  });

  return toCsv(rows);
}
