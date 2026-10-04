import Link from "next/link";
import AdminHeader from "../AdminHeader";
import { requireHavenAdminClient } from "../../../lib/adminServer";

type EnquiriesPageProps = {
  searchParams: Promise<{ q?: string; status?: string; error?: string }>;
};

const statuses = ["new", "read", "archived"] as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage({ searchParams }: EnquiriesPageProps) {
  const params = await searchParams;
  const rawSearch = (params.q ?? "").trim();
  const search = rawSearch.replace(/[,%()"\\]/g, " ").replace(/\s+/g, " ").slice(0, 100);
  const status = statuses.includes(params.status as (typeof statuses)[number]) ? params.status : "all";
  const supabase = await requireHavenAdminClient();

  let query = supabase
    .from("inquiries")
    .select("id,name,email,phone,interest,message,property_id,created_at,status,property:properties!inquiries_property_id_fkey(title,location,city),replies:inquiry_replies(status)")
    .order("created_at", { ascending: false })
    .limit(500);

  if (status !== "all") query = query.eq("status", status);
  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);

  const { data, error } = await query;
  const enquiries = data ?? [];

  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#162b3d]">
      <AdminHeader />
      <section className="mx-auto max-w-6xl px-6 py-10 sm:px-8 sm:py-14">
        <div className="border-b border-[#dfe3e4] pb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b56d45]">Admin</p>
          <h1 className="mt-2 font-serif text-3xl">Enquiries</h1>
        </div>

        {params.error === "archive" && <p role="alert" className="mt-6 border border-[#d8b7a6] bg-white px-4 py-3 text-sm text-[#7e4930]">The enquiry could not be archived. Refresh and try again.</p>}
        {error && (
          <p role="alert" className="mt-6 border border-[#d8b7a6] bg-white px-4 py-3 text-sm text-[#7e4930]">
            Enquiries could not be loaded. Apply migration `005_admin_enquiries.sql` and verify the admin RLS policies.
            {process.env.NODE_ENV === "development" && <span className="mt-2 block font-mono text-xs">{error.message}</span>}
          </p>
        )}

        <form method="get" className="mt-6 grid gap-3 sm:grid-cols-[1fr_12rem_auto]">
          <label className="sr-only" htmlFor="enquiry-search">Search name or email</label>
          <input id="enquiry-search" name="q" type="search" defaultValue={rawSearch} placeholder="Search name or email" className="min-h-11 border border-[#cbd2d2] bg-white px-3 text-sm outline-none focus:border-[#b56d45]" />
          <label className="sr-only" htmlFor="enquiry-status">Filter by status</label>
          <select id="enquiry-status" name="status" defaultValue={status} className="min-h-11 border border-[#cbd2d2] bg-white px-3 text-sm">
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="archived">Archived</option>
          </select>
          <button type="submit" className="min-h-11 bg-[#162b3d] px-5 text-sm font-bold text-white transition hover:bg-[#b56d45]">Apply</button>
        </form>

        {!error && enquiries.length === 0 ? (
          <div className="mt-8 border border-dashed border-[#cbd2d2] bg-white px-6 py-12 text-center">
            <h2 className="font-serif text-2xl">No enquiries found</h2>
            <p className="mt-2 text-sm text-[#667582]">New contact form submissions will appear here.</p>
          </div>
        ) : !error ? (
          <div className="mt-8 overflow-x-auto border border-[#dfe3e4] bg-white">
            <table className="w-full min-w-[960px] border-collapse text-left text-sm">
              <thead className="bg-[#eef0ee] text-xs uppercase tracking-wide text-[#526575]">
                <tr>
                  <th scope="col" className="px-4 py-3">Name</th>
                  <th scope="col" className="px-4 py-3">Email</th>
                  <th scope="col" className="px-4 py-3">Phone</th>
                  <th scope="col" className="px-4 py-3">Property</th>
                  <th scope="col" className="px-4 py-3">Message</th>
                  <th scope="col" className="px-4 py-3">Created</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">Reply</th>
                  <th scope="col" className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e8e7]">
                {enquiries.map((enquiry) => {
                  const property = Array.isArray(enquiry.property) ? enquiry.property[0] : enquiry.property;
                  const hasSentReply = (enquiry.replies ?? []).some((reply) => reply.status === "sent");
                  return (
                    <tr key={enquiry.id} className={enquiry.status === "new" ? "bg-[#fffaf6]" : undefined}>
                      <td className="px-4 py-4 font-semibold">{enquiry.name}</td>
                      <td className="px-4 py-4"><a href={`mailto:${enquiry.email}`} className="text-[#365a71] underline-offset-4 hover:underline">{enquiry.email}</a></td>
                      <td className="px-4 py-4">{enquiry.phone || "—"}</td>
                      <td className="max-w-48 px-4 py-4">{property ? `${property.title}, ${property.location}, ${property.city}` : "General enquiry"}</td>
                      <td className="max-w-56 px-4 py-4">{enquiry.message.slice(0, 110)}{enquiry.message.length > 110 ? "…" : ""}</td>
                      <td className="whitespace-nowrap px-4 py-4">{formatDate(enquiry.created_at)}</td>
                      <td className="px-4 py-4"><span className={`inline-flex items-center gap-2 capitalize ${enquiry.status === "new" ? "font-bold text-[#9a4f39]" : "text-[#526575]"}`}>{enquiry.status === "new" && <span className="h-2 w-2 rounded-full bg-[#b56d45]" aria-hidden="true" />}{enquiry.status}</span></td>
                      <td className="px-4 py-4">{hasSentReply ? <span className="font-semibold text-[#355a42]">Replied</span> : <span className="text-[#7b8890]">No reply</span>}</td>
                      <td className="px-4 py-4"><Link href={`/admin/enquiries/${enquiry.id}`} className="font-semibold text-[#b56d45] underline-offset-4 hover:underline">View</Link></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </main>
  );
}