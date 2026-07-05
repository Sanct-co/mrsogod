import Image from "next/image";
import { CandidateGrid } from "@/components/candidate-grid";
import { RevealText } from "@/components/reveal-text";
import { DividerLine } from "@/components/divider-line";
import { PartnersSection } from "@/components/partners-section";
import { HowToVote } from "@/components/how-to-vote";
import { getActiveCandidates } from "@/lib/candidates";

export default async function Home() {
  const candidates = await getActiveCandidates();

  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="mb-12 flex flex-col items-center text-center">
          <Image src="/mrsogod.png" alt="Mister Sogod" width={220} height={141} priority />
          <div className="mt-6 flex items-center gap-4">
            <DividerLine className="h-px w-10 bg-gold-mid/60" />
            <RevealText
              as="p"
              type="words"
              className="text-xs font-bold uppercase tracking-[0.3em] text-gold-mid"
            >
              Official Candidates
            </RevealText>
            <DividerLine className="h-px w-10 bg-gold-mid/60" />
          </div>
        </div>

        {candidates.length === 0 ? (
          <p className="text-center text-sm uppercase tracking-widest text-gold-mid/70">
            No candidates announced yet.
          </p>
        ) : (
          <CandidateGrid candidates={candidates} />
        )}
      </div>

      <HowToVote />
      <PartnersSection />
    </>
  );
}
