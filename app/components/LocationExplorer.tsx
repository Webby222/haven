"use client";

import { useState } from "react";

const locations = [
  { name: "Ugbowo", count: "24 properties", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1500&q=90", alt: "Bright apartment living room suitable for a Ugbowo flat" },
  { name: "GRA", count: "18 properties", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1500&q=90", alt: "Modern serviced apartment kitchen in GRA" },
  { name: "Airport Road", count: "32 properties", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1500&q=90", alt: "Contemporary gated duplex compound on Airport Road" },
  { name: "Sapele Road", count: "12 properties", image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1500&q=90", alt: "Compact modern flat interior near Sapele Road" },
  { name: "Ikpoba Hill", count: "9 properties", image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1500&q=90", alt: "Quiet apartment bedroom in Ikpoba Hill" },
  { name: "Ring Road", count: "16 properties", image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1500&q=90", alt: "Warm contemporary apartment around Ring Road" },
];

export default function LocationExplorer() {
  const [active, setActive] = useState(0);
  const location = locations[active];

  return (
    <section id="locations" className="bg-[#f2f0eb]" aria-labelledby="locations-heading">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#b56d45]">Explore by location</p><h2 id="locations-heading" className="max-w-sm font-serif text-5xl leading-none text-[#162b3d] sm:text-6xl">Find your part of the city.</h2><p className="mt-6 max-w-sm text-sm leading-7 text-[#667582]">From established neighbourhoods to new compounds, explore places with a different rhythm.</p></div>
          <div className="relative min-h-[400px] overflow-hidden bg-[#162b3d] sm:min-h-[520px]">
            {locations.map((item, index) => <img key={item.name} src={item.image} alt={item.alt} className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${active === index ? "scale-100 opacity-100" : "scale-105 opacity-0"}`} />)}
            <div className="absolute inset-0 bg-gradient-to-t from-[#162b3d]/90 via-transparent to-transparent" />
            <div className="absolute inset-x-6 bottom-6 flex items-end justify-between text-white sm:inset-x-8 sm:bottom-8"><div><p className="text-xs uppercase tracking-[0.15em] text-white/65">Currently exploring</p><h3 className="mt-2 font-serif text-4xl sm:text-5xl">{location.name}</h3><p className="mt-2 text-sm text-white/70">{location.count}</p></div><a href="#properties" className="hidden border-b border-[#e0a17b] pb-2 text-sm font-bold sm:block">View homes <span className="ml-3" aria-hidden="true">→</span></a></div>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 border-t border-[#cfd5d3] sm:grid-cols-3 lg:grid-cols-6">
          {locations.map((item, index) => <button type="button" key={item.name} onClick={() => setActive(index)} className={`border-b border-r border-[#cfd5d3] px-3 py-4 text-left text-sm transition-colors ${active === index ? "font-bold text-[#b56d45]" : "text-[#667582] hover:text-[#162b3d]"}`} aria-pressed={active === index}>{String(index + 1).padStart(2, "0")} <span className="ml-2">{item.name}</span></button>)}
        </div>
      </div>
    </section>
  );
}