"use client";

export type SearchValues = {
  location: string;
  propertyType: string;
  purpose: string;
  bedrooms: string;
  budget: string;
};

const fields: Array<{ key: keyof SearchValues; label: string; values: string[] }> = [
  { key: "location", label: "Location", values: ["Ugbowo, Benin City", "GRA, Benin City", "Airport Road, Benin City", "Lekki, Lagos", "Ikeja, Lagos", "Abuja"] },
  { key: "propertyType", label: "Property type", values: ["2 Bedroom Flat", "3 Bedroom Flat", "Mini Flat", "Serviced Apartment", "Duplex"] },
  { key: "purpose", label: "Purpose", values: ["Rent", "Buy"] },
  { key: "bedrooms", label: "Bedrooms", values: ["1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4 Bedrooms"] },
  { key: "budget", label: "Budget", values: ["Under ₦1m / year", "₦1m – ₦2m / year", "₦2m – ₦4m / year", "₦4m+ / year"] },
];

export default function PropertySearch({ values, onChange }: { values: SearchValues; onChange: (values: SearchValues) => void }) {
  return (
    <form className="border border-[#d5d9d6] bg-white p-4 shadow-[0_12px_35px_rgba(22,43,61,0.08)] sm:p-5" onSubmit={(event) => event.preventDefault()}>
      <div className="mb-5 flex flex-col gap-2 border-b border-[#e3e6e4] pb-4 sm:flex-row sm:items-center sm:justify-between"><span className="text-sm font-bold text-[#162b3d]">Find your next place</span><span className="text-xs text-[#7b8890]">Search homes across Nigeria</span></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.1fr_0.8fr_0.9fr_1.1fr_auto] lg:items-end">
        {fields.map((field) => <label key={field.key} className="group relative flex min-h-[72px] cursor-pointer flex-col justify-center rounded-[3px] border border-[#cbd5d6] bg-[#fcfdfc] px-4 py-2 transition duration-200 hover:-translate-y-px hover:border-[#9eadaf] hover:bg-white focus-within:border-[#b56d45] focus-within:shadow-[0_5px_16px_rgba(22,43,61,0.08)] lg:px-4">
          <span className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#71808c]">{field.label}</span>
          <select value={values[field.key]} onChange={(event) => onChange({ ...values, [field.key]: event.target.value })} className="w-full cursor-pointer appearance-none bg-transparent pr-6 text-sm font-semibold text-[#162b3d] outline-none">
            <option value="">Any {field.label.toLowerCase()}</option>
            {field.values.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 mt-2 text-sm font-bold text-[#b56d45] transition-transform group-focus-within:rotate-180" aria-hidden="true">⌄</span>
        </label>)}
        <button type="submit" className="min-h-[54px] cursor-pointer bg-[#b56d45] px-7 text-sm font-bold text-white shadow-[0_6px_14px_rgba(181,109,69,0.2)] transition duration-200 hover:-translate-y-px hover:bg-[#162b3d] hover:shadow-[0_8px_18px_rgba(22,43,61,0.18)] active:translate-y-px">Search <span className="ml-2" aria-hidden="true">→</span></button>
      </div>
    </form>
  );
}