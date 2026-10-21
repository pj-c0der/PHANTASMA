"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const socialLinks = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "Behance", href: "#" },
];

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-brand-ivory/10 bg-brand-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mx-auto max-w-7xl px-6 py-12 lg:px-8"
      >
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Link
              href="/"
              className="font-serif text-lg tracking-[0.3em] text-brand-ivory transition-colors hover:text-brand-violet"
            >
              PHANTASMA
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-brand-ivory/50">
              A creative studio transforming moments into timeless media.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.25em] text-brand-ivory/40">
              Follow
            </p>
            <ul className="flex flex-col gap-2 sm:items-end">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-ivory/60 transition-colors hover:text-brand-ivory"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-brand-ivory/10 pt-6 text-xs text-brand-ivory/40 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {currentYear} Phantasma Studio. All rights reserved.</p>
          <p className="tracking-wide">Crafted with intention.</p>
        </div>
      </motion.div>
    </footer>
  );
}
