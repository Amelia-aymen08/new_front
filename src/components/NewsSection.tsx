import React from "react";

const news = [
  {
    id: 1,
    image: "/sections/b1.jpg", // Placeholder
    date: { day: "03", month: "Feb" },
    title: "Bâtir un Héritage",
    desc: "Immobilier pour un Patrimoine Durable avec Aymen Promotion",
  },
  {
    id: 2,
    image: "/sections/b2.jpg", // Placeholder
    date: { day: "03", month: "Feb" },
    title: "Bâtir un Héritage",
    desc: "Immobilier pour un Patrimoine Durable avec Aymen Promotion",
  },
  {
    id: 3,
    image: "/sections/b3.jpg", // Placeholder
    date: { day: "03", month: "Feb" },
    title: "Bâtir un Héritage",
    desc: "Immobilier pour un Patrimoine Durable avec Aymen Promotion",
  },
];

export default function NewsSection() {
  return (
    <section className="py-20 text-center text-white pb-0">
      <div>
      {/* Titre */}
      <div className="mb-16">
        <h3 className="font-['PhotographSignature'] text-5xl text-gold-500 mb-2">
          Actualités
        </h3>
        <h2 className="text-3xl font-bold uppercase tracking-wider">
          D'AYMEN PROMOTION
        </h2>
      </div>

      {/* Carousel News */}
      <div className="relative mx-auto max-w-[95%] md:max-w-7xl px-4">
        {/* Mobile: Horizontal Scroll, Desktop: Grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 md:grid md:grid-cols-3 md:gap-8 md:pb-0 hide-scrollbar">
          {news.map((item) => (
            <div key={item.id} className="group relative flex flex-col text-left min-w-[85vw] snap-center md:min-w-0">
              {/* Image Card */}
              <div className="relative mb-6 overflow-hidden rounded-2xl bg-white/5 aspect-[4/3]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                
                {/* Date Badge */}
                <div className="absolute bottom-4 right-4 flex flex-col items-center rounded-lg bg-white px-3 py-2 text-black shadow-lg">
                  <span className="text-xs font-semibold uppercase text-gray-500">
                    {item.date.month}
                  </span>
                  <span className="text-xl font-bold leading-none">
                    {item.date.day}
                  </span>
                </div>
              </div>

              {/* Texte */}
              <h4 className="font-['PhotographSignature'] text-3xl text-gold-500 mb-2">
                {item.title}
              </h4>
              <p className="text-sm text-white/80 leading-snug max-w-[90%] mb-4">
                {item.desc}
              </p>
              
              <button className="text-[10px] font-bold uppercase tracking-widest text-[#F7C66A] hover:text-white transition-colors flex items-center gap-2 w-fit">
                 <span className="text-lg leading-none">▸</span> LIRE L'ARTICLE
              </button>
            </div>
          ))}
        </div>
        
        {/* Mobile Pagination Dots */}
        <div className="flex justify-center gap-2 mt-4 md:hidden">
            {news.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all ${i === 0 ? "w-6 bg-[#F7C66A]" : "w-1.5 bg-white/20"}`} />
            ))}
        </div>
        
         {/* Navigation buttons (Mock - comme sur l'image) */}
         <button className="absolute -left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gold-500 transition shadow-lg hidden md:flex">
             ←
        </button>
        <button className="absolute -right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gold-500 transition shadow-lg hidden md:flex">
             →
        </button>
      </div>
      </div>
    </section>
  );
}
