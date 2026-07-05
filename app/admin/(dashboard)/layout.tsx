import Link from "next/link";
import { requireAdmin } from "@/lib/auth/dal";
import { AdminSignOutButton } from "@/components/admin/admin-sign-out-button";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <nav className="mb-8 flex flex-wrap items-center gap-5 border-b border-gold-mid/30 pb-4">
        <Link
          href="/admin"
          className="text-xs font-bold uppercase tracking-[0.2em] text-gold-foil"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/candidates"
          className="text-xs font-bold uppercase tracking-[0.2em] text-gold-mid hover:text-gold-solid"
        >
          Candidates
        </Link>
        <Link
          href="/admin/settings"
          className="text-xs font-bold uppercase tracking-[0.2em] text-gold-mid hover:text-gold-solid"
        >
          Settings
        </Link>
        <a
          href="/api/admin/export/results"
          className="text-xs font-bold uppercase tracking-[0.2em] text-gold-mid hover:text-gold-solid"
        >
          Export Results CSV
        </a>
        <a
          href="/api/admin/export/votes"
          className="text-xs font-bold uppercase tracking-[0.2em] text-gold-mid hover:text-gold-solid"
        >
          Export Votes CSV
        </a>
        <div className="ml-auto">
          <AdminSignOutButton />
        </div>
      </nav>
      {children}
    </div>
  );
}
