"use client";

import { useMemo, useState } from "react";
import { properties, type PropertyPurpose } from "../../lib/properties";
import { filterProperties, type PropertyFilters } from "../../lib/propertyFilters";
import EmptyState from "./EmptyState";
import PropertyGrid from "./PropertyGrid";
import PropertySearch, { type SearchValues } from "./PropertySearch";

const initialSearch: PropertyFilters = { location: "", propertyType: "", purpose: "", bedrooms: "", maxPrice: "", searchText: "" };

export default function PropertiesBrowser({ purpose, initialFilters = initialSearch }: { purpose?: PropertyPurpose; initialFilters?: PropertyFilters }) {
  const [search, setSearch] = useState<SearchValues>(initialFilters);
  const [appliedSearch, setAppliedSearch] = useState<SearchValues>(initialFilters);
  const [sort, setSort] = useState("newest");
  const [naturalSearch, setNaturalSearch] = useState("");

  const filteredProperties = useMemo(() => {
    const result = filterProperties(properties, appliedSearch, purpose);

    return [...result].sort((a, b) => sort === "low" ? a.priceValue - b.priceValue : sort === "high" ? b.priceValue - a.priceValue : 0);
  }, [appliedSearch, purpose, sort]);

  const updateSearch = (values: SearchValues) => setSearch(values);
  const applySearch = () => setAppliedSearch(search);
  const applyNaturalSearch = () => {
    const nextSearch = { ...search, searchText: naturalSearch };
    setSearch(nextSearch);
    setAppliedSearch(nextSearch);
  };
  const clearFilters = () => { setSearch(initialSearch); setAppliedSearch(initialSearch); setNaturalSearch(""); };

  const resultLabel = purpose === "sale" ? "properties for sale" : purpose === "rent" ? "homes available for rent" : "properties found";

  return <>
    <section className="mt-12" aria-labelledby="search-heading"><h2 id="search-heading" className="sr-only">Search properties</h2><PropertySearch values={search} onChange={updateSearch} onSubmit={applySearch} /></section>

    <section className="mt-8 border border-[#dfe3e4] bg-[#f2f0eb] p-6 sm:p-8" aria-labelledby="natural-heading">
      <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-center"><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#b56d45]">A more natural search</p><h2 id="natural-heading" className="font-serif text-3xl text-[#162b3d]">Know what you want?</h2></div><div className="flex flex-col gap-4 sm:flex-row sm:items-end"><label className="flex-1 border-b border-[#aeb9bd] pb-3 text-sm text-[#465965] focus-within:border-[#b56d45]"><span className="sr-only">Describe what you want</span><input value={naturalSearch} onChange={(event) => setNaturalSearch(event.target.value)} placeholder="I need a modern 2 bedroom flat around Ugbowo, downstairs, with parking..." className="w-full bg-transparent outline-none placeholder:text-[#71808c]" /></label><button type="button" onClick={applyNaturalSearch} className="min-h-12 bg-[#162b3d] px-6 text-sm font-bold text-white transition hover:bg-[#b56d45]">Search naturally <span aria-hidden="true">→</span></button></div></div>
    </section>

    <section className="mt-16" aria-labelledby="results-heading">
      <div className="mb-7 flex flex-col gap-4 border-b border-[#dfe3e4] pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b56d45]">Property discovery</p><h2 id="results-heading" aria-live="polite" className="mt-2 font-serif text-3xl text-[#162b3d]">{filteredProperties.length} {resultLabel}</h2></div><label className="flex items-center gap-3 text-sm text-[#667582]">Sort by <select value={sort} onChange={(event) => setSort(event.target.value)} className="border border-[#d5d9d6] bg-white px-3 py-2 font-medium text-[#162b3d] outline-none focus:border-[#b56d45]"><option value="newest">Newest</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option></select></label></div>
      {filteredProperties.length ? <PropertyGrid properties={filteredProperties} /> : <EmptyState onClear={clearFilters} />}
    </section>
  </>;
}