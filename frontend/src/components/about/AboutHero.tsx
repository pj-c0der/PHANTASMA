"use client";

import { motion } from "framer-motion";

export default function AboutHero() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center bg-brand-black px-6 py-24 text-center">
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-ivory/60"
        >
          THE VISION
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-8 flex flex-col items-center font-serif text-6xl font-bold leading-[0.95] text-brand-ivory md:text-8xl"
        >
          <span>WE ENGINEER</span>
          <span>VISUAL REALITIES.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-10 max-w-xl font-sans text-sm leading-7 text-brand-ivory/60 md:text-base"
        >
          A Pasig City-based integrated creative media enterprise specializing in
          photography, cinematic post-production, and premium digital design.
        </motion.p>
      </div>
    </section>
  );
}
