import { properties as referenceProperties, propertyTypeOptions, type Property, type PropertyPurpose } from "./properties";
import { resolveFacilityIds } from "./facilities";
import type { PropertyMedia } from "./propertyMedia";
import { getSupabaseClient } from "./supabase";

const formatPrice = (amount: number, period: string) => {
  const value = new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(amount);
  if (period === "sale") return `₦${value}`;
  return `₦${value} / ${period === "month" ? "month" : "year"}`;
};

const areaById: Record<string, string> = Object.fromEntries(
  referenceProperties.map((property) => [property.id, property.area]),
);

export const mapPropertyRow = (row: Record<string, unknown>): Property => {
  const priceValue = Number(row.price ?? 0);
  const period = String(row.price_period ?? "year");
  const id = String(row.id);
  const rawPropertyType = String(row.property_type ?? "Apartment");
  const propertyType = propertyTypeOptions.includes(rawPropertyType as (typeof propertyTypeOptions)[number])
    ? (rawPropertyType as (typeof propertyTypeOptions)[number])
    : "Apartment";
  const media: PropertyMedia[] = Array.isArray(row.media)
    ? row.media.filter((item: unknown): item is PropertyMedia => {
        if (!item || typeof item !== "object") return false;
        const entry = item as Partial<PropertyMedia>;
        return typeof entry.path === "string" && typeof entry.url === "string" &&
          (entry.kind === "image" || entry.kind === "video") && typeof entry.name === "string";
      })
    : [];
  const features = Array.isArray(row.features) ? row.features.map((feature: unknown) => String(feature)) : [];
  const facilities = resolveFacilityIds(row.facilities, features);

  return {
    id,
    title: String(row.title ?? "Untitled property"),
    purpose: (row.purpose === "sale" ? "sale" : "rent") as PropertyPurpose,
    propertyType,
    location: String(row.location ?? ""),
    city: String(row.city ?? ""),
    price: formatPrice(priceValue, period),
    priceValue,
    pricePeriod: period === "sale" ? "sale" : period === "month" ? "month" : "year",
    bedrooms: Number(row.bedrooms ?? 0),
    bathrooms: Number(row.bathrooms ?? 0),
    parking: row.parking ? "Parking" : "No parking",
    furnished: Boolean(row.furnished),
    serviced: Boolean(row.serviced),
    featured: Boolean(row.featured),
    area: areaById[id] ?? "N/A",
    image: String(row.image ?? ""),
    imageAlt: String(row.title ?? "Property image"),
    description: String(row.description ?? ""),
    features,
    facilities,
    media,
  };
};

export async function getProperties(): Promise<Property[]> {
  const client = getSupabaseClient();

  if (!client) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to load properties.",
    );
  }

  const { data, error } = await client.from("properties").select("*").order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load properties from Supabase: ${error.message}`);
  }

  if (!data) {
    return [];
  }

  return data.map(mapPropertyRow);
}

export async function getFeaturedProperties(limit = 4): Promise<Property[]> {
  const client = getSupabaseClient();

  if (!client) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to load properties.",
    );
  }

  const safeLimit = Math.max(1, Math.min(Math.floor(limit), 6));
  const { data, error } = await client
    .from("properties")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(safeLimit);

  if (error) {
    throw new Error(`Unable to load featured properties from Supabase: ${error.message}`);
  }

  return (data ?? []).map(mapPropertyRow);
}

export async function getPropertiesByPurpose(purpose: PropertyPurpose): Promise<Property[]> {
  const properties = await getProperties();
  return properties.filter((property) => property.purpose === purpose);
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const properties = await getProperties();
  return properties.find((property) => property.id === id) ?? null;
}
