import { facilityCatalogue, resolveFacilityIds } from "../../lib/facilities";

type PropertyFacilitiesProps = {
  facilities?: unknown;
  legacyFeatures?: string[];
};

export default function PropertyFacilities({ facilities, legacyFeatures = [] }: PropertyFacilitiesProps) {
  const selectedIds = new Set(resolveFacilityIds(facilities, legacyFeatures));
  const selectedFacilities = facilityCatalogue.filter((facility) => selectedIds.has(facility.id));
  if (selectedFacilities.length === 0) return null;

  return (
    <section className="mt-16 border-t border-[#dfe3e4] pt-12" aria-labelledby="property-facilities-heading">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b56d45]">Property</p>
      <h2 id="property-facilities-heading" className="mt-2 font-serif text-3xl text-[#162b3d]">Facilities</h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {selectedFacilities.map((facility) => {
          const Icon = facility.icon;
          return (
            <li key={facility.id} className="flex min-h-12 items-center gap-3 border border-[#dfe3e4] bg-white px-4 py-3 text-sm font-medium text-[#162b3d]">
              <Icon size={18} strokeWidth={1.8} className="shrink-0 text-[#b56d45]" aria-hidden="true" />
              <span>{facility.label}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}