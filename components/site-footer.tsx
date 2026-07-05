"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-plugins";

export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(footerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: footerRef.current, start: "top 95%" },
      });
    },
    { scope: footerRef }
  );

  return (
    <footer ref={footerRef} className="relative z-10 border-t border-gold-mid/30 px-6 py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-gold-mid">
          Mister Sogod 2026
        </p>
        {/* <div className="flex items-center gap-5">
          <Link
            href="/about"
            className="text-xs font-bold uppercase tracking-[0.2em] text-gold-mid transition-colors hover:text-gold-solid"
          >
            About
          </Link>
          <Link
            href="/results"
            className="text-xs font-bold uppercase tracking-[0.2em] text-gold-mid transition-colors hover:text-gold-solid"
          >
            Results
          </Link>
        </div> */}
        <div className="flex items-center gap-4">
          <p className="text-xs text-gold-solid/60">
            &copy; {new Date().getFullYear()} Mister Sogod. All rights reserved.
          </p>
          <a
            href="https://www.facebook.com/profile.php?id=61577264475556"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow us on Facebook"
            className="text-gold-mid transition-colors hover:text-gold-solid"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94Z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
