"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { Candidate } from "@/lib/candidates";

export function CandidateCard({ candidate }: { candidate: Candidate }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: cardRef });

  // eslint-disable-next-line react-hooks/refs -- contextSafe wraps this for event use only, never invoked during render
  const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotateX: py * -8,
      rotateY: px * 8,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 800,
    });
    gsap.to(imgWrapRef.current, {
      x: px * 10,
      y: py * 10,
      duration: 0.4,
      ease: "power2.out",
    });
  });

  // eslint-disable-next-line react-hooks/refs -- contextSafe wraps this for event use only, never invoked during render
  const handleMouseLeave = contextSafe(() => {
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" });
    gsap.to(imgWrapRef.current, { x: 0, y: 0, duration: 0.6, ease: "power3.out" });
  });

  return (
    <Link
      ref={cardRef}
      href={`/candidates/${candidate.id}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="candidate-card chamfer-lg group block border border-gold-mid/40 bg-maroon-core/80 p-4 transition-colors hover:border-gold-solid [transform-style:preserve-3d] will-change-transform"
    >
      <div
        ref={imgWrapRef}
        className="chamfer-sm relative aspect-[3/4] w-full overflow-hidden bg-black-red"
      >
        <Image
          src={candidate.photoUrl}
          alt={candidate.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="chamfer-btn absolute left-2 top-2 bg-gold-solid px-2 py-1 text-xs font-extrabold text-maroon-deep">
          #{candidate.sashNumber}
        </span>
      </div>
      <h2 className="font-display mt-4 text-lg font-extrabold uppercase tracking-wide text-gold-foil">
        {candidate.name}
      </h2>
      <p className="text-xs font-bold uppercase tracking-widest text-gold-mid/80">
        {candidate.barangay}
      </p>
      <p className="mt-2 line-clamp-2 text-sm text-gold-solid/70">{candidate.bio}</p>
    </Link>
  );
}
