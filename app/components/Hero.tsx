import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section id="home" className="bg-white" aria-labelledby="hero-heading">
      <div className="mx-auto grid max-w-7xl gap-0 px-6 py-8 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-12">
        <div className="haven-hero-copy flex flex-col justify-center bg-[#f2f0eb] px-7 py-14 sm:px-12 sm:py-20 lg:-mr-10 lg:px-14 lg:py-24">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.22em] text-[#b56d45]">Property, thoughtfully found</p>
          <h1 id="hero-heading" className="max-w-xl font-serif text-[clamp(3.5rem,7vw,7rem)] leading-[0.92] tracking-[-0.03em] text-[#162b3d]"><span className="block">Find a place</span><span className="block">you&apos;ll love</span><span className="block">to call home.</span></h1>
          <p className="mt-7 max-w-md text-base leading-8 text-[#667582]">Discover homes and properties that fit your lifestyle, location and budget.</p>
          <a href="#properties" className="mt-9 inline-flex items-center text-sm font-bold text-[#162b3d] underline decoration-[#c8825a] decoration-2 underline-offset-8">Explore featured properties <span className="ml-3" aria-hidden="true">→</span></a>
        </div>
        <div className="haven-hero-image relative min-h-[380px] overflow-hidden bg-[#162b3d] sm:min-h-[500px] lg:min-h-[600px]">
          <img src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=90" alt="Contemporary Nigerian-style residential compound with a modern duplex" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#162b3d]/10" />
        </div>
      </div>
      <div className="haven-hero-copy relative z-10 mx-auto max-w-7xl px-6 pb-12 sm:px-8 lg:-mt-20 lg:px-12 lg:pb-0"><SearchBar /></div>
    </section>
  );
}