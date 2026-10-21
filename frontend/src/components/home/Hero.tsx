import Link from "next/link";
import ColorBends from "@/components/ui/ColorBends";

export default function Hero() {
  return (
    <section className="relative z-0 flex min-h-[calc(100svh-5rem)] items-center justify-center overflow-hidden px-6 py-24 text-center">
      <div className="absolute inset-0 -z-10 w-full h-full">
        <ColorBends
          colors={["#0a0a0a", "#6b4c8a", "#1a0b2e", "#050505"]}
          rotation={45}
          speed={0.1}
          scale={1.2}
          frequency={1.5}
          warpStrength={1.5}
          mouseInfluence={0.4}
          noise={0.15}
          parallax={0.5}
          iterations={2}
          intensity={0.8}
          bandWidth={5}
          transparent={true}
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
        <p className="text-[10px] uppercase tracking-[0.4em] text-brand-ivory/40 sm:text-xs">
          EST. PASIG CITY, PHILIPPINES
        </p>

        <h1
          aria-label="Phantasma Studio"
          className="mt-8 flex w-fit max-w-full flex-col items-center font-serif text-brand-ivory"
        >
          <span className="text-[clamp(2.5rem,12vw,3.75rem)] leading-[0.95] tracking-[0.02em] sm:text-6xl lg:text-7xl">
            PHANTASMA
          </span>
          <span
            aria-hidden="true"
            className="mt-3 flex w-full justify-between px-1 text-xl tracking-wide sm:text-2xl"
          >
            {"STUDIO".split("").map((letter) => (
              <span key={letter}>{letter}</span>
            ))}
          </span>
        </h1>

        <p className="mt-8 text-base text-brand-ivory">
          Integrated Creative Media &amp; Digital Production Enterprise
        </p>

        <p className="mt-4 max-w-lg text-sm leading-7 text-brand-ivory/50">
          Transforming moments and ideas into timeless, meaningful, and
          compelling visual experiences.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/contact"
            className="rounded-full bg-brand-violet px-8 py-3 text-sm font-medium tracking-[0.08em] text-brand-ivory transition-colors hover:bg-brand-violet/85"
          >
            BOOK A PROJECT
          </Link>
          <Link
            href="/portfolio"
            className="rounded-full border border-brand-ivory/20 px-8 py-3 text-sm font-medium tracking-[0.08em] text-brand-ivory transition-colors hover:border-brand-ivory/40 hover:bg-brand-ivory/5"
          >
            EXPLORE OUR WORK
          </Link>
        </div>
      </div>
    </section>
  );
}
