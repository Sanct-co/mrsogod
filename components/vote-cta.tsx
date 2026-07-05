"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { castVote, type CastVoteResult } from "@/actions/vote";
import {
  signInWithGoogle,
  signInWithFacebook,
  consumeRedirectResult,
  getAuthErrorMessage,
} from "@/lib/auth/client-session";

type Props = {
  candidateId: string;
  candidateName: string;
  isSignedIn: boolean;
  votedCandidateId?: string | null;
};

const VOTE_ERROR_MESSAGES: Record<NonNullable<CastVoteResult["error"]>, string> = {
  "not-signed-in": "Please sign in to vote.",
  "voting-closed": "Voting is currently closed.",
  "already-voted": "You've already cast your vote.",
  "not-found": "That candidate could not be found.",
  unknown: "Something went wrong. Please try again.",
};

export function VoteCta({
  candidateId,
  candidateName,
  isSignedIn: initialSignedIn,
  votedCandidateId = null,
}: Props) {
  const [signedIn, setSignedIn] = useState(initialSignedIn);
  const [authPending, setAuthPending] = useState<"google" | "facebook" | null>(null);
  const [state, formAction, isVotePending] = useActionState<CastVoteResult | undefined>(
    async () => castVote(candidateId),
    undefined
  );
  const lastHandledState = useRef<CastVoteResult | undefined>(undefined);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { contextSafe } = useGSAP({ scope: rootRef });

  useGSAP(
    () => {
      gsap.from(".vote-msg", { opacity: 0, y: 10, duration: 0.5, ease: "power2.out" });

      if (state?.success) {
        gsap.to(".vote-burst-dot", {
          x: (i) => Math.cos((i / 10) * Math.PI * 2) * gsap.utils.random(30, 60),
          y: (i) => Math.sin((i / 10) * Math.PI * 2) * gsap.utils.random(30, 60),
          opacity: 0,
          scale: 0,
          duration: 0.9,
          delay: 0.1,
          ease: "power3.out",
        });
      }
    },
    { scope: rootRef, dependencies: [state?.success, state?.error, votedCandidateId] }
  );

  // eslint-disable-next-line react-hooks/refs -- contextSafe wraps this for event use only, never invoked during render
  const bounceButton = contextSafe(() => {
    if (!buttonRef.current) return;
    gsap.fromTo(
      buttonRef.current,
      { scale: 1 },
      { scale: 0.94, duration: 0.1, yoyo: true, repeat: 1, ease: "power1.inOut" }
    );
  });

  useEffect(() => {
    consumeRedirectResult()
      .then((didSignIn) => {
        if (didSignIn) {
          setSignedIn(true);
          formAction();
        }
      })
      .catch((err) => toast.error(getAuthErrorMessage(err)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!state || state === lastHandledState.current) return;
    lastHandledState.current = state;

    if (state.success) {
      toast.success(`Your vote for ${candidateName} has been counted!`);
    } else if (state.error) {
      toast.error(VOTE_ERROR_MESSAGES[state.error]);
    }
  }, [state, candidateName]);

  async function handleVote(provider: "google" | "facebook") {
    bounceButton();
    if (!signedIn) {
      setAuthPending(provider);
      try {
        await (provider === "google" ? signInWithGoogle() : signInWithFacebook());
        setSignedIn(true);
      } catch (err) {
        toast.error(getAuthErrorMessage(err));
        setAuthPending(null);
        return;
      }
      setAuthPending(null);
    }
    formAction();
  }

  if (!state?.success && votedCandidateId === candidateId) {
    return (
      <div ref={rootRef}>
        <p className="vote-msg text-sm font-bold uppercase tracking-[0.2em] text-gold-foil">
          Your vote for {candidateName} has been counted.
        </p>
      </div>
    );
  }

  if (!state?.success && votedCandidateId && votedCandidateId !== candidateId) {
    return (
      <div ref={rootRef}>
        <p className="vote-msg text-sm font-bold uppercase tracking-[0.2em] text-gold-solid/80">
          You&apos;ve already voted for another candidate.
        </p>
      </div>
    );
  }

  if (state?.success) {
    return (
      <div ref={rootRef} className="relative inline-flex items-center justify-center">
        <p className="vote-msg text-sm font-bold uppercase tracking-[0.2em] text-gold-foil">
          Your vote for {candidateName} has been counted.
        </p>
        <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="vote-burst-dot absolute h-1.5 w-1.5 rounded-full bg-gold-solid"
            />
          ))}
        </span>
      </div>
    );
  }

  if (state?.error === "already-voted") {
    return (
      <div ref={rootRef}>
        <p className="vote-msg text-sm font-bold uppercase tracking-[0.2em] text-gold-solid/80">
          You&apos;ve already voted.
        </p>
      </div>
    );
  }

  if (state?.error === "voting-closed") {
    return (
      <div ref={rootRef}>
        <p className="vote-msg text-sm font-bold uppercase tracking-[0.2em] text-gold-solid/80">
          Voting is currently closed.
        </p>
      </div>
    );
  }

  const pending = authPending !== null || isVotePending;

  return (
    <div ref={rootRef} className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => handleVote("google")}
          disabled={pending}
          className="chamfer-btn bg-gradient-to-b from-gold-start via-gold-mid to-gold-deep px-6 py-3 text-sm font-extrabold uppercase tracking-[0.2em] text-maroon-deep disabled:opacity-60"
        >
          {pending
            ? "Working…"
            : signedIn
              ? `Vote for ${candidateName}`
              : `Sign in with Google to Vote`}
        </button>
        {/* {!signedIn && (
          <button
            type="button"
            onClick={() => handleVote("facebook")}
            disabled={pending}
            className="chamfer-btn border border-gold-mid px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-solid transition-colors hover:bg-gold-mid/10 disabled:opacity-60"
          >
            or sign in with Facebook
          </button>
        )} */}
      </div>
    </div>
  );
}
