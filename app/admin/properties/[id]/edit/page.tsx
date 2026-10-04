import { notFound } from "next/navigation";
import AdminHeader from "../../../AdminHeader";
import PropertyForm from "../../PropertyForm";
import { updatePropertyAction } from "../../actions";
import { requireHavenAdminClient } from "../../../../../lib/adminServer";
import { mapPropertyRow } from "../../../../../lib/propertyData";
import type { Property } from "../../../../../lib/properties";

type EditPropertyPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; detail?: string }>;
};

export const dynamic = "force-dynamic";

export default async function EditPropertyPage({ params, searchParams }: EditPropertyPageProps) {
  const [{ id }, { error: errorCode, detail }] = await Promise.all([params, searchParams]);
  const supabase = await requireHavenAdminClient();
  let property: Property | null = null;
  let loadFailed = false;

  try {
    const { data, error } = await supabase.from("properties").select("*").eq("id", id).maybeSingle();
    loadFailed = Boolean(error);
    if (data && !error) property = mapPropertyRow(data);
  } catch {
    loadFailed = true;
  }

  if (!property && !loadFailed) notFound();

  const updateAction = updatePropertyAction.bind(null, id);

  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#162b3d]">
      <AdminHeader />
      <section className="mx-auto max-w-4xl px-6 py-10 sm:px-8 sm:py-14">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b56d45]">Property catalogue</p>
        <h1 className="mt-2 font-serif text-3xl">Edit Property</h1>
        {loadFailed && <p role="alert" className="mt-6 border border-[#d8b7a6] bg-white px-4 py-3 text-sm text-[#7e4930]">The property could not be loaded. Check the Supabase connection and database policies.</p>}
        {!loadFailed && property && <PropertyForm action={updateAction} property={property} error={errorCode} detail={detail} />}
      </section>
    </main>
  );
}