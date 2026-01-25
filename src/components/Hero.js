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
        src={isMobile ? "/hero-mobile.png" : "/hero.png"}
        alt="Aymen Promotion"
        className="absolute inset-0 h-full w-full object-cover object-[50%_60%] hero-zoom-out"
        draggable={false}
      />
    </section>
  );
}
