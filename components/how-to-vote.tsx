"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { RevealText } from "@/components/reveal-text";
import { DividerLine } from "@/components/divider-line";

const STEPS = [
  {
    number: "01",
    title: "Pick a Candidate",
    description: "Browse the official candidates below and choose your favorite.",
  },
  {
    number: "02",
    title: "Sign In",
    description: "Tap the vote button and sign in with Google. Takes seconds.",
  },
  {
    number: "03",
    title: "Confirm Your Vote",
    description: "Tap vote to confirm. One vote per person, that's it!",
  },
];

export function HowToVote() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".vote-step", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative z-10 border-t border-gold-mid/30 py-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-6 text-center">
        <RevealText
          as="p"
          type="words"
          className="text-xs font-bold uppercase tracking-[0.3em] text-gold-mid"
        >
          How to Vote
        </RevealText>
        <RevealText
          as="h2"
          type="words"
          delay={0.1}
          className="font-display text-3xl font-black uppercase tracking-tight text-gold-foil sm:text-4xl"
        >
          Three Simple Steps
        </RevealText>
        <div className="mb-8 flex items-center gap-4">
          <DividerLine className="h-px w-10 bg-gold-mid/60" />
          <RevealText
            as="p"
            type="words"
            delay={0.2}
            className="max-w-md text-xs text-gold-solid/70"
          >
            Free, fast, and takes less than a minute
          </RevealText>
          <DividerLine className="h-px w-10 bg-gold-mid/60" />
        </div>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="vote-step chamfer-lg flex flex-col items-center gap-3 border border-gold-mid/40 bg-maroon-core/80 p-6 text-center"
            >
              <span className="text-gold-foil font-display text-4xl font-black">
                {step.number}
              </span>
              <h3 className="font-display text-lg font-extrabold uppercase tracking-wide text-gold-foil">
                {step.title}
              </h3>
              <p className="text-sm text-gold-solid/70">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
