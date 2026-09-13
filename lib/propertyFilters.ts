import type { Property, PropertyPurpose } from "./properties";

export type PropertyFilters = {
  location: string;
  propertyType: string;
  purpose: string;
  bedrooms: string;
  maxPrice: string;
  searchText: string;
};

const normalise = (value: string) => value.trim().toLowerCase();

export function filterProperties(properties: Property[], filters: PropertyFilters, pagePurpose?: PropertyPurpose) {
  const searchText = normalise(filters.searchText);
  const purpose = pagePurpose ?? (filters.purpose === "Buy" ? "sale" : filters.purpose === "Rent" ? "rent" : undefined);
  const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : undefined;

  return properties.filter((property) => {
    if (purpose && property.purpose !== purpose) return false;
    if (filters.location && !normalise(`${property.location}, ${property.city}`).includes(normalise(filters.location))) return false;
    if (filters.propertyType && property.propertyType !== filters.propertyType) return false;
    if (filters.bedrooms && property.bedrooms !== Number.parseInt(filters.bedrooms, 10)) return false;
    if (maxPrice !== undefined && property.priceValue > maxPrice) return false;

    if (searchText) {
      const searchableText = [property.title, property.location, property.city, property.propertyType, property.description, ...property.features].join(" ").toLowerCase();
      const searchTerms = searchText.split(/\s+/).filter(Boolean);
      if (!searchTerms.every((term) => searchableText.includes(term))) return false;
    }

    return true;
  });
}
