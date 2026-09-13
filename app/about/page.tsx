import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Reveal from "../components/Reveal";

const locations = [
  ["Benin City", "Ugbowo, GRA, Airport Road", "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=88"],
  ["Lagos", "Lekki, Ikeja and beyond", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=88"],
  ["Abuja", "Maitama and growing estates", "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=88"],
  ["Port Harcourt", "Old GRA and city living", "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1000&q=88"],
  ["Ibadan", "Jericho and established neighbourhoods", "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=88"],
];

const steps = [
  ["01", "Discover", "Explore properties based on where you want to live and what you need."],
  ["02", "Explore", "Look through property details, images, pricing, location and features."],
  ["03", "Enquire", "When something feels right, contact the relevant property representative."],
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf8] text-[#162b3d]">
      <Header />
      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:px-12 lg:py-28">
          <Reveal className="pb-6">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b56d45]">HAVEN / PROPERTY DISCOVERY</p>
            <h1 className="mt-6 max-w-2xl font-serif text-6xl leading-[0.9] tracking-[-0.04em] sm:text-8xl">A better way to find where you belong.</h1>
            <p className="mt-8 max-w-lg text-base leading-8 text-[#667582]">HAVEN is built to make discovering homes and properties across Nigeria simpler, clearer and more human.</p>
          </Reveal>
          <Reveal delay={140} className="relative min-h-[440px] overflow-hidden sm:min-h-[650px]">
            <img src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=90" alt="Modern Nigerian-style duplex with a spacious residential compound" className="haven-image-reveal h-full w-full object-cover" />
            <span className="absolute bottom-6 left-6 border-l-2 border-[#e0a17b] pl-4 text-sm text-white">A place to start from.</span>
          </Reveal>
        </section>

        <section className="border-y border-[#dfe3e4] bg-[#f2f0eb]">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-12 lg:py-32">
            <Reveal><h2 className="max-w-3xl font-serif text-5xl leading-[0.98] tracking-[-0.03em] sm:text-7xl">Finding a home should feel exciting. Not exhausting.</h2></Reveal>
            <Reveal delay={120}><p className="max-w-md text-base leading-8 text-[#667582]">Property discovery can mean scattered listings, unclear information, repetitive searches and uncertainty about whether a place actually fits. HAVEN is designed around a simpler rhythm: discover, explore, compare, enquire.</p></Reveal>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:px-12 lg:py-32">
          <Reveal className="lg:sticky lg:top-32 lg:self-start"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b56d45]">Why we built HAVEN</p><h2 className="mt-5 max-w-sm font-serif text-5xl leading-tight sm:text-6xl">A clearer view of the places that matter.</h2></Reveal>
          <div className="space-y-14">
            <Reveal><p className="max-w-2xl text-2xl leading-relaxed text-[#465965] sm:text-3xl">HAVEN is for people searching for homes and property opportunities in Nigerian cities, whether the next step is a flat, a duplex, an estate or a place with just enough room for the life ahead.</p></Reveal>
            <Reveal delay={100} className="grid gap-8 border-t border-[#dfe3e4] pt-8 sm:grid-cols-2"><div><h3 className="font-serif text-3xl">Useful by default</h3><p className="mt-4 text-sm leading-7 text-[#667582]">Easier discovery, clearer property information and better visual presentation help people spend less time piecing together the basics.</p></div><div><h3 className="font-serif text-3xl">Grounded in place</h3><p className="mt-4 text-sm leading-7 text-[#667582]">Location-focused exploration keeps the search close to neighbourhoods, budgets and the realities of Nigerian city life.</p></div></Reveal>
          </div>
        </section>

        <section className="bg-[#162b3d] text-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 lg:py-28">
            <Reveal><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e0a17b]">Built for Nigeria</p><h2 className="mt-5 max-w-md font-serif text-5xl leading-tight sm:text-6xl">Built around the way Nigeria lives.</h2></Reveal>
            <Reveal delay={120}><p className="max-w-2xl text-xl leading-9 text-white/70">From Apartments and Flats to Mini Flats, Self Contains, Duplexes, Serviced Apartments and Estates, the right property takes different forms. HAVEN brings that range together across <span className="text-white">Benin City · Lagos · Abuja · Port Harcourt · Ibadan</span>.</p><div className="mt-12 border-t border-white/15 pt-6 text-sm uppercase tracking-[0.16em] text-white/55">Apartments / Flats / Mini Flats / Duplexes / Estates</div></Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28" aria-labelledby="how-heading">
          <Reveal><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b56d45]">The HAVEN rhythm</p><h2 id="how-heading" className="mt-4 font-serif text-5xl sm:text-6xl">How discovery works.</h2></Reveal>
          <div className="mt-14 grid gap-10 border-t border-[#dfe3e4] pt-8 md:grid-cols-3 md:gap-8">{steps.map(([number, title, text], index) => <Reveal key={number} delay={index * 100}><span className="font-serif text-6xl text-[#b56d45]/45">{number}</span><h3 className="mt-8 font-serif text-3xl">{title}</h3><p className="mt-4 max-w-xs text-sm leading-7 text-[#667582]">{text}</p></Reveal>)}</div>
        </section>

        <section className="border-y border-[#dfe3e4] bg-[#f2f0eb]">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-12 lg:py-28">
            <Reveal><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b56d45]">The search experience</p><h2 className="mt-4 font-serif text-5xl leading-tight sm:text-6xl">Start with what you need.</h2></Reveal>
            <Reveal delay={120} className="border border-[#d5d9d6] bg-white p-6 sm:p-9"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#71808c]">Describe the place in your words</p><p className="mt-6 font-serif text-3xl leading-tight text-[#162b3d] sm:text-4xl">“I need a modern 2 bedroom apartment in Ugbowo under ₦1.5m per year.”</p><p className="mt-6 max-w-lg text-sm leading-7 text-[#667582]">The experience is designed to make it easier to express what you are actually looking for, before you narrow down the details.</p></Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28" aria-labelledby="locations-heading">
          <Reveal><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b56d45]">Where we look</p><h2 id="locations-heading" className="mt-4 max-w-2xl font-serif text-5xl leading-tight sm:text-6xl">Properties shaped by their places.</h2></Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{locations.map(([name, detail, image], index) => <Reveal key={name} delay={index * 70}><div className="group relative min-h-64 overflow-hidden rounded-[4px] bg-[#162b3d]"><img src={image} alt={`${name} residential property setting`} className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105 group-hover:opacity-95" /><div className="absolute inset-0 bg-gradient-to-t from-[#162b3d]/90 via-transparent to-transparent" /><div className="absolute inset-x-5 bottom-5 text-white transition-transform duration-300 group-hover:-translate-y-1"><h3 className="font-serif text-3xl">{name}</h3><p className="mt-2 text-xs text-white/70">{detail}</p></div></div></Reveal>)}</div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-12 lg:py-28">
            <Reveal><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b56d45]">The HAVEN philosophy</p><h2 className="mt-5 font-serif text-5xl leading-tight sm:text-6xl">Less searching. More discovering.</h2></Reveal>
            <Reveal delay={120} className="grid grid-cols-2 gap-x-8 gap-y-8 border-t border-[#dfe3e4] pt-6 text-sm"><div><strong className="text-[#162b3d]">Clarity</strong><p className="mt-2 leading-6 text-[#667582]">The details should be easy to understand.</p></div><div><strong className="text-[#162b3d]">Simplicity</strong><p className="mt-2 leading-6 text-[#667582]">The next step should never feel hidden.</p></div><div><strong className="text-[#162b3d]">Better presentation</strong><p className="mt-2 leading-6 text-[#667582]">Good imagery helps a place make sense.</p></div><div><strong className="text-[#162b3d]">Human enquiries</strong><p className="mt-2 leading-6 text-[#667582]">Property decisions still begin with people.</p></div></Reveal>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#162b3d] text-white">
          <img src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=88" alt="Contemporary residential property at golden hour" className="absolute inset-0 h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-[#162b3d]/70" />
          <Reveal className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12 lg:py-32"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e0a17b]">Start somewhere good</p><h2 className="mt-5 max-w-3xl font-serif text-5xl leading-tight sm:text-7xl">Your next place could be closer than you think.</h2><p className="mt-6 max-w-md text-base leading-8 text-white/70">Explore properties and start your search.</p><div className="mt-9 flex flex-wrap gap-4"><Link href="/properties" className="inline-flex min-h-12 items-center bg-[#e0a17b] px-7 text-sm font-bold text-[#162b3d] transition hover:bg-white">Explore Properties <span className="ml-3" aria-hidden="true">→</span></Link><Link href="/rent" className="inline-flex min-h-12 items-center border border-white/60 px-7 text-sm font-bold text-white transition hover:border-white hover:bg-white hover:text-[#162b3d]">Find a Home <span className="ml-3" aria-hidden="true">→</span></Link></div></Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
