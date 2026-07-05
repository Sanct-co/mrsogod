"use client";

import { useActionState } from "react";
import { updateVotingSchedule, type ScheduleFormResult } from "@/actions/settings";

const fieldClass =
  "chamfer-sm border border-gold-mid/40 bg-black-red px-3 py-2 text-sm text-gold-solid";
const labelClass = "flex flex-col gap-1 text-xs font-bold uppercase tracking-widest text-gold-mid";

export function VotingScheduleForm({ startsAt, endsAt }: { startsAt: string; endsAt: string }) {
  const [state, formAction, isPending] = useActionState<ScheduleFormResult | undefined, FormData>(
    updateVotingSchedule,
    undefined
  );

  return (
    <form action={formAction} className="mt-4 flex max-w-xl flex-col gap-3">
      <label className={labelClass}>
        Starts At
        <input
          type="datetime-local"
          name="votingStartsAt"
          defaultValue={startsAt}
          className={fieldClass}
        />
      </label>
      <label className={labelClass}>
        Ends At
        <input
          type="datetime-local"
          name="votingEndsAt"
          defaultValue={endsAt}
          className={fieldClass}
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="chamfer-btn self-start border border-gold-mid px-4 py-2 text-xs font-bold uppercase tracking-widest text-gold-solid hover:bg-gold-mid/10 disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save Schedule"}
      </button>
      {state?.success && <p className="text-xs text-gold-solid/70">Saved.</p>}
    </form>
  );
}
