"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const directDetails = [
  {
    label: "Email",
    value: "phantasma.studio@gmail.com",
    href: "mailto:phantasma.studio@gmail.com",
  },
  { label: "Phone", value: "+63 917 123 4567", href: "tel:+639171234567" },
];

const socials = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "Behance", href: "#" },
];

const fields = [
  { id: "fullName", label: "FULL NAME", type: "text", placeholder: "Jane Doe" },
  {
    id: "email",
    label: "EMAIL ADDRESS",
    type: "email",
    placeholder: "jane@example.com",
  },
  {
    id: "contactNumber",
    label: "CONTACT NUMBER",
    type: "tel",
    placeholder: "+63 --- --- ----",
  },
  {
    id: "subject",
    label: "SUBJECT",
    type: "text",
    placeholder: "Inquiry about...",
  },
];

const inputClasses =
  "w-full bg-transparent border-b border-brand-ivory/20 py-2 text-brand-ivory placeholder-brand-ivory/30 focus:border-brand-violet focus:outline-none transition-colors";

// Set to "/images/map-placeholder.jpg" once the map asset is added.
const mapImage = "/images/map-placeholder.jpg";

export default function ContactPage() {
  return (
    <div className="bg-brand-black">
      {/* Header */}
      <section className="px-6 pt-32 pb-16 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="block text-xs uppercase tracking-widest text-brand-ivory/40"
          >
            GET IN TOUCH
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
            className="mt-4 font-serif text-5xl font-bold leading-none text-brand-ivory md:text-7xl"
          >
            CONTACT PHANTASMA
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mx-auto mt-8 max-w-2xl text-sm leading-7 text-brand-ivory/60 sm:text-base"
          >
            Let&apos;s discuss your next creative project.
          </motion.p>
        </div>
      </section>

      {/* Information & Form */}
      <section id="message-form" className="scroll-mt-24 px-6 py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-xs uppercase tracking-[0.4em] text-brand-ivory/40">
              INFORMATION
            </p>
            <h2 className="mt-4 font-serif text-3xl text-brand-ivory sm:text-4xl">
              PHANTASMA STUDIO
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-7 text-brand-ivory/60">
              9 Tramo Street, Rosario Village, Barangay Santa Lucia, Pasig City
              1600 Philippines.
            </p>

            <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              >
                <p className="text-xs uppercase tracking-[0.25em] text-brand-ivory/40">
                  DIRECT
                </p>
                <ul className="mt-5 space-y-3">
                  {directDetails.map((detail) => (
                    <li key={detail.label}>
                      <Link
                        href={detail.href}
                        className="text-sm text-brand-ivory/70 transition-colors hover:text-brand-ivory"
                      >
                        {detail.value}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
              >
                <p className="text-xs uppercase tracking-[0.25em] text-brand-ivory/40">
                  SOCIALS
                </p>
                <ul className="mt-5 space-y-3">
                  {socials.map((social) => (
                    <li key={social.label}>
                      <Link
                        href={social.href}
                        className="text-sm text-brand-ivory/70 transition-colors hover:text-brand-ivory"
                      >
                        {social.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>

          {/* Form */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-xs uppercase tracking-[0.4em] text-brand-ivory/40"
            >
              SEND A MESSAGE
            </motion.p>

            <form className="mt-8" onSubmit={(event) => event.preventDefault()}>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: "easeOut",
                    }}
                  >
                    <label
                      htmlFor={field.id}
                      className="block text-[10px] uppercase tracking-[0.25em] text-brand-ivory/40"
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      className={`mt-3 ${inputClasses}`}
                    />
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                className="mt-8"
              >
                <label
                  htmlFor="message"
                  className="block text-[10px] uppercase tracking-[0.25em] text-brand-ivory/40"
                >
                  MESSAGE
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us more about your project goals..."
                  className={`mt-3 resize-none ${inputClasses}`}
                />
              </motion.div>

              <motion.button
                type="submit"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                className="mt-10 w-full rounded-full bg-brand-violet px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-brand-ivory transition-colors hover:bg-brand-violet/85"
              >
                SEND MESSAGE
              </motion.button>
            </form>
          </div>
        </div>
      </section>

      {/* Studio Location */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-xs uppercase tracking-[0.4em] text-brand-ivory/40">
              VISIT OUR STUDIO
            </p>
            <h2 className="mt-4 font-serif text-3xl text-brand-ivory sm:text-4xl">
              Pasig City, Philippines
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative mx-auto mt-10 h-[400px] w-full overflow-hidden rounded-xl"
          >
            {mapImage ? (
              <Image
                src={mapImage}
                alt="Map showing the location of Phantasma Studio in Pasig City"
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover grayscale opacity-70"
              />
            ) : (
              <div
                role="img"
                aria-label="Map placeholder showing the studio location"
                className="absolute inset-0 flex items-center justify-center border border-brand-ivory/10 bg-gradient-to-br from-zinc-900 via-brand-black to-zinc-900 opacity-70 grayscale"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-brand-ivory/30">
                  Map
                </span>
              </div>
            )}
          </motion.div>

          <p className="mt-8 text-[10px] uppercase tracking-widest text-brand-ivory/40">
            9 TRAMO STREET, ROSARIO VILLAGE, BARANGAY SANTA LUCIA, PASIG CITY
            1600
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-brand-ivory/10 px-6 py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <h2 className="font-serif text-3xl leading-tight text-brand-ivory sm:text-4xl md:text-5xl">
            READY TO CREATE SOMETHING MEANINGFUL?
          </h2>
          <Link
            href="#message-form"
            className="mt-10 inline-flex rounded-full bg-brand-violet px-8 py-3 text-sm font-semibold text-brand-ivory transition-colors hover:bg-brand-violet/85"
          >
            START A PROJECT
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
