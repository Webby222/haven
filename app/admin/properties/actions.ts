"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { propertyPurposeOptions, propertyTypeOptions } from "../../../lib/properties";
import { isFacilityId, type FacilityId } from "../../../lib/facilities";
import { PROPERTY_MEDIA_BUCKET, type PropertyMedia } from "../../../lib/propertyMedia";
import { requireHavenAdminClient } from "../../../lib/adminServer";

type PropertyInput = {
  title: string;
  purpose: (typeof propertyPurposeOptions)[number];
  property_type: (typeof propertyTypeOptions)[number];
  location: string;
  city: string;
  price: number;
  price_period: "sale" | "year" | "month";
  bedrooms: number;
  bathrooms: number;
  parking: boolean;
  furnished: boolean;
  serviced: boolean;
  featured: boolean;
  image: string;
  media: PropertyMedia[];
  facilities: FacilityId[];
  description: string;
};

function parsePropertyInput(formData: FormData): PropertyInput | null {
  const title = String(formData.get("title") ?? "").trim();
  const purpose = String(formData.get("purpose") ?? "");
  const propertyType = String(formData.get("propertyType") ?? "");
  const location = String(formData.get("location") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price"));
  const pricePeriod = String(formData.get("pricePeriod") ?? "");
  const bedrooms = Number(formData.get("bedrooms") || 0);
  const bathrooms = Number(formData.get("bathrooms") || 0);
  const image = String(formData.get("image") ?? "").trim();
  const submittedFacilities = formData.getAll("facilities").map((facility) => String(facility));
  if (submittedFacilities.some((facility) => !isFacilityId(facility))) return null;
  const facilities = [...new Set(submittedFacilities as FacilityId[])];
  const mediaText = String(formData.get("media") ?? "[]");
  let media: PropertyMedia[];

  try {
    const parsed: unknown = JSON.parse(mediaText);
    if (!Array.isArray(parsed) || parsed.length > 20) return null;
    media = parsed.filter((item: unknown): item is PropertyMedia => {
      if (!item || typeof item !== "object") return false;
      const entry = item as Partial<PropertyMedia>;
      return typeof entry.path === "string" && entry.path.startsWith("properties/") &&
        typeof entry.url === "string" && (entry.kind === "image" || entry.kind === "video") &&
        typeof entry.name === "string";
    });
    if (media.length !== parsed.length) return null;
  } catch {
    return null;
  }

  if (
    !title ||
    !propertyPurposeOptions.includes(purpose as PropertyInput["purpose"]) ||
    !propertyTypeOptions.includes(propertyType as PropertyInput["property_type"]) ||
    !location ||
    !city ||
    !description ||
    !Number.isFinite(price) ||
    price <= 0 ||
    !(purpose === "sale" ? pricePeriod === "sale" : pricePeriod === "year" || pricePeriod === "month") ||
    !Number.isInteger(bedrooms) || bedrooms < 0 ||
    !Number.isInteger(bathrooms) || bathrooms < 0
  ) {
    return null;
  }

  if (!image) return null;

  try {
    const imageUrl = new URL(image);
    if (imageUrl.protocol !== "https:" && imageUrl.protocol !== "http:") return null;
  } catch {
    return null;
  }

  return {
    title,
    purpose: purpose as PropertyInput["purpose"],
    property_type: propertyType as PropertyInput["property_type"],
    location,
    city,
    price,
    price_period: pricePeriod as PropertyInput["price_period"],
    bedrooms,
    bathrooms,
    parking: formData.get("parking") === "on",
    furnished: formData.get("furnished") === "on",
    serviced: formData.get("serviced") === "on",
    featured: formData.get("featured") === "on",
    image,
    media,
    facilities,
    description,
  };
}

function refreshPropertyPages(id?: string) {
  revalidatePath("/", "page");
  revalidatePath("/buy", "page");
  revalidatePath("/rent", "page");
  revalidatePath("/properties", "page");
  revalidatePath("/properties/[id]", "page");
  revalidatePath("/admin", "page");
  revalidatePath("/admin/properties", "page");
  if (id) revalidatePath(`/properties/${id}`);
}

function redirectWithDatabaseError(path: string, errorCode: "save" | "delete", error: unknown): never {
  const message = error instanceof Error
    ? error.message
    : typeof error === "object" && error !== null && "message" in error && typeof error.message === "string"
      ? error.message
      : "Unknown Supabase operation error.";
  const query = new URLSearchParams({ error: errorCode });

  if (process.env.NODE_ENV === "development") {
    query.set("detail", message.replace(/[\r\n\u0000-\u001f]/g, " ").slice(0, 300));
  }

  redirect(`${path}?${query.toString()}`);
}

function createPropertyId(title: string, city: string) {
  const slug = `${title}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70);

  return `${slug || "property"}-${randomUUID().slice(0, 8)}`;
}

export async function createPropertyAction(formData: FormData): Promise<void> {
  const supabase = await requireHavenAdminClient();
  const property = parsePropertyInput(formData);
  if (!property) redirect("/admin/properties/new?error=validation");

  const id = createPropertyId(property.title, property.city);
  let operationError: unknown;
  try {
    const { error } = await supabase.from("properties").insert({ id, ...property });
    operationError = error;
  } catch {
    operationError = new Error("Unable to reach Supabase while creating the property.");
  }

  if (operationError) redirectWithDatabaseError("/admin/properties/new", "save", operationError);

  refreshPropertyPages(id);
  redirect("/admin/properties?status=created");
}

export async function updatePropertyAction(id: string, formData: FormData): Promise<void> {
  const supabase = await requireHavenAdminClient();
  const property = parsePropertyInput(formData);
  if (!property) redirect(`/admin/properties/${encodeURIComponent(id)}/edit?error=validation`);

  let operationError: unknown;
  let removedMediaPaths: string[] = [];
  try {
    const { data: existing, error: readError } = await supabase
      .from("properties")
      .select("media")
      .eq("id", id)
      .maybeSingle();

    if (readError || !existing) {
      operationError = readError ?? new Error("No property row matched the supplied ID.");
    } else {
      const retainedPaths = new Set(property.media.map((item) => item.path));
      removedMediaPaths = (Array.isArray(existing.media) ? existing.media : [])
        .map((item: unknown) => item && typeof item === "object" && "path" in item && typeof item.path === "string" ? item.path : null)
        .filter((path: string | null): path is string => Boolean(path?.startsWith("properties/")) && !retainedPaths.has(path!));

      const { data, error } = await supabase
        .from("properties")
        .update(property)
        .eq("id", id)
        .select("id")
        .maybeSingle();
      operationError = error ?? (!data ? new Error("No property row matched the supplied ID.") : undefined);
    }
  } catch {
    operationError = new Error("Unable to reach Supabase while updating the property.");
  }

  if (operationError) redirectWithDatabaseError(`/admin/properties/${encodeURIComponent(id)}/edit`, "save", operationError);

  let mediaCleanupFailed = false;
  if (removedMediaPaths.length > 0) {
    try {
      const { error } = await supabase.storage.from(PROPERTY_MEDIA_BUCKET).remove(removedMediaPaths);
      mediaCleanupFailed = Boolean(error);
    } catch {
      mediaCleanupFailed = true;
    }
  }

  refreshPropertyPages(id);
  redirect(`/admin/properties?status=updated${mediaCleanupFailed ? "&warning=media-cleanup" : ""}`);
}

export async function deletePropertyAction(formData: FormData): Promise<void> {
  const supabase = await requireHavenAdminClient();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/properties?error=delete");

  let operationError: unknown;
  try {
    const { data, error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();
    operationError = error ?? (!data ? new Error("No property row matched the supplied ID.") : undefined);
  } catch {
    operationError = new Error("Unable to reach Supabase while deleting the property.");
  }

  if (operationError) redirectWithDatabaseError("/admin/properties", "delete", operationError);

  refreshPropertyPages(id);
  redirect("/admin/properties?status=deleted");
}