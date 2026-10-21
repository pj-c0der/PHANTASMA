import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative z-0 flex min-h-[calc(100svh-5rem)] items-center justify-center overflow-hidden px-6 py-24 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-brand-violet/30 blur-[120px] md:h-[800px] md:w-[800px] md:blur-[150px]"
      />

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
