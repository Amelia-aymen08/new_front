import React, { useEffect, useRef, useState } from "react";

type Stat = {
  value: number;
  prefix?: string;
  label: string;
  sub?: string;
};

const stats: Stat[] = [
  { value: 1500, prefix: "+", label: "APPARTEMENTS", sub: "LIVRÉS" },
  { value: 30, prefix: "+", label: "RÉSIDENCES", sub: "HAUT STANDING" },
  { value: 20, prefix: "+", label: "ANS SAVOIR FAIRE" },
  { value: 15, prefix: "+", label: "COMMUNES", sub: "PRESTIGIEUSES" },
];

function useCountUp(target: number, start: boolean, duration = 1300, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;

    let raf: number;
    let timeout: NodeJS.Timeout;

    const begin = () => {
      const startTime = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.floor(eased * target));
        if (progress < 1) {
          raf = requestAnimationFrame(tick);
        }
      };
      raf = requestAnimationFrame(tick);
    };

    if (delay > 0) {
      timeout = setTimeout(begin, delay);
    } else {
      begin();
    }

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [start, target, duration, delay]);

  return value;
}

function useInViewOnce(threshold = 0.25) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function StatItem({ stat, visible, delayMs, isMain = false }: { stat: Stat; visible: boolean; delayMs: number; isMain?: boolean }) {
  const current = useCountUp(stat.value, visible, 2000, delayMs);
  return (
    <div className={`flex flex-col items-center ${isMain ? "" : ""}`}>
      <div className={`mb-1 font-bold text-gold-500 ${isMain ? "text-6xl md:text-8xl" : "text-4xl md:text-6xl"}`}>
        {stat.prefix ?? ""}{current.toLocaleString("fr-FR")}
      </div>
      <div className={`${isMain ? "text-sm md:text-base" : "text-xs md:text-sm"} font-bold tracking-widest uppercase`}>
        {stat.label}
      </div>
      {stat.sub ? (
        <div className={`mt-1 ${isMain ? "text-xs md:text-sm" : "text-[10px] md:text-xs"} text-white/70 uppercase tracking-widest`}>
          {stat.sub}
        </div>
      ) : null}
    </div>
  );
}

export default function WhyChooseUsSection() {
  const { ref, visible } = useInViewOnce(0.25);

  const mainStat = stats[0];
  const secondaryStats = stats.slice(1);

  return (
    <section ref={ref} className="py-24 text-center text-white">
      <div className="mb-10">
        <h3 className="font-['PhotographSignature'] text-5xl text-gold-500">Pourquoi</h3>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold uppercase tracking-wider">NOUS CHOISIR ?</h2>
      </div>
      <div className="mx-auto mb-16 grid max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="relative rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/20 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-black/20 before:to-transparent before:content-['']"
            style={{ boxShadow: "inset 0 -12px 16px rgba(0,0,0,0.20), 0 10px 22px rgba(0,0,0,0.22)" }}
          >
            <div className="relative z-10 flex items-center gap-6 px-8 py-8">
              <div className="flex h-14 w-14 items-center justify-center">
                <img src="/choose.svg" alt="" className="h-14 w-14" />
              </div>
              <div className="w-[2px] h-14 bg-white/25 rounded" />
              <div className="flex-1 text-left">
                <div className="text-lg font-bold uppercase tracking-wider text-gold-500">AMÉNAGEMENT</div>
                <div className="mt-2 text-sm leading-relaxed text-white/85">
                  Transformez votre espace de vie avec notre service d'aménagement intérieur....
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-12 px-6 md:flex-row md:justify-center md:gap-20">
        {/* Main Stat */}
        <div className="flex-shrink-0 w-full md:w-auto border-b border-white/10 pb-8 md:border-0 md:pb-0">
          <StatItem stat={mainStat} visible={visible} delayMs={0} isMain={true} />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:flex md:flex-wrap md:justify-center md:gap-20 w-full md:w-auto">
          {secondaryStats.map((stat, idx) => (
            <StatItem key={stat.label} stat={stat} visible={visible} delayMs={1500 + idx * 200} isMain={false} />
          ))}
        </div>
      </div>
    </section>
  );
}
