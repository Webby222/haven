import Link from "next/link";
import AdminHeader from "../AdminHeader";
import DeletePropertyControl from "./DeletePropertyControl";
import { requireHavenAdminClient } from "../../../lib/adminServer";
import { mapPropertyRow } from "../../../lib/propertyData";
import type { Property } from "../../../lib/properties";

type AdminPropertiesPageProps = {
  searchParams: Promise<{ status?: string; error?: string; detail?: string; warning?: string }>;
};

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage({ searchParams }: AdminPropertiesPageProps) {
  const supabase = await requireHavenAdminClient();
  let hasDatabaseError = false;
  let properties: { property: Property; createdAt: string }[] = [];

  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });
    hasDatabaseError = Boolean(error);
    if (data && !error) {
      properties = data.map((row) => ({
        property: mapPropertyRow(row),
        createdAt: String(row.created_at ?? ""),
      }));
    }
  } catch {
    hasDatabaseError = true;
  }

  const { status, error: errorCode, detail, warning } = await searchParams;

  const notice = warning === "media-cleanup"
    ? "Property updated, but one or more removed files could not be deleted from Storage."
    : status === "created"
    ? "Property created successfully."
    : status === "updated"
      ? "Property changes saved."
      : status === "deleted"
        ? "Property deleted."
        : null;
  const errorMessage = errorCode === "delete"
    ? "The property could not be deleted. It may have already been removed, or database access was denied."
    : hasDatabaseError
      ? "Properties could not be loaded. Check the Supabase connection and database policies."
      : null;

  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#162b3d]">
      <AdminHeader />
      <section className="mx-auto max-w-6xl px-6 py-10 sm:px-8 sm:py-14">
        <div className="flex flex-wrap items-end justify-between gap-5 border-b border-[#dfe3e4] pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b56d45]">Admin</p>
            <h1 className="mt-2 font-serif text-3xl">Properties</h1>
          </div>
          <Link href="/admin/properties/new" className="inline-flex min-h-11 items-center bg-[#162b3d] px-5 text-sm font-bold text-white transition hover:bg-[#b56d45]">Add Property</Link>
        </div>

        {notice && <p role="status" className="mt-6 border border-[#b7c9bc] bg-white px-4 py-3 text-sm text-[#355a42]">{notice}</p>}
        {errorMessage && (
          <div role="alert" className="mt-6 border border-[#d8b7a6] bg-white px-4 py-3 text-sm text-[#7e4930]">
            <p>{errorMessage}</p>
            {detail && process.env.NODE_ENV === "development" && (
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs">Supabase: {detail}</pre>
            )}
          </div>
        )}

        {hasDatabaseError ? null : properties.length === 0 ? (
          <div className="mt-8 border border-dashed border-[#cbd2d2] bg-white px-6 py-12 text-center">
            <h2 className="font-serif text-2xl">No properties yet</h2>
            <p className="mt-2 text-sm text-[#667582]">Create the first listing to start your catalogue.</p>
            <Link href="/admin/properties/new" className="mt-5 inline-flex min-h-10 items-center border border-[#162b3d] px-4 text-sm font-semibold">Add Property</Link>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto border border-[#dfe3e4] bg-white">
            <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
              <thead className="bg-[#eef0ee] text-xs uppercase tracking-wide text-[#526575]">
                <tr>
                  <th scope="col" className="px-4 py-3">Property</th>
                  <th scope="col" className="px-4 py-3">Purpose</th>
                  <th scope="col" className="px-4 py-3">Type</th>
                  <th scope="col" className="px-4 py-3">Location</th>
                  <th scope="col" className="px-4 py-3">Price</th>
                  <th scope="col" className="px-4 py-3">Beds</th>
                  <th scope="col" className="px-4 py-3">Featured</th>
                  <th scope="col" className="px-4 py-3">Created</th>
                  <th scope="col" className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e8e7]">
                {properties.map(({ property, createdAt }) => (
                  <tr key={property.id}>
                    <td className="max-w-56 px-4 py-4 font-semibold">{property.title}</td>
                    <td className="px-4 py-4 capitalize">{property.purpose}</td>
                    <td className="px-4 py-4">{property.propertyType}</td>
                    <td className="px-4 py-4">{property.location}, {property.city}</td>
                    <td className="px-4 py-4">{property.price}</td>
                    <td className="px-4 py-4">{property.bedrooms}</td>
                    <td className="px-4 py-4">{property.featured ? "Yes" : "No"}</td>
                    <td className="px-4 py-4">{createdAt ? new Date(createdAt).toLocaleDateString("en-NG") : "—"}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <Link href={`/admin/properties/${encodeURIComponent(property.id)}/edit`} className="font-semibold text-[#365a71] underline-offset-4 hover:underline">Edit</Link>
                        <DeletePropertyControl id={property.id} title={property.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}