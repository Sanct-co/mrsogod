import { requireAdmin } from "@/lib/auth/dal";
import { getActiveCandidates } from "@/lib/candidates";
import { getFraudFlags } from "@/lib/fraud";
import { ResultsBoard } from "@/components/results-board";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const [candidates, fraudFlags] = await Promise.all([getActiveCandidates(), getFraudFlags()]);

  return (
    <div>
      <h1 className="font-display text-2xl font-black uppercase tracking-tight text-gold-foil">
        Live Results
      </h1>
      <div className="mt-6">
        <ResultsBoard candidates={candidates} />
      </div>

      <h2 className="font-display mt-10 text-lg font-black uppercase tracking-tight text-gold-foil">
        Fraud Flags <span className="text-gold-mid/60">(informational only)</span>
      </h2>
      {fraudFlags.length === 0 ? (
        <p className="mt-2 text-sm text-gold-mid/70">No unusual voting bursts detected.</p>
      ) : (
        <ul className="mt-2 space-y-1 text-sm text-gold-solid/80">
          {fraudFlags.map((flag) => (
            <li key={flag.window}>
              {flag.count} votes within the minute starting {flag.window}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
