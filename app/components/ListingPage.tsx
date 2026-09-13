import Footer from "./Footer";
import Header from "./Header";
import PropertiesBrowser from "./PropertiesBrowser";
import type { PropertyPurpose } from "../../lib/properties";

export default function ListingPage({ title, description, purpose }: { title: string; description: string; purpose: PropertyPurpose }) {
  return <div className="min-h-screen bg-[#fbfaf8] text-[#162b3d]"><Header /><main className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-24"><div className="grid gap-8 border-b border-[#dfe3e4] pb-14 lg:grid-cols-[1fr_0.8fr] lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b56d45]">Haven {purpose === "sale" ? "for sale" : "for rent"}</p><h1 className="mt-5 max-w-3xl font-serif text-6xl leading-[0.94] tracking-[-0.03em] text-[#162b3d] sm:text-7xl">{title}</h1></div><p className="max-w-md text-base leading-8 text-[#667582]">{description}</p></div><PropertiesBrowser purpose={purpose} /></main><Footer /></div>;
}