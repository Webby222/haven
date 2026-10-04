import type { PropertyMedia } from "../../lib/propertyMedia";

type PropertyMediaGalleryProps = {
  media: PropertyMedia[];
  coverImage: string;
};

export default function PropertyMediaGallery({ media, coverImage }: PropertyMediaGalleryProps) {
  const gallery = media.filter((item) => item.url !== coverImage);
  if (gallery.length === 0) return null;

  return (
    <section className="mt-16 border-t border-[#dfe3e4] pt-10" aria-labelledby="property-gallery-heading">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b56d45]">Property gallery</p>
      <h2 id="property-gallery-heading" className="mt-2 font-serif text-3xl text-[#162b3d]">More views</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((item) => (
          <figure key={item.path} className="overflow-hidden bg-[#e8ecec]">
            {item.kind === "video" ? (
              <video src={item.url} controls playsInline preload="metadata" aria-label={item.name} className="aspect-[4/3] h-full w-full object-cover" />
            ) : (
              <img src={item.url} alt={item.name} loading="lazy" className="aspect-[4/3] h-full w-full object-cover" />
            )}
            <figcaption className="px-3 py-2 text-xs text-[#667582]">{item.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}