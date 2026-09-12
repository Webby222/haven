"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  ["Home", "/"],
  ["Buy", "/buy"],
  ["Rent", "/rent"],
  ["About", "/about"],
  ["Properties", "/properties"],
  ["Contact", "/contact"],
] as const;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-30 border-b bg-white transition-all duration-300 ${scrolled ? "border-[#d8dfe0] py-1 shadow-[0_6px_24px_rgba(22,43,61,0.07)]" : "border-[#e3e6e4]"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8 lg:px-12">
        <Link href="/" className="font-serif text-2xl font-bold tracking-[0.16em] text-[#162b3d]">HAVEN</Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {links.map(([label, href]) => <Link key={label} href={href} className={`text-sm font-medium transition-colors hover:text-[#c9784a] ${pathname === href ? "text-[#b56d45]" : "text-[#526575]"}`}>{label}</Link>)}
        </nav>
        <a href="#list" className="hidden min-h-11 items-center bg-[#162b3d] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#b56d45] md:inline-flex">List a Property</a>
        <button type="button" className="flex h-10 w-10 items-center justify-center text-[#102a43] md:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <span className="text-2xl leading-none" aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
        </button>
      </div>
      {menuOpen && <nav className="border-t border-[#dfe5e8] px-6 py-5 md:hidden" aria-label="Mobile navigation">
        <div className="flex flex-col gap-5">
          {links.map(([label, href]) => <Link key={label} href={href} onClick={() => setMenuOpen(false)} className={`text-sm font-medium ${pathname === href ? "text-[#b56d45]" : "text-[#526575]"}`}>{label}</Link>)}
          <a href="#list" onClick={() => setMenuOpen(false)} className="inline-flex min-h-11 items-center justify-center bg-[#102a43] px-5 text-sm font-semibold text-white">List a Property</a>
        </div>
      </nav>}
    </header>
  );
}