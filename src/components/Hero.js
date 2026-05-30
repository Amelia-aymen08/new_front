import React, { useState, useEffect } from "react";

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <h1 className="sr-only">Promoteur Immobilier Alger — Appartements Haut Standing | Aymen Promotion</h1>
      <img
        src={isMobile ? "/hero-mobile.png" : "/Hero.png"}
        alt="Résidences haut standing Aymen Promotion à Alger — Hydra, Chéraga, Birkhadem"
        className="absolute inset-0 h-full w-full object-cover object-[50%_60%] hero-zoom-out"
        draggable={false}
      />
      {/* Scroll Down Arrow (Mouse + Double Arrow) */}
      <div className={`absolute ${isMobile ? "bottom-[8%]" : "bottom-8"} left-1/2 -translate-x-1/2 flex flex-col items-center z-30 pointer-events-none opacity-85`}>
        {/* Mouse Icon */}
        <div className={`${isMobile ? "w-[20px] h-[32px] border-[2px] rounded-[12px] pt-[5px] mb-1" : "w-[26px] h-[44px] border-[3px] rounded-[18px] pt-[7px] mb-2"} border-white/80 flex justify-center bg-black/10 backdrop-blur-sm`}>
          <div className={`${isMobile ? "w-[2px] h-[7px]" : "w-[3px] h-[10px]"} bg-[#F7C66A] rounded-full animate-scroll-wheel`}></div>
        </div>
        {/* Double Arrows */}
        <div className="flex flex-col items-center animate-bounce">
          <svg width={isMobile ? 30 : 50} height={isMobile ? 30 : 50} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`text-white drop-shadow-lg ${isMobile ? "-mt-1" : "-mt-2"}`}>
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth={isMobile ? 1.8 : 2.2} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 14L12 20L18 14" stroke="currentColor" strokeWidth={isMobile ? 1.8 : 2.2} strokeLinecap="round" strokeLinejoin="round" className="opacity-70"/>
          </svg>
        </div>
      </div>
    </section>
  );
}
