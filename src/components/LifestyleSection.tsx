import React, { useEffect, useRef, useState } from "react";

const categories = ["CUISINE", "SÉJOUR", "SUITE", "PISCINE", "SALLE D'EAU"];

const slides = [
  { id: 1, src: "/sections/lifestyle1.png" },
  { id: 2, src: "/sections/lifestyle2.png" },
  { id: 3, src: "/sections/lifestyle3.png" },
  { id: 4, src: "/sections/lifestyle4.png" },
];

const GAP_PX = 24; // gap-6

function ArrowIcon({ direction = "left" }: { direction?: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={direction === "right" ? "rotate-180" : ""}
    >
      <path
        d="M14.5 6.5 9 12l5.5 5.5"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LifestyleSection() {
  const [activeCat, setActiveCat] = useState("PISCINE");
  const [index, setIndex] = useState(1);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [layout, setLayout] = useState({
    slideWidth: 0,
    containerWidth: 0,
    gap: GAP_PX,
  });

  const paddedSlides = [slides[slides.length - 1], ...slides, slides[0]];

  useEffect(() => {
    const measure = () => {
      const slide = trackRef.current?.querySelector("[data-slide]") as HTMLElement | null;
      const slideWidth = slide?.clientWidth ?? 0;
      const computedGap = trackRef.current
        ? parseFloat(getComputedStyle(trackRef.current).columnGap || `${GAP_PX}`)
        : GAP_PX;
      setLayout({
        slideWidth,
        containerWidth: containerRef.current?.clientWidth ?? 0,
        gap: Number.isFinite(computedGap) ? computedGap : GAP_PX,
      });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const goTo = (next: number) => {
    const max = slides.length;
    setIndex(((next % max) + max) % max);
  };

  const handlePrev = () => goTo(index - 1);
  const handleNext = () => goTo(index + 1);

  const slideSpan = layout.slideWidth + layout.gap;
  const paddedIndex = index + 1;
  const translateX =
    layout.slideWidth && layout.containerWidth
      ? -(paddedIndex * slideSpan - (layout.containerWidth - layout.slideWidth) / 2)
      : 0;

  return (
    <section className="py-20 text-center text-white">
      <div>
        <div className="mb-10">
          <h3 className="mb-2 font-['PhotographSignature'] text-5xl text-gold-500">
            Un Style de Vie
          </h3>
          <h2 className="text-3xl font-bold uppercase tracking-wider">LUXUEUX ET MODERNE</h2>
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`rounded-full border px-6 py-2 text-sm font-semibold uppercase tracking-wide transition-all
                ${
                  activeCat === cat
                    ? "border-gold-500 bg-gold-500 text-black"
                    : "border-white/30 text-white/70 hover:border-white hover:text-white"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative mx-auto max-w-6xl px-4 md:px-10" ref={containerRef}>
          <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-[#031B17] to-transparent md:w-16" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-[#031B17] to-transparent md:w-16" />

          <div
            ref={trackRef}
            className="flex items-center gap-6 transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
            style={{ transform: `translateX(${translateX}px)` }}
          >
            {paddedSlides.map((slide, i) => {
              const realIndex = (i - 1 + slides.length) % slides.length;
              const isActive = realIndex === index;
              return (
                <div
                  key={`${slide.id}-${i}`}
                  data-slide
                  className={`group relative shrink-0 overflow-hidden rounded-[18px] border border-white/5 bg-white/5 shadow-[0_10px_50px_rgba(0,0,0,0.35)] backdrop-blur transition-all duration-500
                    ${
                      isActive
                        ? "scale-[1.02] opacity-100 shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
                        : "scale-[0.95] opacity-80"
                    }
                    w-[78vw] sm:w-[62vw] md:w-[52vw] lg:w-[480px] xl:w-[520px] aspect-[4/3]
                  `}
                >
                  <img
                    src={slide.src}
                    alt="Lifestyle"
                    className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
                      isActive ? "" : "blur-\[0\.5px\] brightness-105"
                    }`}
                    draggable={false}
                  />
                  {!isActive && (
                    <div className="pointer-events-none absolute inset-0 bg-white/35 backdrop-blur-\[1px\]" />
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handlePrev}
            aria-label="Precedent"
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#031B17] shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition hover:bg-[#C2A15C] hover:text-black md:left-4"
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Suivant"
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#031B17] shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition hover:bg-[#C2A15C] hover:text-black md:right-4"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>
      </div>
    </section>
  );
}
