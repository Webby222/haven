"use client";

import Link from "next/link";
import { useState } from "react";
import type { Property } from "../../lib/properties";
import Reveal from "./Reveal";

export default function PropertyGrid({ properties }: { properties: Property[] }) {
  const [favourites, setFavourites] = useState<string[]>([]);

  const toggleFavourite = (id: string) => setFavourites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  return <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {properties.map((property, index) => <Reveal key={property.id} delay={(index % 3) * 90}>
      <article className="group relative overflow-hidden rounded-[4px] border border-[#dfe3e4] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#c6d0d0] hover:shadow-[0_16px_34px_rgba(22,43,61,0.1)]">
        <Link href="/properties" className="block" aria-label={`View ${property.title} in ${property.location}`}>
          <div className="relative aspect-[1.18/1] overflow-hidden bg-[#e8ecec]">
            <img src={property.image} alt={property.imageAlt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
            <span className="absolute bottom-4 left-4 bg-white/95 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#162b3d]">{property.propertyType}</span>
          </div>
          <div className="p-5 sm:p-6">
            <p className="text-xs font-medium text-[#71808c]">{property.location}</p>
            <h2 className="mt-2 font-serif text-2xl leading-tight text-[#162b3d]">{property.title}</h2>
            <p className="mt-4 text-lg font-bold text-[#b56d45]">{property.price}</p>
            <div className="mt-5 flex items-center gap-4 border-t border-[#e5e9ea] pt-4 text-xs text-[#71808c]"><span>{property.bedrooms} Bedrooms</span><span>{property.bathrooms} Bathrooms</span><span>{property.parking}</span></div>
            <p className="mt-2 text-xs text-[#8b99a3]">{property.area} <span className="float-right text-sm text-[#b56d45] transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span></p>
          </div>
        </Link>
        <button type="button" aria-label={favourites.includes(property.id) ? `Remove ${property.title} from favourites` : `Add ${property.title} to favourites`} aria-pressed={favourites.includes(property.id)} onClick={() => toggleFavourite(property.id)} className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border text-lg transition ${favourites.includes(property.id) ? "border-[#b56d45] bg-[#b56d45] text-white" : "border-white/70 bg-white/90 text-[#162b3d] hover:border-[#b56d45] hover:text-[#b56d45]"}`}><span aria-hidden="true">{favourites.includes(property.id) ? "♥" : "♡"}</span></button>
      </article>
    </Reveal>)}
  </div>;
}