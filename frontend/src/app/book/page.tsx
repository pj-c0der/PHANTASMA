"use client";

import {
  useState,
  type DragEvent,
  type FormEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  ChevronDown,
  CloudUpload,
  Info,
  X,
} from "lucide-react";
import { ApiRequestError, submitForm } from "@/lib/api";

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

type BookingField =
  | "fullName"
  | "email"
  | "contactNumber"
  | "service"
  | "projectDate"
  | "location"
  | "scope"
  | "projectDetails";

const requiredFields: { name: BookingField; label: string }[] = [
  { name: "fullName", label: "full name" },
  { name: "email", label: "email address" },
  { name: "contactNumber", label: "contact number" },
  { name: "service", label: "service" },
  { name: "projectDate", label: "event/project date" },
  { name: "location", label: "location" },
  { name: "scope", label: "estimated project scope" },
  { name: "projectDetails", label: "project details" },
];

const apiFieldNames: Record<string, BookingField> = {
  fullName: "fullName",
  full_name: "fullName",
  email: "email",
  contactNumber: "contactNumber",
  contact_number: "contactNumber",
  service: "service",
  projectDate: "projectDate",
  project_date: "projectDate",
  location: "location",
  scope: "scope",
  projectDetails: "projectDetails",
  project_details: "projectDetails",
};

function FieldLabel({
  htmlFor,
  label,
  required = true,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-center justify-between gap-3"
    >
      <span className={labelClasses}>{label}</span>
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

export default function BookPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<BookingField, string>>
  >({});
  const [submissionId, setSubmissionId] = useState<number | null>(null);
  const [emailNotificationSent, setEmailNotificationSent] = useState<
    boolean | null
  >(null);
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

  const clearFieldError = (field: BookingField) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setSubmissionError("");
  };

  const inputClassName = (field: BookingField) =>
    `${inputClasses} ${
      fieldErrors[field]
        ? "border-red-400 focus:border-red-400"
        : ""
    }`;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmissionError("");

    const form = event.currentTarget;
    try {
      const formData = new FormData(form);
      const optionalValue = (key: string) =>
        String(formData.get(key) ?? "").trim() || null;
      const nextFieldErrors: Partial<Record<BookingField, string>> = {};
      for (const field of requiredFields) {
        if (!String(formData.get(field.name) ?? "").trim()) {
          nextFieldErrors[field.name] =
            field.name === "service"
              ? "Please choose a service."
              : `Please enter your ${field.label}.`;
        }
      }

      const email = String(formData.get("email") ?? "").trim();
      if (
        email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ) {
        nextFieldErrors.email = "Enter a valid email address.";
      }

      if (Object.keys(nextFieldErrors).length > 0) {
        setFieldErrors(nextFieldErrors);
        setSubmissionError(
          "Please complete the highlighted fields before submitting.",
        );
        const firstInvalidField = requiredFields.find(
          ({ name }) => nextFieldErrors[name],
        );
        if (firstInvalidField) {
          document.getElementById(firstInvalidField.name)?.focus();
        }
        return;
      }

      const receipt = await submitForm("/api/project-inquiries", {
        fullName: String(formData.get("fullName") ?? ""),
        email: String(formData.get("email") ?? ""),
        contactNumber: optionalValue("contactNumber"),
        service: String(formData.get("service") ?? ""),
        projectDate: optionalValue("projectDate"),
        location: optionalValue("location"),
        scope: optionalValue("scope"),
        budget: optionalValue("budget"),
        projectDetails: optionalValue("projectDetails"),
      });
      setSubmissionId(receipt.id);
      setEmailNotificationSent(receipt.emailNotificationSent ?? null);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      if (error instanceof ApiRequestError && error.fieldErrors.length > 0) {
        const nextFieldErrors: Partial<Record<BookingField, string>> = {};
        for (const apiError of error.fieldErrors) {
          const field = apiFieldNames[apiError.field];
          if (field) nextFieldErrors[field] = apiError.message;
        }
        if (Object.keys(nextFieldErrors).length > 0) {
          setFieldErrors(nextFieldErrors);
          setSubmissionError(
            "Please review the highlighted fields and try again.",
          );
        } else {
          setSubmissionError(error.message);
        }
      } else {
        setSubmissionError(
          error instanceof Error
            ? error.message
            : "Could not save your project inquiry.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
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
                      src="/images/form.png"
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

                    <form
                      onSubmit={handleSubmit}
                      className="mt-8"
                      noValidate
                    >
                      {submissionError && (
                        <div
                          role="alert"
                          className="mb-8 flex items-start gap-3 rounded-md border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200"
                        >
                          <AlertCircle
                            className="mt-0.5 h-5 w-5 shrink-0 text-red-400"
                            aria-hidden="true"
                          />
                          <p>{submissionError}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div>
                          <FieldLabel htmlFor="fullName" label="FULL NAME" />
                          <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            placeholder="Jane Doe"
                            className={`mt-3 ${inputClassName("fullName")}`}
                            required
                            aria-invalid={Boolean(fieldErrors.fullName)}
                            aria-describedby={
                              fieldErrors.fullName ? "fullName-error" : undefined
                            }
                            onChange={() => clearFieldError("fullName")}
                          />
                          <FieldError
                            id="fullName-error"
                            message={fieldErrors.fullName}
                          />
                        </div>

                        <div>
                          <FieldLabel htmlFor="email" label="EMAIL ADDRESS" />
                          <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="jane@example.com"
                            className={`mt-3 ${inputClassName("email")}`}
                            required
                            aria-invalid={Boolean(fieldErrors.email)}
                            aria-describedby={
                              fieldErrors.email ? "email-error" : undefined
                            }
                            onChange={() => clearFieldError("email")}
                          />
                          <FieldError
                            id="email-error"
                            message={fieldErrors.email}
                          />
                        </div>

                        <div>
                          <FieldLabel
                            htmlFor="contactNumber"
                            label="CONTACT NUMBER"
                          />
                          <input
                            id="contactNumber"
                            name="contactNumber"
                            type="tel"
                            placeholder="+63 --- --- ----"
                            className={`mt-3 ${inputClassName("contactNumber")}`}
                            required
                            aria-invalid={Boolean(fieldErrors.contactNumber)}
                            aria-describedby={
                              fieldErrors.contactNumber
                                ? "contactNumber-error"
                                : undefined
                            }
                            onChange={() => clearFieldError("contactNumber")}
                          />
                          <FieldError
                            id="contactNumber-error"
                            message={fieldErrors.contactNumber}
                          />
                        </div>

                        <div>
                          <FieldLabel
                            htmlFor="service"
                            label="SERVICE NEEDED"
                          />
                          <div className="relative mt-3">
                            <select
                              id="service"
                              name="service"
                              defaultValue=""
                              className={`${inputClassName("service")} appearance-none pr-8`}
                              required
                              aria-invalid={Boolean(fieldErrors.service)}
                              aria-describedby={
                                fieldErrors.service ? "service-error" : undefined
                              }
                              onChange={() => clearFieldError("service")}
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
                          <FieldError
                            id="service-error"
                            message={fieldErrors.service}
                          />
                        </div>

                        <div>
                          <FieldLabel
                            htmlFor="projectDate"
                            label="EVENT / PROJECT DATE"
                          />
                          <input
                            id="projectDate"
                            name="projectDate"
                            type="date"
                            className={`mt-3 ${inputClassName("projectDate")} [color-scheme:dark]`}
                            required
                            aria-invalid={Boolean(fieldErrors.projectDate)}
                            aria-describedby={
                              fieldErrors.projectDate
                                ? "projectDate-error"
                                : undefined
                            }
                            onChange={() => clearFieldError("projectDate")}
                          />
                          <FieldError
                            id="projectDate-error"
                            message={fieldErrors.projectDate}
                          />
                        </div>

                        <div>
                          <FieldLabel htmlFor="location" label="LOCATION" />
                          <input
                            id="location"
                            name="location"
                            type="text"
                            placeholder="City, venue, or address"
                            className={`mt-3 ${inputClassName("location")}`}
                            required
                            aria-invalid={Boolean(fieldErrors.location)}
                            aria-describedby={
                              fieldErrors.location ? "location-error" : undefined
                            }
                            onChange={() => clearFieldError("location")}
                          />
                          <FieldError
                            id="location-error"
                            message={fieldErrors.location}
                          />
                        </div>

                        <div>
                          <FieldLabel
                            htmlFor="scope"
                            label="ESTIMATED PROJECT SCOPE"
                          />
                          <input
                            id="scope"
                            name="scope"
                            type="text"
                            placeholder="e.g. One-day event, 3-week campaign"
                            className={`mt-3 ${inputClassName("scope")}`}
                            required
                            aria-invalid={Boolean(fieldErrors.scope)}
                            aria-describedby={
                              fieldErrors.scope ? "scope-error" : undefined
                            }
                            onChange={() => clearFieldError("scope")}
                          />
                          <FieldError
                            id="scope-error"
                            message={fieldErrors.scope}
                          />
                        </div>

                        <div>
                          <FieldLabel
                            htmlFor="budget"
                            label="BUDGET RANGE"
                            required={false}
                          />
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
                        <FieldLabel
                          htmlFor="projectDetails"
                          label="PROJECT DETAILS"
                        />
                        <textarea
                          id="projectDetails"
                          name="projectDetails"
                          rows={5}
                          placeholder="Tell us about the project, the story you want to tell, and any references..."
                          className={`mt-3 resize-none ${inputClassName("projectDetails")}`}
                          required
                          aria-invalid={Boolean(fieldErrors.projectDetails)}
                          aria-describedby={
                            fieldErrors.projectDetails
                              ? "projectDetails-error"
                              : undefined
                          }
                          onChange={() => clearFieldError("projectDetails")}
                        />
                        <FieldError
                          id="projectDetails-error"
                          message={fieldErrors.projectDetails}
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
                          <p className="mt-2 text-xs text-brand-ivory/40">
                            Attachments are not included in this test submission yet.
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
                          disabled={isSubmitting}
                          className="w-full rounded-full bg-brand-violet px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-ivory transition-colors hover:bg-brand-violet/85 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        >
                          {isSubmitting ? "SENDING..." : "SUBMIT PROJECT INQUIRY"}
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
                  Your inquiry has been saved as reference #{submissionId}. Our team will carefully review the details you&apos;ve shared
                  and reach out within 2-3 business days to coordinate next
                  steps and confirm your project timeline.
                </p>
                {emailNotificationSent !== null && (
                  <p
                    role="status"
                    className={`mt-4 max-w-2xl text-sm leading-6 ${
                      emailNotificationSent
                        ? "text-brand-ivory/50"
                        : "text-amber-200"
                    }`}
                  >
                    {emailNotificationSent
                      ? "The team notification was accepted by the email server."
                      : "Your inquiry was saved, but the team email notification could not be sent. Please contact us directly."}
                  </p>
                )}
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
