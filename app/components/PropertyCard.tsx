export type Property = {
  title: string;
  location: string;
  price: string;
  details: string;
  type: string;
  image: string;
  imageAlt: string;
};

export default function PropertyCard({ property, className = "" }: { property: Property; className?: string }) {
  return (
    <article className={`group overflow-hidden rounded-[4px] border border-[#dfe3e4] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(22,43,61,0.1)] ${className}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-[#e8ecec]">
        {/* External images keep this first phase dependency-free; next/image can be added with image hosting later. */}
        <img src={property.image} alt={property.imageAlt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
      </div>
      <div className="p-5 sm:p-6">
        <p className="text-xs font-medium text-[#71808c]">{property.type} · {property.location}</p>
        <h3 className="mt-2 font-serif text-2xl text-[#162b3d]">{property.title}</h3>
        <div className="mt-5 border-t border-[#e5e9ea] pt-4 text-sm">
          <p className="font-bold text-[#b56d45]">{property.price}</p>
          <p className="mt-2 text-xs text-[#71808c]">{property.details}</p>
        </div>
      </div>
    </article>
  );
}