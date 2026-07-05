"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DividerLine } from "@/components/divider-line";
import { RevealText } from "@/components/reveal-text";

type Partner = { name: string; src: string };

const ROW_ONE: Partner[] = [
  { name: "Arnado Enterprises", src: "/partners/arndao.png" },
  { name: "DCM — Damolog Central Marketing", src: "/partners/dcm.png" },
  { name: "Pa Guapa Ta Beauty Salon and Spa", src: "/partners/paguapa.png" },
  { name: "The Playcourt — Sogod Sports Club", src: "/partners/playcourt.jpg" },
  { name: "Partner business", src: "/partners/cebu.jpg" },
];

const ROW_TWO: Partner[] = [
  { name: "Pungko-Pungko ni Boss Le-Ño", src: "/partners/pungko.png" },
  { name: "Sacaan Tropical Breeze Resort", src: "/partners/sacaan.jpg" },
  { name: "Shem's Pension House", src: "/partners/shems.png" },
  { name: "Sogod Fitness Gym", src: "/partners/sogodfg.jpg" },
];

function PartnerTile({ partner }: { partner: Partner }) {
  return (
    <div className="chamfer-sm group flex h-24 w-44 shrink-0 items-center justify-center border border-gold-mid/30 bg-white/95 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:border-gold-solid hover:shadow-[0_8px_28px_rgba(212,175,55,0.35)] sm:h-28 sm:w-52">
      <div className="relative h-full w-full">
        <Image
          src={partner.src}
          alt={partner.name}
          fill
          sizes="208px"
          className="object-contain"
        />
      </div>
    </div>
  );
}

// Enough tile copies to cover ultra-wide viewports before the loop wraps, so it never runs dry.
const MIN_TILES = 24;

function MarqueeRow({ items, reverse = false }: { items: Partner[]; reverse?: boolean }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const copies = Math.max(3, Math.ceil(MIN_TILES / items.length));
  const shiftPercent = 100 / copies;
  const looped = Array.from({ length: copies }, () => items).flat();

  useGSAP(
    () => {
      const el = rowRef.current;
      if (!el) return;

      const tween = gsap.fromTo(
        el,
        { xPercent: reverse ? -shiftPercent : 0 },
        {
          xPercent: reverse ? 0 : -shiftPercent,
          duration: 34,
          ease: "none",
          repeat: -1,
        }
      );
      const pause = () => tween.pause();
      const resume = () => tween.play();
      el.addEventListener("mouseenter", pause);
      el.addEventListener("mouseleave", resume);

      return () => {
        el.removeEventListener("mouseenter", pause);
        el.removeEventListener("mouseleave", resume);
      };
    },
    { scope: rowRef, dependencies: [reverse, shiftPercent] }
  );

  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div ref={rowRef} className="flex w-max gap-5 py-2">
        {looped.map((partner, i) => (
          <PartnerTile key={`${partner.src}-${i}`} partner={partner} />
        ))}
      </div>
    </div>
  );
}

export function PartnersSection() {
  return (
    <section className="relative z-10 border-t border-gold-mid/30 py-14">
      <div className="mx-auto mb-10 flex w-full max-w-6xl flex-col items-center gap-4 px-6 text-center">
        <RevealText
          as="p"
          type="words"
          className="text-xs font-bold uppercase tracking-[0.3em] text-gold-mid"
        >
          Partners
        </RevealText>
        <RevealText
          as="h2"
          type="words"
          delay={0.1}
          className="font-display text-3xl font-black uppercase tracking-tight text-gold-foil sm:text-4xl"
        >
          Standing With Sogod
        </RevealText>
        <div className="flex items-center gap-4">
          <DividerLine className="h-px w-10 bg-gold-mid/60" />
          <RevealText
            as="p"
            type="words"
            delay={0.2}
            className="max-w-md text-xs text-gold-solid/70"
          >
            Local businesses and organizations backing the search
          </RevealText>
          <DividerLine className="h-px w-10 bg-gold-mid/60" />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <MarqueeRow items={ROW_ONE} />
        <MarqueeRow items={ROW_TWO} reverse />
      </div>
    </section>
  );
}
