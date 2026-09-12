import Reveal from "./Reveal";

const features = ["2 Bedrooms", "2 Bathrooms", "Parking", "Estate security"];

export default function PropertyStory() {
  return (
    <section className="bg-[#162b3d] text-white" aria-labelledby="story-heading">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:px-12 lg:py-32">
        <div className="lg:sticky lg:top-28 lg:h-[calc(100vh-9rem)] lg:min-h-[620px]">
          <div className="group relative h-full min-h-[440px] overflow-hidden bg-[#274256] sm:min-h-[580px]">
            <img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1500&q=90" alt="Contemporary Ugbowo apartment living room with warm finishes" className="h-full w-full object-cover transition duration-[1200ms] group-hover:scale-[1.04]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#162b3d]/70 via-transparent to-transparent" />
            <span className="absolute left-5 top-5 border border-white/50 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white">Haven selection 01</span>
            <p className="absolute bottom-6 left-6 text-sm text-white/80">Ugbowo, Benin City</p>
          </div>
        </div>
        <div className="flex flex-col justify-center py-4 lg:py-20">
          <Reveal><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e0a17b]">The featured property</p></Reveal>
          <Reveal delay={90}><h2 id="story-heading" className="mt-5 max-w-lg font-serif text-5xl leading-[0.98] tracking-[-0.02em] sm:text-6xl">Modern 2 Bedroom Flat</h2></Reveal>
          <Reveal delay={180}><p className="mt-7 max-w-md text-base leading-8 text-white/65">A calm, well-planned apartment in one of Benin City&apos;s most connected neighbourhoods. Designed for everyday living, with room to make it yours.</p></Reveal>
          <Reveal delay={260}><p className="mt-10 font-serif text-3xl text-[#e0a17b]">₦1,500,000 <span className="font-sans text-sm text-white/55">/ year</span></p></Reveal>
          <Reveal delay={340} className="mt-10 grid max-w-md grid-cols-2 border-y border-white/15 py-5 sm:grid-cols-4">
            {features.map((feature) => <div key={feature} className="border-r border-white/15 px-3 py-1 first:pl-0 last:border-0"><p className="text-xs leading-5 text-white/65">{feature}</p></div>)}
          </Reveal>
          <Reveal delay={420}><a href="#properties" className="mt-10 inline-flex items-center self-start border-b border-[#e0a17b] pb-2 text-sm font-bold text-white transition-colors hover:text-[#e0a17b]">View property details <span className="ml-4" aria-hidden="true">→</span></a></Reveal>
        </div>
      </div>
    </section>
  );
}