import { verifySession } from "@/lib/auth/dal";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default async function AdminLoginPage() {
  const session = await verifySession();
  const notAuthorized = !!session && !session.admin;

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-sm flex-col items-center justify-center px-6 text-center">
      <span aria-hidden className="text-3xl">
        ♛
      </span>
      <h1 className="font-display mt-2 text-2xl font-black uppercase tracking-tight text-gold-foil">
        Admin Sign In
      </h1>
      <AdminLoginForm notAuthorized={notAuthorized} />
    </div>
  );
}
