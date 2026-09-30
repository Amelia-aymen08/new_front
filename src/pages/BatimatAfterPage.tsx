// @ts-nocheck
import React, { useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Seo from "../components/Seo";
import { API_BASE_URL } from "../config";
import { getHubspotContext } from "../utils/hubspotContext";
import { getAttribution } from "../utils/attribution";
import { COUNTRIES } from "../data/countries";

const GOLD = "#F7C66A";
const RED = "#BF0D0D";

// Lieu et dates de l'événement — un seul endroit à modifier.
const VENUE_NAME = "Hôtel Paris 17 Batignolles";
const VENUE_ADDRESS = "4 Boulevard Berthier, 75017 Paris";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(`${VENUE_NAME} ${VENUE_ADDRESS}`);

const IMG = "/assets/batimat_after/web";

const DAY_OPTIONS = [
  { value: "samedi", top: "Samedi", sub: "3 octobre 2026" },
  { value: "dimanche", top: "Dimanche", sub: "4 octobre 2026" },
  { value: "flexible", top: "Flexible", sub: "selon disponibilité" },
];

const HIGHLIGHTS = [
  {
    icon: "fa-building",
    title: "Découvrez nos projets",
    text: "Consultez nos présentations, rendus et maquettes pour mieux comprendre les résidences et les typologies proposées.",
  },
  {
    icon: "fa-people-group",
    title: "Échangez avec nos experts",
    text: "Parlez de votre besoin, de votre calendrier et de vos priorités avec un interlocuteur qui pourra orienter votre démarche.",
  },
  {
    icon: "fa-hand-holding-hand",
    title: "Préparez la prochaine étape",
    text: "Repartez avec une vision plus claire de votre projet et des démarches à envisager avec Aymen Promotion.",
  },
];

const GALLERY = [
  { src: `${IMG}/exchange.webp`, title: "Échanges personnalisés", text: "Un temps dédié à chaque projet", large: true },
  { src: `${IMG}/welcome.webp`, title: "Un accueil chaleureux", text: "Aux couleurs de l'Algérie" },
  { src: `${IMG}/reception-crowd.webp`, title: "Rencontres et partage", text: "Un événement humain et convivial" },
  { src: `${IMG}/projects.webp`, title: "Présentation des projets", text: "Maquettes, rendus et conseils" },
];

const STEPS = [
  { n: "01", title: "Vous remplissez le formulaire", text: "Indiquez vos coordonnées et le jour qui vous convient le mieux." },
  { n: "02", title: "Notre équipe vous contacte", text: "Nous vérifions les informations et confirmons avec vous les modalités de votre visite." },
  { n: "03", title: "Nous vous accueillons à Paris", text: `Retrouvez notre équipe à l'${VENUE_NAME} pour découvrir les projets et échanger.` },
];

const FAQ_ITEMS = [
  {
    question: "Je n'ai pas assisté à BATIMAT. Puis-je participer ?",
    answer:
      "Oui. Cette rencontre est organisée justement pour les personnes qui n'ont pas pu venir au salon ou qui souhaitent poursuivre les échanges avec Aymen Promotion à Paris.",
  },
  {
    question: "Mon inscription est-elle confirmée immédiatement ?",
    answer:
      "Le formulaire enregistre votre demande. Notre équipe vous contactera ensuite afin de confirmer le jour choisi et les informations pratiques.",
  },
  {
    question: "Puis-je venir accompagné(e) ?",
    answer:
      "Oui. Merci toutefois de remplir un formulaire séparé pour chaque participant afin que nous puissions préparer correctement l'accueil.",
  },
  {
    question: "L'inscription réserve-t-elle une chambre à l'hôtel ?",
    answer:
      "Non. Le formulaire concerne uniquement la participation à la rencontre Aymen Promotion organisée dans l'établissement.",
  },
  {
    question: "Comment accéder au lieu ?",
    answer: `Le rendez-vous se tiendra à l'${VENUE_NAME}, ${VENUE_ADDRESS}. Le bouton Google Maps ci-dessus permet d'ouvrir l'itinéraire.`,
  },
];

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  countryCode: "FR",
  phone: "",
  visitDay: "",
  newsletterOptIn: false,
  consent: false,
};

function BatimatAfterForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.visitDay) {
      setStatus({ type: "error", message: "Merci de choisir votre jour de visite." });
      return;
    }
    if (!form.consent) {
      setStatus({ type: "error", message: "Merci d'accepter les conditions pour continuer." });
      return;
    }
    setLoading(true);
    setStatus({ type: null, message: "" });
    try {
      const res = await fetch(`${API_BASE_URL}/api/batimat-after`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...getHubspotContext(), ...getAttribution() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus({ type: "success", message: data.message || "Votre inscription a bien été enregistrée." });
        setForm(EMPTY_FORM);
      } else {
        setStatus({ type: "error", message: data.message || "Une erreur est survenue." });
      }
    } catch {
      setStatus({ type: "error", message: "Une erreur est survenue. Veuillez réessayer." });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-md border border-[#E2E2E2] bg-white px-3 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#BF0D0D]";
  const labelClass = "mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a]";

  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-2xl">
      <div className="mx-auto h-1 w-[61%]" style={{ background: "linear-gradient(to right, #013A33, #F7C66A)" }} />
      <div className="p-6 md:p-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#8a8a8a]">
            Inscription au week-end Paris
          </p>
          <p className="flex items-center gap-1.5 text-[11px] text-[#8a8a8a]">
            <i className="fa-regular fa-clock" /> Environ 1 minute
          </p>
        </div>

        <h2 className="mb-2 text-2xl font-bold text-[#1a1a1a]">Réservez votre rencontre</h2>
        <p className="mb-6 text-sm leading-relaxed text-[#6b6b6b]">
          Choisissez votre jour de visite et transmettez-nous vos coordonnées. Notre équipe vous
          contactera pour confirmer les informations pratiques.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Prénom*</label>
              <input
                required
                name="firstname"
                autoComplete="given-name"
                value={form.firstName}
                onChange={(e) => set({ firstName: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Nom*</label>
              <input
                required
                name="lastname"
                autoComplete="family-name"
                value={form.lastName}
                onChange={(e) => set({ lastName: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Adresse e-mail*</label>
            <input
              required
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => set({ email: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Téléphone / WhatsApp *</label>
            <div className="flex gap-2">
              <select
                required
                aria-label="Indicatif téléphonique"
                value={form.countryCode}
                onChange={(e) => set({ countryCode: e.target.value })}
                className="w-28 shrink-0 rounded-md border border-[#E2E2E2] bg-white px-2 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-[#BF0D0D]"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} {c.dial}
                  </option>
                ))}
              </select>
              <input
                required
                name="phone"
                type="tel"
                autoComplete="tel-national"
                value={form.phone}
                onChange={(e) => set({ phone: e.target.value })}
                placeholder="6 XX XX XX XX"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Jour souhaité *</label>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Jour souhaité">
              {DAY_OPTIONS.map((d) => {
                const active = form.visitDay === d.value;
                return (
                  <button
                    key={d.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => set({ visitDay: d.value })}
                    className={`rounded-md border px-2 py-2.5 text-center transition-colors ${
                      active
                        ? "border-[#BF0D0D] bg-[#BF0D0D]/5"
                        : "border-[#E2E2E2] bg-white hover:border-[#BF0D0D]/60"
                    }`}
                  >
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a]">
                      {d.top}
                    </span>
                    <span className="block text-[10px] leading-tight text-[#6b6b6b]">{d.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              required
              checked={form.consent}
              onChange={(e) => set({ consent: e.target.checked })}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#BF0D0D]"
            />
            <span className="text-xs leading-relaxed text-[#6b6b6b]">
              J'accepte que mes données soient utilisées par Aymen Promotion pour traiter ma demande
              de préinscription et me contacter au sujet de ma visite à Paris (octobre 2026). *{" "}
              <a href="/confidentialite" className="font-semibold underline hover:text-[#BF0D0D]">
                Politique de confidentialité
              </a>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              checked={form.newsletterOptIn}
              onChange={(e) => set({ newsletterOptIn: e.target.checked })}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#BF0D0D]"
            />
            <span className="text-xs leading-relaxed text-[#6b6b6b]">
              Je souhaite également recevoir les actualités et offres d'Aymen Promotion. Ce choix est
              facultatif.
            </span>
          </label>

          {status.type && (
            <div
              role={status.type === "error" ? "alert" : "status"}
              className={`rounded px-4 py-3 text-sm ${
                status.type === "success"
                  ? "border border-green-500/30 bg-green-50 text-green-700"
                  : "border border-red-500/30 bg-red-50 text-red-700"
              }`}
            >
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md py-3 text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: RED }}
          >
            {loading ? "Envoi…" : "Envoyer ma demande"}
          </button>

          <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-[#8a8a8a]">
            <i className="fa-solid fa-lock mt-0.5" />
            Votre demande sera confirmée par notre équipe. L'inscription à l'événement ne constitue pas une réservation de chambre à l'hôtel.
          </p>
        </form>
      </div>
    </div>
  );
}

function FaqAccordion() {
  const [open, setOpen] = useState(-1);
  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, i) => (
        <div
          key={item.question}
          className="rounded-[19px] border-[1.5px] border-white/20 px-5 backdrop-blur-[7.5px]"
          style={{ boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
        >
          <button
            type="button"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? -1 : i)}
            className="flex w-full items-center justify-between gap-4 py-4 text-left"
          >
            <span className="text-sm font-bold text-white">{item.question}</span>
            <i className={`fa-solid ${open === i ? "fa-minus" : "fa-plus"} shrink-0 text-xs`} style={{ color: GOLD }} />
          </button>
          {open === i && <p className="pb-4 text-sm leading-relaxed text-white/70">{item.answer}</p>}
        </div>
      ))}
    </div>
  );
}

const glass = {
  background: "rgba(255,255,255,0.09)",
  boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)",
};

export default function BatimatAfterPage() {
  const formRef = useRef(null);

  // Le formulaire est toujours affiché ; les boutons « Réserver » y font défiler la page.
  const openForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Aymen Promotion à Paris — Rencontre immobilière",
    startDate: "2026-10-03",
    endDate: "2026-10-04",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: VENUE_NAME,
      address: {
        "@type": "PostalAddress",
        streetAddress: "4 Boulevard Berthier",
        postalCode: "75017",
        addressLocality: "Paris",
        addressCountry: "FR",
      },
    },
    organizer: { "@type": "Organization", name: "Aymen Promotion", url: "https://www.aymenpromotion-dz.com" },
  };

  return (
    <>
      <Seo
        title="Vous n'avez pas pu venir à BATIMAT ? Rencontrons-nous à Paris"
        description="Aymen Promotion vous accueille à Paris les 3 et 4 octobre 2026 pour découvrir ses projets immobiliers en Algérie. Inscrivez-vous et recevez votre badge par e-mail."
        appendTitleSuffix={false}
        keywords="Aymen Promotion Paris, rencontre immobilier Algérie Paris, après Batimat, projets immobiliers Algérie"
      />
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(eventSchema)}</script>

      <Header className="absolute top-0 left-0 z-40 w-full" />

      <div className="relative" style={{ background: "#031b17" }}>
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(860px 620px at 15% 46%, rgba(225,187,127,0.22), rgba(3,27,23,0) 62%)," +
                "radial-gradient(860px 620px at 85% 48%, rgba(225,187,127,0.20), rgba(3,27,23,0) 64%)," +
                "radial-gradient(720px 520px at 78% 78%, rgba(21,105,83,0.16), rgba(3,27,23,0) 72%)," +
                "#031b17",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/texture.webp')",
              backgroundSize: "1200px",
              backgroundRepeat: "repeat",
              opacity: 0.14,
              mixBlendMode: "soft-light",
            }}
          />
        </div>

        <div className="relative z-10">
          {/* ── Hero ── */}
          <section className="relative z-20 px-6 pb-12 pt-28 md:px-16 md:pb-20 md:pt-36">
            <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-white/80">
                  Aymen Promotion à Paris
                </p>
                <h1 className="mb-5 text-3xl font-bold uppercase leading-tight text-white md:text-4xl lg:text-5xl">
                  Vous n'avez pas pu venir à Batimat ?{" "}
                  <span style={{ color: GOLD }}>Nous venons à votre rencontre.</span>
                </h1>
                <p className="mb-6 text-[15px] leading-relaxed text-white/80 md:text-base">
                  Aymen Promotion prolonge sa présence à Paris pendant un week-end de rencontres à
                  l'<strong className="text-white">{VENUE_NAME}, {VENUE_ADDRESS}</strong>.
                  Réservez votre passage pour découvrir nos projets et échanger directement avec notre
                  équipe autour de votre ambition immobilière en Algérie.
                </p>

                <div className="mb-7 flex flex-wrap gap-3">
                  <div className="flex items-center gap-3 rounded-[9px] px-4 py-3 backdrop-blur-[8px]" style={{ background: "rgba(255,255,255,0.2)", boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}>
                    <i className="fa-regular fa-calendar text-lg" style={{ color: GOLD }} />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Dates</p>
                      <p className="text-sm font-semibold text-white">Samedi 3 & dimanche 4 octobre 2026</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-[9px] px-4 py-3 backdrop-blur-[8px]" style={{ background: "rgba(255,255,255,0.2)", boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}>
                    <i className="fa-solid fa-location-dot text-lg" style={{ color: GOLD }} />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Lieu</p>
                      <p className="text-sm font-semibold text-white">À l'{VENUE_NAME}, {VENUE_ADDRESS}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={openForm}
                    className="rounded-md px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
                    style={{ background: RED }}
                  >
                    Réserver ma rencontre
                  </button>
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border border-white/40 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/10"
                  >
                    Voir l'itinéraire
                  </a>
                </div>

                <p className="flex items-center gap-2 text-xs text-white/60">
                  <i className="fa-solid fa-shield-halved" style={{ color: GOLD }} />
                  Données utilisées uniquement selon votre consentement
                </p>
              </div>

              <div>
                <div ref={formRef}>
                  <BatimatAfterForm />
                </div>
              </div>
            </div>
          </section>

          {/* ── Une rencontre pensée pour votre projet ── */}
          <section className="relative z-0 -mt-24 px-6 pb-16 pt-32 md:-mt-28 md:px-16 md:pb-24 md:pt-40" style={{ background: "#031B13" }}>
            <div className="mx-auto max-w-6xl">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-white/80">
                Deux jours pour avancer
              </p>
              <h2 className="mb-4 max-w-2xl text-2xl font-bold leading-tight md:text-3xl" style={{ color: GOLD }}>
                Une rencontre pensée pour votre projet
              </h2>
              <p className="mb-10 max-w-2xl text-[15px] leading-relaxed text-white/70">
                Un format plus proche, organisé après BATIMAT, pour prendre le temps de découvrir nos
                résidences, poser vos questions et préparer la suite avec nos équipes.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                {HIGHLIGHTS.map((h) => (
                  <div key={h.title} className="flex gap-4 rounded-[8px] p-6 backdrop-blur-[7.5px]" style={glass}>
                    <i className={`fa-solid ${h.icon} mt-1 text-2xl`} style={{ color: GOLD }} />
                    <div>
                      <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-white">{h.title}</h3>
                      <p className="text-sm leading-relaxed text-white/70">{h.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Galerie ── */}
          <section className="px-6 py-16 md:px-16 md:py-24">
            <div className="mx-auto max-w-6xl">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-white/80">
                Retour sur le Pavillon Dauphine
              </p>
              <h2 className="mb-4 max-w-2xl text-2xl font-bold uppercase leading-tight text-white md:text-4xl">
                L'esprit de nos rencontres à Paris
              </h2>
              <p className="mb-10 max-w-2xl text-[15px] leading-relaxed text-white/70">
                Ces images de notre précédent événement au Pavillon Dauphine illustrent l'expérience que
                nous souhaitons renouveler : proximité, écoute, présentation des projets et échanges
                directs avec nos visiteurs.
              </p>
              <div className="grid gap-3 md:grid-cols-3 md:grid-rows-3">
                {GALLERY.map((g) => (
                  <figure
                    key={g.src}
                    className={`relative overflow-hidden rounded-[10px] ${
                      g.large ? "md:col-span-2 md:row-span-3" : ""
                    }`}
                  >
                    <img
                      src={g.src}
                      alt={`${g.title} — ${g.text}`}
                      loading="lazy"
                      className={`w-full object-cover ${g.large ? "aspect-[16/10] md:h-full md:aspect-auto" : "aspect-[16/10]"}`}
                    />
                    <figcaption
                      className="absolute inset-x-0 bottom-0 px-4 pb-3 pt-10 text-white"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0))" }}
                    >
                      <span className="block text-xs font-bold">{g.title}</span>
                      <span className="block text-[11px] text-white/75">{g.text}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          {/* ── Informations pratiques ── */}
          <section className="px-6 pb-16 md:px-16 md:pb-24">
            <div className="mx-auto max-w-6xl">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-white/80">
                Informations pratiques
              </p>
              <h2 className="mb-4 max-w-2xl text-2xl font-bold uppercase leading-tight text-white md:text-4xl">
                Retrouvons-nous à l'{VENUE_NAME}
              </h2>
              <p className="mb-10 max-w-2xl text-[15px] leading-relaxed text-white/70">
                Choisissez le jour qui vous convient. Notre équipe confirmera ensuite votre présence et
                vous transmettra les informations utiles pour votre venue.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div
                  className="relative flex flex-col items-center justify-center overflow-hidden rounded-[10px] p-8 text-center"
                  style={{
                    background: "linear-gradient(135deg, rgba(1,58,51,0.75), rgba(3,27,19,0.9))",
                    boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)",
                  }}
                >
                  <i className="fa-solid fa-location-dot mb-3 text-4xl" style={{ color: GOLD }} />
                  <h3 className="mb-1 text-lg font-bold uppercase text-white">À l'{VENUE_NAME}</h3>
                  <p className="mb-5 text-sm text-white/70">{VENUE_ADDRESS}</p>
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
                    style={{ background: RED }}
                  >
                    Ouvrir dans Google Maps
                  </a>
                </div>

                <div className="rounded-[10px] p-8 backdrop-blur-[7.5px]" style={glass}>
                  <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-white">
                    Deux jours pour nous rencontrer
                  </h3>
                  {[
                    { d: "03", day: "Samedi 3 octobre 2026", text: "Choisissez le samedi ou indiquez que vous êtes flexible." },
                    { d: "04", day: "Dimanche 4 octobre 2026", text: "Notre équipe vous confirmera les modalités de votre venue." },
                  ].map((row) => (
                    <div key={row.d} className="mb-4 flex items-start gap-4 last:mb-0">
                      <div
                        className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-md text-[#0a3d2e]"
                        style={{ background: GOLD }}
                      >
                        <span className="text-lg font-bold leading-none">{row.d}</span>
                        <span className="text-[9px] font-bold uppercase leading-none">oct.</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{row.day}</p>
                        <p className="text-sm leading-relaxed text-white/70">{row.text}</p>
                      </div>
                    </div>
                  ))}
                  <p className="mt-5 text-xs leading-relaxed" style={{ color: GOLD }}>
                    À noter : l'inscription concerne l'événement organisé par Aymen Promotion dans
                    l'hôtel. Elle n'inclut pas de réservation de chambre.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Comment réserver ── */}
          <section className="px-6 pb-16 md:px-16 md:pb-24">
            <div className="mx-auto max-w-6xl">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-white/80">
                Parcours simple et transparent
              </p>
              <h2 className="mb-4 text-2xl font-bold uppercase leading-tight md:text-4xl" style={{ color: GOLD }}>
                Comment réserver votre passage
              </h2>
              <p className="mb-10 max-w-2xl text-[15px] leading-relaxed text-white/70">
                Quelques informations suffisent pour permettre à notre équipe d'organiser votre accueil
                dans les meilleures conditions.
              </p>

              <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center">
                {STEPS.map((step, i, arr) => (
                  <React.Fragment key={step.n}>
                    <div className="flex-1 rounded-[8px] p-6 backdrop-blur-[7.5px]" style={glass}>
                      <p className="mb-2 text-3xl font-bold" style={{ color: GOLD }}>{step.n}</p>
                      <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-white">{step.title}</h3>
                      <p className="text-sm leading-relaxed text-white/70">{step.text}</p>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="flex shrink-0 items-center justify-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: GOLD }}>
                          <i className="fa-solid fa-chevron-right rotate-90 text-xs text-[#0a3d2e] md:rotate-0" />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="mt-6 flex gap-4 rounded-[20px] p-6 backdrop-blur-[7.5px]" style={glass}>
                <i className="fa-solid fa-circle-info mt-0.5 shrink-0 text-lg text-white/70" />
                <div>
                  <h3 className="mb-1 text-sm font-bold text-white">Une inscription par participant</h3>
                  <p className="text-sm leading-relaxed text-white/70">
                    Pour faciliter la préparation et le suivi, merci d'envoyer une demande distincte pour
                    chaque personne qui souhaite participer.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="px-6 pb-16 md:px-16 md:pb-24">
            <div className="mx-auto max-w-4xl">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-white/80">
                Questions fréquentes
              </p>
              <h2 className="mb-8 text-2xl font-bold uppercase leading-tight md:text-3xl" style={{ color: GOLD }}>
                Avant de vous inscrire
              </h2>
              <FaqAccordion />
            </div>
          </section>

          {/* ── CTA finale ── */}
          <section className="px-6 pb-20 md:px-16 md:pb-28">
            <div
              className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-[42px] p-8 md:flex-row md:items-center"
              style={{ background: "rgba(3,27,19,0.8)" }}
            >
              <div>
                <h2 className="mb-2 text-xl font-bold uppercase text-white md:text-2xl">
                  Prêt à nous rencontrer à Paris ?
                </h2>
                <p className="text-sm text-white/70">
                  Choisissez votre jour de visite et transmettez votre demande en moins d'une minute.
                </p>
              </div>
              <button
                type="button"
                onClick={openForm}
                className="mx-auto block w-fit shrink-0 rounded-md px-8 py-3 text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 md:hidden"
                style={{ background: RED }}
              >
                Réserver ma rencontre
              </button>
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hidden shrink-0 rounded-md px-8 py-3 text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 md:block"
                style={{ background: RED }}
              >
                Réserver ma rencontre
              </a>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}
