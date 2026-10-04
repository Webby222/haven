import AdminHeader from "../../AdminHeader";
import PropertyForm from "../PropertyForm";
import { createPropertyAction } from "../actions";

type NewPropertyPageProps = {
  searchParams: Promise<{ error?: string; detail?: string }>;
};

export default async function NewPropertyPage({ searchParams }: NewPropertyPageProps) {
  const { error, detail } = await searchParams;

  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#162b3d]">
      <AdminHeader />
      <section className="mx-auto max-w-4xl px-6 py-10 sm:px-8 sm:py-14">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b56d45]">Property catalogue</p>
        <h1 className="mt-2 font-serif text-3xl">Add Property</h1>
        <PropertyForm action={createPropertyAction} error={error} detail={detail} />
      </section>
    </main>
  );
}