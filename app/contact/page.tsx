import Footer from "../components/Footer";
import Header from "../components/Header";
import Reveal from "../components/Reveal";
import ContactForm from "./ContactForm";
import { getPropertyById } from "../../lib/propertyData";

type ContactPageProps = {
  searchParams: Promise<{ property?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { property: propertyId } = await searchParams;
  let property = null;

  if (propertyId) {
    try {
      const match = await getPropertyById(propertyId);
      if (match) property = { id: match.id, title: match.title, purpose: match.purpose };
    } catch {
      property = null;
    }
  }

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
          <ContactForm property={property} />
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}