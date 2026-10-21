export default function Home() {
  return (
    <section className="flex min-h-[calc(100svh-5rem)] items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-6 text-xs uppercase tracking-[0.4em] text-brand-violet">
          Phantasma Studio
        </p>
        <h1 className="font-serif text-4xl leading-[1.1] text-balance text-brand-ivory sm:text-6xl lg:text-7xl">
          Transforming moments into timeless media.
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-brand-ivory/60 sm:text-lg">
          A creative studio crafting films, photography, and digital experiences
          that endure.
        </p>
      </div>
    </section>
  );
}
