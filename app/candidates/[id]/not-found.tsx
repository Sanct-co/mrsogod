import Link from "next/link";

export default function CandidateNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center px-6 py-24 text-center">
      <span aria-hidden className="text-3xl">
        ♛
      </span>
      <h1 className="font-display mt-4 text-2xl font-black uppercase tracking-wide text-gold-foil">
        Candidate Not Found
      </h1>
      <p className="mt-3 text-sm text-gold-solid/70">
        This candidate doesn&apos;t exist or is no longer active.
      </p>
      <Link
        href="/"
        className="chamfer-btn mt-8 border border-gold-mid px-6 py-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-solid transition-colors hover:bg-gold-mid/10"
      >
        Back to Candidates
      </Link>
    </div>
  );
}
