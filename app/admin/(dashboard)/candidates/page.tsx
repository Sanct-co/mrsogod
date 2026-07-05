import Link from "next/link";
import { requireAdmin } from "@/lib/auth/dal";
import { getAllCandidatesAdmin } from "@/lib/candidates";
import { CandidateAdminTable } from "@/components/admin/candidate-admin-table";

export default async function AdminCandidatesPage() {
  await requireAdmin();
  const candidates = await getAllCandidatesAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-black uppercase tracking-tight text-gold-foil">
          Candidates
        </h1>
        <Link
          href="/admin/candidates/new"
          className="chamfer-btn bg-gradient-to-b from-gold-start via-gold-mid to-gold-deep px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-maroon-deep"
        >
          + New Candidate
        </Link>
      </div>
      <div className="mt-6">
        {candidates.length === 0 ? (
          <p className="text-sm text-gold-mid/70">No candidates yet.</p>
        ) : (
          <CandidateAdminTable candidates={candidates} />
        )}
      </div>
    </div>
  );
}
