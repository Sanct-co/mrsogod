"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/**
 * Decorative angular/faceted background shapes (design.json layoutAndStructure.backgroundGeometry).
 * Fixed, non-interactive, kept out of the accessibility tree.
 */
export function BackgroundFacets() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const facets = gsap.utils.toArray<HTMLElement>(".facet");
      facets.forEach((facet, i) => {
        gsap.to(facet, {
          x: i % 2 === 0 ? 24 : -24,
          y: i % 2 === 0 ? -18 : 18,
          rotation: i % 2 === 0 ? 4 : -4,
          duration: 6 + i,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="facet absolute -top-24 -right-40 h-[26rem] w-[26rem] bg-maroon-deep/60 [clip-path:polygon(20%_0,100%_0,100%_70%,55%_100%,0_55%)]" />
      <div className="facet absolute -bottom-40 -left-32 h-[30rem] w-[30rem] bg-black-red/70 [clip-path:polygon(0_10%,70%_0,100%_65%,35%_100%,0_100%)]" />
      <div className="facet absolute top-1/3 -left-20 h-72 w-72 bg-maroon-bright/15 [clip-path:polygon(30%_0,100%_20%,80%_100%,0_80%)]" />
      <div className="facet absolute -top-16 left-1/4 h-56 w-56 bg-maroon-bright/10 [clip-path:polygon(0_0,100%_15%,70%_100%,10%_85%)]" />
    </div>
  );
}
