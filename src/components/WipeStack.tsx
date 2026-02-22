import React, { useEffect, useMemo, useRef, useState } from "react";

export type Slide = { key: string; element: React.ReactNode };
type Props = { slides: Slide[] };

function getMaxScrollTop() {
  const docEl = document.documentElement;
  const body = document.body;
  const root = document.getElementById("root");

  const vals = [
    window.scrollY || 0,
    docEl?.scrollTop || 0,
    body?.scrollTop || 0,
    root ? (root as HTMLElement).scrollTop || 0 : 0,
  ];

  return Math.max(...vals);
}

export default function WipeStack({ slides }: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapperRef.current;
      if (!el) return;

      const vhUnit =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--vh")) ||
        window.innerHeight * 0.01;

      const viewportPx = vhUnit * 100;

      // position du wrapper dans le document (référentiel window)
      const rect = el.getBoundingClientRect();
      const topInDoc = getMaxScrollTop() + rect.top;

      const range = Math.max(1, (slides.length - 1) * viewportPx);
      const local = getMaxScrollTop() - topInDoc;

      const p = Math.min(1, Math.max(0, local / range));
      setProgress(p);
    };

    // écoute partout (window + root + document)
    const root = document.getElementById("root");
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true } as any);
    root?.addEventListener("scroll", onScroll, { passive: true } as any);

    window.addEventListener("resize", onScroll);
    window.visualViewport?.addEventListener("resize", onScroll);

    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll as any);
      root?.removeEventListener("scroll", onScroll as any);

      window.removeEventListener("resize", onScroll);
      window.visualViewport?.removeEventListener("resize", onScroll);
    };
  }, [slides.length]);

  const seg = useMemo(() => {
    if (slides.length <= 1) return { idx: 0, e: 0 };
    const s = progress * (slides.length - 1);
    const idx = Math.min(slides.length - 1, Math.max(0, Math.floor(s)));
    const t = s - idx;
    const e = t * t * (3 - 2 * t);
    return { idx, e };
  }, [progress, slides.length]);

  const wipeHeight = `calc(${slides.length} * var(--vh, 1vh) * 100)`;
  const viewportHeight = `calc(var(--vh, 1vh) * 100)`;

  return (
    <div ref={wrapperRef} className="relative" style={{ height: wipeHeight }}>
      <div className="sticky top-0 w-full overflow-hidden" style={{ height: viewportHeight }}>
        {slides.map((s, i) => {
          let yPct = 100;
          if (i < seg.idx) yPct = -100;
          if (i === seg.idx) yPct = 0;
          if (i === seg.idx + 1) yPct = (1 - seg.e) * 100;

          const isVisible = i === seg.idx || i === seg.idx + 1;

          return (
            <div
              key={s.key}
              className="absolute inset-0"
              style={{
                transform: `translateY(${yPct}%)`,
                willChange: "transform",
                pointerEvents: isVisible ? "auto" : "none",
              }}
            >
              <div className="w-full" style={{ height: viewportHeight }}>
                {s.element}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
