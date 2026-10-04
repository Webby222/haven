import Link from "next/link";
import { redirect } from "next/navigation";
import { isHavenAdmin } from "../../../lib/adminAuth";
import { createAdminServerClient, getSupabasePublicConfig } from "../../../lib/supabaseAdminServer";
import { loginAction } from "./actions";

type AdminLoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const config = getSupabasePublicConfig();
  if (config) {
    const supabase = await createAdminServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (isHavenAdmin(user)) redirect("/admin");
  }

  const { error } = await searchParams;
  const configurationMissing = !config || error === "configuration";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f3ee] px-6 py-12 text-[#162b3d]">
      <div className="w-full max-w-md">
        <Link href="/" className="font-serif text-2xl font-bold tracking-[0.16em]">HAVEN</Link>
        <p className="mt-12 text-xs font-bold uppercase tracking-[0.2em] text-[#b56d45]">Admin access</p>
        <h1 className="mt-3 font-serif text-4xl">Sign in</h1>
        <p className="mt-3 text-sm text-[#667582]">Use your authorized HAVEN administrator account.</p>

        {configurationMissing ? (
          <p role="alert" className="mt-8 border border-[#d8b7a6] bg-white px-4 py-3 text-sm text-[#7e4930]">
            Admin sign-in is temporarily unavailable. Please try again later.
          </p>
        ) : (
          <form action={loginAction} className="mt-8 space-y-5">
            {error === "credentials" && (
              <p role="alert" className="border border-[#d8b7a6] bg-white px-4 py-3 text-sm text-[#7e4930]">
                Login failed. Check your email and password and try again.
              </p>
            )}
            {error === "reset" && <p role="alert" className="border border-[#d8b7a6] bg-white px-4 py-3 text-sm text-[#7e4930]">That password reset link is invalid or expired. Request a new one.</p>}
            <label className="block text-sm font-semibold">
              Email
              <input name="email" type="email" autoComplete="username" required className="mt-2 min-h-12 w-full border border-[#cbd2d2] bg-white px-4 font-normal outline-none transition focus:border-[#b56d45]" />
            </label>
            <label className="block text-sm font-semibold">
              Password
              <input name="password" type="password" autoComplete="current-password" required className="mt-2 min-h-12 w-full border border-[#cbd2d2] bg-white px-4 font-normal outline-none transition focus:border-[#b56d45]" />
            </label>
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <label className="inline-flex items-center gap-2 font-medium text-[#526575]">
                <input name="rememberMe" type="checkbox" className="h-4 w-4 accent-[#b56d45]" />
                Remember me
              </label>
              <Link href="/admin/forgot-password" className="font-semibold text-[#b56d45] underline-offset-4 hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" className="min-h-12 w-full bg-[#162b3d] px-5 text-sm font-bold text-white transition hover:bg-[#b56d45]">
              Log in
            </button>
          </form>
        )}
      </div>
    </main>
  );
}