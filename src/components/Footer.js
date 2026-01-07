import React, { useEffect, useRef, useState } from "react";

const locationsCol1 = ["Hydra", "Dar El Beida", "Bab Ezzouar", "Draria", "Said Hamdine"];
const locationsCol2 = ["Dely Ibrahim", "Chéraga", "El Achour", "Ruisseau"];

export default function Footer() {
  const year = new Date().getFullYear();
  const ref = useRef(null);
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
      { threshold: 0.2 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <footer ref={ref} className="relative overflow-hidden bg-[#0a1714] text-white">
      <div className="absolute inset-0" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 md:flex-row md:items-start md:gap-16 md:py-20">
        <div className={`flex-1 space-y-6 transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <img src="/logo.png" alt="Aymen Promotion" className="h-12 w-auto" />
          <h3 className="text-3xl font-semibold leading-tight md:text-4xl">
            Restez au coeur de l'actualité du haut standing
          </h3>
          <div className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white/70 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
            <input
              type="email"
              placeholder="E-mail"
              className="w-full bg-transparent text-white placeholder:text-white/55 outline-none"
            />
            <span className="text-white/70">→</span>
          </div>
          <div className="flex items-center gap-4 text-white/80">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25">
              <i className="fa-brands fa-whatsapp text-sm" aria-hidden />
              <span className="sr-only">WhatsApp</span>
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25">
              <i className="fa-brands fa-instagram text-sm" aria-hidden />
              <span className="sr-only">Instagram</span>
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25">
              <i className="fa-brands fa-youtube text-sm" aria-hidden />
              <span className="sr-only">YouTube</span>
            </span>
          </div>
        </div>

        <div className={`flex-1 space-y-10 text-sm transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="grid grid-cols-2 gap-x-10 gap-y-4">
            <div className="space-y-3">
              <p className="text-[12px] uppercase tracking-[0.2em] text-[#F7C66A]">Localités</p>
              <div className="space-y-2 text-white/85">
                {locationsCol1.map((loc) => (
                  <div key={loc}>{loc}</div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-[12px] uppercase tracking-[0.2em] text-[#F7C66A] invisible">Localités</p>
              <div className="space-y-2 text-white/85">
                {locationsCol2.map((loc) => (
                  <div key={loc}>{loc}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[12px] uppercase tracking-[0.2em] text-[#F7C66A]">Nos coordonnées</p>
            <div className="space-y-2 text-white/85">
              <a href="#" className="underline-offset-2 hover:underline">
                Said Hamdine ilot N 52 section 05, Bir Mourad Rais - Alger 16000
              </a>
              <div className="flex flex-wrap items-center gap-3">
                <a href="mailto:contact@aymenpromotion.com" className="underline-offset-2 hover:underline">
                  contact@aymenpromotion.com
                </a>
                <span className="text-white/40">|</span>
                <a href="tel:+213560582959" className="underline-offset-2 hover:underline">
                  +213 560 58 29 59
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 pb-12 text-[12px] text-white/60 md:flex-row md:items-center md:justify-between">
        <div>© Aymen Promotion {year} | All Rights Reserved.</div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white">Terms & Condition</a>
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}
