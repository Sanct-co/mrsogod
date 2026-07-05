import { getActiveCandidates } from "@/lib/candidates";
import { ResultsBoard } from "@/components/results-board";
import { RevealText } from "@/components/reveal-text";
import { LiveDot } from "@/components/live-dot";

export default async function ResultsPage() {
  const candidates = await getActiveCandidates();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="flex items-center gap-2">
          <LiveDot />
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold-mid">Live</p>
        </div>
        <RevealText
          as="h1"
          type="chars"
          delay={0.1}
          className="font-display mt-1 text-4xl font-black uppercase tracking-tight text-gold-foil"
        >
          Results
        </RevealText>
      </div>
      <ResultsBoard candidates={candidates} />
    </div>
  );
}
