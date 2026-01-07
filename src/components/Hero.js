import React from "react";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <img
        src="/hero.png"
        alt="Aymen Promotion"
        className="absolute inset-0 h-full w-full object-cover object-[50%_60%] hero-zoom-out"
        draggable={false}
      />
    </section>
  );
}
