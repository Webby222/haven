import Link from "next/link";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { getSupabasePublicConfig } from "../../../lib/supabaseAdminServer";

export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  const configured = Boolean(getSupabasePublicConfig());

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f3ee] px-6 py-12 text-[#162b3d]">
      <div className="w-full max-w-md">
        <Link href="/" className="font-serif text-2xl font-bold tracking-[0.16em]">HAVEN</Link>
        <p className="mt-12 text-xs font-bold uppercase tracking-[0.2em] text-[#b56d45]">Admin access</p>
        <h1 className="mt-3 font-serif text-4xl">Reset password</h1>
        <p className="mt-3 text-sm text-[#667582]">Enter the email for your HAVEN administrator account.</p>
        {configured ? <ForgotPasswordForm /> : <p role="alert" className="mt-8 border border-[#d8b7a6] bg-white px-4 py-3 text-sm text-[#7e4930]">Password reset is temporarily unavailable.</p>}
      </div>
    </main>
  );
}