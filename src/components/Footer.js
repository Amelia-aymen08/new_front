import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LOCALITIES } from "../data/mockData";

// Split localities into two columns
const midPoint = Math.ceil(LOCALITIES.length / 2);
const localitiesCol1 = LOCALITIES.slice(0, midPoint);
const localitiesCol2 = LOCALITIES.slice(midPoint);

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
    <footer ref={ref} className="relative -mt-1 overflow-hidden bg-[#0a1714] text-white">
      <div className="absolute inset-0" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-20 md:flex-row md:items-start md:gap-32 md:px-10 md:py-24">
        <div className={`flex-1 space-y-8 transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <img src="/logo_original.svg" alt="Aymen Promotion" className="h-14 w-auto" />
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
          <div className="flex items-center gap-6 text-white">
            <a href="https://www.facebook.com/aymenpromotionimmobiliere" className="transition hover:text-[#F7C66A]" aria-label="Facebook">
              <i className="fa-brands fa-facebook-f text-lg" />
            </a>
            <a href="https://www.instagram.com/aymenpromotion/" className="transition hover:text-[#F7C66A]" aria-label="Instagram">
              <i className="fa-brands fa-instagram text-lg" />
            </a>
            <a href="https://www.linkedin.com/company/aymen-promotion-immobiliere/" className="transition hover:text-[#F7C66A]" aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin-in text-lg" />
            </a>
            <a href="https://www.youtube.com/@aymenpromotionimmobiliere6948" className="transition hover:text-[#F7C66A]" aria-label="YouTube">
              <i className="fa-brands fa-youtube text-lg" />
            </a>
            <a href="https://www.tiktok.com/@aymenpromotionimmo" className="transition hover:text-[#F7C66A]" aria-label="TikTok">
              <i className="fa-brands fa-tiktok text-lg" />
            </a>
            <a href="https://x.com/AymenPromotion" className="transition hover:text-[#F7C66A]" aria-label="X">
              <i className="fa-brands fa-x-twitter text-lg" />
            </a>
          </div>
        </div>

        <div className={`flex-1 space-y-12 text-sm transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            <div className="space-y-4">
              <p className="text-[12px] uppercase tracking-[0.2em] text-[#F7C66A]">Localités</p>
              <div className="space-y-3 text-white/85">
                {localitiesCol1.map((loc) => (
                  <Link 
                    key={loc.id} 
                    to={`/localite/${loc.id}`}
                    className="block transition hover:text-[#F7C66A]"
                  >
                    {loc.name.split(',')[0]}
                  </Link>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[12px] uppercase tracking-[0.2em] text-[#F7C66A] invisible">Localités</p>
              <div className="space-y-3 text-white/85">
                {localitiesCol2.map((loc) => (
                  <Link 
                    key={loc.id} 
                    to={`/localite/${loc.id}`}
                    className="block transition hover:text-[#F7C66A]"
                  >
                    {loc.name.split(',')[0]}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[12px] uppercase tracking-[0.2em] text-[#F7C66A]">Nos coordonnées</p>
            <div className="space-y-3 text-white/85">
              <a href="/" className="block underline-offset-2 hover:underline">
                Said Hamdine ilot N 52 section 05,<br /> Bir Mourad Rais - Alger 16000
              </a>
              <div className="flex flex-col gap-2">
                {/* 
                  REMOVED: Old contact links (phone/email) are now in StickyContactBar
                */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 pb-12 text-[12px] text-white/60 md:flex-row md:items-center md:justify-between md:px-10">
        <div>© Aymen Promotion {year} | All Rights Reserved.</div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white">Terms & Condition</a>
          <a href="#" className="hover:text-white">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
