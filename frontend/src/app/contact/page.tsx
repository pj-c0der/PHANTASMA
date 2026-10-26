"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { ApiRequestError, submitForm } from "@/lib/api";

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
  {
    id: "fullName",
    label: "FULL NAME",
    type: "text",
    placeholder: "Jane Doe",
    required: true,
  },
  {
    id: "email",
    label: "EMAIL ADDRESS",
    type: "email",
    placeholder: "jane@example.com",
    required: true,
  },
  {
    id: "contactNumber",
    label: "CONTACT NUMBER",
    type: "tel",
    placeholder: "+63 --- --- ----",
    required: false,
  },
  {
    id: "subject",
    label: "SUBJECT",
    type: "text",
    placeholder: "Inquiry about...",
    required: false,
  },
] as const;

const inputClasses =
  "w-full bg-transparent border-b border-brand-ivory/20 py-2 text-brand-ivory placeholder-brand-ivory/30 focus:border-brand-violet focus:outline-none transition-colors";
const requiredContactFields = ["fullName", "email", "message"] as const;
type ContactField = (typeof fields)[number]["id"] | "message";

const apiFieldNames: Record<string, ContactField> = {
  fullName: "fullName",
  full_name: "fullName",
  email: "email",
  contactNumber: "contactNumber",
  contact_number: "contactNumber",
  subject: "subject",
  message: "message",
};

function FieldLabel({
  htmlFor,
  label,
  required,
}: {
  htmlFor: string;
  label: string;
  required: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-center justify-between gap-3"
    >
      <span className="block text-[10px] uppercase tracking-[0.25em] text-brand-ivory/40">
        {label}
      </span>
      <span
        className={`text-[9px] uppercase tracking-[0.2em] ${
          required ? "text-brand-violet" : "text-brand-ivory/30"
        }`}
      >
        {required ? "Required" : "Optional"}
      </span>
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p
      id={id}
      className="mt-2 flex items-center gap-2 text-xs leading-5 text-red-300"
    >
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

// Set to "/images/map-placeholder.jpg" once the map asset is added.
const mapImage = "/images/map-placeholder.jpg";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<ContactField, string>>
  >({});

  const clearFieldError = (field: ContactField) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setSubmissionMessage("");
    setSubmissionStatus("idle");
  };

  const inputClassName = (field: ContactField) =>
    `${inputClasses} ${
      fieldErrors[field] ? "border-red-400 focus:border-red-400" : ""
    }`;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmissionStatus("submitting");
    setSubmissionMessage("");

    const form = event.currentTarget;
    try {
      const formData = new FormData(form);
      const nextFieldErrors: Partial<Record<ContactField, string>> = {};
      for (const field of requiredContactFields) {
        if (!String(formData.get(field) ?? "").trim()) {
          nextFieldErrors[field] =
            field === "message"
              ? "Please enter your message."
              : `Please enter your ${field === "fullName" ? "full name" : "email address"}.`;
        }
      }

      const email = String(formData.get("email") ?? "").trim();
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        nextFieldErrors.email = "Enter a valid email address.";
      }

      if (Object.keys(nextFieldErrors).length > 0) {
        setFieldErrors(nextFieldErrors);
        setSubmissionStatus("error");
        setSubmissionMessage(
          "Please complete the highlighted fields before sending.",
        );
        const firstInvalidField = requiredContactFields.find(
          (field) => nextFieldErrors[field],
        );
        if (firstInvalidField) {
          document.getElementById(firstInvalidField)?.focus();
        }
        return;
      }

      const receipt = await submitForm("/api/contact-messages", {
        fullName: String(formData.get("fullName") ?? ""),
        email,
        contactNumber: String(formData.get("contactNumber") ?? "").trim() || null,
        subject: String(formData.get("subject") ?? "").trim() || null,
        message: String(formData.get("message") ?? ""),
      });
      setSubmissionStatus("success");
      setSubmissionMessage(`Message saved successfully. Reference #${receipt.id}.`);
      setFieldErrors({});
      form.reset();
    } catch (error) {
      if (error instanceof ApiRequestError && error.fieldErrors.length > 0) {
        const nextFieldErrors: Partial<Record<ContactField, string>> = {};
        for (const apiError of error.fieldErrors) {
          const field = apiFieldNames[apiError.field];
          if (field) nextFieldErrors[field] = apiError.message;
        }

        if (Object.keys(nextFieldErrors).length > 0) {
          setFieldErrors(nextFieldErrors);
          setSubmissionStatus("error");
          setSubmissionMessage(
            "Please review the highlighted fields and try again.",
          );
        } else {
          setSubmissionStatus("error");
          setSubmissionMessage(error.message);
        }
      } else {
        setSubmissionStatus("error");
        setSubmissionMessage(
          error instanceof Error ? error.message : "Could not save your message.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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

            <form className="mt-8" onSubmit={handleSubmit} noValidate>
              {submissionMessage && submissionStatus === "error" && (
                <div
                  role="alert"
                  className="mb-8 flex items-start gap-3 rounded-md border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200"
                >
                  <AlertCircle
                    className="mt-0.5 h-5 w-5 shrink-0 text-red-400"
                    aria-hidden="true"
                  />
                  <p>{submissionMessage}</p>
                </div>
              )}
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
                    <FieldLabel
                      htmlFor={field.id}
                      label={field.label}
                      required={field.required}
                    />
                    <input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      className={`mt-3 ${inputClassName(field.id)}`}
                      required={field.required}
                      maxLength={
                        field.id === "fullName"
                          ? 120
                          : field.id === "email"
                            ? 254
                            : field.id === "contactNumber"
                              ? 40
                              : 200
                      }
                      aria-invalid={Boolean(fieldErrors[field.id])}
                      aria-describedby={
                        fieldErrors[field.id]
                          ? `${field.id}-error`
                          : undefined
                      }
                      onChange={() => clearFieldError(field.id)}
                    />
                    <FieldError
                      id={`${field.id}-error`}
                      message={fieldErrors[field.id]}
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
                <FieldLabel
                  htmlFor="message"
                  label="MESSAGE"
                  required
                />
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us more about your project goals..."
                  className={`mt-3 resize-none ${inputClassName("message")}`}
                  required
                  maxLength={10000}
                  aria-invalid={Boolean(fieldErrors.message)}
                  aria-describedby={
                    fieldErrors.message ? "message-error" : undefined
                  }
                  onChange={() => clearFieldError("message")}
                />
                <FieldError
                  id="message-error"
                  message={fieldErrors.message}
                />
              </motion.div>

              <p
                role={submissionStatus === "success" ? "status" : undefined}
                aria-live="polite"
                className={`mt-6 text-sm ${
                  submissionStatus === "success"
                    ? "text-brand-ivory/70"
                    : "sr-only"
                }`}
              >
                {submissionStatus === "success" ? submissionMessage : ""}
              </p>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                className="mt-4 w-full rounded-full bg-brand-violet px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-brand-ivory transition-colors hover:bg-brand-violet/85 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
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
