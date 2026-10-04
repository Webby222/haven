export default function AdminPropertiesLoading() {
  return (
    <main className="min-h-screen bg-[#f5f3ee] px-6 py-12 text-[#162b3d] sm:px-8">
      <p role="status" className="mx-auto max-w-6xl text-sm text-[#667582]">Loading properties...</p>
      <div aria-hidden="true" className="mx-auto mt-6 h-72 max-w-6xl animate-pulse border border-[#dfe3e4] bg-white" />
    </main>
  );
}