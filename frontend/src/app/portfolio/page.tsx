"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Play } from "lucide-react";

type Filter = "ALL" | "PHOTOGRAPHY" | "VIDEO" | "GRAPHIC DESIGN";

type Project = {
  id: number;
  category: string;
  filter: Exclude<Filter, "ALL">;
  title: string;
  desc: string;
  aspect: string;
  isVideo?: boolean;
  image?: string;
  video?: string;
};

const filters: Filter[] = ["ALL", "PHOTOGRAPHY", "VIDEO", "GRAPHIC DESIGN"];

const projects: Project[] = [
  {
    id: 1,
    category: "PHOTOGRAPHY",
    filter: "PHOTOGRAPHY",
    title: "Graduation Stories",
    desc: "A warm, dignified academic milestone story capturing pride, gratitude, and achievement.",
    aspect: "aspect-[4/5]",
    image: "/portfolio/gradpic.png",
  },
  {
    id: 2,
    category: "PHOTOGRAPHY / VIDEO",
    filter: "PHOTOGRAPHY",
    title: "An Intimate Celebration",
    desc: "A small, intimate wedding celebration told through quiet, cinematic moments.",
    aspect: "aspect-video",
    image: "/portfolio/celeb.png",
  },
  {
    id: 3,
    category: "PHOTOGRAPHY / DESIGN",
    filter: "PHOTOGRAPHY",
    title: "Resort Visual Campaign",
    desc: "A resort visual brand campaign blending photography and design languages.",
    aspect: "aspect-[21/9]",
    image: "/portfolio/resort.png",
  },
  {
    id: 4,
    category: "VIDEO PRODUCTION",
    filter: "VIDEO",
    title: "Event Highlights",
    desc: "A highlight reel of a local event, capturing energy and memorable moments.",
    aspect: "aspect-video",
    isVideo: true,
    video: "/portfolio/event.mp4",
  },
  {
    id: 5,
    category: "GRAPHIC DESIGN",
    filter: "GRAPHIC DESIGN",
    title: "Campaign Identity",
    desc: "A brand campaign identity system built for consistency and visual impact.",
    aspect: "aspect-video",
    image: "/portfolio/brand.jfif",
  },
];

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("ALL");

  const filteredProjects =
    activeFilter === "ALL"
      ? projects
      : projects.filter((project) => project.filter === activeFilter);

  return (
    <div className="bg-brand-black pt-32">
      <section className="px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-ivory/40">
            Portfolio
          </p>
          <h1 className="mt-4 font-serif text-5xl font-bold leading-none text-brand-ivory sm:text-6xl lg:text-7xl">
            SELECTED WORK
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-sm leading-7 text-brand-ivory/70 sm:text-base">
            A curated look at the stories, campaigns, and moving images we have
            brought to life.
          </p>

          <div className="mt-10 flex justify-center">
            <div
              role="group"
              aria-label="Filter work by category"
              className="flex flex-wrap justify-center gap-1 rounded-full border border-brand-ivory/20 p-1"
            >
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  aria-pressed={activeFilter === filter}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.15em] transition-colors sm:px-5 ${
                    activeFilter === filter
                      ? "bg-brand-violet text-white"
                      : "bg-transparent text-brand-ivory/60 hover:text-brand-ivory"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          layout
          className="mx-auto mt-16 max-w-7xl columns-1 gap-8 md:columns-2"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="mb-12 break-inside-avoid"
              >
                <div
                  className={`relative w-full overflow-hidden rounded-md bg-brand-black/50 ${project.aspect}`}
                >
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : project.video ? (
                    <video
                      src={project.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-br from-brand-violet/25 via-[#150c1e] to-brand-black"
                    />
                  )}

                  <span className="absolute left-4 top-4 z-10 rounded-full border border-white/30 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-widest text-white backdrop-blur-md">
                    {project.category}
                  </span>
                </div>

                <h2 className="mt-4 font-serif text-xl text-brand-ivory">
                  {project.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-brand-ivory/60">
                  {project.desc}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
}
