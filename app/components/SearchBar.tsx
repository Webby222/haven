"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { properties } from "../../lib/properties";
import type { PropertyFilters } from "../../lib/propertyFilters";

const locationOptions = Array.from(new Set(properties.map((property) => `${property.location}, ${property.city}`)));
const propertyTypeOptions = Array.from(new Set(properties.map((property) => property.propertyType)));
const initialFilters: PropertyFilters = { location: "", propertyType: "", purpose: "", bedrooms: "", maxPrice: "", searchText: "" };
const priceOptions = [["1000000", "₦1m / year"], ["2000000", "₦2m / year"], ["4000000", "₦4m / year"], ["10000000", "₦10m / year"], ["50000000", "₦50m"]] as const;

export default function SearchBar() {
  const router = useRouter();
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters);

  const update = (key: keyof PropertyFilters, value: string) => setFilters((current) => ({ ...current, [key]: value }));
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => { if (value) params.set(key, value); });
    const query = params.toString();
    router.push(query ? `/properties?${query}` : "/properties");
  };

  return (
    <form className="border border-[#d5d9d6] bg-white p-4 shadow-[0_12px_35px_rgba(22,43,61,0.1)] lg:p-5" onSubmit={submitSearch}>
      <div className="mb-4 flex flex-col gap-2 border-b border-[#e3e6e4] pb-4 sm:flex-row sm:items-center sm:justify-between"><span className="text-sm font-bold text-[#162b3d]">Find your next place</span><span className="text-xs text-[#7b8890]">Search homes across Benin City</span></div>
      <label className="mb-4 flex min-h-[52px] cursor-text items-center rounded-[3px] border border-[#cbd5d6] px-4 transition hover:border-[#9eadaf] focus-within:border-[#b56d45] focus-within:shadow-[0_5px_16px_rgba(22,43,61,0.08)]"><span className="mr-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#71808c]">Search</span><input value={filters.searchText} onChange={(event) => update("searchText", event.target.value)} placeholder="Try “2 bedroom apartment in Ugbowo”" className="w-full bg-transparent text-sm font-semibold text-[#162b3d] outline-none placeholder:font-normal placeholder:text-[#8b99a3]" /></label>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_0.85fr_1fr_auto] lg:items-end">
        <Field label="Location" value={filters.location} onChange={(value) => update("location", value)} options={locationOptions} placeholder="Any location" />
        <Field label="Purpose" value={filters.purpose} onChange={(value) => update("purpose", value)} options={["Buy", "Rent"]} placeholder="Buy or rent" />
        <Field label="Property type" value={filters.propertyType} onChange={(value) => update("propertyType", value)} options={propertyTypeOptions} placeholder="Any property type" />
        <Field label="Bedrooms" value={filters.bedrooms} onChange={(value) => update("bedrooms", value)} options={["1", "2", "3", "4"]} displayOptions={["1 bedroom", "2 bedrooms", "3 bedrooms", "4 bedrooms"]} placeholder="Any bedrooms" />
        <Field label="Maximum price" value={filters.maxPrice} onChange={(value) => update("maxPrice", value)} options={priceOptions.map(([value]) => value)} displayOptions={priceOptions.map(([, label]) => label)} placeholder="Any budget" />
        <button type="submit" className="min-h-[54px] cursor-pointer bg-[#b56d45] px-6 text-sm font-bold text-white shadow-[0_6px_14px_rgba(181,109,69,0.2)] transition duration-200 hover:-translate-y-px hover:bg-[#162b3d] hover:shadow-[0_8px_18px_rgba(22,43,61,0.18)] active:translate-y-px">Search <span className="ml-2" aria-hidden="true">→</span></button>
      </div>
    </form>
  );
}

function Field({ label, value, onChange, options, displayOptions = options, placeholder }: { label: string; value: string; onChange: (value: string) => void; options: string[]; displayOptions?: string[]; placeholder: string }) {
  return <label className="group relative flex min-h-[72px] cursor-pointer flex-col justify-center rounded-[3px] border border-[#cbd5d6] bg-[#fcfdfc] px-4 py-2 transition duration-200 hover:-translate-y-px hover:border-[#9eadaf] hover:bg-white focus-within:border-[#b56d45] focus-within:shadow-[0_5px_16px_rgba(22,43,61,0.08)] lg:px-4"><span className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#71808c]">{label}</span><select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className="w-full cursor-pointer appearance-none bg-transparent pr-6 text-sm font-semibold text-[#162b3d] outline-none"><option value="">{placeholder}</option>{options.map((option, index) => <option key={option} value={option}>{displayOptions[index]}</option>)}</select><span className="pointer-events-none absolute right-4 top-1/2 mt-2 text-sm font-bold text-[#b56d45] transition-transform group-focus-within:rotate-180" aria-hidden="true">⌄</span></label>;
}
