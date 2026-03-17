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
      <img
        src={isMobile ? "/hero-mobile.png" : "/Hero.png"}
        alt="Aymen Promotion"
        className="absolute inset-0 h-full w-full object-cover object-[50%_60%] hero-zoom-out"
        draggable={false}
      />
      {/* Scroll Down Arrow */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-20 pointer-events-none opacity-90">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white drop-shadow-lg">
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 14L12 20L18 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"/>
        </svg>
      </div>
    </section>
  );
}
