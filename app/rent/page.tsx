import ListingPage from "../components/ListingPage";
import { getPropertiesByPurpose } from "../../lib/propertyData";

export default async function RentPage() {
  try {
    const properties = await getPropertiesByPurpose("rent");
    return <ListingPage purpose="rent" title="Find a place that feels like home." description="Discover apartments, flats and homes available for rent in locations that matter to you." properties={properties} />;
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred while loading rental properties.";

    return <div className="min-h-screen bg-[#fbfaf8] text-[#162b3d]"><div className="mx-auto max-w-3xl px-6 py-28 text-center"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b56d45]">Property data unavailable</p><h1 className="mt-5 font-serif text-5xl">We couldn&apos;t load rental properties.</h1><p className="mt-5 text-sm leading-7 text-[#667582]">{message}</p></div></div>;
  }
}