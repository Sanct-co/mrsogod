"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Candidate } from "@/lib/candidates";
import { deleteCandidate, reorderCandidates, updateCandidate } from "@/actions/candidates";

export function CandidateAdminTable({ candidates }: { candidates: Candidate[] }) {
  const [items, setItems] = useState(candidates);
  const [isPending, startTransition] = useTransition();

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    startTransition(async () => {
      await reorderCandidates(next.map((c) => c.id));
    });
  }

  function toggleActive(candidate: Candidate) {
    setItems((prev) =>
      prev.map((c) => (c.id === candidate.id ? { ...c, isActive: !c.isActive } : c))
    );
    startTransition(async () => {
      const formData = new FormData();
      formData.set("name", candidate.name);
      formData.set("barangay", candidate.barangay);
      formData.set("bio", candidate.bio);
      formData.set("photoUrl", candidate.photoUrl);
      formData.set("sashNumber", String(candidate.sashNumber));
      formData.set("facebook", candidate.socialLinks.facebook ?? "");
      formData.set("instagram", candidate.socialLinks.instagram ?? "");
      if (!candidate.isActive) formData.set("isActive", "on");
      await updateCandidate(candidate.id, undefined, formData);
    });
  }

  function remove(id: string, name: string) {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    setItems((prev) => prev.filter((c) => c.id !== id));
    startTransition(async () => {
      await deleteCandidate(id);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((candidate, index) => (
        <div
          key={candidate.id}
          className="chamfer-sm flex flex-wrap items-center gap-4 border border-gold-mid/30 bg-maroon-core/60 p-3"
        >
          <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden bg-black-red">
            <Image
              src={candidate.photoUrl}
              alt={candidate.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div className="min-w-[10rem] flex-1">
            <p className="text-sm font-bold uppercase tracking-wide text-gold-foil">
              #{candidate.sashNumber} {candidate.name}
            </p>
            <p className="text-xs uppercase tracking-widest text-gold-mid/70">
              {candidate.barangay}
            </p>
          </div>
          <span
            className={`text-xs font-bold uppercase tracking-widest ${
              candidate.isActive ? "text-green-400" : "text-gold-solid/50"
            }`}
          >
            {candidate.isActive ? "Active" : "Inactive"}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => move(index, -1)}
              disabled={isPending || index === 0}
              className="px-2 py-1 text-xs text-gold-solid disabled:opacity-30"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              disabled={isPending || index === items.length - 1}
              className="px-2 py-1 text-xs text-gold-solid disabled:opacity-30"
            >
              ↓
            </button>
          </div>
          <button
            type="button"
            onClick={() => toggleActive(candidate)}
            disabled={isPending}
            className="chamfer-btn border border-gold-mid px-3 py-1 text-xs font-bold uppercase tracking-widest text-gold-solid hover:bg-gold-mid/10 disabled:opacity-60"
          >
            {candidate.isActive ? "Deactivate" : "Activate"}
          </button>
          <Link
            href={`/admin/candidates/${candidate.id}/edit`}
            className="chamfer-btn border border-gold-mid px-3 py-1 text-xs font-bold uppercase tracking-widest text-gold-solid hover:bg-gold-mid/10"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => remove(candidate.id, candidate.name)}
            disabled={isPending}
            className="chamfer-btn border border-red-500/60 px-3 py-1 text-xs font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10 disabled:opacity-60"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
