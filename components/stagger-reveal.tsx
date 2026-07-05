"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-plugins";

type Props = {
  className?: string;
  children: React.ReactNode;
  stagger?: number;
};

export function StaggerReveal({ className, children, stagger = 0.1 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap.from(Array.from(el.children), {
        opacity: 0,
        y: 28,
        duration: 0.6,
        stagger,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
