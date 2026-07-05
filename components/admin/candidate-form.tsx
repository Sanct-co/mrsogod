"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createCandidate, updateCandidate, type CandidateFormResult } from "@/actions/candidates";
import type { Candidate } from "@/lib/candidates";

type Props = {
  candidate?: Candidate;
  availablePhotos: string[];
};

const fieldClass =
  "chamfer-sm border border-gold-mid/40 bg-black-red px-3 py-2 text-sm text-gold-solid";
const labelClass = "flex flex-col gap-1 text-xs font-bold uppercase tracking-widest text-gold-mid";

export function CandidateForm({ candidate, availablePhotos }: Props) {
  const router = useRouter();
  const action = candidate ? updateCandidate.bind(null, candidate.id) : createCandidate;
  const [state, formAction, isPending] = useActionState<CandidateFormResult | undefined, FormData>(
    action,
    undefined
  );

  useEffect(() => {
    if (state?.success) router.push("/admin/candidates");
  }, [state, router]);

  const currentPhotoKnown =
    !candidate?.photoUrl || availablePhotos.some((f) => `/candidates/${f}` === candidate.photoUrl);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <label className={labelClass}>
        Name
        <input name="name" defaultValue={candidate?.name} required className={fieldClass} />
      </label>
      <label className={labelClass}>
        Barangay
        <input name="barangay" defaultValue={candidate?.barangay} required className={fieldClass} />
      </label>
      <label className={labelClass}>
        Sash Number
        <input
          name="sashNumber"
          type="number"
          min={1}
          defaultValue={candidate?.sashNumber}
          required
          className={fieldClass}
        />
      </label>
      <label className={labelClass}>
        Bio
        <textarea name="bio" defaultValue={candidate?.bio} required rows={5} className={fieldClass} />
      </label>
      <label className={labelClass}>
        Photo
        <select name="photoUrl" defaultValue={candidate?.photoUrl ?? ""} required className={fieldClass}>
          <option value="" disabled>
            — select a photo —
          </option>
          {!currentPhotoKnown && candidate?.photoUrl && (
            <option value={candidate.photoUrl}>
              {candidate.photoUrl} (missing from public/candidates/)
            </option>
          )}
          {availablePhotos.map((file) => (
            <option key={file} value={`/candidates/${file}`}>
              {file}
            </option>
          ))}
        </select>
      </label>
      {availablePhotos.length === 0 && (
        <p className="text-xs text-gold-solid/60">
          No photos found in public/candidates/. Add image files there and redeploy, then refresh
          this page.
        </p>
      )}
      <label className={labelClass}>
        Facebook URL (optional)
        <input name="facebook" defaultValue={candidate?.socialLinks.facebook} className={fieldClass} />
      </label>
      <label className={labelClass}>
        Instagram URL (optional)
        <input
          name="instagram"
          defaultValue={candidate?.socialLinks.instagram}
          className={fieldClass}
        />
      </label>
      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-mid">
        <input name="isActive" type="checkbox" defaultChecked={candidate?.isActive} />
        Active (visible on public gallery)
      </label>

      {state?.error && <p className="text-sm font-bold text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="chamfer-btn self-start bg-gradient-to-b from-gold-start via-gold-mid to-gold-deep px-6 py-3 text-sm font-extrabold uppercase tracking-widest text-maroon-deep disabled:opacity-60"
      >
        {isPending ? "Saving…" : candidate ? "Save Changes" : "Create Candidate"}
      </button>
    </form>
  );
}
