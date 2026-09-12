const fields = [
  { label: "Location", placeholder: "Ugbowo, Benin City", options: [] },
  { label: "Purpose", placeholder: "Rent", options: ["Buy", "Rent"] },
  { label: "Property", placeholder: "2 Bedroom Flat", options: ["2 Bedroom Flat", "Mini Flat", "Serviced Apartment"] },
  { label: "Bedrooms", placeholder: "2 bedrooms", options: ["1 bedroom", "2 bedrooms", "3 bedrooms", "4+ bedrooms"] },
  { label: "Budget", placeholder: "₦1m – ₦2m / year", options: ["Under ₦1m / year", "₦1m – ₦2m / year", "₦2m+ / year"] },
] as const;

export default function SearchBar() {
  return (
    <form className="border border-[#d5d9d6] bg-white p-4 shadow-[0_12px_35px_rgba(22,43,61,0.1)] lg:p-5">
      <div className="mb-4 flex items-center justify-between border-b border-[#e3e6e4] pb-4"><span className="text-sm font-bold text-[#162b3d]">Find your next place</span><span className="text-xs text-[#7b8890]">Search homes across Benin City</span></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_0.85fr_1fr_auto] lg:items-end">
        {fields.map((field, index) => <label key={field.label} className="group flex min-h-[60px] flex-col justify-center border-b border-[#d6dee2] px-3 py-2 transition-colors focus-within:border-[#b56d45] lg:border-b-0 lg:border-r lg:px-4">
          <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8b99a3]">{field.label}</span>
          {index === 0 ? <input aria-label={field.label} defaultValue={field.placeholder} className="w-full bg-transparent text-sm text-[#162b3d] outline-none placeholder:text-[#162b3d]" /> : <select aria-label={field.label} defaultValue={field.placeholder} className="w-full appearance-none bg-transparent text-sm text-[#162b3d] outline-none"><option value={field.placeholder}>{field.placeholder}</option>{field.options.map((option) => <option key={option}>{option}</option>)}</select>}
        </label>)}
        <button type="submit" className="min-h-[52px] bg-[#b56d45] px-6 text-sm font-bold text-white transition-colors hover:bg-[#162b3d]">Search</button>
      </div>
    </form>
  );
}