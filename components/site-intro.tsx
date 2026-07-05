"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-plugins";

const INTRO_KEY = "mrsogod-intro-seen";

export function SiteIntro() {
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (sessionStorage.getItem(INTRO_KEY)) {
        setVisible(false);
        return;
      }
      sessionStorage.setItem(INTRO_KEY, "1");

      gsap
        .timeline({ delay: 0.1, onComplete: () => setVisible(false) })
        .set(".intro-logo", { scale: 0.7, autoAlpha: 0 })
        .set(".intro-line", { scaleX: 0 })
        .set(".intro-label", { autoAlpha: 0, y: 12 })
        .to(".intro-logo", { scale: 1, autoAlpha: 1, duration: 0.7, ease: "back.out(1.8)" })
        .to(".intro-line", { scaleX: 1, duration: 0.5, ease: "power3.inOut" }, "-=0.25")
        .to(".intro-label", { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.2")
        .to({}, { duration: 0.5 })
        .to(rootRef.current, { yPercent: -100, duration: 0.7, ease: "power4.inOut" });
    },
    { scope: rootRef }
  );

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black-red"
    >
      <Image src="/mrsogod.png" alt="" width={140} height={90} className="intro-logo" priority />
      <span className="intro-line h-px w-24 bg-gold-mid/60" />
      <p className="intro-label text-xs font-bold uppercase tracking-[0.35em] text-gold-mid">
        Mister Sogod 2026
      </p>
    </div>
  );
}
