import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LOCALITIES } from "../data/mockData";
import { API_BASE_URL } from "../config";

const GOLD = "#F7C66A";
const LABEL_GOLD = "#F4CE86";

// Sélection éditoriale des résidences mises en avant — pas la liste complète
// (voir "Toutes les résidences" pour ça), reprise telle quelle du Figma.
const FEATURED_RESIDENCES = ["Séraphinite", "Célestine", "Cyanite", "Citrine", "Azurite", "Larimar"];

const EXPLORE_LINKS = [
  { label: "Accueil", to: "/" },
  { label: "À propos", to: "/a-propos" },
  { label: "Nos réalisations", to: "/projets" },
  { label: "Visite virtuelle 360°", to: "/visite-virtuelle" },
  { label: "Blog", to: "/blog" },
  { label: "Carrières", to: "/carriere" },
  { label: "Contact", to: "/contact" },
];

const SOCIAL_LINKS = [
  { icon: "fa-facebook-f", href: "https://www.facebook.com/aymenpromotionimmobiliere", label: "Facebook" },
  { icon: "fa-x-twitter", href: "https://x.com/AymenPromotion", label: "X" },
  { icon: "fa-youtube", href: "https://www.youtube.com/@aymenpromotionimmobiliere6948", label: "YouTube" },
  { icon: "fa-instagram", href: "https://www.instagram.com/aymenpromotion/", label: "Instagram" },
  { icon: "fa-linkedin-in", href: "https://www.linkedin.com/company/aymen-promotion-immobiliere/", label: "LinkedIn" },
  { icon: "fa-tiktok", href: "https://www.tiktok.com/@aymenpromotionimmo", label: "TikTok" },
];

function localitySlug(loc) {
  return loc.name.split(",")[0].trim().toLowerCase().replace(/ /g, "-");
}

export default function Footer() {
  const year = new Date().getFullYear();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [newsEmail, setNewsEmail] = useState("");
  const [newsStatus, setNewsStatus] = useState(null);
  const [newsLoading, setNewsLoading] = useState(false);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!newsEmail) return;
    setNewsLoading(true);
    setNewsStatus(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsEmail, source: "footer" }),
      });
      const data = await res.json().catch(() => ({}));
      setNewsStatus({ ok: res.ok, message: data.message || (res.ok ? "Inscription réussie !" : "Erreur.") });
      if (res.ok) setNewsEmail("");
    } catch {
      setNewsStatus({ ok: false, message: "Erreur réseau." });
    } finally {
      setNewsLoading(false);
    }
  };

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
    <footer ref={ref} className="relative -mt-1 overflow-hidden bg-[#031B17] text-white">
      {/* Halo doux, cohérent avec le reste du site */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(700px 500px at 12% 10%, rgba(21,105,83,0.35), rgba(3,27,23,0) 65%)," +
              "radial-gradient(600px 460px at 90% 0%, rgba(225,187,127,0.14), rgba(3,27,23,0) 68%)",
          }}
        />
      </div>

      <div
        className={`relative z-10 mx-auto w-full max-w-7xl px-6 pb-8 pt-16 transition-all duration-700 ease-out md:px-10 md:pt-20 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
          {/* ── Colonne 1 : logo, présentation, chiffres, newsletter, réseaux ── */}
          <div className="space-y-6">
            <img src="/logo_original.svg" alt="Logo Aymen Promotion, promoteur immobilier Alger" className="h-12 w-auto" />

            <p className="text-sm leading-relaxed text-white/90">
              <strong className="font-semibold">Promoteur immobilier haut standing</strong> à Alger
              <br />
              Depuis plus de <strong className="font-bold">20 ans</strong>, Aymen Promotion Immobilière
              conçoit des résidences d'exception dans les communes les plus prisées de la capitale,
              Hydra, Dély Ibrahim, Chéraga, Birkhadem, Kouba et Les Sources.
              <br />
              De la construction à la vente d'appartements et à la gestion de copropriété, nous vous
              accompagnons jusqu'aux clés.
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                { bold: "+20 ans", rest: "d'expérience" },
                { rest: "Communes huppées d'Alger" },
                { bold: "+25", rest: "résidences livrées" },
              ].map((s) => (
                <span
                  key={s.rest}
                  className="rounded-[8px] px-4 py-1.5 text-xs text-white backdrop-blur-[7.5px]"
                  style={{ background: "rgba(255,255,255,0.2)", boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
                >
                  {s.bold && <strong className="font-bold">{s.bold} </strong>}
                  {s.rest}
                </span>
              ))}
            </div>

            <div>
              <h3 className="mb-2 text-lg font-bold uppercase tracking-wide" style={{ color: GOLD }}>
                Ne manquez aucune nouvelle résidence
              </h3>
              <p className="mb-4 text-sm text-white/80">
                Nos lancements et opportunités, en avant-première. Une sélection par mois, zéro spam.
              </p>
              <form
                onSubmit={handleNewsletter}
                className="flex h-12 items-center justify-between gap-3 rounded-xl border border-white px-5 text-sm text-white/60"
              >
                <input
                  type="email"
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                  placeholder="E-mail"
                  required
                  className="w-full bg-transparent text-white placeholder:text-white/60 outline-none"
                />
                <button type="submit" disabled={newsLoading} className="shrink-0 text-white transition-colors hover:text-[#F7C66A] disabled:opacity-50">
                  →
                </button>
              </form>
              {newsStatus && (
                <p className={`mt-2 text-xs ${newsStatus.ok ? "text-green-400" : "text-red-400"}`}>
                  {newsStatus.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-5">
              {SOCIAL_LINKS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-white/80 transition hover:text-[#F7C66A]" aria-label={s.label}>
                  <i className={`fa-brands ${s.icon} text-base`} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Colonnes 2-4 : Nos résidences + Explorer côte à côte en haut,
              Nous contacter en pleine largeur en dessous — fidèle au Figma
              (Nous contacter n'est pas une 3e colonne, c'est un bloc à part
              sous les deux premières, avec sa propre sous-grille 2 colonnes) ── */}
          <div className="space-y-10">
            <div className="grid grid-cols-2 gap-x-6 gap-y-10">
              {/* Nos résidences */}
              <div className="min-w-0 space-y-3 text-sm">
                <p className="text-xs font-bold uppercase tracking-[0.1em]" style={{ color: LABEL_GOLD }}>
                  Nos résidences
                </p>
                <div className="flex flex-col gap-2 text-white/80">
                  {FEATURED_RESIDENCES.map((name) => (
                    <Link key={name} to={`/projet/${name.toLowerCase()}`} className="transition hover:text-[#F7C66A]">
                      Résidence {name}
                    </Link>
                  ))}
                  <Link to="/projets" className="font-bold" style={{ color: GOLD }}>
                    Toutes les résidences
                  </Link>
                </div>
              </div>

              {/* Explorer */}
              <div className="min-w-0 space-y-3 text-sm">
                <p className="text-xs font-bold uppercase tracking-[0.1em]" style={{ color: LABEL_GOLD }}>
                  Explorer
                </p>
                <div className="flex flex-col gap-2 text-white/80">
                  {EXPLORE_LINKS.map((l) => (
                    <Link key={l.label} to={l.to} className="transition hover:text-[#F7C66A]">
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Nous contacter — pleine largeur du bloc nav, sous-grille 2x2 */}
            <div className="space-y-3 text-sm">
              <p className="text-xs font-bold uppercase tracking-[0.1em]" style={{ color: LABEL_GOLD }}>
                Nous contacter
              </p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex items-start gap-2">
                  <i className="fa-solid fa-location-dot mt-1 shrink-0 text-white/70" />
                  <div>
                    <p className="font-bold text-white">Siège social</p>
                    <a
                      href="https://maps.app.goo.gl/YvrothxkmnrYBNHZ9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/80 hover:underline"
                    >
                      64, Route Nationale N°01, Ilot N°31
                      <br />
                      Bir Mourad Raïs, Alger 16000
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <i className="fa-solid fa-phone mt-1 shrink-0 text-white/70" />
                  <div>
                    <p className="font-bold text-white">Téléphone</p>
                    <a href="tel:+21323318648" className="block text-white/80 hover:underline">
                      +213 23 31 86 48
                    </a>
                    <a href="https://wa.me/213560582959" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-white/80 hover:underline">
                      +213 560 58 29 59 <i className="fa-brands fa-whatsapp text-[#25D366]" />
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <i className="fa-regular fa-clock mt-1 shrink-0 text-white/70" />
                  <div>
                    <p className="font-bold text-white">Horaires</p>
                    <p className="text-white/80">Samedi – Jeudi : 9h00 – 17h00</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <i className="fa-solid fa-envelope mt-1 shrink-0 text-white/70" />
                  <div>
                    <p className="font-bold text-white">E-mail</p>
                    <a href="mailto:contact@aymenpromotion-dz.com" className="text-white/80 hover:underline">
                      contact@aymenpromotion-dz.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Communes ── */}
        <div className="mt-16">
          <h3 className="mb-4 text-lg font-bold uppercase tracking-wide" style={{ color: GOLD }}>
            Immobilier haut standing par commune à Alger
          </h3>
          <div className="flex flex-wrap gap-2">
            {LOCALITIES.map((loc, i) => (
              <Link
                key={loc.id}
                to={`/localite/${localitySlug(loc)}`}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase transition-colors hover:border-[#F7C66A] hover:text-[#F7C66A] ${
                  i === 0 ? "border-[#F7C66A] text-white" : "border-white/60 text-white/60"
                }`}
              >
                {loc.name.split(",")[0]}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-[12px] text-white/40 md:flex-row md:items-center md:justify-between">
          <div>© Aymen Promotion {year} | Tous droits réservés.</div>
          <div className="flex items-center gap-6">
            <Link to="/cgu" className="underline hover:text-white">Terms &amp; Condition</Link>
            <Link to="/confidentialite" className="hover:text-white">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
