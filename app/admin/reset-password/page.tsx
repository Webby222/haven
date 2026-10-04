import Link from "next/link";
import AdminHeader from "../AdminHeader";
import ResetPasswordForm from "./ResetPasswordForm";
import { requireHavenAdminClient } from "../../../lib/adminServer";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage() {
  await requireHavenAdminClient();

  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#162b3d]">
      <AdminHeader />
      <section className="mx-auto max-w-md px-6 py-12 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b56d45]">Admin access</p>
        <h1 className="mt-3 font-serif text-4xl">Choose a new password</h1>
        <ResetPasswordForm />
        <Link href="/admin/login" className="mt-6 block text-center text-sm font-semibold text-[#b56d45] underline-offset-4 hover:underline">Back to login</Link>
      </section>
    </main>
  );
}