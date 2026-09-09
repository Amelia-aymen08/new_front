// @ts-nocheck
import React from "react";
import { Link } from "react-router-dom";

/**
 * Première section de la page d'accueil : l'affiche BATIMAT 2026.
 * Plein écran, exactement comme les autres Hero : object-cover, aucun bord vide.
 * L'ancrage se fait en haut (object-top) pour ne jamais rogner le logo / le titre ;
 * seule une bande de bas (route) peut être coupée selon le format de l'écran.
 */
export default function BatimatHomeHero() {
  return (
    <section className="relative h-full w-full overflow-hidden bg-[#0e2a20]">
      <picture>
        <source media="(max-width: 767px)" srcSet="/home_batimat_mobile.webp" type="image/webp" />
        <source srcSet="/home_batimat.webp" type="image/webp" />
        <img
          src="/home_batimat.png"
          alt="Aymen Promotion vous donne rendez-vous au salon international BATIMAT 2026 à Paris, du 28 septembre au 1er octobre"
          className="absolute inset-0 h-full w-full object-cover object-center md:object-top"
          fetchpriority="high"
          draggable={false}
        />
      </picture>

      {/* Léger dégradé bas pour la lisibilité du bouton */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />

      {/* Bouton — centré bas sur mobile, à droite sur desktop. Ajuster left/top si besoin. */}
      <Link
        to="/batimat"
        aria-label="Réservez votre place au salon BATIMAT 2026"
        className="absolute left-1/2 top-[85%] z-10 -translate-x-1/2 -translate-y-1/2 md:left-[80%] md:top-[78%]"
      >
        <span className="inline-flex items-center whitespace-nowrap rounded-full border border-white/60 bg-gold-500 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#031B17] transition hover:scale-[1.04] hover:bg-gold-600 sm:text-xs md:px-8 md:py-3 md:text-sm animate-infoGlow">
          Réservez votre place
        </span>
      </Link>

      {/* Flèche « scroll pour continuer » */}
      <div className="pointer-events-none absolute bottom-[4%] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center opacity-90 md:bottom-6">
        <div className="mb-1 flex h-[30px] w-[19px] justify-center rounded-[12px] border-2 border-white/80 bg-black/10 pt-[5px] backdrop-blur-sm md:mb-2 md:h-[44px] md:w-[26px] md:rounded-[18px] md:border-[3px] md:pt-[7px]">
          <div className="h-[6px] w-[2px] animate-scroll-wheel rounded-full bg-[#E1BB7F] md:h-[10px] md:w-[3px]" />
        </div>
        <div className="animate-bounce">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="-mt-1 text-white drop-shadow-lg md:-mt-2 md:h-[50px] md:w-[50px]"
          >
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 14L12 20L18 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="opacity-70" />
          </svg>
        </div>
      </div>
    </section>
  );
}
