import Link from "next/link";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import PropertyFacilities from "../../components/PropertyFacilities";
import PropertyGrid from "../../components/PropertyGrid";
import PropertyMediaGallery from "../../components/PropertyMediaGallery";
import Reveal from "../../components/Reveal";
import { getProperties, getPropertyById } from "../../../lib/propertyData";
import type { Property } from "../../../lib/properties";

type PropertyDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PropertyDetailsPage({ params }: PropertyDetailsPageProps) {
  const { id } = await params;
  let property: Property | null = null;
  let properties: Property[] = [];
  let loadError: string | null = null;

  try {
    property = await getPropertyById(id);
    if (property) properties = await getProperties();
  } catch (error) {
    loadError = error instanceof Error ? error.message : "An unexpected error occurred while loading this property.";
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#fbfaf8] text-[#162b3d]">
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-28 text-center sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b56d45]">Property data unavailable</p>
          <h1 className="mt-5 font-serif text-5xl">We couldn&apos;t load this property.</h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#667582]">{loadError}</p>
          <Link href="/properties" className="mt-8 inline-flex min-h-12 items-center bg-[#162b3d] px-7 text-sm font-bold text-white transition hover:bg-[#b56d45]">Back to properties <span className="ml-3" aria-hidden="true">→</span></Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#fbfaf8] text-[#162b3d]">
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-28 text-center sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b56d45]">Property unavailable</p>
          <h1 className="mt-5 font-serif text-5xl">We couldn&apos;t find that property.</h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#667582]">The property may have moved, or the link may be incomplete. Return to the catalogue to continue exploring.</p>
          <Link href="/properties" className="mt-8 inline-flex min-h-12 items-center bg-[#162b3d] px-7 text-sm font-bold text-white transition hover:bg-[#b56d45]">Back to properties <span className="ml-3" aria-hidden="true">→</span></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const related = properties
    .filter((item) => item.id !== property.id)
    .sort((a, b) => {
      const score = (candidate: Property) =>
        Number(candidate.city === property.city) +
        Number(candidate.purpose === property.purpose) +
        Number(candidate.propertyType === property.propertyType);
      return score(b) - score(a);
    })
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-[#162b3d]">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12 lg:py-20">
        <Link href="/properties" className="inline-flex items-center text-sm font-bold text-[#b56d45] transition hover:text-[#162b3d]">← <span className="ml-3">Back to properties</span></Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <Reveal className="overflow-hidden bg-[#e8ecec]">
            <img src={property.image} alt={property.imageAlt} className="haven-image-reveal aspect-[4/3] h-full w-full object-cover" />
          </Reveal>
          <Reveal delay={120} className="lg:pt-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b56d45]">For {property.purpose === "sale" ? "sale" : "rent"} · {property.propertyType}</p>
            <h1 className="mt-5 font-serif text-5xl leading-[0.96] tracking-[-0.03em] sm:text-6xl">{property.title}</h1>
            <p className="mt-5 text-base text-[#667582]">{property.location}, {property.city}</p>
            <p className="mt-8 font-serif text-3xl text-[#b56d45]">{property.price}</p>
            <dl className="mt-8 grid grid-cols-2 gap-y-5 border-y border-[#dfe3e4] py-6 text-sm">
              <div><dt className="text-[#8b99a3]">Bedrooms</dt><dd className="mt-1 font-bold">{property.bedrooms}</dd></div>
              <div><dt className="text-[#8b99a3]">Bathrooms</dt><dd className="mt-1 font-bold">{property.bathrooms}</dd></div>
              <div><dt className="text-[#8b99a3]">Parking</dt><dd className="mt-1 font-bold">{property.parking}</dd></div>
              <div><dt className="text-[#8b99a3]">Property type</dt><dd className="mt-1 font-bold">{property.propertyType}</dd></div>
            </dl>
            <p className="mt-8 text-sm leading-7 text-[#667582]">{property.description}</p>
            <Link href={`/contact?property=${encodeURIComponent(property.id)}`} className="mt-8 inline-flex min-h-12 items-center bg-[#162b3d] px-7 text-sm font-bold text-white transition hover:bg-[#b56d45]">Enquire about this property <span className="ml-3" aria-hidden="true">→</span></Link>
          </Reveal>
        </div>
        <PropertyMediaGallery media={property.media ?? []} coverImage={property.image} />
        <PropertyFacilities facilities={property.facilities} legacyFeatures={property.features} />
        <section className="mt-12 border-t border-[#dfe3e4] pt-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b56d45]">Amenities</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[property.furnished ? "Furnished" : "Unfurnished", property.serviced ? "Serviced" : "Self-managed", property.parking].map((label) => <div key={label} className="border border-[#dfe3e4] bg-[#f7f4ef] px-4 py-6 text-center text-sm font-medium text-[#162b3d]">{label}</div>)}
          </div>
        </section>
        {related.length > 0 && (
          <section className="mt-20">
            <div className="flex items-end justify-between gap-4 border-b border-[#dfe3e4] pb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b56d45]">Related properties</p>
                <h2 className="mt-2 font-serif text-4xl text-[#162b3d]">More like this</h2>
              </div>
              <Link href="/properties" className="hidden text-sm font-bold text-[#b56d45] sm:block">View all properties →</Link>
            </div>
            <div className="mt-8"><PropertyGrid properties={related} /></div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}