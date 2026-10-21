type EcosystemColumn = {
  number: string;
  title: string;
  items: string[];
};

const ecosystemColumns: EcosystemColumn[] = [
  {
    number: "01",
    title: "CREATIVE MEDIA",
    items: [
      "Photography",
      "Video Production & Post-Production",
      "Graphic Design",
    ],
  },
  {
    number: "02",
    title: "PHYSICAL PRODUCTS",
    items: [
      "Photobooks",
      "Framed Portraits",
      "Event Souvenirs",
      "USB Keepsake Boxes",
    ],
  },
  {
    number: "03",
    title: "DIGITAL PRODUCTS",
    items: ["Editing Presets", "Video LUTs", "Design Templates"],
  },
];

export default function Ecosystem() {
  return (
    <section className="px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-ivory/40">
            WHAT WE DO
          </p>
          <h2 className="mt-4 font-serif text-4xl text-brand-ivory">
            Our Creative Ecosystem
          </h2>
        </div>

        <div className="grid grid-cols-1 divide-y divide-brand-ivory/10 md:grid-cols-3 md:divide-x md:divide-y-0">
          {ecosystemColumns.map((column) => (
            <div key={column.number} className="py-10 md:px-6 md:py-0 lg:px-10">
              <p className="text-xs tracking-[0.2em] text-brand-ivory/40">
                {column.number}
              </p>
              <h3 className="mt-4 font-serif text-xl uppercase tracking-[0.08em] text-brand-ivory">
                {column.title}
              </h3>
              <ul className="mt-8">
                {column.items.map((item) => (
                  <li
                    key={item}
                    className="border-b border-brand-ivory/10 py-5 text-sm text-brand-ivory/60"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
