import Link from "next/link";

const footerLinks = [["Properties", "/properties"], ["Buy", "/buy"], ["Rent", "/rent"], ["About", "/about"], ["Contact", "/contact"]] as const;

export default function Footer() {
  return (
    <footer className="border-t border-[#dfe3e4] bg-[#f2f0eb]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-8 lg:px-12">
        <div>
          <Link href="/" className="font-serif text-2xl font-bold tracking-[0.16em] text-[#162b3d]">HAVEN</Link>
          <p className="mt-3 text-sm text-[#71808c]">Find a place you&apos;ll love to call home.</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#526575]" aria-label="Footer navigation">
          {footerLinks.map(([label, href]) => <Link key={label} href={href} className="transition-colors hover:text-[#c9784a]">{label}</Link>)}
        </nav>
      </div>
      <div className="mx-auto max-w-7xl border-t border-[#dfe5e8] px-6 py-5 text-xs text-[#8b99a3] sm:px-8 lg:px-12">© {new Date().getFullYear()} HAVEN. Property, thoughtfully found.</div>
    </footer>
  );
}