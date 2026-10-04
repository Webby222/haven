import Reveal from "./Reveal";
import Link from "next/link";
import type { Property } from "../../lib/properties";

export default function PropertyStory({ property }: { property: Property }) {
  const features = [`${property.bedrooms} Bedrooms`, `${property.bathrooms} Bathrooms`, property.parking, property.propertyType];

  return (
    <section className="bg-[#162b3d] text-white" aria-labelledby="story-heading">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:px-12 lg:py-32">
        <div className="lg:sticky lg:top-28 lg:h-[calc(100vh-9rem)] lg:min-h-[620px]">
          <div className="group relative h-full min-h-[440px] overflow-hidden bg-[#274256] sm:min-h-[580px]">
            <img src={property.image} alt={property.imageAlt} className="h-full w-full object-cover transition duration-[1200ms] group-hover:scale-[1.04]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#162b3d]/70 via-transparent to-transparent" />
            <span className="absolute left-5 top-5 border border-white/50 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white">Featured property</span>
            <p className="absolute bottom-6 left-6 text-sm text-white/80">{property.location}, {property.city}</p>
          </div>
        </div>
        <div className="flex flex-col justify-center py-4 lg:py-20">
          <Reveal><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e0a17b]">The featured property</p></Reveal>
          <Reveal delay={90}><h2 id="story-heading" className="mt-5 max-w-lg font-serif text-5xl leading-[0.98] tracking-[-0.02em] sm:text-6xl">{property.title}</h2></Reveal>
          <Reveal delay={180}><p className="mt-7 max-w-md text-base leading-8 text-white/65">{property.description}</p></Reveal>
          <Reveal delay={260}><p className="mt-10 font-serif text-3xl text-[#e0a17b]">{property.price}</p></Reveal>
          <Reveal delay={340} className="mt-10 grid max-w-md grid-cols-2 border-y border-white/15 py-5 sm:grid-cols-4">
            {features.map((feature) => <div key={feature} className="border-r border-white/15 px-3 py-1 first:pl-0 last:border-0"><p className="text-xs leading-5 text-white/65">{feature}</p></div>)}
          </Reveal>
          <Reveal delay={420}><Link href={`/properties/${encodeURIComponent(property.id)}`} className="mt-10 inline-flex items-center self-start border-b border-[#e0a17b] pb-2 text-sm font-bold text-white transition-colors hover:text-[#e0a17b]">View property details <span className="ml-4" aria-hidden="true">→</span></Link></Reveal>
        </div>
      </div>
    </section>
  );
}