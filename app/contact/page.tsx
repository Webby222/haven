import Footer from "../components/Footer";
import Header from "../components/Header";
import Reveal from "../components/Reveal";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf8] text-[#162b3d]">
      <Header />
      <main className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 lg:py-24">
        <Reveal className="flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b56d45]">Get in touch</p>
            <h1 className="mt-6 font-serif text-6xl leading-[0.92] tracking-[-0.03em] sm:text-7xl">Let&apos;s find the right property for you.</h1>
            <p className="mt-7 max-w-md text-base leading-8 text-[#667582]">Have a property in mind or need help finding one? Get in touch with Haven.</p>
          </div>
          <div className="mt-12 border-t border-[#dfe3e4] pt-7 text-sm leading-8 text-[#667582]">
            <p><strong className="text-[#162b3d]">Phone</strong><br />Coming soon</p>
            <p className="mt-4"><strong className="text-[#162b3d]">WhatsApp</strong><br />Coming soon</p>
            <p className="mt-4"><strong className="text-[#162b3d]">Email</strong><br />eigbefog@gmail.com</p>
          </div>
        </Reveal>
        <Reveal delay={120} className="bg-[#f2f0eb] p-6 sm:p-10">
          <form className="space-y-6">
            <p className="font-serif text-3xl">Send an enquiry</p>
            <label className="block text-sm font-semibold">Name<input required className="mt-2 min-h-12 w-full border border-[#cbd5d6] bg-white px-4 outline-none transition focus:border-[#b56d45]" /></label>
            <label className="block text-sm font-semibold">Email<input required type="email" className="mt-2 min-h-12 w-full border border-[#cbd5d6] bg-white px-4 outline-none transition focus:border-[#b56d45]" /></label>
            <label className="block text-sm font-semibold">Phone<input type="tel" className="mt-2 min-h-12 w-full border border-[#cbd5d6] bg-white px-4 outline-none transition focus:border-[#b56d45]" /></label>
            <label className="block text-sm font-semibold">Property interest<select defaultValue="General enquiry" className="mt-2 min-h-12 w-full border border-[#cbd5d6] bg-white px-4 outline-none transition focus:border-[#b56d45]"><option>Buy</option><option>Rent</option><option>General enquiry</option></select></label>
            <label className="block text-sm font-semibold">Message<textarea required rows={5} className="mt-2 w-full border border-[#cbd5d6] bg-white px-4 py-3 outline-none transition focus:border-[#b56d45]" /></label>
            <button type="submit" className="min-h-12 bg-[#162b3d] px-7 text-sm font-bold text-white transition hover:bg-[#b56d45]">Send enquiry <span className="ml-3" aria-hidden="true">→</span></button>
          </form>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}