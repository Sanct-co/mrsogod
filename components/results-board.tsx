"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { Candidate } from "@/lib/candidates";

export function ResultsBoard({ candidates }: { candidates: Candidate[] }) {
  const boardRef = useRef<HTMLDivElement>(null);
  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
  const ranked = [...candidates].sort((a, b) => b.voteCount - a.voteCount);

  useGSAP(
    () => {
      gsap.from(".result-row", {
        opacity: 0,
        x: -24,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });
      gsap.utils.toArray<HTMLElement>(".result-bar-fill").forEach((bar) => {
        gsap.fromTo(
          bar,
          { width: "0%" },
          {
            width: bar.dataset.pct + "%",
            duration: 1,
            delay: 0.15,
            ease: "power3.out",
          }
        );
      });
    },
    { scope: boardRef, dependencies: [candidates] }
  );

  if (ranked.length === 0) {
    return (
      <p className="text-sm uppercase tracking-widest text-gold-mid/70">
        No candidates yet.
      </p>
    );
  }

  return (
    <div ref={boardRef} className="flex flex-col gap-3">
      {ranked.map((candidate, i) => {
        const pct = totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0;
        return (
          <div
            key={candidate.id}
            className="result-row chamfer-sm border border-gold-mid/30 bg-maroon-core/60 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-bold uppercase tracking-wide text-gold-foil">
              <span>
                #{i + 1} · {candidate.name}{" "}
                <span className="text-gold-mid/70">({candidate.barangay})</span>
              </span>
              <span>
                {candidate.voteCount} votes · {pct.toFixed(1)}%
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-black-red">
              <div
                className="result-bar-fill h-full bg-gradient-to-r from-gold-deep via-gold-mid to-gold-start"
                data-pct={pct}
                style={{ width: 0 }}
              />
            </div>
          </div>
        );
      })}
      <p className="mt-2 text-right text-xs font-bold uppercase tracking-widest text-gold-mid/70">
        Total votes: {totalVotes}
      </p>
    </div>
  );
}
