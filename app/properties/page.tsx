import Footer from "../components/Footer";
import Header from "../components/Header";
import PropertiesBrowser from "../components/PropertiesBrowser";
import type { PropertyFilters } from "../../lib/propertyFilters";
import { getProperties } from "../../lib/propertyData";

type SearchParams = Record<string, string | string[] | undefined>;

function getParam(params: SearchParams, key: keyof PropertyFilters) {
  const value = params[key];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const initialFilters: PropertyFilters = { location: getParam(params, "location"), propertyType: getParam(params, "propertyType"), purpose: getParam(params, "purpose"), bedrooms: getParam(params, "bedrooms"), maxPrice: getParam(params, "maxPrice"), searchText: getParam(params, "searchText") };

  try {
    const properties = await getProperties();

    return <div className="min-h-screen bg-[#fbfaf8] text-[#162b3d]"><Header /><main className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-24"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b56d45]">Haven property discovery</p><h1 className="mt-5 font-serif text-6xl leading-[0.94] tracking-[-0.03em] text-[#162b3d] sm:text-7xl">Explore properties.</h1><p className="mt-7 max-w-xl text-base leading-8 text-[#667582]">Browse homes, apartments and investment properties across locations that matter to you.</p></div><PropertiesBrowser initialFilters={initialFilters} properties={properties} /></main><Footer /></div>;
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred while loading property data.";

    return <div className="min-h-screen bg-[#fbfaf8] text-[#162b3d]"><Header /><main className="mx-auto max-w-3xl px-6 py-28 text-center sm:px-8"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b56d45]">Property data unavailable</p><h1 className="mt-5 font-serif text-5xl">We couldn&apos;t load HAVEN&apos;s property data.</h1><p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#667582]">{message}</p><p className="mt-6 text-sm text-[#667582]">Check your Supabase environment variables and confirm the `properties` table is available.</p></main><Footer /></div>;
  }
}