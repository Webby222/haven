import Footer from "../components/Footer";
import Header from "../components/Header";
import PropertiesBrowser from "../components/PropertiesBrowser";

export default function PropertiesPage() {
  return <div className="min-h-screen bg-[#fbfaf8] text-[#162b3d]"><Header /><main className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-24"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b56d45]">Haven property discovery</p><h1 className="mt-5 font-serif text-6xl leading-[0.94] tracking-[-0.03em] text-[#162b3d] sm:text-7xl">Explore properties.</h1><p className="mt-7 max-w-xl text-base leading-8 text-[#667582]">Browse homes, apartments and investment properties across locations that matter to you.</p></div><PropertiesBrowser /></main><Footer /></div>;
}