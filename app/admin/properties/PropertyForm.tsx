"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { Property } from "../../../lib/properties";
import { propertyPurposeOptions, propertyTypeOptions } from "../../../lib/properties";
import { facilityCatalogue, facilityCategories, resolveFacilityIds, type FacilityId } from "../../../lib/facilities";
import { MAX_PROPERTY_MEDIA_BYTES, PROPERTY_MEDIA_BUCKET, type PropertyMedia } from "../../../lib/propertyMedia";
import { getSupabaseBrowserClient } from "../../../lib/supabaseBrowser";

type PropertyFormProps = {
  action: (formData: FormData) => Promise<void>;
  property?: Property;
  error?: string;
  detail?: string;
};

const allowedMediaTypes = new Set([
  "image/jpeg", "image/png", "image/webp", "image/avif",
  "video/mp4", "video/webm", "video/quicktime",
]);

function makeMediaPath(file: File) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(-100);
  return `properties/${crypto.randomUUID()}-${safeName || "media"}`;
}

export default function PropertyForm({ action, property, error, detail }: PropertyFormProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [pendingMessage, setPendingMessage] = useState("Saving...");
  const [galleryMedia, setGalleryMedia] = useState<PropertyMedia[]>(() => property?.media ?? []);
  const [selectedFacilities, setSelectedFacilities] = useState<FacilityId[]>(() => resolveFacilityIds(property?.facilities, property?.features));
  const existingMedia = property?.media ?? [];
  const managedCoverImage = Boolean(property && existingMedia.some((item) => item.url === property.image));

  const initialError = error === "validation"
    ? "Check the required fields and price period. Upload at least one photo for a new property."
    : error === "save"
      ? "The property could not be saved. Check database access and try again."
      : null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const files = formData.getAll("mediaFiles").filter((value): value is File => value instanceof File && value.size > 0);
    const maxFiles = 20 - galleryMedia.length;

    if (files.length > maxFiles) {
      setUploadError(`A property can have up to 20 media files. This one can accept ${maxFiles} more.`);
      return;
    }

    if (!property && !files.some((file) => file.type.startsWith("image/"))) {
      setUploadError("Upload at least one photo. A property needs a cover photo.");
      return;
    }

    const invalidFile = files.find((file) => !allowedMediaTypes.has(file.type) || file.size > MAX_PROPERTY_MEDIA_BYTES);
    if (invalidFile) {
      setUploadError(`${invalidFile.name} is unsupported or exceeds the 50 MB per-file limit.`);
      return;
    }

    setUploadError(null);
    setPending(true);
    setPendingMessage(files.length ? "Uploading media..." : "Saving...");

    const uploaded: PropertyMedia[] = [];
    let supabase: ReturnType<typeof getSupabaseBrowserClient> | null = null;

    try {
      if (files.length > 0) supabase = getSupabaseBrowserClient();
      for (const file of files) {
        if (!supabase) throw new Error("Supabase media upload is unavailable.");
        const path = makeMediaPath(file);
        const { error: uploadErrorResult } = await supabase.storage
          .from(PROPERTY_MEDIA_BUCKET)
          .upload(path, file, { cacheControl: "3600", contentType: file.type, upsert: false });

        if (uploadErrorResult) throw uploadErrorResult;

        const { data } = supabase.storage.from(PROPERTY_MEDIA_BUCKET).getPublicUrl(path);
        uploaded.push({
          path,
          url: data.publicUrl,
          kind: file.type.startsWith("video/") ? "video" : "image",
          name: file.name,
        });
      }
    } catch (uploadFailure) {
      if (supabase && uploaded.length) {
        await supabase.storage.from(PROPERTY_MEDIA_BUCKET).remove(uploaded.map((item) => item.path));
      }
      const message = uploadFailure instanceof Error ? uploadFailure.message : "The media upload failed.";
      setUploadError(`Supabase media upload failed: ${message}`);
      setPending(false);
      return;
    }

    const media = [...galleryMedia, ...uploaded];
    const coverImage = media.find((item) => item.kind === "image")?.url ?? (managedCoverImage ? "" : property?.image ?? "");
    if (!coverImage) {
      setUploadError("Upload at least one photo. A property needs a cover photo.");
      setPending(false);
      return;
    }

    formData.delete("mediaFiles");
    formData.delete("facilities");
    selectedFacilities.forEach((facility) => formData.append("facilities", facility));
    formData.set("media", JSON.stringify(media));
    formData.set("image", coverImage);
    setPendingMessage("Saving property...");
    await action(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      {initialError && (
        <div role="alert" className="border border-[#d8b7a6] bg-white px-4 py-3 text-sm text-[#7e4930]">
          <p>{initialError}</p>
          {error === "save" && detail && process.env.NODE_ENV === "development" && (
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs">Supabase: {detail}</pre>
          )}
        </div>
      )}
      {uploadError && <p role="alert" className="border border-[#d8b7a6] bg-white px-4 py-3 text-sm text-[#7e4930]">{uploadError}</p>}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-semibold md:col-span-2">
          Title <span aria-hidden="true">*</span>
          <input name="title" required maxLength={160} defaultValue={property?.title ?? ""} className="mt-2 min-h-11 w-full border border-[#cbd2d2] bg-white px-3 font-normal outline-none focus:border-[#b56d45]" />
        </label>
        <label className="text-sm font-semibold">
          Purpose <span aria-hidden="true">*</span>
          <select name="purpose" required defaultValue={property?.purpose ?? "rent"} className="mt-2 min-h-11 w-full border border-[#cbd2d2] bg-white px-3 font-normal">
            {propertyPurposeOptions.map((purpose) => <option key={purpose} value={purpose}>{purpose === "sale" ? "Sale" : "Rent"}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Property type <span aria-hidden="true">*</span>
          <select name="propertyType" required defaultValue={property?.propertyType ?? "Apartment"} className="mt-2 min-h-11 w-full border border-[#cbd2d2] bg-white px-3 font-normal">
            {propertyTypeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Location <span aria-hidden="true">*</span>
          <input name="location" required maxLength={120} defaultValue={property?.location ?? ""} className="mt-2 min-h-11 w-full border border-[#cbd2d2] bg-white px-3 font-normal outline-none focus:border-[#b56d45]" />
        </label>
        <label className="text-sm font-semibold">
          City <span aria-hidden="true">*</span>
          <input name="city" required maxLength={120} defaultValue={property?.city ?? ""} className="mt-2 min-h-11 w-full border border-[#cbd2d2] bg-white px-3 font-normal outline-none focus:border-[#b56d45]" />
        </label>
        <label className="text-sm font-semibold">
          Price <span aria-hidden="true">*</span>
          <input name="price" type="number" min="0.01" step="0.01" required defaultValue={property?.priceValue ?? ""} className="mt-2 min-h-11 w-full border border-[#cbd2d2] bg-white px-3 font-normal outline-none focus:border-[#b56d45]" />
        </label>
        <label className="text-sm font-semibold">
          Price period <span aria-hidden="true">*</span>
          <select name="pricePeriod" required defaultValue={property?.pricePeriod ?? "year"} className="mt-2 min-h-11 w-full border border-[#cbd2d2] bg-white px-3 font-normal">
            <option value="sale">One-time price</option>
            <option value="month">Per month</option>
            <option value="year">Per year</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Bedrooms
          <input name="bedrooms" type="number" min="0" step="1" defaultValue={property?.bedrooms ?? 0} className="mt-2 min-h-11 w-full border border-[#cbd2d2] bg-white px-3 font-normal outline-none focus:border-[#b56d45]" />
        </label>
        <label className="text-sm font-semibold">
          Bathrooms
          <input name="bathrooms" type="number" min="0" step="1" defaultValue={property?.bathrooms ?? 0} className="mt-2 min-h-11 w-full border border-[#cbd2d2] bg-white px-3 font-normal outline-none focus:border-[#b56d45]" />
        </label>
        <div className="text-sm font-semibold md:col-span-2">
          <label htmlFor="property-media">Photos and videos <span aria-hidden="true">*</span></label>
          <input id="property-media" name="mediaFiles" type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime" className="mt-2 block min-h-11 w-full border border-[#cbd2d2] bg-white px-3 py-2 font-normal file:mr-3 file:border-0 file:bg-[#eef0ee] file:px-3 file:py-1" />
          <p className="mt-2 text-xs font-normal text-[#667582]">Up to 20 files, 50 MB each. Additional gallery media appears on the property detail page; the first photo is used for listing cards.</p>
          {property?.image && <p className="mt-2 text-xs font-normal text-[#667582]">The current cover photo will remain unless a new photo is uploaded.</p>}
          {galleryMedia.length > 0 && <p className="mt-1 text-xs font-normal text-[#667582]">{galleryMedia.length} existing gallery file{galleryMedia.length === 1 ? "" : "s"} will be kept.</p>}
          {galleryMedia.length > 0 && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galleryMedia.map((item) => (
                <figure key={item.path} className="overflow-hidden border border-[#dfe3e4] bg-white">
                  {item.kind === "video" ? (
                    <video src={item.url} controls playsInline preload="metadata" aria-label={item.name} className="aspect-[4/3] w-full object-cover" />
                  ) : (
                    <img src={item.url} alt={item.name} className="aspect-[4/3] w-full object-cover" />
                  )}
                  <figcaption className="flex items-center justify-between gap-3 px-3 py-2 text-xs text-[#667582]">
                    <span className="min-w-0 truncate">{item.name}</span>
                    <button type="button" disabled={pending} onClick={() => setGalleryMedia((current) => current.filter((media) => media.path !== item.path))} className="shrink-0 font-semibold text-[#9a4f39] underline-offset-4 hover:underline disabled:opacity-60">
                      Remove
                    </button>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
        <label className="text-sm font-semibold md:col-span-2">
          Description <span aria-hidden="true">*</span>
          <textarea name="description" required rows={5} defaultValue={property?.description ?? ""} className="mt-2 w-full border border-[#cbd2d2] bg-white px-3 py-2 font-normal outline-none focus:border-[#b56d45]" />
        </label>
        <fieldset className="space-y-5 md:col-span-2">
          <legend className="text-sm font-semibold">Facilities</legend>
          {facilityCategories.map((category) => (
            <div key={category}>
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#667582]">{category}</h2>
              <div className="flex flex-wrap gap-2">
                {facilityCatalogue.filter((facility) => facility.category === category).map((facility) => {
                  const Icon = facility.icon;
                  const selected = selectedFacilities.includes(facility.id);
                  return (
                    <label key={facility.id} className={`inline-flex min-h-10 cursor-pointer items-center gap-2 border px-3 py-2 text-xs font-semibold transition focus-within:ring-2 focus-within:ring-[#b56d45] ${selected ? "border-[#b56d45] bg-[#fbf3ee] text-[#7c4b31]" : "border-[#cbd2d2] bg-white text-[#526575] hover:border-[#b56d45]"}`}>
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => setSelectedFacilities((current) => selected ? current.filter((id) => id !== facility.id) : [...current, facility.id])}
                        className="sr-only"
                      />
                      <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                      <span>{facility.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
          <p className="text-xs text-[#667582]">{selectedFacilities.length} selected</p>
        </fieldset>
      </div>

      <fieldset className="flex flex-wrap gap-x-8 gap-y-4 border-t border-[#dfe3e4] pt-6">
        <legend className="sr-only">Property options</legend>
        {([
          ["parking", "Parking", property?.parking === "Parking"],
          ["furnished", "Furnished", property?.furnished ?? false],
          ["serviced", "Serviced", property?.serviced ?? false],
          ["featured", "Featured", property?.featured ?? false],
        ] as const).map(([name, label, checked]) => (
          <label key={name} className="inline-flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" name={name} defaultChecked={checked} className="h-4 w-4 accent-[#b56d45]" />
            {label}
          </label>
        ))}
      </fieldset>

      <div className="flex flex-wrap items-center gap-3 border-t border-[#dfe3e4] pt-6">
        <button type="submit" disabled={pending} className="min-h-11 bg-[#162b3d] px-5 text-sm font-bold text-white transition hover:bg-[#b56d45] disabled:cursor-wait disabled:opacity-60">
          {pending ? pendingMessage : property ? "Save changes" : "Create property"}
        </button>
        <Link href="/admin/properties" className="inline-flex min-h-11 items-center border border-[#cbd2d2] bg-white px-5 text-sm font-semibold">Cancel</Link>
      </div>
    </form>
  );
}