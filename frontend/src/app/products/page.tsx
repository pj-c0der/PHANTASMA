"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

type Tab = "PHYSICAL" | "DIGITAL";

type PhysicalProduct = {
  number: string;
  title: string;
  description: string;
  image?: string;
};

type ProcessStep = {
  number: string;
  title: string;
};

type DigitalCategory = {
  number: string;
  title: string;
  description: string;
};

type DigitalProduct = {
  number: string;
  title: string;
  description: string;
  image?: string;
};

const headers: Record<Tab, { title: string; subtitle: string }> = {
  PHYSICAL: {
    title: "PHYSICAL PRODUCTS",
    subtitle: "Digital assets transformed into tangible keepsakes.",
  },
  DIGITAL: {
    title: "DIGITAL CREATIVE PRODUCTS",
    subtitle:
      "Downloadable creative resources crafted to elevate your visual work — presets, color-grading LUTs, and design templates built with the same editorial precision as our studio productions.",
  },
};

const physicalProducts: PhysicalProduct[] = [
  {
    number: "01",
    title: "PHOTOBOOKS",
    description:
      "Professionally printed and bound photo albums for celebrations, graduations, and special events.",
  },
  {
    number: "02",
    title: "FRAMED PHOTOGRAPHS",
    description:
      "Printed and framed photographs designed for personal and commercial display.",
  },
  {
    number: "03",
    title: "PERSONALIZED EVENT SOUVENIRS",
    description:
      "Customized tangible keepsakes incorporating event-specific visual elements.",
  },
  {
    number: "04",
    title: "USB KEEPSAKE BOXES",
    description:
      "Customized wooden or acrylic boxes containing capacitive digital photographs and video files.",
  },
];

const processSteps: ProcessStep[] = [
  { number: "01", title: "DESIGN" },
  { number: "02", title: "PRINT / FABRICATE" },
  { number: "03", title: "QUALITY CHECK" },
  { number: "04", title: "DELIVERY" },
];

const digitalCategories: DigitalCategory[] = [
  {
    number: "01",
    title: "EDITING PRESETS",
    description:
      "Color presets for photography, lifestyle, and portrait editing.",
  },
  {
    number: "02",
    title: "VIDEO LUTS",
    description: "Cinematic color grades for event and lifestyle footage.",
  },
  {
    number: "03",
    title: "DESIGN TEMPLATES",
    description:
      "Editable layouts for events, campaigns, and social content.",
  },
];

const digitalProducts: DigitalProduct[] = [
  {
    number: "01",
    title: "Golden Hour Preset Pack",
    description:
      "Warm, sun-kissed tones for outdoor and lifestyle photography",
  },
  {
    number: "02",
    title: "Cinematic Portrait Presets",
    description: "Moody, filmic depth for dramatic portrait sessions",
  },
  {
    number: "03",
    title: "Warm Film LUT Collection",
    description:
      "Vintage, film-inspired grading for wedding and lifestyle footage",
  },
  {
    number: "04",
    title: "Editorial Event LUTs",
    description:
      "Refined, high-contrast grading for event and cinematic video",
  },
  {
    number: "05",
    title: "Event Invitation Template Set",
    description:
      "Editable layouts for weddings, launches, and formal gatherings",
  },
  {
    number: "06",
    title: "Social Promo Template Kit",
    description:
      "Ready-to-edit layouts for campaigns, promos, and social content",
  },
];

function ProductMedia({
  image,
  alt,
  number,
  aspect,
}: {
  image?: string;
  alt: string;
  number: string;
  aspect: string;
}) {
  return (
    <div className={`relative w-full overflow-hidden ${aspect}`}>
      {image ? (
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-violet/20 via-[#150c1e] to-brand-black transition-transform duration-700 group-hover:scale-105"
        >
          <span className="font-serif text-7xl text-brand-ivory/10">
            {number}
          </span>
        </div>
      )}
    </div>
  );
}

function PhysicalProducts() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {physicalProducts.map((product, index) => (
          <motion.article
            key={product.number}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.6,
              delay: index * 0.08,
              ease: "easeOut",
            }}
            className="group overflow-hidden rounded-lg border border-brand-ivory/10 bg-zinc-900/40 transition-colors hover:border-brand-violet/40"
          >
            <div className="relative">
              <ProductMedia
                image={product.image}
                alt={product.title}
                number={product.number}
                aspect="aspect-[16/10]"
              />
              <span className="absolute left-5 top-5 z-10 text-xs tracking-[0.3em] text-brand-ivory/50">
                {product.number}
              </span>
            </div>

            <div className="p-8">
              <h2 className="font-serif text-2xl leading-tight text-brand-ivory">
                {product.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-brand-ivory/60">
                {product.description}
              </p>
            </div>
          </motion.article>
        ))}
      </div>

      <section className="mt-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center font-serif text-3xl text-brand-ivory sm:text-4xl"
        >
          Our Production Process
        </motion.h2>

        <div className="relative mt-14">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-5 hidden h-px bg-brand-ivory/15 lg:block"
          />

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.12,
                  ease: "easeOut",
                }}
                className="relative"
              >
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-brand-violet bg-brand-black text-xs tracking-[0.15em] text-brand-ivory">
                  {step.number}
                </div>
                <h3 className="mt-6 text-xs uppercase tracking-[0.25em] text-brand-ivory">
                  {step.title}
                </h3>
                <div className="mt-4 h-px w-12 bg-brand-violet/60" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mt-24 flex flex-col items-center border-t border-brand-ivory/10 pt-16 text-center"
      >
        <h2 className="font-serif text-3xl leading-tight text-brand-ivory sm:text-4xl">
          Have a Product in Mind?
        </h2>
        <Link
          href="/contact"
          className="mt-8 inline-flex rounded-full bg-brand-violet px-8 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-ivory transition-colors hover:bg-brand-violet/85"
        >
          REQUEST A CUSTOM PRODUCT
        </Link>
      </motion.div>
    </div>
  );
}

function DigitalProducts() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-8 border-b border-brand-ivory/10 pb-12 md:grid-cols-3">
        {digitalCategories.map((category, index) => (
          <motion.div
            key={category.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut",
            }}
          >
            <p className="text-xs tracking-[0.3em] text-brand-ivory/40">
              {category.number}
            </p>
            <h2 className="mt-3 text-sm uppercase tracking-[0.2em] text-brand-ivory">
              {category.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-brand-ivory/50">
              {category.description}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {digitalProducts.map((product, index) => (
          <motion.article
            key={product.number}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.6,
              delay: index * 0.08,
              ease: "easeOut",
            }}
            className="group flex h-full flex-col overflow-hidden rounded-lg border border-brand-ivory/10 bg-zinc-900/40 transition-colors hover:border-brand-violet/40"
          >
            <ProductMedia
              image={product.image}
              alt={product.title}
              number={product.number}
              aspect="aspect-square"
            />

            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-serif text-xl leading-snug text-brand-ivory">
                {product.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-brand-ivory/60">
                {product.description}
              </p>

              <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                <span className="text-xs uppercase tracking-[0.15em] text-brand-ivory/40">
                  From ₱—
                </span>
                <Link
                  href="/contact"
                  className="whitespace-nowrap rounded-full border border-brand-ivory/25 px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-brand-ivory transition-colors hover:border-brand-violet hover:text-brand-ivory"
                >
                  VIEW PRODUCT
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("PHYSICAL");

  return (
    <div className="bg-brand-black pb-32">
      <section className="px-6 pb-16 pt-32 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-ivory/40">
            PRODUCTS
          </p>

          <div className="mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="font-serif text-4xl font-bold leading-[1.05] text-brand-ivory sm:text-5xl lg:text-7xl">
                  {headers[activeTab].title}
                </h1>
                <p className="mx-auto mt-8 max-w-3xl text-sm leading-7 text-brand-ivory/60 sm:text-base">
                  {headers[activeTab].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex justify-center">
            <div
              role="group"
              aria-label="Choose a product type"
              className="inline-flex rounded-full border border-brand-ivory/20 p-1"
            >
              {(["PHYSICAL", "DIGITAL"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  aria-pressed={activeTab === tab}
                  className={`rounded-full px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] transition-colors sm:px-8 ${
                    activeTab === tab
                      ? "bg-brand-violet text-brand-ivory"
                      : "bg-transparent text-brand-ivory/60 hover:text-brand-ivory"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {activeTab === "PHYSICAL" ? (
                <PhysicalProducts />
              ) : (
                <DigitalProducts />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
