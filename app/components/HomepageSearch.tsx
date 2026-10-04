import { getProperties } from "../../lib/propertyData";
import SearchBar from "./SearchBar";

export function HomepageSearchLoading() {
  return <div role="status" aria-busy="true" className="min-h-[160px] border border-[#d5d9d6] bg-white p-5 text-sm text-[#667582]">Loading property search...</div>;
}

async function loadSearchOptions() {
  try {
    const properties = await getProperties();
    return {
      locationOptions: [...new Set(properties.map((property) => `${property.location}, ${property.city}`))],
      propertyTypeOptions: [...new Set(properties.map((property) => property.propertyType))],
      errorMessage: undefined,
    };
  } catch {
    return {
      locationOptions: [],
      propertyTypeOptions: [],
      errorMessage: "Property filters are unavailable right now. You can still search by keyword.",
    };
  }
}

export default async function HomepageSearch() {
  const { locationOptions, propertyTypeOptions, errorMessage } = await loadSearchOptions();
  return <SearchBar locationOptions={locationOptions} propertyTypeOptions={propertyTypeOptions} errorMessage={errorMessage} />;
}