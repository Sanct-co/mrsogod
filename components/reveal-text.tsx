"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap-plugins";

type Tag = "h1" | "h2" | "h3" | "p" | "span";
type SplitType = "lines" | "words" | "chars";

type Props = {
  as?: Tag;
  className?: string;
  children: React.ReactNode;
  type?: SplitType;
  delay?: number;
  stagger?: number;
  scrollTrigger?: boolean;
};

export function RevealText({
  as: Tag = "p",
  className,
  children,
  type = "lines",
  delay = 0,
  stagger = 0.04,
  scrollTrigger = false,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    const split = SplitText.create(el, {
      type,
      mask: type,
      autoSplit: true,
      onSplit(self) {
        const targets = type === "chars" ? self.chars : type === "words" ? self.words : self.lines;
        return gsap.from(targets, {
          yPercent: 110,
          autoAlpha: 0,
          stagger,
          duration: 0.9,
          delay,
          ease: "power3.out",
          scrollTrigger: scrollTrigger ? { trigger: el, start: "top 85%" } : undefined,
        });
      },
    });

    return () => split.revert();
  }, [type, delay, stagger, scrollTrigger]);

  return (
    <Tag ref={ref as React.Ref<never>} className={className}>
      {children}
    </Tag>
  );
}
