import { requireAdmin } from "@/lib/auth/dal";
import { listAvailablePhotos } from "@/actions/candidates";
import { CandidateForm } from "@/components/admin/candidate-form";

export default async function NewCandidatePage() {
  await requireAdmin();
  const availablePhotos = await listAvailablePhotos();

  return (
    <div>
      <h1 className="font-display text-2xl font-black uppercase tracking-tight text-gold-foil">
        New Candidate
      </h1>
      <div className="mt-6">
        <CandidateForm availablePhotos={availablePhotos} />
      </div>
    </div>
  );
}
