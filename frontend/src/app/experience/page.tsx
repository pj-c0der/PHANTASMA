"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type TimelineStep = {
  step: string;
  title: string;
  desc: string;
};

const timeline: TimelineStep[] = [
  {
    step: "01",
    title: "DISCOVER",
    desc: "Client discovers Phantasma Studio through the website. This acts as the access point to all company information and is directly associated with a digital platform.",
  },
  {
    step: "02",
    title: "EXPLORE",
    desc: "Client explores portfolio and products. The client reviews photography, video, graphic design, physical products, and digital creative products.",
  },
  {
    step: "03",
    title: "INQUIRE",
    desc: "Client submits a project inquiry. The primary phase for the client to specify their project requirements and initially interact with us.",
  },
  {
    step: "04",
    title: "BOOK",
    desc: "Client secures a project schedule. Booking and scheduling information is coordinated through the digital platform.",
  },
  {
    step: "05",
    title: "CREATE",
    desc: "Phantasma Studio produces the requested creative output.",
  },
  {
    step: "06",
    title: "DELIVER",
    desc: "Client receives the completed output.",
  },
];

export default function ExperiencePage() {
  return (
    <div className="bg-brand-black">
      {/* Header */}
      <section className="px-6 pb-20 pt-40 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-xs uppercase tracking-[0.4em] text-brand-ivory/40"
          >
            CLIENT EXPERIENCE
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
            className="mt-4 font-serif text-5xl font-bold leading-[1.05] text-brand-ivory md:text-7xl"
          >
            FROM DISCOVERY TO DELIVERY
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mx-auto mt-8 max-w-2xl text-sm leading-7 text-brand-ivory/60 sm:text-base"
          >
            A step-by-step map of the client journey navigating our target
            clients with Phantasma Studio&apos;s creative services and products.
          </motion.p>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-brand-black">
        <div className="relative mx-auto max-w-4xl px-6 py-10">
          {/* Track (observed for the draw animation) */}
          <motion.div
            aria-hidden="true"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            className="absolute bottom-10 left-8 top-10 w-px overflow-hidden md:left-12"
          >
            <motion.div
              variants={{ hidden: { height: 0 }, visible: { height: "100%" } }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-full bg-brand-ivory/10"
            />
          </motion.div>

          {timeline.map((item) => (
            <div
              key={item.step}
              className="relative mb-24 flex gap-8 pl-16 last:mb-0 md:gap-16 md:pl-24"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" }}
                aria-hidden="true"
                className="absolute left-0.5 top-2 z-10 h-3 w-3 rounded-full bg-brand-violet shadow-[0_0_14px_2px_rgba(107,76,138,0.55)] md:left-[18px]"
              />

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="w-full"
              >
                <p className="text-xs tracking-[0.3em] text-brand-ivory/50">
                  {item.step}
                </p>
                <h3 className="mt-2 text-2xl uppercase tracking-widest text-brand-ivory">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-ivory/70 sm:text-base">
                  {item.desc}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-brand-ivory/10 px-6 py-32 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-5xl"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-brand-ivory/40">
            THE DIFFERENCE
          </p>
          <h2 className="my-6 font-serif text-4xl leading-tight text-brand-ivory md:text-5xl">
            TECHNOLOGY ENABLES THE CONNECTION. CREATIVITY DELIVERS THE VALUE.
          </h2>
          <p className="mx-auto max-w-3xl text-sm leading-7 text-brand-ivory/60 sm:text-base">
            The Phantasma Studio website functions as more than an online
            portfolio; it connects the end-to-end creative workflow with
            technology to bring stories to life by facilitating discovery,
            communication, booking, and delivery in an integrated environment.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/book"
              className="rounded-full bg-brand-violet px-8 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-ivory transition-colors hover:bg-brand-violet/85"
            >
              START A PROJECT
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-brand-ivory/20 px-8 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-ivory transition-colors hover:bg-white/5"
            >
              VIEW SERVICES
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
