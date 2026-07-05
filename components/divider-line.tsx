"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-plugins";

export function DividerLine({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      gsap.from(ref.current, {
        scaleX: 0,
        duration: 0.8,
        ease: "power3.inOut",
        scrollTrigger: { trigger: ref.current, start: "top 90%" },
      });
    },
    { scope: ref }
  );

  return <span ref={ref} className={`origin-center ${className ?? ""}`} />;
}
