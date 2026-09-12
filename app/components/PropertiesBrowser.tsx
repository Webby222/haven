"use client";

import { useMemo, useState } from "react";
import { properties } from "../../lib/properties";
import EmptyState from "./EmptyState";
import PropertyGrid from "./PropertyGrid";
import PropertySearch, { type SearchValues } from "./PropertySearch";

const initialSearch: SearchValues = { location: "", propertyType: "", purpose: "", bedrooms: "", budget: "" };

export default function PropertiesBrowser({ purpose }: { purpose?: "rent" | "buy" }) {
  const [search, setSearch] = useState<SearchValues>(initialSearch);
  const [sort, setSort] = useState("newest");
  const [naturalSearch, setNaturalSearch] = useState("");

  const filteredProperties = useMemo(() => {
    const result = properties.filter((property) => {
      if (purpose && property.purpose !== purpose) return false;
      const locationMatch = !search.location || property.location === search.location;
      const typeMatch = !search.propertyType || property.propertyType === search.propertyType;
      const bedroomMatch = !search.bedrooms || property.bedrooms === Number.parseInt(search.bedrooms, 10);
      const budgetMatch = !search.budget || (search.budget.includes("Under") ? property.priceValue < 1000000 : search.budget.includes("₦1m") ? property.priceValue >= 1000000 && property.priceValue <= 2000000 : search.budget.includes("₦2m") ? property.priceValue > 2000000 && property.priceValue <= 4000000 : property.priceValue > 4000000);
      return locationMatch && typeMatch && bedroomMatch && budgetMatch;
    });

    return [...result].sort((a, b) => sort === "low" ? a.priceValue - b.priceValue : sort === "high" ? b.priceValue - a.priceValue : 0);
  }, [purpose, search, sort]);

  const updateSearch = (values: SearchValues) => setSearch(values);
  const clearFilters = () => setSearch(initialSearch);

  return <>
    <section className="mt-12" aria-labelledby="search-heading"><h2 id="search-heading" className="sr-only">Search properties</h2><PropertySearch values={search} onChange={updateSearch} /></section>

    <section className="mt-8 border border-[#dfe3e4] bg-[#f2f0eb] p-6 sm:p-8" aria-labelledby="natural-heading">
      <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-center"><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#b56d45]">A more natural search</p><h2 id="natural-heading" className="font-serif text-3xl text-[#162b3d]">Know what you want?</h2></div><div className="flex flex-col gap-4 sm:flex-row sm:items-end"><label className="flex-1 border-b border-[#aeb9bd] pb-3 text-sm text-[#465965] focus-within:border-[#b56d45]"><span className="sr-only">Describe what you want</span><input value={naturalSearch} onChange={(event) => setNaturalSearch(event.target.value)} placeholder="I need a modern 2 bedroom flat around Ugbowo, downstairs, with parking..." className="w-full bg-transparent outline-none placeholder:text-[#71808c]" /></label><button type="button" className="min-h-12 bg-[#162b3d] px-6 text-sm font-bold text-white transition hover:bg-[#b56d45]">Search naturally <span aria-hidden="true">→</span></button></div></div>
    </section>

    <section className="mt-16" aria-labelledby="results-heading">
      <div className="mb-7 flex flex-col gap-4 border-b border-[#dfe3e4] pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b56d45]">Property discovery</p><h2 id="results-heading" className="mt-2 font-serif text-3xl text-[#162b3d]">{filteredProperties.length === properties.length ? "24" : filteredProperties.length} properties found</h2></div><label className="flex items-center gap-3 text-sm text-[#667582]">Sort by <select value={sort} onChange={(event) => setSort(event.target.value)} className="border border-[#d5d9d6] bg-white px-3 py-2 font-medium text-[#162b3d] outline-none focus:border-[#b56d45]"><option value="newest">Newest</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option></select></label></div>
      {filteredProperties.length ? <PropertyGrid properties={filteredProperties} /> : <EmptyState onClear={clearFilters} />}
    </section>
  </>;
}