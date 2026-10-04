import PropertyCard from "./PropertyCard";
import PropertyStory from "./PropertyStory";
import Reveal from "./Reveal";
import { getFeaturedProperties } from "../../lib/propertyData";

function FeaturedSectionHeading() {
  return (
    <Reveal className="grid gap-6 border-b border-[#dfe3e4] pb-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
      <div>
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#b56d45]">Featured properties</p>
        <h2 id="featured-heading" className="max-w-xl font-serif text-4xl leading-[1.08] text-[#162b3d] sm:text-5xl">Spaces worth taking a closer look at.</h2>
      </div>
      <div className="flex items-end justify-between gap-6 lg:justify-end">
        <p className="max-w-sm text-sm leading-7 text-[#667582]">Handpicked homes and investment opportunities in the neighbourhoods people love most.</p>
        <a className="hidden whitespace-nowrap text-sm font-bold text-[#162b3d] underline decoration-[#c8825a] decoration-2 underline-offset-8 transition-colors hover:text-[#b56d45] sm:inline" href="#locations">Browse locations <span aria-hidden="true">→</span></a>
      </div>
    </Reveal>
  );
}

export function FeaturedPropertiesLoading() {
  return (
    <section id="properties" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28" aria-labelledby="featured-heading" aria-busy="true">
      <FeaturedSectionHeading />
      <p role="status" className="mt-8 text-sm text-[#667582]">Loading featured properties...</p>
      <div aria-hidden="true" className="mt-6 grid gap-7 md:grid-cols-3">{[0, 1, 2].map((item) => <div key={item} className="aspect-[4/3] animate-pulse border border-[#dfe3e4] bg-white" />)}</div>
    </section>
  );
}

export default async function FeaturedProperties() {
  let featuredProperties;
  try {
    featuredProperties = await getFeaturedProperties(4);
  } catch {
    return (
      <section id="properties" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28" aria-labelledby="featured-heading">
        <FeaturedSectionHeading />
        <p role="alert" className="mt-8 border border-[#dfe3e4] bg-white px-5 py-6 text-sm text-[#667582]">Featured properties could not be loaded right now. Please try again later.</p>
      </section>
    );
  }

  if (featuredProperties.length === 0) {
    return (
      <section id="properties" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28" aria-labelledby="featured-heading">
        <FeaturedSectionHeading />
        <p className="mt-8 border border-dashed border-[#cbd2d2] bg-white px-5 py-8 text-sm text-[#667582]">No featured properties are available right now. Please check back soon.</p>
      </section>
    );
  }

  const [spotlight, ...cardProperties] = featuredProperties;

  return (
    <>
      <PropertyStory property={spotlight} />
      <section id="properties" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28" aria-labelledby="featured-heading">
        <FeaturedSectionHeading />
        {cardProperties.length > 0 ? (
          <div className="mt-10 grid gap-7 md:grid-cols-12">
            {cardProperties.map((property, index) => (
              <Reveal key={property.id} delay={index * 100} className={index === 0 ? "md:col-span-7" : "md:col-span-5"}>
                <PropertyCard
                  property={{
                    title: property.title,
                    location: `${property.location}, ${property.city}`,
                    price: property.price,
                    details: [`${property.bedrooms} beds`, `${property.bathrooms} baths`, property.area !== "N/A" ? property.area : null].filter(Boolean).join(" · "),
                    type: property.propertyType,
                    image: property.image,
                    imageAlt: property.imageAlt,
                  }}
                  className={index === 0 ? "h-full" : ""}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-[#667582]">The featured property is highlighted above.</p>
        )}
      </section>
    </>
  );
}