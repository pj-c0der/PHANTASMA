"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type Service = {
  number: string;
  title: string;
  desc: string;
  deliverables: string[];
  buttonText: string;
  image?: string;
  video?: string;
  isVideo?: boolean;
};

const services: Service[] = [
  {
    number: "01",
    title: "PHOTOGRAPHY",
    desc: "Capturing genuine, unrepeatable moments with a refined editorial eye — from intimate portraits to full-scale event coverage.",
    deliverables: [
      "Portrait sessions",
      "Graduations",
      "Intimate weddings",
      "Resort/estate requirements",
      "Local events",
      "On-location photography",
    ],
    buttonText: "INQUIRE ABOUT PHOTOGRAPHY",
    image: "/services/photography2.jpg",
  },
  {
    number: "02",
    title: "VIDEO PRODUCTION & POST-PRODUCTION",
    desc: "Cinematic storytelling from concept to color grade, crafted to make every visual and brand moment unforgettable.",
    deliverables: [
      "Event highlight reels",
      "Cinematic short films",
      "Promotional videos",
      "Interviews/documentaries",
      "Color grading",
      "Sound mastering",
    ],
    buttonText: "INQUIRE ABOUT VIDEO",
    video: "/services/videoprod2.mp4",
    isVideo: true,
  },
  {
    number: "03",
    title: "GRAPHIC DESIGN",
    desc: "Considered, print-ready visual design that gives every invitation, brand, and promotional piece a polished, lasting presence.",
    deliverables: [
      "Event invitations",
      "Banners",
      "Promotional materials",
      "Branding",
      "Print-ready designs",
    ],
    buttonText: "INQUIRE ABOUT DESIGN",
    image: "/services/graphic.jpg",
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-brand-black">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="px-6 pb-16 pt-32 lg:px-8"
      >
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-xs uppercase tracking-widest text-brand-ivory/40">
            SERVICES
          </p>
          <h1 className="mt-4 font-serif text-5xl font-bold leading-none text-brand-ivory sm:text-6xl lg:text-7xl">
            WHAT WE OFFER
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-sm leading-7 text-brand-ivory/60 sm:text-base">
            A full-scale creative media practice — capturing, crafting, and
            refining every visual story from first frame to final delivery.
          </p>
        </div>
      </motion.div>

      <section className="px-6 pb-32 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-y-32">
          {services.map((service, index) => (
            <div
              key={service.number}
              className={`flex flex-col gap-10 md:items-center md:gap-0 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <div className="aspect-[4/5] w-full overflow-hidden md:aspect-square md:w-1/2">
                <motion.div
                  initial={{ scale: 1.2, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="relative h-full w-full overflow-hidden bg-brand-black/50"
                >
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : service.isVideo ? (
                    <video src={service.video} autoPlay loop muted />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-br from-brand-violet/15 via-transparent to-transparent"
                    />
                  )}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full md:w-1/2 md:px-16"
              >
                <p className="text-xs tracking-[0.25em] text-brand-ivory/50">
                  {service.number}
                </p>
                <h2 className="mt-4 font-serif text-3xl leading-tight text-brand-ivory md:text-5xl">
                  {service.title}
                </h2>
                <p className="mt-6 text-sm leading-7 text-brand-ivory/60">
                  {service.desc}
                </p>

                <ul className="mt-8">
                  {service.deliverables.map((deliverable, itemIndex) => (
                    <motion.li
                      key={deliverable}
                      initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.2 + itemIndex * 0.06,
                        ease: "easeOut",
                      }}
                      className="border-b border-brand-ivory/10 py-3 text-sm text-brand-ivory/70"
                    >
                      {deliverable}
                    </motion.li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand-violet px-7 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-ivory transition-colors hover:bg-brand-violet/85"
                >
                  {service.buttonText}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </motion.div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
