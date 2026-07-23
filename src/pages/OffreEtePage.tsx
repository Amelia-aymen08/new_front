// @ts-nocheck
import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Seo from "../components/Seo";
import { API_BASE_URL } from "../config";


export default function OffreEtePage() {
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", preference: "email" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null, message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });
    try {
      const res = await fetch(`${API_BASE_URL}/api/offres-ete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setStatus({ type: "success", message: "Votre demande a bien été envoyée. Un conseiller vous contactera très bientôt." });
        setFormData({ fullName: "", email: "", phone: "", preference: "email" });
      } else {
        setStatus({ type: "error", message: data?.message || "Erreur lors de l'envoi." });
      }
    } catch {
      setStatus({ type: "error", message: "Une erreur est survenue. Veuillez réessayer." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo
        title="Offres été 2026 | Aymen Promotion"
        description="Découvrez les offres estivales d'Aymen Promotion, explorez nos résidences et réservez votre visite avec l'un de nos conseillers."
        appendTitleSuffix={false}
        keywords="offres été 2026, promoteur immobilier alger, summer offer aymen, appartement alger été"
      />

      <Header className="fixed top-0 left-0 z-40 w-full bg-transparent" />

      {/*
        ═══════════════════════════════════════════════════════
        HERO
        • paddingTop = hauteur du header → l'image commence SOUS le menu
        • hauteur totale = padding + zone visible
        • overflow:visible → fleurs et enveloppes peuvent dépasser
        ═══════════════════════════════════════════════════════
      */}
      <div
        className="relative w-full overflow-visible aspect-[2140/2586] md:aspect-auto md:h-[78vh]"
        style={{ minHeight: 340 }}
      >
        {/* ── Image du banner — plein bord, comme les autres pages ── */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Mobile : banner dédié (déjà cadré en portrait, avec le titre intégré) */}
          <img
            src="/assets/campagne_ete/banner_mobile.png"
            alt="Offres été 2026 — Aymen Promotion"
            className="absolute inset-0 h-full w-full object-cover object-top md:hidden"
            draggable={false}
          />
          {/* Desktop : banner large */}
          <img
            src="/assets/campagne_ete/banner_ete.png"
            alt="Offres été 2026 — Aymen Promotion"
            className="absolute inset-0 h-full w-full object-cover object-top hidden md:block"
            draggable={false}
          />
          {/* Fondu vers la section formulaire */}
          <div
            className="absolute bottom-0 left-0 w-full pointer-events-none"
            style={{ height: "50%", background: "linear-gradient(to bottom, transparent, #0a3d2e)" }}
          />
        </div>

        {/* ── Fleur gauche : partiellement hors-écran ── */}
        <img
          src="/assets/campagne_ete/fleur_left.png"
          alt="" aria-hidden draggable={false}
          className="absolute pointer-events-none select-none md:hidden"
          style={{ bottom: "-14px", left: "-65px", width: "145px", zIndex: 20 }}
        />
        <img
          src="/assets/campagne_ete/fleur_left.png"
          alt="" aria-hidden draggable={false}
          className="absolute pointer-events-none select-none hidden md:block"
          style={{ bottom: "-14px", left: "-100px", width: "200px", zIndex: 20 }}
        />

        {/* ── Fleur droite : partiellement hors-écran ── */}
        <img
          src="/assets/campagne_ete/fleur_right.png"
          alt="" aria-hidden draggable={false}
          className="absolute pointer-events-none select-none md:hidden"
          style={{ bottom: "-14px", right: "-65px", width: "145px", zIndex: 20 }}
        />
        <img
          src="/assets/campagne_ete/fleur_right.png"
          alt="" aria-hidden draggable={false}
          className="absolute pointer-events-none select-none hidden md:block"
          style={{ bottom: "-14px", right: "-100px", width: "200px", zIndex: 20 }}
        />

        {/* ── Enveloppes ── */}
        {/* Mobile */}
        <div
          className="absolute left-1/2 md:hidden"
          style={{ bottom: "-90px", transform: "translateX(-50%)", zIndex: 30, width: "min(98vw, 640px)" }}
        >
          <img
            src="/assets/campagne_ete/enveloppes.png"
            alt="Summer Offer Aymen Promotion"
            draggable={false}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
        {/* Desktop */}
        <div
          className="absolute left-1/2 hidden md:block"
          style={{ bottom: "-130px", transform: "translateX(-50%)", zIndex: 30, width: "min(96vw, 1180px)" }}
        >
          <img
            src="/assets/campagne_ete/enveloppes.png"
            alt="Summer Offer Aymen Promotion"
            draggable={false}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      </div>

      {/*
        ═══════════════════════════════════════════════════════
        SECTION FORMULAIRE
        paddingTop = espace libre au-dessus des enveloppes
        Mobile  : enveloppes débordent 80px  → pt ≈ 110px
        Desktop : enveloppes débordent 110px → pt ≈ 150px
        ═══════════════════════════════════════════════════════
      */}
      <section style={{ background: "#0a3d2e", overflow: "hidden" }}>
        <div
          className="relative mx-auto w-full px-4 md:px-8 pb-16 md:pb-24 pt-[110px] md:pt-[150px]"
          style={{ maxWidth: 1180 }}
        >
          {/* Cadre (carte verre dépoli, comme sur le Figma) */}
          <div
            className="relative w-full"
            style={{
              background: "rgba(255,255,255,0.09)",
              backdropFilter: "blur(7.5px)",
              WebkitBackdropFilter: "blur(7.5px)",
              borderRadius: 8,
              boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
              padding: "clamp(32px, 6vw, 56px) clamp(20px, 10vw, 170px)",
            }}
          >
            {/* Titre */}
            <div className="text-center mb-8 md:mb-10">
              <p
                className="font-['PhotographSignature'] text-[#F7C66A]"
                style={{ fontSize: "clamp(42px, 10vw, 76px)", lineHeight: 1.1 }}
              >
                N'hésitez Pas
              </p>
              <p
                className="text-white font-bold uppercase tracking-[0.2em] mt-1"
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(9px, 1.8vw, 13px)" }}
              >
                à nous contacter
              </p>
            </div>

            {/* Formulaire */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 md:space-y-7 mx-auto"
              style={{ maxWidth: 680 }}
            >

            <div className="space-y-1">
              <label className="block text-xs uppercase tracking-wider text-gray-300"
                     style={{ fontFamily: "Montserrat, sans-serif" }}>
                Nom et Prénom* :
              </label>
              <input
                required name="fullName" value={formData.fullName}
                onChange={handleChange} type="text"
                className="w-full bg-transparent border-b border-white/30 py-2 text-white focus:border-[#F7C66A] outline-none transition-colors"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs uppercase tracking-wider text-gray-300"
                     style={{ fontFamily: "Montserrat, sans-serif" }}>
                Email* :
              </label>
              <input
                required name="email" value={formData.email}
                onChange={handleChange} type="email"
                className="w-full bg-transparent border-b border-white/30 py-2 text-white focus:border-[#F7C66A] outline-none transition-colors"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 border-b border-white/30 py-2 focus-within:border-[#F7C66A] transition-colors">
                <span className="text-white text-sm pr-2 border-r border-white/30 shrink-0 select-none"
                      style={{ fontFamily: "Montserrat, sans-serif" }}>
                  +213
                </span>
                <input
                  required name="phone" value={formData.phone}
                  onChange={handleChange} type="tel" placeholder="5XX XXX XXX"
                  className="flex-1 bg-transparent text-white outline-none placeholder:text-white/30"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                />
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-gray-300 mb-3 font-semibold"
                 style={{ fontFamily: "Montserrat, sans-serif" }}>
                Préférence de contact :
              </p>
              <div className="flex gap-5 md:gap-8 flex-wrap">
                {[
                  { value: "email",     label: "Email" },
                  { value: "telephone", label: "Téléphone" },
                  { value: "whatsapp",  label: "WhatsApp" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio" name="preference" value={opt.value}
                      checked={formData.preference === opt.value}
                      onChange={handleChange}
                      className="accent-[#F7C66A] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-white/70 text-sm group-hover:text-white transition-colors"
                          style={{ fontFamily: "Montserrat, sans-serif" }}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {status.type && (
              <div
                className={`rounded px-4 py-3 text-sm ${
                  status.type === "success"
                    ? "bg-green-900/40 border border-green-500/30 text-green-300"
                    : "bg-red-900/40 border border-red-500/30 text-red-300"
                }`}
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {status.message}
              </div>
            )}

            <div className="flex justify-center pt-3 md:pt-4">
              <button
                type="submit" disabled={loading}
                className="bg-[#F7C66A] text-[#031B17] font-bold uppercase px-10 md:px-14 py-3 rounded-sm hover:bg-white transition-colors shadow-lg shadow-[#F7C66A]/20 disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px] flex items-center justify-center gap-2"
                style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "0.18em", fontSize: 13 }}
              >
                {loading
                  ? <><span className="h-4 w-4 border-2 border-[#031B17] border-t-transparent rounded-full animate-spin" />Envoi…</>
                  : "SOUMETTRE"
                }
              </button>
            </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
