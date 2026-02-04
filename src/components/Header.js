import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HamburgerIcon from "./icons/HamburgerIcon";
import MenuOverlay from "./MenuOverlay";

export default function Header({ logoSrc = "/logo_original.svg", className = "absolute left-0 top-0 z-30 w-full" }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header className={className}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-10">
          <Link to="/">
            <img
              src={logoSrc}
              alt="Aymen Promotion"
              className="h-12 w-auto md:h-14"
              draggable={false}
            />
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group inline-flex items-center gap-3 text-white/90"
            aria-label="Ouvrir le menu"
          >
            <span className="text-base font-medium">Menu</span>
            <span className="text-white/50">|</span>
            <HamburgerIcon className="h-6 w-7 text-white" />
          </button>
        </div>
      </header>

      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
