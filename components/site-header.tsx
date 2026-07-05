"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-plugins";
import { SignOutButton } from "@/components/auth/sign-out-button";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/results", label: "Results" },
];

export function SiteHeader({ hasSession }: { hasSession: boolean }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      gsap
        .timeline({ delay: 0.2 })
        .from(".header-brand", { opacity: 0, y: -12, duration: 0.5, ease: "power2.out" })
        .from(
          ".header-link",
          { opacity: 0, y: -8, duration: 0.4, stagger: 0.08, ease: "power2.out" },
          "-=0.25"
        );
    },
    { scope: headerRef }
  );

  useGSAP(
    () => {
      if (!overlayRef.current) return;
      timelineRef.current = gsap
        .timeline({ paused: true })
        .fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: "power2.out" })
        .fromTo(
          ".mobile-nav-panel",
          { y: -28, opacity: 0, scale: 0.94 },
          { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.6)" },
          "-=0.1"
        )
        .from(
          ".mobile-nav-link",
          { opacity: 0, y: -10, stagger: 0.06, duration: 0.3, ease: "power2.out" },
          "-=0.2"
        )
        .play();
    },
    { scope: overlayRef, dependencies: [mounted] }
  );

  const openMenu = () => {
    setOpen(true);
    setMounted(true);
  };

  const closeMenu = () => {
    if (!mounted) return;
    setOpen(false);
    const tl = timelineRef.current;
    if (tl) {
      tl.eventCallback("onReverseComplete", () => setMounted(false));
      tl.reverse();
    } else {
      setMounted(false);
    }
  };

  const toggleMenu = () => (open ? closeMenu() : openMenu());

  return (
    <header ref={headerRef} className="relative z-10 border-b border-gold-mid/30 px-6 py-5">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link href="/" className="header-brand flex items-center gap-2" onClick={closeMenu}>
          <Image
            src="/mrsogod.png"
            alt="Mister Sogod"
            width={80}
            height={51}
            priority
            className="h-12 w-auto sm:h-8"
          />
          <span className="hidden font-display text-sm font-extrabold tracking-[0.25em] text-gold-foil sm:inline">
            MISTER SOGOD 2026
          </span>
        </Link>

        <div className="hidden items-center gap-5 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="header-link text-xs font-bold uppercase tracking-[0.2em] text-gold-mid transition-colors hover:text-gold-solid"
            >
              {link.label}
            </Link>
          ))}
          {hasSession && <span className="header-link"><SignOutButton /></span>}
        </div>

        <button
          type="button"
          onClick={toggleMenu}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 sm:hidden"
        >
          <span
            className={`h-0.5 w-6 bg-gold-mid transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span className={`h-0.5 w-6 bg-gold-mid transition-opacity ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-0.5 w-6 bg-gold-mid transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {mounted &&
        createPortal(
          <div
            ref={overlayRef}
            id="mobile-nav"
            className="fixed inset-0 z-50 flex items-start justify-center bg-maroon-deep/70 px-4 pt-10 backdrop-blur-sm sm:hidden"
            onClick={closeMenu}
          >
            <div
              className="mobile-nav-panel chamfer-lg w-full max-w-sm border border-gold-mid/40 bg-gradient-to-b from-maroon-bright via-maroon-core to-maroon-deep p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gold-mid/30 pb-4">
                <div className="flex items-center gap-2">
                  <Image src="/mrsogod.png" alt="Mister Sogod" width={36} height={24} />
                  <span className="font-display text-xs font-extrabold tracking-[0.2em] text-gold-foil">
                    MISTER SOGOD 2026
                  </span>
                </div>
                <button
                  type="button"
                  onClick={closeMenu}
                  aria-label="Close menu"
                  className="text-gold-mid transition-colors hover:text-gold-solid"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="4" y1="4" x2="16" y2="16" />
                    <line x1="16" y1="4" x2="4" y2="16" />
                  </svg>
                </button>
              </div>

              <div className="mt-5 flex flex-col items-center gap-5 pt-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="mobile-nav-link text-sm font-bold uppercase tracking-[0.2em] text-gold-mid transition-colors hover:text-gold-solid"
                  >
                    {link.label}
                  </Link>
                ))}
                {hasSession && <span className="mobile-nav-link"><SignOutButton /></span>}
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
