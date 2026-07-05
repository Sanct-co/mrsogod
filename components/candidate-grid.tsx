"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CandidateCard } from "@/components/candidate-card";
import type { Candidate } from "@/lib/candidates";

export function CandidateGrid({ candidates }: { candidates: Candidate[] }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".candidate-card", {
        opacity: 0,
        y: 40,
        scale: 0.96,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
      });
    },
    { scope: gridRef }
  );

  return (
    <div ref={gridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {candidates.map((candidate) => (
        <CandidateCard key={candidate.id} candidate={candidate} />
      ))}
    </div>
  );
}
