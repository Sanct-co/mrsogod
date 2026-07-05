import { requireAdmin } from "@/lib/auth/dal";
import { adminDb } from "@/lib/firebase/admin";
import { VotingToggle } from "@/components/admin/voting-toggle";
import { VotingScheduleForm } from "@/components/admin/voting-schedule-form";
import { ResetVotesButton } from "@/components/admin/reset-votes-button";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const snap = await adminDb.doc("settings/config").get();
  const data = snap.data() ?? {};

  return (
    <div className="flex max-w-xl flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-black uppercase tracking-tight text-gold-foil">
          Settings
        </h1>
        <div className="mt-6">
          <VotingToggle open={!!data.votingOpen} />
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg font-black uppercase tracking-tight text-gold-foil">
          Voting Schedule
        </h2>
        <p className="mt-1 text-xs text-gold-solid/60">
          Informational only for v1 — the toggle above still needs to be clicked manually at the
          actual start/end time.
        </p>
        <VotingScheduleForm startsAt={data.votingStartsAt ?? ""} endsAt={data.votingEndsAt ?? ""} />
      </div>

      <div>
        <h2 className="font-display text-lg font-black uppercase tracking-tight text-red-400">
          Danger Zone
        </h2>
        <p className="mt-1 text-xs text-gold-solid/60">
          Deletes every vote record and resets each candidate&apos;s count to 0.
        </p>
        <div className="mt-4">
          <ResetVotesButton />
        </div>
      </div>
    </div>
  );
}
