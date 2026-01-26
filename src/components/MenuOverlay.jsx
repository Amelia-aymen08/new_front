import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

export default function MenuOverlay({ open, onClose }) {
  const [mounted, setMounted] = useState(open);

  // garde monté le temps de l'animation de sortie
  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    const t = window.setTimeout(() => setMounted(false), 420);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const links = useMemo(
    () => [
      { label: "PROJETS", href: "/projets" },
      { label: "À PROPOS", href: "/a-propos" },
      { label: "LOCALITÉS", href: "/projets", state: { tab: "LOCALITÉS" } },
      { label: "CARRIÈRE", href: "/carriere" },
      { label: "AYMAG", href: "#" },
      { label: "BLOG", href: "/blog" },
    ],
    []
  );

  const socials = useMemo(
    () => [
      { label: "Facebook", href: "#", icon: "fa-brands fa-facebook-f" },
      { label: "Instagram", href: "#", icon: "fa-brands fa-instagram" },
      { label: "TikTok", href: "#", icon: "fa-brands fa-tiktok" },
      { label: "YouTube", href: "#", icon: "fa-brands fa-youtube" },
      { label: "LinkedIn", href: "#", icon: "fa-brands fa-linkedin-in" },
      { label: "Pinterest", href: "#", icon: "fa-brands fa-pinterest-p" },
      { label: "X", href: "#", icon: "fa-brands fa-x-twitter" },
    ],
    []
  );

  const shouldRender = open || mounted;
  if (!shouldRender) return null;

  const overlay = (
    <div
      className={[
        "fixed inset-0 z-[5000]",
        "transition-opacity duration-[420ms]",
        open ? "opacity-100" : "opacity-0 pointer-events-none",
      ].join(" ")}
    >
      {/* Backdrop : sombre + très léger blur */}
      <button
        type="button"
        aria-label="Fermer le menu"
        onClick={onClose}
        className={[
          "absolute inset-0 h-full w-full",
          "transition-opacity duration-[420ms] ease-out",
          open ? "opacity-100" : "opacity-0",
          // ✅ plus sombre, plus transparent
          "bg-black/30",
          // ✅ blur plus faible
          "backdrop-blur-[1.5px]",
        ].join(" ")}
      />

      {/* Panel gauche : sombre + transparent, blur réduit */}
      <aside
        className={[
          "absolute left-0 top-0 h-full",
          "w-[50vw] min-w-[340px] max-w-[720px]",
          // ✅ sombre + transparent (au lieu de blanc)
          "bg-black/28",
          // ✅ blur plus léger
          "backdrop-blur-[10px]",
          // ✅ bordure discrète
          "border-r border-white/10",
          // ✅ ombre propre
          "shadow-[0_18px_55px_rgba(0,0,0,.55)]",
          "transition-all duration-[420ms] ease-out",
          open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6",
        ].join(" ")}
      >
        {/* ✅ petit dégradé interne pour donner du depth sans blanchir */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/25" />

        {/* Top bar */}
        <div className="relative flex items-start justify-between px-7 pt-6">
          <img
            src="/logo_original.svg"
            alt="Aymen Promotion"
            className="h-11 w-auto opacity-95"
            draggable={false}
          />

          <button
            type="button"
            onClick={onClose}
            className="grid h-14 w-14 place-items-center text-white/90 hover:text-white transition"
            aria-label="Fermer"
          >
            <XCloseIcon />
          </button>
        </div>

        {/* ✅ bloc aligné à droite comme ta ref */}
        <div className="relative flex h-[calc(100%-120px)] flex-col justify-center px-10">
          <div className="ml-auto w-[72%] max-w-[360px] text-right">
            <div
              className={[
                "text-white/90 text-[44px] tracking-[0.22em] font-semibold",
                "transition-all duration-[400ms] ease-out transform",
                open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3",
              ].join(" ")}
              style={{ transitionDelay: open ? "40ms" : "0ms" }}
            >
              MENU
            </div>

            <nav className="mt-9 flex flex-col gap-4">
              {links.map((l, idx) => (
                <Link
                  key={l.label}
                  to={l.href}
                  state={l.state}
                  onClick={onClose}
                  className={[
                    "text-white/70 tracking-[0.22em] text-[16px]",
                    "transition-all duration-[400ms] ease-out transform",
                    open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3",
                    "hover:text-white/95 relative inline-block group",
                  ].join(" ")}
                  style={{ transitionDelay: open ? `${80 + idx * 60}ms` : "0ms" }}
                >
                  <span className="relative transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#F7C66A]">
                    {l.label}
                  </span>
                  <span
                    className="pointer-events-none absolute left-0 bottom-[-6px] h-[1px] w-0 origin-left bg-[#F7C66A] transition-all duration-200 group-hover:w-full"
                    aria-hidden
                  />
                </Link>
              ))}
            </nav>

            {/* Réseaux */}
            <div className="mt-12 flex items-center justify-end gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  title={s.label}
                  className="
                    grid h-10 w-10 place-items-center
                    rounded-full
                    bg-white/10
                    backdrop-blur-[6px]
                    ring-1 ring-white/15
                    text-white/75
                    transition
                    hover:bg-white/15 hover:text-white
                  "
                >
                  <i className={`${s.icon} text-[18px]`} aria-hidden />
                </a>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );

  return createPortal(overlay, document.body);
}

/* --- Icons --- */
function XCloseIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="opacity-95">
      <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
