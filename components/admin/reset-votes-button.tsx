"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { resetVotes } from "@/actions/vote";

export function ResetVotesButton() {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleReset() {
    startTransition(async () => {
      await resetVotes();
      setConfirming(false);
      router.refresh();
    });
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="chamfer-sm border border-red-700/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-red-400 hover:bg-red-950/40"
      >
        Reset All Votes
      </button>
    );
  }

  return (
    <div className="chamfer-sm flex flex-wrap items-center gap-3 border border-red-700/60 bg-red-950/20 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-red-300">
        Sure? This deletes every vote and sets all counts to 0. Cannot undo.
      </p>
      <button
        type="button"
        onClick={handleReset}
        disabled={isPending}
        className="chamfer-sm border border-red-700/60 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-red-200 hover:bg-red-900/40 disabled:opacity-50"
      >
        {isPending ? "Resetting…" : "Confirm Reset"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        disabled={isPending}
        className="text-xs font-bold uppercase tracking-[0.2em] text-gold-mid hover:text-gold-solid disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  );
}
