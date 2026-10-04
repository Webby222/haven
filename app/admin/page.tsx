import { redirect } from "next/navigation";
import Link from "next/link";
import AdminHeader from "./AdminHeader";
import { isHavenAdmin } from "../../lib/adminAuth";
import { createAdminServerClient, getSupabasePublicConfig } from "../../lib/supabaseAdminServer";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!getSupabasePublicConfig()) redirect("/admin/login");

  const supabase = await createAdminServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isHavenAdmin(user)) redirect("/admin/login");

  const [propertiesResult, enquiriesResult, newEnquiriesResult] = await Promise.all([
    supabase.from("properties").select("id", { count: "exact", head: true }),
    supabase.from("inquiries").select("id", { count: "exact", head: true }),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);

  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#162b3d]">
      <AdminHeader />
      <section className="mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <h1 className="font-serif text-3xl">Property Management</h1>
          <Link href="/admin/properties" className="inline-flex min-h-11 items-center bg-[#162b3d] px-5 text-sm font-bold text-white transition hover:bg-[#b56d45]">Manage properties</Link>
        </div>
        <div className="mt-8 grid max-w-4xl gap-4 sm:grid-cols-3">
          <div className="border border-[#dfe3e4] bg-white p-6">
            <p className="text-sm font-semibold text-[#667582]">Properties</p>
            <p className="mt-3 font-serif text-4xl" aria-live="polite">{propertiesResult.count ?? "—"}</p>
          </div>
          <div className="border border-[#dfe3e4] bg-white p-6">
            <p className="text-sm font-semibold text-[#667582]">Total enquiries</p>
            <p className="mt-3 font-serif text-4xl" aria-live="polite">{enquiriesResult.error ? "—" : enquiriesResult.count ?? 0}</p>
          </div>
          <div className="border border-[#dfe3e4] bg-white p-6">
            <p className="text-sm font-semibold text-[#667582]">New enquiries</p>
            <p className="mt-3 font-serif text-4xl" aria-live="polite">{newEnquiriesResult.error ? "—" : newEnquiriesResult.count ?? 0}</p>
          </div>
        </div>
        <Link href="/admin/enquiries" className="mt-6 inline-flex min-h-10 items-center border border-[#cbd2d2] bg-white px-4 text-sm font-semibold transition hover:border-[#b56d45] hover:text-[#b56d45]">View enquiries</Link>
      </section>
    </main>
  );
}