import React, { useEffect, useRef, useState } from "react";

const categories = ["CUISINE", "SÉJOUR", "SUITE", "PISCINE", "SALLE D'EAU"];

const categoryMap: Record<string, { folder: string; files: string[] }> = {
  "CUISINE": {
    folder: "cuisine",
    files: ["cuisine.jpg", "cuisine-miniature-1.jpg", "cuisine-miniature-2.jpg", "cuisine-miniature-3.jpg", "cuisine-miniature-4.jpg", "cuisine-miniature-5.jpg"]
  },
  "SÉJOUR": {
    folder: "sejour",
    files: ["sejour.jpg", "sejour-miniature-1.jpg", "sejour-miniature-2.jpg", "sejour-miniature-3.jpg", "sejour-miniature-4.jpg", "sejour-miniature-5.jpg"]
  },
  "SUITE": {
    folder: "suite",
    files: ["suite.jpg", "suite-miniature-1.jpg", "suite-miniature-2.jpg", "suite-miniature-3.jpg", "suite-miniature-4.jpg", "suite-miniature-5.jpg"]
  },
  "PISCINE": {
    folder: "piscine",
    files: ["piscine.jpg", "piscine-miniature-1.jpg", "piscine-miniature-2.jpg", "piscine-miniature-3.jpg", "piscine-miniature-4.jpg", "piscine-miniature-5.jpg"]
  },
  "SALLE D'EAU": {
    folder: "salle-deau",
    files: ["salle-deau.jpg", "salle-deau-miniature-1.jpg", "salle-deau-miniature-2.jpg", "salle-deau-miniature-3.jpg", "salle-deau-miniature-4.jpg", "salle-deau-miniature-5.jpg"]
  }
};

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
  const [activeCat, setActiveCat] = useState("CUISINE");
  // REMOVED DUPLICATE index state here
  const trackRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [layout, setLayout] = useState({
    slideWidth: 0,
    containerWidth: 0,
    gap: GAP_PX,
  });

  const currentCategoryData = categoryMap[activeCat];
  const originalSlides = currentCategoryData.files.map((file, i) => ({
    id: i + 1,
    src: `/sections/interieurs/${currentCategoryData.folder}/${file}`
  }));

  // Triple buffer for infinite loop illusion
  const slides = [...originalSlides, ...originalSlides, ...originalSlides];

  const [index, setIndex] = useState(originalSlides.length);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Reset index when category changes
  useEffect(() => {
    setIsTransitioning(false);
    setIndex(originalSlides.length);
    // Re-enable transition in next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
    });
  }, [activeCat, originalSlides.length]);

  useEffect(() => {
    const measure = () => {
      const slide = trackRef.current?.querySelector("[data-slide]") as HTMLElement | null;
      // Use offsetWidth to get the layout width, ignoring transforms (scale)
      const slideWidth = slide?.offsetWidth ?? 0;
      
      let computedGap = GAP_PX;
      if (trackRef.current) {
        const style = window.getComputedStyle(trackRef.current);
        const gapVal = parseFloat(style.columnGap || style.gap);
        if (Number.isFinite(gapVal)) {
          computedGap = gapVal;
        }
      }

      setLayout({
        slideWidth,
        containerWidth: containerRef.current?.clientWidth ?? 0,
        gap: computedGap,
      });
    };

    measure();
    // Re-measure after a short delay to ensure DOM is ready
    const timer = setTimeout(measure, 100);

    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(timer);
    };
  }, [activeCat]);

  const handleTransitionEnd = () => {
    const len = originalSlides.length;
    if (index < len) {
      setIsTransitioning(false);
      setIndex(index + len);
    } else if (index >= 2 * len) {
      setIsTransitioning(false);
      setIndex(index - len);
    }
  };

  const handlePrev = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      requestAnimationFrame(() => setIndex((prev) => prev - 1));
    } else {
      setIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      requestAnimationFrame(() => setIndex((prev) => prev + 1));
    } else {
      setIndex((prev) => prev + 1);
    }
  };

  const slideSpan = layout.slideWidth + layout.gap;
  // Center the current slide:
  // Offset = (ContainerWidth - SlideWidth) / 2
  // Position = Index * SlideSpan
  // TranslateX = -(Position - Offset)
  const translateX =
    layout.slideWidth && layout.containerWidth
      ? -(index * slideSpan - (layout.containerWidth - layout.slideWidth) / 2)
      : 0;

  return (
    <section className="py-20 text-center text-white" id="interiors-carousel">
      <div>
        <div className="mb-10">
          <h3 className="mb-2 font-['PhotographSignature'] text-5xl text-gold-500">
            Un Style de Vie
          </h3>
          <h2 className="text-3xl font-bold uppercase tracking-wider">LUXUEUX ET MODERNE</h2>
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-2 md:gap-4 px-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`rounded-full border px-4 py-2 text-xs md:text-sm font-semibold uppercase tracking-wide transition-all
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

        <div className="relative mx-auto max-w-6xl px-0 md:px-10" ref={containerRef}>
          <div
            ref={trackRef}
            onTransitionEnd={handleTransitionEnd}
            className={`flex items-center gap-4 md:gap-6 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
              isTransitioning ? "transition-transform duration-700" : "duration-0"
            }`}
            style={{ transform: `translateX(${translateX}px)` }}
          >
            {slides.map((slide, i) => {
              const isActive = i === index;
              
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
                    w-[85vw] sm:w-[62vw] md:w-[52vw] lg:w-[480px] xl:w-[520px] aspect-[3/4] md:aspect-[4/3]
                  `}
                >
                  <img
                    src={slide.src}
                    alt="Lifestyle"
                    className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
                      isActive ? "" : "blur-[0.5px] brightness-105"
                    }`}
                    draggable={false}
                  />
                  {!isActive && (
                    <div className="pointer-events-none absolute inset-0 bg-white/35 backdrop-blur-[2px]" />
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handlePrev}
            aria-label="Precedent"
            className="absolute left-2 md:left-[50%] md:-translate-x-[340px] top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#031B17] shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition hover:bg-[#C2A15C] hover:text-black z-20"
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Suivant"
            className="absolute right-2 md:right-[50%] md:translate-x-[340px] top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#031B17] shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition hover:bg-[#C2A15C] hover:text-black z-20"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>
      </div>
    </section>
  );
}
