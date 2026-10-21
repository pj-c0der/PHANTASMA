import Link from "next/link";
import ColorBends from "@/components/ui/ColorBends";

export default function Hero() {
  return (
    <section className="relative z-0 flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* WebGL background: absolutely positioned and pushed behind the text */}
      <div className="absolute inset-0 -z-10 h-full w-full">
        <ColorBends
          colors={["#a855f7", "#c084fc", "#6b4c8a", "#3b0764"]}
          rotation={-15}
          speed={0.3}
          scale={1.5}
          frequency={1.2}
          warpStrength={2.0}
          mouseInfluence={0.5}
          noise={0.1}
          parallax={0.1}
          iterations={2}
          intensity={2.5}
          bandWidth={3}
          transparent={false}
        />
      </div>

      <div className="relative z-10 flex max-w-4xl flex-col items-center">
        <span className="mb-6 text-xs font-semibold uppercase tracking-[0.4em] text-brand-ivory/60">
          EST. PASIG CITY, PHILIPPINES
        </span>

        <h1 className="flex flex-col items-center font-serif text-6xl font-bold leading-none text-brand-ivory md:text-7xl">
          <span>PHANTASMA</span>
          <span className="ml-4 mt-2 text-5xl tracking-[0.5em] md:text-6xl md:tracking-[0.8em]">
            STUDIO
          </span>
        </h1>

        <p className="mt-8 font-sans text-lg text-brand-ivory md:text-xl">
          Integrated Creative Media &amp; Digital Production Enterprise
        </p>

        <p className="mt-4 max-w-lg font-sans text-sm text-brand-ivory/70">
          Transforming moments and ideas into timeless, meaningful, and
          compelling visual experiences.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/contact"
            className="rounded-full bg-brand-violet px-8 py-3 text-sm font-semibold text-brand-ivory transition hover:bg-brand-violet/80"
          >
            BOOK A PROJECT
          </Link>
          <Link
            href="/portfolio"
            className="rounded-full border border-brand-ivory/20 bg-transparent px-8 py-3 text-sm font-semibold text-brand-ivory transition hover:bg-brand-ivory/5"
          >
            EXPLORE OUR WORK
          </Link>
        </div>
      </div>
    </section>
  );
}
