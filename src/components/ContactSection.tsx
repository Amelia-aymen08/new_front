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
          className={`relative col-span-1 flex h-full bg-[#0C2A24] px-6 py-10 md:col-span-5 md:px-12 md:py-14 transition-all duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
            panelsVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
          }`}
          style={{ willChange: "transform, opacity" }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
            style={{ backgroundImage: "url(/texture.png)", backgroundSize: "cover", backgroundPosition: "center" }}
          />

          <div
            className={`relative flex h-full w-full flex-col justify-center items-end text-right pr-12 transition-transform transition-opacity duration-[1100ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ willChange: "transform, opacity" }}
          >
            <img src="/logo.png" alt="Aymen Promotion" className="mb-10 h-14 w-auto object-contain" draggable={false} />

            <div className="mb-12 space-y-2">
              <div className="text-4xl font-extrabold tracking-wide text-[#F7C66A] md:text-5xl">EXPRIMEZ</div>
              <div className="text-4xl font-regular tracking-wide text-white md:text-5xl">VOTRE</div>
              <div className="text-4xl font-regular tracking-wide text-white md:text-5xl">INTÉRÊT</div>
            </div>

            <div className="mb-10 space-y-3 text-base text-white/85">
              <button className="group inline-flex items-center gap-3">
                <span>Exprimez votre intérêt</span>
                <span className="text-[#F7C66A] transition group-hover:translate-x-0.5">&gt;</span>
              </button><br/>
              <button className="group inline-flex items-center gap-3">
                <span>Exprimez votre intérêt</span>
                <span className="text-[#F7C66A] transition group-hover:translate-x-0.5">&gt;</span>
              </button>
            </div>

            <div className="mt-15 flex flex-wrap items-center gap-2">
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
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white/80 transition hover:border-[#F7C66A] hover:text-[#F7C66A]"
                >
                  <i className={`${icon} text-base`} aria-hidden />
                  <span className="sr-only">{key}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 right-0 w-3 bg-gradient-to-r from-transparent to-black/30 md:w-4" />
        </div>

        {/* RIGHT PANEL */}
        <div
          className={`relative col-span-1 flex h-full md:col-span-7 transition-all duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
            panelsVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
          style={{ willChange: "transform, opacity" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/55 to-black/60 backdrop-blur-[3px]" />

          <div
            className={`relative z-10 flex h-full w-full items-center justify-start pl-12 transition-transform transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ willChange: "transform, opacity" }}
          >
            <form className="w-full max-w-xl">
              <div className="grid grid-cols-1 gap-6">
                {[
                  { label: "Nom", type: "text" },
                  { label: "Num", type: "tel" },
                  { label: "Email", type: "email" },
                ].map((field) => (
                  <label key={field.label} className="block">
                    <span className="mb-1 block text-sm text-white/80">{field.label}</span>
                    <input
                      type={field.type}
                      className="w-full border-0 border-b border-[#F7C66A]/80 bg-transparent py-2 text-white outline-none transition focus:border-[#F7C66A] placeholder:text-white/60"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full border border-[#F7C66A] px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-[#F7C66A] hover:text-black"
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
