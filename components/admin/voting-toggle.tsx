"use client";

import { useTransition } from "react";
import { setVotingOpen } from "@/actions/settings";

export function VotingToggle({ open }: { open: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(async () => setVotingOpen(!open))}
      disabled={isPending}
      className={`chamfer-btn px-6 py-3 text-sm font-extrabold uppercase tracking-widest disabled:opacity-60 ${
        open
          ? "border border-gold-mid text-gold-solid hover:bg-gold-mid/10"
          : "bg-gradient-to-b from-gold-start via-gold-mid to-gold-deep text-maroon-deep"
      }`}
    >
      {isPending
        ? "Updating…"
        : open
          ? "Voting is OPEN — click to close"
          : "Voting is CLOSED — click to open"}
    </button>
  );
}
