export const PROPERTY_MEDIA_BUCKET = "haven-property-media";
export const MAX_PROPERTY_MEDIA_BYTES = 50 * 1024 * 1024;

export type PropertyMedia = {
  path: string;
  url: string;
  kind: "image" | "video";
  name: string;
};