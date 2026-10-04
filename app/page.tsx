import { Suspense } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FeaturedProperties, { FeaturedPropertiesLoading } from "./components/FeaturedProperties";
import HomepageSearch, { HomepageSearchLoading } from "./components/HomepageSearch";
import LocationExplorer from "./components/LocationExplorer";
import Reveal from "./components/Reveal";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fbfaf8] text-[#162b3d]">
      <Header />
      <main>
        <Hero searchBar={<Suspense fallback={<HomepageSearchLoading />}><HomepageSearch /></Suspense>} />

        <section className="relative overflow-hidden bg-[#fbfaf8]" aria-labelledby="personal-heading">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-24 sm:px-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-12 lg:py-36">
            <Reveal className="relative z-10 lg:pr-12"><p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#b56d45]">A different way to search</p><h2 id="personal-heading" className="max-w-xl font-serif text-6xl leading-[0.9] tracking-[-0.03em] text-[#162b3d] sm:text-7xl">Property should feel personal.</h2><p className="mt-8 max-w-md text-base leading-8 text-[#667582]">The right home is more than a list of features. It is the morning light, the distance to work, the space for your people and the feeling that it fits.</p></Reveal>
            <Reveal delay={140} className="relative min-h-[420px] overflow-hidden sm:min-h-[560px]"><img src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=90" alt="Quiet modern bedroom in a Nigerian apartment" className="haven-image-reveal h-full w-full object-cover transition duration-1000 hover:scale-[1.03]" /><div className="absolute bottom-6 left-6 max-w-[220px] border-l-2 border-[#e0a17b] pl-4 text-sm leading-6 text-white">A place to settle into, in a neighbourhood that feels like yours.</div></Reveal>
          </div>
        </section>

        <Suspense fallback={<FeaturedPropertiesLoading />}><FeaturedProperties /></Suspense>

        <Reveal className="border-y border-[#dfe3e4] bg-[#162b3d]">
          <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:grid-cols-3 sm:px-8 lg:px-12" aria-label="Haven demonstration metrics">
            {[['500+', 'Properties discovered'], ['10+', 'Locations'], ['24/7', 'Property enquiries']].map(([value, label]) => <div key={label} className="border-l border-white/20 pl-5"><p className="font-serif text-4xl text-white sm:text-5xl">{value}</p><p className="mt-2 text-xs uppercase tracking-[0.16em] text-white/60">{label} <span className="normal-case tracking-normal">(demo)</span></p></div>)}
          </section>
        </Reveal>

        <section className="border-y border-[#dfe3e4] bg-[#f2f0eb]" aria-labelledby="describe-heading">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-12 lg:py-20">
            <Reveal>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#b56d45]">A more natural search</p>
              <h2 id="describe-heading" className="max-w-md font-serif text-4xl leading-tight text-[#162b3d]">Looking for something specific?</h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#667582]">Tell Haven what you&apos;re looking for in your own words. We&apos;ll help you narrow down the right kind of place.</p>
            </Reveal>
            <Reveal delay={120} className="border border-[#d5d9d6] bg-white p-5 sm:p-7">
              <label htmlFor="ideal-home" className="text-xs font-bold uppercase tracking-[0.16em] text-[#687784]">Describe your ideal home</label>
              <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end">
                <div className="flex-1 border-b border-[#aeb9bd] pb-3 text-base leading-7 text-[#465965]">2 bedroom apartment in Ugbowo under ₦1.5m with parking.</div>
                <button id="ideal-home" type="button" className="min-h-12 bg-[#162b3d] px-6 text-sm font-bold text-white transition-colors hover:bg-[#b56d45]">Search <span aria-hidden="true">→</span></button>
              </div>
            </Reveal>
          </div>
        </section>

        <LocationExplorer />

        <section className="border-y border-[#dfe3e4] bg-white" aria-labelledby="how-heading">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-24">
            <Reveal className="max-w-md"><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#b56d45]">Simple by design</p><h2 id="how-heading" className="font-serif text-4xl text-[#162b3d] sm:text-5xl">How Haven works</h2></Reveal>
            <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
              {[['01', 'Search', 'Find properties that match your needs.'], ['02', 'Explore', 'View photos, details and property information.'], ['03', 'Connect', 'Send an enquiry to learn more.']].map(([number, title, description], index) => <Reveal key={number} delay={index * 100} className="border-t-2 border-[#c8825a] pt-5"><span className="text-sm font-bold text-[#b56d45]">{number}</span><h3 className="mt-8 font-serif text-3xl text-[#162b3d]">{title}</h3><p className="mt-3 max-w-xs text-sm leading-7 text-[#667582]">{description}</p></Reveal>)}
            </div>
          </div>
        </section>

        <section className="mx-6 my-20 bg-[#162b3d] px-7 py-14 sm:mx-8 sm:px-12 lg:mx-auto lg:my-28 lg:max-w-7xl lg:py-20" aria-labelledby="cta-heading">
          <Reveal className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end"><div><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#e0a17b]">Your next move</p><h2 id="cta-heading" className="max-w-2xl font-serif text-4xl leading-tight text-white sm:text-5xl">Ready to find your next place?</h2></div><a className="inline-flex min-h-12 items-center justify-center self-start bg-[#e0a17b] px-7 text-sm font-bold text-[#162b3d] transition-colors hover:bg-white sm:self-auto" href="#properties">Explore Properties <span className="ml-3" aria-hidden="true">→</span></a></Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
