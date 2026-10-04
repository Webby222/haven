import Link from "next/link";
import EnquiryNotificationBell, { type AdminNotificationItem } from "./EnquiryNotificationBell";
import { logoutAction } from "./actions";
import { requireHavenAdminClient } from "../../lib/adminServer";

export default async function AdminHeader() {
  const supabase = await requireHavenAdminClient();
  const [countResult, recentResult] = await Promise.all([
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase
      .from("inquiries")
      .select("id,name,message,created_at,property:properties!inquiries_property_id_fkey(title)")
      .eq("status", "new")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);
  const notificationError = countResult.error || recentResult.error;
  const recent: AdminNotificationItem[] = (recentResult.data ?? []).map((item) => {
    const property = Array.isArray(item.property) ? item.property[0] : item.property;
    return {
      id: item.id,
      name: item.name,
      message: item.message,
      createdAt: item.created_at,
      propertyTitle: property?.title ?? null,
    };
  });

  return (
    <header className="border-b border-[#dfe3e4] bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5 sm:px-8">
        <div>
          <Link href="/admin" className="font-serif text-xl font-bold tracking-[0.14em]">HAVEN ADMIN</Link>
          <p className="mt-1 text-xs text-[#667582]">Property Management</p>
        </div>
        <nav className="flex items-center gap-4" aria-label="Admin navigation">
          <EnquiryNotificationBell count={notificationError ? null : countResult.count ?? 0} recent={notificationError ? [] : recent} />
          <Link href="/admin/properties" className="text-sm font-semibold text-[#526575] transition hover:text-[#b56d45]">Properties</Link>
          <Link href="/admin/enquiries" className="text-sm font-semibold text-[#526575] transition hover:text-[#b56d45]">Enquiries</Link>
          <form action={logoutAction}>
            <button type="submit" className="min-h-10 border border-[#cbd2d2] px-4 text-sm font-semibold transition hover:border-[#b56d45] hover:text-[#b56d45]">Log out</button>
          </form>
        </nav>
      </div>
    </header>
  );
}