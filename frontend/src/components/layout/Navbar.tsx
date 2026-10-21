"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-black/10 backdrop-blur-3xl border-b border-brand-ivory/10">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8"
      >
        <Link href="/" className="flex items-center gap-3">
          {/* The Logo Image */}
          <Image
            src="/images/logo.png"
            alt="Phantasma Studio Logo"
            width={40}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />

          {/* The Text Wordmark */}
          <span className="font-serif text-xl md:text-2xl font-bold tracking-widest text-brand-ivory mt-1">
            PHANTASMA
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-wide text-brand-ivory/70 transition-colors hover:text-brand-ivory"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/contact"
            className="rounded-full bg-brand-violet px-6 py-2.5 text-sm font-medium text-brand-ivory transition-colors hover:bg-brand-violet/85"
          >
            Book a Project
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-ivory/15 text-brand-ivory transition-colors hover:border-brand-ivory/40 hover:text-brand-ivory lg:hidden"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </nav>

      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-brand-ivory/10 bg-brand-black px-6 pb-8 pt-4 lg:hidden"
        >
          <div className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="border-b border-brand-ivory/5 py-4 text-base tracking-wide text-brand-ivory/80 transition-colors hover:text-brand-ivory"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/contact"
              onClick={closeMenu}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-violet px-6 py-3 text-sm font-medium text-brand-ivory transition-colors hover:bg-brand-violet/85"
            >
              Book a Project
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
