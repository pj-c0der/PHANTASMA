"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ColorBends from "@/components/ui/ColorBends";
import SpecularButton from "@/components/ui/SpecularButton";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative w-full z-0 flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center pt-20">
      {/* THE FIX: Wrapped in an absolute container to push it behind the text */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-brand-black">
        <ColorBends
          colors={["#a855f7"]}
          rotation={90}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          noise={0.15}
          parallax={0.5}
          iterations={1}
          intensity={1.5}
          bandWidth={6}
          transparent
          autoRotate={0}
        />
      </div>

      <motion.div className="relative z-10 flex max-w-4xl flex-col items-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mb-6 text-xs font-semibold uppercase tracking-[0.4em] text-brand-ivory/60"
        >
          EST. PASIG CITY, PHILIPPINES
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center font-serif text-6xl font-bold leading-none text-brand-ivory md:text-7xl"
        >
          <span>PHANTASMA</span>
          <span className="ml-4 mt-2 text-5xl tracking-[0.5em]">STUDIO</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-8 font-sans text-lg text-brand-ivory md:text-xl"
        >
          Integrated Creative Media &amp; Digital Production Enterprise
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          className="mt-4 max-w-lg font-sans text-sm text-brand-ivory/70"
        >
          Transforming moments and ideas into timeless, meaningful, and
          compelling visual experiences.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/contact"
            className="rounded-full bg-brand-violet px-8 py-4 text-lg text-brand-ivory transition hover:bg-brand-violet/80"
          >
            BOOK A PROJECT
          </Link>
          <SpecularButton
            size="lg"
            radius={40}
            tint="#ffffff"
            tintOpacity={0.04}
            textColor="#f5f5f5"
            lineColor="#a855f7"
            baseColor="#525252"
            intensity={1}
            idleIntensity={0.35}
            shineSize={14}
            shineFade={40}
            thickness={1.5}
            glow={1.4}
            followMouse
            proximity={250}
            onClick={() => router.push("/portfolio")}
          >
            EXPLORE OUR WORK
          </SpecularButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
