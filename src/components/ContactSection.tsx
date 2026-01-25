import React, { useEffect, useRef, useState } from "react";

export default function ContactSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState(0); // 0 none, 1 bg, 2 panels, 3 content

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let fired = false;
    const fire = () => {
      if (fired) return;
      fired = true;
      setPhase(1);
    };

    const handleScroll = () => {
      const r = node.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // Trigger when the section is significantly visible (e.g., top enters the bottom 80% of viewport)
      if (r.top < vh * 0.8 && r.bottom > 0) fire();
    };

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fire();
          obs.disconnect();
          window.removeEventListener("scroll", handleScroll);
          window.removeEventListener("resize", handleScroll);
        }
      },
      { threshold: 0.2 }
    );

    obs.observe(node);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (phase !== 1) return;
    // Wait 2 seconds (zoom animation) before showing panels
    const t2 = setTimeout(() => setPhase(2), 2000);
    return () => clearTimeout(t2);
  }, [phase]);

  useEffect(() => {
    if (phase !== 2) return;
    // Content appears slowly after panels start closing
    const t3 = setTimeout(() => setPhase(3), 800);
    return () => clearTimeout(t3);
  }, [phase]);

  const bgVisible = phase >= 1;
  const panelsVisible = phase >= 2;
  const contentVisible = phase >= 3;

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden text-white mt-32"
      style={{ height: "85vh" }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/contact.png"
          alt=""
          className="h-full w-full origin-center transform object-cover transition-all ease-[cubic-bezier(0.22,0.61,0.36,1)]"
          style={{
            opacity: bgVisible ? 1 : 0,
            transform: bgVisible ? "scale(1.1)" : "scale(1)",
            transitionDuration: "2000ms", // 2 seconds zoom
          }}
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative grid h-full grid-cols-1 md:grid-cols-12">
        {/* LEFT PANEL */}
        <div
          className={`relative col-span-1 flex h-auto md:h-full bg-[#0C2A24] px-6 py-10 md:col-span-5 md:px-12 md:py-14 transition-all duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
            panelsVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
          }`}
          style={{ willChange: "transform, opacity" }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
            style={{ backgroundImage: "url(/texture.png)", backgroundSize: "cover", backgroundPosition: "center" }}
          />

          <div
            className={`relative flex h-full w-full flex-col justify-start md:justify-center items-start md:items-end text-left md:text-right md:pr-12 transition-transform transition-opacity duration-[1100ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ willChange: "transform, opacity" }}
          >
            {/* Logo hidden on mobile, visible on desktop if needed, but simplified here */}
            
            <div className="mb-8 md:mb-12 space-y-1 md:space-y-2">
              <div className="text-3xl md:text-4xl font-extrabold tracking-wide text-[#F7C66A] md:text-5xl">EXPRIMEZ</div>
              <div className="text-3xl md:text-4xl font-regular tracking-wide text-white md:text-5xl">VOTRE INTÉRÊT</div>
            </div>

            <div className="mb-8 md:mb-10 space-y-3 text-base text-white/85 hidden md:block">
              <button className="group inline-flex items-center gap-3">
                <span>Exprimez votre intérêt</span>
                <span className="text-[#F7C66A] transition group-hover:translate-x-0.5">&gt;</span>
              </button><br/>
            </div>

            <div className="mt-0 md:mt-15 flex flex-wrap items-center gap-2">
              {[
                { key: "wa", icon: "fa-brands fa-whatsapp" },
                { key: "ig", icon: "fa-brands fa-instagram" },
                { key: "fb", icon: "fa-brands fa-facebook-f" },
                { key: "tt", icon: "fa-brands fa-tiktok" },
                { key: "yt", icon: "fa-brands fa-youtube" },
                { key: "in", icon: "fa-brands fa-linkedin-in" },
                { key: "pi", icon: "fa-brands fa-pinterest-p" },
                { key: "x", icon: "fa-brands fa-x-twitter" },
              ].map(({ key, icon }) => (
                <div
                  key={key}
                  className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full border border-white/30 text-white/80 transition hover:border-[#F7C66A] hover:text-[#F7C66A]"
                >
                  <i className={`${icon} text-sm md:text-base`} aria-hidden />
                  <span className="sr-only">{key}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 right-0 w-3 bg-gradient-to-r from-transparent to-black/30 md:w-4 hidden md:block" />
        </div>

        {/* RIGHT PANEL */}
        <div
          className={`relative col-span-1 flex h-full md:col-span-7 transition-all duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
            panelsVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
          style={{ willChange: "transform, opacity" }}
        >
          <div className="absolute inset-0 bg-[#0C2A24] md:bg-gradient-to-r md:from-black/70 md:via-black/55 md:to-black/60 md:backdrop-blur-[3px]" />

          <div
            className={`relative z-10 flex h-full w-full items-start md:items-center justify-start px-6 pt-6 md:pl-12 md:pt-0 transition-transform transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ willChange: "transform, opacity" }}
          >
            <form className="w-full max-w-xl pb-10 md:pb-0">
              <div className="grid grid-cols-1 gap-6">
                {[
                  { label: "NOM", type: "text" },
                  { label: "NUM", type: "tel" },
                  { label: "EMAIL", type: "email" },
                ].map((field) => (
                  <label key={field.label} className="block">
                    <span className="mb-1 block text-xs md:text-sm text-white/60 uppercase tracking-wider">{field.label}</span>
                    <input
                      type={field.type}
                      className="w-full border-0 border-b border-[#F7C66A]/50 bg-transparent py-2 text-white outline-none transition focus:border-[#F7C66A] placeholder:text-white/60"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-10 flex justify-start md:justify-center">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full border border-[#F7C66A] px-8 py-3 text-xs md:text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-[#F7C66A] hover:text-black w-full md:w-auto"
                >
                  PRENDRE CONTACT
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
