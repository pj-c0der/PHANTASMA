"use client";

import { motion } from "framer-motion";
import ReflectiveCard from "@/components/ui/ReflectiveCard";

type Founder = {
  name: string;
  role: string;
  imageSrc: string;
  idValue: string;
};

type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

const founders: Founder[] = [
  {
    name: "Vin Hendrix Presto",
    role: "CO-FOUNDER",
    imageSrc: "/team/vin.jpg",
    idValue: "8901 2345 6789",
  },
  {
    name: "Peter Sloanne Miralles",
    role: "CO-FOUNDER",
    imageSrc: "/team/peter.jpg",
    idValue: "1234 5678 9012",
  },
  {
    name: "Russel James Buen",
    role: "CO-FOUNDER",
    imageSrc: "/team/russel.jpg",
    idValue: "5678 9012 3456",
  },
  {
    name: "Donny Pangilinan",
    role: "CO-FOUNDER",
    imageSrc: "/team/prespurt.jpg",
    idValue: "9012 3456 7890",
  },
];

const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "DISCOVER",
    description: "Client discovers the studio through the website.",
  },
  {
    number: "02",
    title: "EXPLORE",
    description: "Client views portfolio and services.",
  },
  {
    number: "03",
    title: "INQUIRE",
    description: "Client submits project inquiry form.",
  },
  {
    number: "04",
    title: "BOOK",
    description: "Client secures a schedule.",
  },
  {
    number: "05",
    title: "CREATE",
    description: "Phantasma Studio handles the creative process.",
  },
  {
    number: "06",
    title: "DELIVER",
    description: "Client receives the completed digital or physical output.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-brand-black pt-32">
      {/* Intro & Vision / Mission */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <section className="px-6 pb-24 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="font-serif text-5xl font-bold leading-none text-brand-ivory sm:text-6xl lg:text-7xl">
              ABOUT PHANTASMA
            </h1>
            <p className="mx-auto mt-8 max-w-3xl text-sm leading-8 text-brand-ivory/60 sm:text-base">
              Phantasma Studio is a home-and school-based creative
              microenterprise in Pasig City, managed and operated by college
              students. The studio combines creative media services, customized
              physical products, digital creative products, and
              technology-enabled client engagement to bring stories and visions
              to life.
            </p>
          </div>

          <div className="mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
            <div className="border border-brand-ivory/10 bg-brand-ivory/[0.03] p-10">
              <p className="text-xs uppercase tracking-[0.35em] text-brand-ivory/40">
                — VISION
              </p>
              <p className="mt-6 text-sm leading-7 text-brand-ivory/70 sm:text-base">
                To become a trusted creative media enterprise that transforms
                moments and ideas into timeless, meaningful, and compelling
                visual experiences.
              </p>
            </div>

            <div className="border border-brand-ivory/10 bg-brand-ivory/[0.03] p-10">
              <p className="text-xs uppercase tracking-[0.35em] text-brand-ivory/40">
                — MISSION
              </p>
              <p className="mt-6 text-sm leading-7 text-brand-ivory/70 sm:text-base">
                To deliver accessible and high-quality photography, video,
                graphic design, and creative media solutions by combining
                technology, innovation, and craftsmanship to bring out
                clients&apos; stories and visions to life.
              </p>
            </div>
          </div>
        </section>
      </motion.div>

      {/* The Team */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <section className="px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-brand-ivory/40">
                THE TEAM
              </p>
              <h2 className="mt-4 font-serif text-4xl text-brand-ivory sm:text-5xl">
                Founding Partners
              </h2>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {founders.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                    ease: "easeOut",
                  }}
                  className="flex flex-col items-center"
                >
                  {/* 1. The container giving the 3D canvas its shape */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm">
                    {/* 2. The React Bits Component */}
                    <ReflectiveCard
                      name={member.name}
                      role={member.role}
                      idValue={member.idValue}
                      imageSrc={member.imageSrc}
                      width="100%"
                      height="100%"
                      webcam={false}
                      tint="#d4bcd6"
                      metalness={0.6}
                      roughness={0}
                      blurStrength={0}
                      shine={1}
                      glare={0.4}
                      grayscale={1}
                      warp={0}
                      warpScale={0}
                      bevel={0}
                      tiltStrength={3}
                      radius={24}
                      enableTilt={true}
                      intro={true}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <section className="px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-brand-ivory/40">
                HOW IT WORKS
              </p>
              <h2 className="mt-4 font-serif text-4xl text-brand-ivory sm:text-5xl">
                From Discovery to Delivery
              </h2>
            </div>

            <div className="relative mt-20">
              <span
                aria-hidden="true"
                className="absolute left-[8.333%] right-[8.333%] top-7 hidden border-t border-brand-ivory/15 md:block"
              />

              <div className="relative flex flex-col gap-12 md:flex-row md:gap-0">
                {processSteps.map((step, index) => (
                  <div
                    key={step.number}
                    className="flex flex-1 flex-col items-center px-0 text-center md:px-3"
                  >
                    <div
                      className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full border text-xs tracking-[0.15em] ${
                        index === processSteps.length - 1
                          ? "border-brand-violet bg-brand-violet text-brand-ivory"
                          : "border-brand-ivory/20 bg-brand-black text-brand-ivory/60"
                      }`}
                    >
                      {step.number}
                    </div>
                    <h3 className="mt-6 font-serif text-sm uppercase tracking-[0.2em] text-brand-ivory">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-[15rem] text-xs leading-6 text-brand-ivory/50">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
