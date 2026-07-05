"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-plugins";
import toast from "react-hot-toast";

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a3 3 0 0 0 0-1.4l7.05-4.11a3 3 0 1 0-.97-1.71l-7.05 4.11a3 3 0 1 0 0 4.82l7.05 4.13a3 3 0 1 0 .97-1.86Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M13.5 21v-7.6h2.55l.38-2.96h-2.93V8.53c0-.86.24-1.44 1.47-1.44h1.57V4.46A20.9 20.9 0 0 0 14.24 4c-2.24 0-3.77 1.37-3.77 3.87v2.57H7.9v2.96h2.57V21h3.03Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.7" />
      <circle cx="16.85" cy="7.15" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

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

  function handleFacebook(e: React.MouseEvent<HTMLButtonElement>) {
    pop(e.currentTarget);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      window.location.href
    )}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=600");
  }

  async function handleInstagram(e: React.MouseEvent<HTMLButtonElement>) {
    pop(e.currentTarget);
    // Instagram has no web share-intent URL, so copy the link and hand off to the app.
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied! Paste it into your Instagram story or bio.");
    } catch {
      toast.error("Couldn't copy the link. Please copy it manually.");
    }
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  }

  return (
    <div
      ref={rootRef}
      className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
    >
      <button
        type="button"
        onClick={handleShare}
        className="share-btn chamfer-btn inline-flex h-11 w-full shrink-0 cursor-pointer items-center justify-center gap-2 shadow-[inset_0_0_0_1px_var(--color-gold-mid)] px-4 text-xs font-bold uppercase leading-none tracking-[0.2em] text-gold-solid transition-colors hover:bg-gold-mid/10 active:bg-gold-mid/20 sm:w-auto sm:justify-start"
      >
        <ShareIcon />
        {copied ? "Link Copied" : "Share"}
      </button>
      <button
        type="button"
        onClick={handleFacebook}
        aria-label="Share on Facebook"
        className="share-btn inline-flex h-11 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-gold-mid/40 px-4 text-xs font-bold uppercase leading-none tracking-[0.2em] text-gold-mid transition-colors hover:border-gold-mid hover:bg-gold-mid/10 hover:text-gold-solid active:bg-gold-mid/20 sm:w-auto sm:justify-start"
      >
        <FacebookIcon />
        Facebook
      </button>
      <button
        type="button"
        onClick={handleInstagram}
        aria-label="Share on Instagram"
        className="share-btn inline-flex h-11 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-gold-mid/40 px-4 text-xs font-bold uppercase leading-none tracking-[0.2em] text-gold-mid transition-colors hover:border-gold-mid hover:bg-gold-mid/10 hover:text-gold-solid active:bg-gold-mid/20 sm:w-auto sm:justify-start"
      >
        <InstagramIcon />
        Instagram
      </button>
    </div>
  );
}
