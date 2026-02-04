import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function StickyContactBar() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const items = [
    {
      id: "phone",
      icon: "fa-phone",
      label: "Téléphoner",
      href: "tel:+213560582959",
      color: "text-white",
      type: "link"
    },
    {
      id: "write",
      icon: "fa-pen-to-square",
      // Content handled specially
      type: "custom" 
    },
    {
      id: "contact",
      icon: "fa-calendar-days",
      label: "Prendre Rendez-vous",
      href: "/contact",
      type: "route" // internal link
    }
  ];

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-3 font-['Montserrat']">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="relative flex items-center justify-end"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Expanded Content */}
          <div
            className={`absolute right-[85%] mr-0 flex items-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] h-full ${
              hoveredIndex === index
                ? "w-auto opacity-100 translate-x-0 pr-4"
                : "w-0 opacity-0 translate-x-4 pr-0"
            }`}
          >
            <div className="whitespace-nowrap rounded-l-xl bg-[#0C2A24]/90 backdrop-blur-md border border-white/10 px-4 py-3 shadow-[0_0_20px_rgba(247,198,106,0.15)] flex items-center gap-4 min-h-[50px]">
              
              {/* PHONE CONTENT */}
              {item.id === "phone" && (
                <a href={item.href} className="text-white hover:text-[#F7C66A] font-medium tracking-wide flex items-center gap-2">
                  <span className="text-[#F7C66A]"><i className="fa-solid fa-phone"></i></span>
                  {item.label}
                </a>
              )}

              {/* WRITE CONTENT (Email + WhatsApp) */}
              {item.id === "write" && (
                <div className="flex items-center gap-6">
                  <a href="mailto:contact@aymenpromotion.com" className="flex items-center gap-2 text-white hover:text-[#F7C66A] transition-colors">
                    <i className="fa-solid fa-envelope text-[#F7C66A]"></i>
                    <span className="text-sm font-medium">Email</span>
                  </a>
                  <div className="w-px h-4 bg-white/20"></div>
                  <a href="https://wa.me/213560582959" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-[#25D366] transition-colors">
                    <i className="fa-brands fa-whatsapp text-[#25D366] text-lg"></i>
                    <span className="text-sm font-medium">WhatsApp</span>
                  </a>
                </div>
              )}

              {/* CONTACT CONTENT */}
              {item.id === "contact" && (
                <Link to={item.href} className="text-white hover:text-[#F7C66A] font-medium tracking-wide uppercase text-sm flex items-center gap-2">
                  <span className="text-[#F7C66A]"><i className="fa-solid fa-calendar-check"></i></span>
                  {item.label}
                </Link>
              )}

            </div>
          </div>

          {/* Icon Button */}
          <div 
            className={`group relative flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-l-xl border-y border-l border-white/20 bg-[#0C2A24]/40 backdrop-blur-md shadow-lg transition-all duration-300 cursor-pointer
              ${hoveredIndex === index ? "bg-[#F7C66A] border-[#F7C66A] text-[#031B17]" : "text-white hover:bg-white/10"}
            `}
          >
            <div className={`absolute inset-0 rounded-l-xl bg-[#F7C66A]/20 opacity-0 transition-opacity duration-500 ${hoveredIndex === index ? "animate-pulse opacity-100" : ""}`} />
            <i className={`fa-solid ${item.icon} text-lg md:text-xl relative z-10 transition-transform duration-300 ${hoveredIndex === index ? "scale-110" : ""}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
