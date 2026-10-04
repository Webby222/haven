import Link from "next/link";
import { notFound } from "next/navigation";
import AdminHeader from "../../AdminHeader";
import { archiveInquiryAction } from "../actions";
import ReplyComposer from "../ReplyComposer";
import { requireHavenAdminClient } from "../../../../lib/adminServer";
import { getPropertyById } from "../../../../lib/propertyData";

type EnquiryDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string; error?: string }>;
};

const inquiryIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const dynamic = "force-dynamic";

export default async function EnquiryDetailPage({ params, searchParams }: EnquiryDetailPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  if (!inquiryIdPattern.test(id)) notFound();

  const supabase = await requireHavenAdminClient();
  const { data: enquiry, error } = await supabase
    .from("inquiries")
    .select("id,name,email,phone,interest,message,property_id,created_at,status")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return (
      <main className="min-h-screen bg-[#f5f3ee] text-[#162b3d]">
        <AdminHeader />
        <section className="mx-auto max-w-4xl px-6 py-10 sm:px-8">
          <p role="alert" className="border border-[#d8b7a6] bg-white px-4 py-3 text-sm text-[#7e4930]">This enquiry could not be loaded. Apply migration `005_admin_enquiries.sql` and check admin RLS.</p>
          {process.env.NODE_ENV === "development" && <p className="mt-2 font-mono text-xs">{error.message}</p>}
          <Link href="/admin/enquiries" className="mt-6 inline-flex text-sm font-semibold text-[#b56d45]">Back to enquiries</Link>
        </section>
      </main>
    );
  }

  if (!enquiry) notFound();

  let status = enquiry.status;
  let readUpdateFailed = false;
  if (status === "new") {
    const { data: updated, error: updateError } = await supabase
      .from("inquiries")
      .update({ status: "read" })
      .eq("id", id)
      .eq("status", "new")
      .select("id")
      .maybeSingle();
    if (updated && !updateError) status = "read";
    else if (updateError) readUpdateFailed = true;
  }

  const { data: replyHistory, error: replyHistoryError } = await supabase
    .from("inquiry_replies")
    .select("id,to_email,subject,message,status,provider_message_id,failure_message,created_at,sent_at")
    .eq("inquiry_id", id)
    .order("created_at", { ascending: true });

  let property: Awaited<ReturnType<typeof getPropertyById>> = null;
  let propertyLoadFailed = false;
  if (enquiry.property_id) {
    try {
      property = await getPropertyById(enquiry.property_id);
    } catch {
      propertyLoadFailed = true;
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#162b3d]">
      <AdminHeader />
      <section className="mx-auto max-w-4xl px-6 py-10 sm:px-8 sm:py-14">
        <Link href="/admin/enquiries" className="text-sm font-semibold text-[#b56d45] underline-offset-4 hover:underline">Back to enquiries</Link>
        <div className="mt-6 flex flex-wrap items-start justify-between gap-5 border-b border-[#dfe3e4] pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b56d45]">Enquiry</p>
            <h1 className="mt-2 font-serif text-3xl">{enquiry.name}</h1>
          </div>
          <p className="border border-[#dfe3e4] bg-white px-3 py-2 text-sm capitalize">{status}</p>
        </div>

        {query.status === "archived" && <p role="status" className="mt-6 border border-[#b7c9bc] bg-white px-4 py-3 text-sm text-[#355a42]">Enquiry archived.</p>}
        {(query.error === "archive" || readUpdateFailed) && <p role="alert" className="mt-6 border border-[#d8b7a6] bg-white px-4 py-3 text-sm text-[#7e4930]">The enquiry status could not be updated.</p>}

        <dl className="mt-8 grid gap-6 border-b border-[#dfe3e4] pb-8 sm:grid-cols-2">
          <div><dt className="text-xs font-bold uppercase tracking-wide text-[#667582]">Email</dt><dd className="mt-2"><a href={`mailto:${enquiry.email}`} className="font-semibold text-[#365a71] underline-offset-4 hover:underline">{enquiry.email}</a></dd></div>
          {enquiry.phone && <div><dt className="text-xs font-bold uppercase tracking-wide text-[#667582]">Phone</dt><dd className="mt-2"><a href={`tel:${enquiry.phone}`} className="font-semibold text-[#365a71] underline-offset-4 hover:underline">{enquiry.phone}</a></dd></div>}
          <div><dt className="text-xs font-bold uppercase tracking-wide text-[#667582]">Interest</dt><dd className="mt-2">{enquiry.interest}</dd></div>
          <div><dt className="text-xs font-bold uppercase tracking-wide text-[#667582]">Received</dt><dd className="mt-2">{new Intl.DateTimeFormat("en-NG", { dateStyle: "full", timeStyle: "short" }).format(new Date(enquiry.created_at))}</dd></div>
          <div className="sm:col-span-2"><dt className="text-xs font-bold uppercase tracking-wide text-[#667582]">Property</dt><dd className="mt-2">
            {!enquiry.property_id ? "General enquiry" : property ? <Link href={`/properties/${encodeURIComponent(property.id)}`} className="font-semibold text-[#b56d45] underline-offset-4 hover:underline">{property.title} · {property.location}, {property.city}</Link> : propertyLoadFailed ? "Property details are temporarily unavailable." : "The associated property is no longer available."}
          </dd></div>
        </dl>

        <section className="mt-8">
          <h2 className="text-xs font-bold uppercase tracking-wide text-[#667582]">Original enquiry</h2>
          <p className="mt-3 whitespace-pre-wrap border border-[#dfe3e4] bg-white p-5 text-sm leading-7">{enquiry.message}</p>
        </section>

        <section className="mt-8 border-t border-[#dfe3e4] pt-8" aria-labelledby="conversation-heading">
          <h2 id="conversation-heading" className="font-serif text-2xl">Reply history</h2>
          {replyHistoryError ? (
            <p role="alert" className="mt-4 border border-[#d8b7a6] bg-white px-4 py-3 text-sm text-[#7e4930]">
              Reply history is unavailable. Apply migration `007_inquiry_replies.sql`.
              {process.env.NODE_ENV === "development" && <span className="mt-2 block font-mono text-xs">{replyHistoryError.message}</span>}
            </p>
          ) : replyHistory && replyHistory.length > 0 ? (
            <ol className="mt-4 space-y-4">
              {replyHistory.map((reply) => (
                <li key={reply.id} className="border border-[#dfe3e4] bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">HAVEN reply · To: {reply.to_email}</p>
                      <p className="mt-1 text-xs text-[#667582]">Subject: {reply.subject}</p>
                    </div>
                    <span className={`text-xs font-bold uppercase ${reply.status === "sent" ? "text-[#355a42]" : reply.status === "failed" ? "text-[#9a4f39]" : "text-[#795c27]"}`}>{reply.status}</span>
                  </div>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#526575]">{reply.message}</p>
                  <time dateTime={reply.sent_at ?? reply.created_at} className="mt-4 block text-xs text-[#7b8890]">
                    {reply.status === "sent" && reply.sent_at ? "Sent " : reply.status === "pending" ? "Attempt started " : "Attempted "}
                    {new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(reply.sent_at ?? reply.created_at))}
                  </time>
                  {reply.status === "failed" && reply.failure_message && <p className="mt-2 text-xs text-[#9a4f39]">Send failed: {reply.failure_message}</p>}
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 text-sm text-[#667582]">No replies sent yet.</p>
          )}
        </section>

        <ReplyComposer inquiryId={enquiry.id} toEmail={enquiry.email} subject={`Re: ${property?.title ?? "your HAVEN enquiry"}`} />

        {status !== "archived" && (
          <form action={archiveInquiryAction} className="mt-8">
            <input type="hidden" name="id" value={enquiry.id} />
            <button type="submit" className="min-h-11 border border-[#9a4f39] px-5 text-sm font-semibold text-[#9a4f39] transition hover:bg-[#9a4f39] hover:text-white">Archive enquiry</button>
          </form>
        )}
      </section>
    </main>
  );
}