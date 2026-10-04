import AdminHeader from "../AdminHeader";

export default function EnquiriesLoading() {
  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#162b3d]">
      <AdminHeader />
      <section className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
        <p role="status" className="text-sm text-[#667582]">Loading enquiries...</p>
        <div aria-hidden="true" className="mt-6 h-72 animate-pulse border border-[#dfe3e4] bg-white" />
      </section>
    </main>
  );
}