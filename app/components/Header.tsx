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

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "";
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className={`sticky top-0 z-30 border-b bg-white transition-all duration-300 ${scrolled ? "border-[#d8dfe0] py-1 shadow-[0_6px_24px_rgba(22,43,61,0.07)]" : "border-[#e3e6e4]"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8 lg:px-12">
        <Link href="/" className="font-serif text-2xl font-bold tracking-[0.16em] text-[#162b3d]">HAVEN</Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {links.map(([label, href]) => <Link key={label} href={href} className={`text-sm font-medium transition-colors hover:text-[#c9784a] ${pathname === href ? "text-[#b56d45]" : "text-[#526575]"}`}>{label}</Link>)}
        </nav>
        <a href="#list" className="hidden min-h-11 items-center bg-[#162b3d] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#b56d45] md:inline-flex">List a Property</a>
        <button type="button" className="flex h-10 w-10 items-center justify-center text-[#162b3d] transition-transform duration-300 hover:scale-105 md:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen((open) => !open)}>
          <span className="relative block h-4 w-6" aria-hidden="true">
            <span className={`absolute left-0 top-0 h-px w-6 bg-current transition-all duration-300 ${menuOpen ? "top-2 rotate-45" : "top-0 rotate-0"}`} />
            <span className={`absolute left-0 top-2 h-px w-6 bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute left-0 top-4 h-px w-6 bg-current transition-all duration-300 ${menuOpen ? "top-2 -rotate-45" : "top-4 rotate-0"}`} />
          </span>
        </button>
      </div>

      <div id="mobile-menu" className={`fixed inset-0 z-40 md:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!menuOpen} role="dialog" aria-modal="true" aria-label="Mobile navigation menu">
        <div
          className={`absolute inset-0 bg-[#f7f2ea] transition-all duration-500 ease-out ${menuOpen ? "opacity-100" : "opacity-0"}`}
          style={{ clipPath: menuOpen ? "inset(0 0 0 0 round 0px)" : "inset(0 0 100% 0 round 0px)" }}
        />

        <div
          className={`relative flex h-full flex-col px-6 pt-5 pb-8 transition-all duration-500 ease-out ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          style={{ clipPath: menuOpen ? "inset(0 0 0 0 round 0px)" : "inset(0 0 100% 0 round 0px)" }}
        >
          <div className="flex items-center justify-between border-b border-[#dfe5e0] pb-4">
            <Link href="/" className="font-serif text-2xl font-bold tracking-[0.16em] text-[#162b3d]" onClick={() => setMenuOpen(false)}>HAVEN</Link>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-[#d7d7d1] px-2.5 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#162b3d] transition-colors duration-300 hover:border-[#b56d45] hover:text-[#b56d45]"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <span className="relative flex h-4 w-4 items-center justify-center" aria-hidden="true">
                <span className={`absolute h-px w-4 bg-current transition-transform duration-300 ${menuOpen ? "rotate-45" : "rotate-0"}`} />
                <span className={`absolute h-px w-4 bg-current transition-transform duration-300 ${menuOpen ? "-rotate-45" : "rotate-0"}`} />
              </span>
              <span>Close</span>
            </button>
          </div>

          <nav aria-label="Mobile navigation" className="mt-8 flex flex-1 flex-col justify-center">
            {links.map(([label, href], index) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`group relative flex items-center justify-between overflow-hidden border-b border-[#dfe5e0] py-4 text-[clamp(2.5rem,8vw,4.25rem)] leading-none tracking-[-0.05em] text-[#162b3d] transition-all duration-300 ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <span className="inline-block transition-transform duration-300 group-active:-translate-y-1 motion-reduce:transition-none">{label}</span>
                <span className={`h-px w-0 bg-[#b56d45] transition-all duration-300 group-hover:w-16 group-focus-visible:w-16 motion-reduce:transition-none ${pathname === href ? "w-12" : ""}`} />
              </Link>
            ))}
          </nav>

          <p className="border-t border-[#dfe5e0] pt-4 text-[0.62rem] font-medium uppercase tracking-[0.22em] text-[#667582]">
            Discover better places across Nigeria.
          </p>
        </div>
      </div>
    </header>
  );
}