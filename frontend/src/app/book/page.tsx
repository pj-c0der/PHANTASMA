"use client";

import {
  useState,
  type DragEvent,
  type FormEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, CloudUpload, Info, X } from "lucide-react";

const inputClasses =
  "w-full bg-transparent border-b border-brand-ivory/20 py-2 text-brand-ivory placeholder-brand-ivory/30 focus:border-brand-violet focus:outline-none transition-colors";
const labelClasses =
  "block text-[10px] uppercase tracking-[0.25em] text-brand-ivory/40";

const services = [
  "Photography",
  "Video Production & Post-Production",
  "Graphic Design",
  "Photobooks & Keepsakes",
  "Digital Presets & Templates",
  "Other",
];

export default function BookPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const incoming = Array.from(list);
    setFiles((previous) => [...previous, ...incoming]);
  };

  const removeFile = (index: number) => {
    setFiles((previous) => previous.filter((_, i) => i !== index));
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsDragging(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-brand-black">
      {/* Header */}
      <section className="px-6 pb-16 pt-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-xs uppercase tracking-[0.4em] text-brand-ivory/40"
          >
            START A PROJECT
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
            className="mt-4 font-serif text-5xl font-bold leading-[1.05] text-brand-ivory md:text-7xl"
          >
            LET&apos;S CREATE SOMETHING MEANINGFUL
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mx-auto mt-8 max-w-2xl text-sm leading-7 text-brand-ivory/60 sm:text-base"
          >
            Share a few details about your project and our team will get back
            to you with the next steps.
          </motion.p>
        </div>
      </section>

      {/* Main content */}
      <section className="px-6 pb-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="inquiry-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.5fr]">
                  {/* Visual */}
                  <div className="relative h-[600px] w-full overflow-hidden rounded-md bg-zinc-900 lg:h-full lg:min-h-[600px]">
                    <Image
                      src="/images/hero-bg-placeholder.jpg"
                      alt="Abstract violet light bending across a dark background"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/50 to-brand-black/10"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <p className="font-serif text-2xl leading-snug text-brand-ivory">
                        Every inquiry begins a conversation about your story.
                      </p>
                      <div className="mt-5 flex items-start gap-3 text-xs leading-5 text-brand-ivory/60">
                        <Info
                          className="mt-0.5 h-4 w-4 shrink-0 text-brand-violet"
                          aria-hidden="true"
                        />
                        <span>
                          We typically respond within 1-2 business days.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-brand-ivory/40">
                      01 / PROJECT INQUIRY FORM
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8">
                      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div>
                          <label htmlFor="fullName" className={labelClasses}>
                            FULL NAME
                          </label>
                          <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            placeholder="Jane Doe"
                            className={`mt-3 ${inputClasses}`}
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className={labelClasses}>
                            EMAIL ADDRESS
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="jane@example.com"
                            className={`mt-3 ${inputClasses}`}
                          />
                        </div>

                        <div>
                          <label htmlFor="contactNumber" className={labelClasses}>
                            CONTACT NUMBER
                          </label>
                          <input
                            id="contactNumber"
                            name="contactNumber"
                            type="tel"
                            placeholder="+63 --- --- ----"
                            className={`mt-3 ${inputClasses}`}
                          />
                        </div>

                        <div>
                          <label htmlFor="service" className={labelClasses}>
                            SERVICE NEEDED
                          </label>
                          <div className="relative mt-3">
                            <select
                              id="service"
                              name="service"
                              defaultValue=""
                              className={`${inputClasses} appearance-none pr-8`}
                            >
                              <option
                                value=""
                                disabled
                                className="bg-zinc-900 text-brand-ivory"
                              >
                                Select a service
                              </option>
                              {services.map((service) => (
                                <option
                                  key={service}
                                  value={service}
                                  className="bg-zinc-900 text-brand-ivory"
                                >
                                  {service}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ivory/40"
                              aria-hidden="true"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="projectDate" className={labelClasses}>
                            EVENT / PROJECT DATE
                          </label>
                          <input
                            id="projectDate"
                            name="projectDate"
                            type="date"
                            className={`mt-3 ${inputClasses} [color-scheme:dark]`}
                          />
                        </div>

                        <div>
                          <label htmlFor="location" className={labelClasses}>
                            LOCATION
                          </label>
                          <input
                            id="location"
                            name="location"
                            type="text"
                            placeholder="City, venue, or address"
                            className={`mt-3 ${inputClasses}`}
                          />
                        </div>

                        <div>
                          <label htmlFor="scope" className={labelClasses}>
                            ESTIMATED PROJECT SCOPE
                          </label>
                          <input
                            id="scope"
                            name="scope"
                            type="text"
                            placeholder="e.g. One-day event, 3-week campaign"
                            className={`mt-3 ${inputClasses}`}
                          />
                        </div>

                        <div>
                          <label htmlFor="budget" className={labelClasses}>
                            BUDGET RANGE (OPTIONAL)
                          </label>
                          <input
                            id="budget"
                            name="budget"
                            type="text"
                            placeholder="e.g. ₱50,000 – ₱100,000"
                            className={`mt-3 ${inputClasses}`}
                          />
                        </div>
                      </div>

                      <div className="mt-8">
                        <label
                          htmlFor="projectDetails"
                          className={labelClasses}
                        >
                          PROJECT DETAILS
                        </label>
                        <textarea
                          id="projectDetails"
                          name="projectDetails"
                          rows={5}
                          placeholder="Tell us about the project, the story you want to tell, and any references..."
                          className={`mt-3 resize-none ${inputClasses}`}
                        />
                      </div>

                      {/* Upload */}
                      <div className="mt-8">
                        <p className={labelClasses}>ATTACHMENTS</p>
                        <label
                          htmlFor="project-files"
                          onDragOver={(event) => {
                            event.preventDefault();
                            setIsDragging(true);
                          }}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`mt-3 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center transition-colors focus-within:border-brand-violet ${
                            isDragging
                              ? "border-brand-violet bg-brand-violet/5"
                              : "border-brand-ivory/20 hover:border-brand-violet"
                          }`}
                        >
                          <CloudUpload
                            className="h-6 w-6 text-brand-ivory/50"
                            aria-hidden="true"
                          />
                          <p className="mt-4 text-sm text-brand-ivory/60">
                            Drag &amp; drop files here, or{" "}
                            <span className="text-brand-violet">browse</span>
                          </p>
                          <p className="mt-2 text-xs text-brand-ivory/40">
                            PDF, JPG, PNG, MP4 — Max 25MB
                          </p>
                          <input
                            id="project-files"
                            name="attachments"
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png,.mp4"
                            className="sr-only"
                            onChange={(event) => {
                              addFiles(event.target.files);
                              event.target.value = "";
                            }}
                          />
                        </label>

                        {files.length > 0 && (
                          <ul className="mt-4 space-y-2">
                            {files.map((file, index) => (
                              <li
                                key={`${file.name}-${file.size}-${index}`}
                                className="flex items-center justify-between gap-4 rounded-md bg-zinc-900/60 px-3 py-2 text-xs text-brand-ivory/60"
                              >
                                <span className="truncate">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  aria-label={`Remove ${file.name}`}
                                  className="shrink-0 text-brand-ivory/40 transition-colors hover:text-brand-ivory"
                                >
                                  <X
                                    className="h-3.5 w-3.5"
                                    aria-hidden="true"
                                  />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="mt-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                        <p className="text-xs leading-5 text-brand-ivory/40">
                          By submitting, you agree to our project terms.
                        </p>
                        <button
                          type="submit"
                          className="w-full rounded-full bg-brand-violet px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-ivory transition-colors hover:bg-brand-violet/85 sm:w-auto"
                        >
                          SUBMIT PROJECT INQUIRY
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-brand-violet/40 bg-brand-violet/10">
                  <Check
                    className="h-6 w-6 text-brand-violet"
                    aria-hidden="true"
                  />
                </div>
                <h2 className="mt-8 max-w-3xl font-serif text-3xl leading-tight text-brand-ivory sm:text-4xl md:text-5xl">
                  Thank You. Your project inquiry has been received.
                </h2>
                <p className="mt-6 max-w-2xl text-sm leading-7 text-brand-ivory/60 sm:text-base">
                  Our team will carefully review the details you&apos;ve shared
                  and reach out within 2-3 business days to coordinate next
                  steps and confirm your project timeline.
                </p>
                <Link
                  href="/"
                  className="mt-10 rounded-full border border-brand-ivory/20 px-8 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-ivory transition-colors hover:bg-white/5"
                >
                  RETURN TO HOME
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
