import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/dal";
import { getCandidateById } from "@/lib/candidates";
import { listAvailablePhotos } from "@/actions/candidates";
import { CandidateForm } from "@/components/admin/candidate-form";

export default async function EditCandidatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [candidate, availablePhotos] = await Promise.all([
    getCandidateById(id),
    listAvailablePhotos(),
  ]);
  if (!candidate) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-black uppercase tracking-tight text-gold-foil">
        Edit {candidate.name}
      </h1>
      <div className="mt-6">
        <CandidateForm candidate={candidate} availablePhotos={availablePhotos} />
      </div>
    </div>
  );
}
