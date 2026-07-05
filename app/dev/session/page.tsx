import { verifySession } from "@/lib/auth/dal";
import { SignInButtons } from "@/components/auth/sign-in-buttons";

export default async function DevSessionPage() {
  const session = await verifySession();

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="text-xl font-semibold mb-4">Phase 1 — session check</h1>
      <SignInButtons />

      <div className="mt-6">
        {session ? (
          <div className="space-y-1 text-sm">
            <p>
              <strong>uid:</strong> {session.uid}
            </p>
            <p>
              <strong>provider:</strong> {session.firebase?.sign_in_provider}
            </p>
            <p>
              <strong>admin claim:</strong> {session.admin ? "true" : "false (or unset)"}
            </p>
          </div>
        ) : (
          <p className="text-sm text-neutral-500">No active session.</p>
        )}
      </div>
    </main>
  );
}
