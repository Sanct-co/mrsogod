"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-plugins";

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      gsap.from(".share-btn", {
        opacity: 0,
        y: 10,
        duration: 0.5,
        stagger: 0.08,
        delay: 0.2,
        ease: "power2.out",
      });
    },
    { scope: rootRef }
  );

  const pop = contextSafe((target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return;
    gsap.fromTo(
      target,
      { scale: 1 },
      { scale: 0.92, duration: 0.1, yoyo: true, repeat: 1, ease: "power1.inOut" }
    );
  });

  async function handleShare(e: React.MouseEvent<HTMLButtonElement>) {
    pop(e.currentTarget);
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user dismissed the native share sheet
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function openIntent(e: React.MouseEvent<HTMLButtonElement>, builder: (url: string) => string) {
    pop(e.currentTarget);
    window.open(builder(window.location.href), "_blank", "noopener,noreferrer");
  }

  return (
    <div ref={rootRef} className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={handleShare}
        className="share-btn chamfer-btn border border-gold-mid px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-solid transition-colors hover:bg-gold-mid/10"
      >
        {copied ? "Link Copied" : "Share"}
      </button>
      <button
        type="button"
        onClick={(e) =>
          openIntent(e, (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        }
        className="share-btn text-xs font-bold uppercase tracking-[0.2em] text-gold-mid transition-colors hover:text-gold-solid"
      >
        Facebook
      </button>
      <button
        type="button"
        onClick={(e) =>
          openIntent(
            e,
            (url) =>
              `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
          )
        }
        className="share-btn text-xs font-bold uppercase tracking-[0.2em] text-gold-mid transition-colors hover:text-gold-solid"
      >
        Twitter/X
      </button>
    </div>
  );
}
