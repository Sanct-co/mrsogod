import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCandidateById } from "@/lib/candidates";
import { verifySession } from "@/lib/auth/dal";
import { getVotedCandidateId } from "@/lib/votes";
import { ShareButtons } from "@/components/share-buttons";
import { VoteCta } from "@/components/vote-cta";
import { RevealText } from "@/components/reveal-text";
import { DividerLine } from "@/components/divider-line";

export default async function CandidatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [candidate, session] = await Promise.all([getCandidateById(id), verifySession()]);
  if (!candidate) notFound();

  const votedCandidateId = session ? await getVotedCandidateId(session.uid) : null;

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <Link
        href="/"
        className="text-xs font-bold uppercase tracking-[0.25em] text-gold-mid transition-colors hover:text-gold-solid"
      >
        ← All Candidates
      </Link>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,320px)_1fr]">
        <div className="chamfer-lg relative aspect-[3/4] w-full overflow-hidden border border-gold-mid/40 bg-black-red">
          <Image
            src={candidate.photoUrl}
            alt={candidate.name}
            fill
            sizes="(min-width: 768px) 320px, 100vw"
            className="object-cover"
            priority
          />
          <span className="chamfer-btn absolute left-3 top-3 bg-gold-solid px-3 py-1 text-sm font-extrabold text-maroon-deep">
            #{candidate.sashNumber}
          </span>
        </div>

        <div>
          <RevealText
            as="p"
            type="words"
            className="text-xs font-bold uppercase tracking-[0.3em] text-gold-mid"
          >
            {candidate.barangay}
          </RevealText>
          <RevealText
            as="h1"
            type="words"
            delay={0.1}
            className="font-display mt-1 text-3xl font-black uppercase tracking-tight text-gold-foil sm:text-4xl"
          >
            {candidate.name}
          </RevealText>
          <DividerLine className="mt-4 h-px w-16 bg-gold-mid/50" />
          <RevealText
            as="p"
            type="lines"
            delay={0.15}
            className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gold-solid/80"
          >
            {candidate.bio}
          </RevealText>

          <div className="mt-8 flex flex-col gap-4 sm:gap-5">
            <VoteCta
              candidateId={candidate.id}
              candidateName={candidate.name}
              isSignedIn={!!session}
              votedCandidateId={votedCandidateId}
            />
            <ShareButtons title={`Vote for ${candidate.name} — Mister Sogod 2026`} />
          </div>
        </div>
      </div>
    </div>
  );
}
