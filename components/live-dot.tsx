"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-plugins";

export function LiveDot() {
  const dotRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    gsap.to(dotRef.current, {
      scale: 1.8,
      opacity: 0,
      duration: 1.2,
      repeat: -1,
      ease: "power2.out",
    });
  });

  return (
    <span className="relative flex h-2 w-2">
      <span ref={dotRef} className="absolute inline-flex h-2 w-2 rounded-full bg-gold-solid" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-solid" />
    </span>
  );
}
