// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Seo from "../components/Seo";
import { API_BASE_URL } from "../config";
import { getHubspotContext } from "../utils/hubspotContext";
import { getAttribution, getCurrentLinkAttribution } from "../utils/attribution";
import { COUNTRIES } from "../data/countries";

const GOLD = "#F7C66A";
const RED = "#BF0D0D";
const IMG = "/assets/jpo_helenite";

// Début des journées portes ouvertes (vendredi 23 octobre 2026, 15h, heure d'Alger).
const EVENT_START = new Date("2026-10-23T15:00:00+01:00").getTime();

const FRIDAY_SLOTS = ["15h - 16h", "16h - 17h", "17h - 18h", "18h - 19h"];
const DAY_SLOTS = [
  "08h - 09h", "09h - 10h", "10h - 11h", "11h - 12h", "12h - 13h",
  "13h - 14h", "14h - 15h", "15h - 16h", "16h - 17h", "17h - 18h",
];
const DATE_OPTIONS = [
  { value: "2026-10-23", label: "Vendredi 23 Octobre", slots: FRIDAY_SLOTS },
  { value: "2026-10-24", label: "Samedi 24 Octobre", slots: DAY_SLOTS },
  { value: "2026-10-25", label: "Dimanche 25 Octobre", slots: DAY_SLOTS },
  { value: "2026-10-26", label: "Lundi 26 Octobre", slots: DAY_SLOTS },
  { value: "2026-10-27", label: "Mardi 27 Octobre", slots: DAY_SLOTS },
  { value: "2026-10-28", label: "Mercredi 28 Octobre", slots: DAY_SLOTS },
  { value: "2026-10-29", label: "Jeudi 29 Octobre", slots: DAY_SLOTS },
];

const PROFILES = ["Futur acquéreur", "Investisseur", "Projet familial", "Diaspora / retour en Algérie", "Autre"];
const TYPOLOGIES = ["À définir", "F2", "F3", "F4", "F5", "Duplex / penthouse"];
const HORIZONS = ["Immédiat / moins de 3 mois", "3 à 6 mois", "6 à 12 mois", "Plus de 12 mois"];

const KEY_POINTS = [
  { icon: "fa-star", title: "Avant-première exclusive", text: "Découvrez Hélénite parmi les premiers" },
  { icon: "fa-tag", title: "Prix de lancement", text: "Conditions spéciales présentées pendant les journées portes ouvertes" },
  { icon: "fa-ruler-combined", title: "Achat sur plan", text: "Plans, typologies et accompagnement personnalisé" },
  { icon: "fa-comments", title: "Échange avec nos experts", text: "Une équipe disponible pour étudier votre projet" },
];

const OPPORTUNITIES = [
  {
    icon: "fa-city",
    title: "Découverte complète du projet",
    text: "Architecture, plans, typologies, prestations et vision générale de la résidence",
  },
  {
    icon: "fa-hand-holding-hand",
    title: "Étude personnalisée",
    text: "Présentez-nous vos besoins afin de recevoir des informations adaptées à votre projet",
  },
  {
    icon: "fa-people-group",
    title: "Accompagnement à l'achat sur plan",
    text: "Comprenez les étapes, les possibilités et les éléments essentiels avant votre décision",
  },
];

const REASONS = [
  { n: "01", title: "Soyez parmi les premiers", text: "Découvrez le concept Hélénite avant le lancement général et échangez directement avec l'équipe projet" },
  { n: "02", title: "Profitez du lancement", text: "Accédez aux informations et aux conditions commerciales présentées à l'occasion de l'avant-première" },
  { n: "03", title: "Visualisez votre futur bien", text: "Explorez la maquette, les plans, les typologies et les prestations pour mieux vous projeter" },
  { n: "04", title: "Recevez un conseil personnalisé", text: "Nos experts prennent le temps de comprendre votre besoin, votre horizon et vos critères" },
];

const GALLERY = [
  { src: `${IMG}/gallery-model.webp`, alt: "Visiteurs découvrant la maquette d'une résidence Aymen Promotion", cls: "md:row-span-2", pos: "40% 50%" },
  { src: `${IMG}/gallery-building.webp`, alt: "Visiteuse devant la présentation d'une résidence Aymen Promotion", cls: "", pos: "72% 50%" },
  { src: `${IMG}/gallery-vr.webp`, alt: "Visite virtuelle en casque de réalité virtuelle", cls: "", pos: "50% 30%" },
  { src: `${IMG}/gallery-wide.webp`, alt: "Conseiller Aymen Promotion présentant la maquette à des visiteurs", cls: "md:col-span-2", pos: "50% 50%" },
];

const STEPS = [
  { n: "01", title: "Choisissez votre date", text: "Complétez le formulaire et indiquez le jour et le créneau qui vous conviennent" },
  { n: "02", title: "Recevez la confirmation", text: "Notre équipe vérifie la disponibilité et vous communique l'adresse ainsi que les informations pratiques" },
  { n: "03", title: "Découvrez Hélénite", text: "Rencontrez nos experts, explorez le projet et obtenez les réponses adaptées à votre situation" },
];

const FAQ_ITEMS = [
  {
    question: "L'inscription est-elle gratuite ?",
    answer: "Oui. L'inscription à l'avant-première est gratuite. Elle permet à notre équipe d'organiser votre accueil et de confirmer un créneau de visite.",
  },
  {
    question: "Où se déroule l'avant-première ?",
    answer: "L'événement se déroule à Alger. Le lieu exact et les indications d'accès sont communiqués après confirmation de votre inscription.",
  },
  {
    question: "Que vais-je découvrir pendant la visite ?",
    answer: "Vous pourrez découvrir le concept architectural de Hélénite, la maquette, les plans, les typologies, les prestations et les conditions présentées à l'occasion du lancement.",
  },
  {
    question: "Le créneau choisi est-il confirmé immédiatement ?",
    answer: "Votre demande est enregistrée immédiatement, puis notre équipe vous contacte pour confirmer le créneau selon les disponibilités.",
  },
  {
    question: "Puis-je venir avec un proche ?",
    answer: "Oui. Pour faciliter l'accueil et le suivi, nous recommandons toutefois une inscription distincte pour chaque participant.",
  },
];

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  countryCode: "DZ",
  phone: "",
  visitDate: "",
  timeSlot: "",
  profile: "",
  typology: "",
  horizon: "",
  message: "",
  newsletterOptIn: false,
  consent: false,
};

const glass = {
  background: "rgba(255,255,255,0.09)",
  boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)",
};

function useCountdown(target) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
  };
}

function Select({ label, children, className = "", ...props }) {
  return (
    <div className={className}>
      {label && <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a]">{label}</label>}
      <div className="relative">
        <select
          {...props}
          className="w-full appearance-none rounded-md border border-[#E2E2E2] bg-white px-3 py-2.5 pr-9 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#BF0D0D] disabled:cursor-not-allowed disabled:bg-[#f6f6f6] disabled:text-[#9a9a9a]"
        >
          {children}
        </select>
        <i className="fa-solid fa-chevron-down pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6b6b6b]" />
      </div>
    </div>
  );
}

function JpoForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [projectOpen, setProjectOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const slots = DATE_OPTIONS.find((d) => d.value === form.visitDate)?.slots || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.visitDate || !form.timeSlot) {
      setStatus({ type: "error", message: "Merci de choisir votre jour et votre créneau de visite." });
      return;
    }
    if (!form.consent) {
      setStatus({ type: "error", message: "Merci d'accepter les conditions pour continuer." });
      return;
    }
    setLoading(true);
    setStatus({ type: null, message: "" });
    try {
      const res = await fetch(`${API_BASE_URL}/api/jpo-helenite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Le lien utilisé pour arriver sur la page (utm_* ou /jpo_helenite/<source>) prime sur une attribution mémorisée.
        body: JSON.stringify({
          ...form,
          ...getHubspotContext(),
          ...getAttribution(),
          ...getCurrentLinkAttribution(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus({ type: "success", message: data.message || "Votre demande a bien été enregistrée." });
        setForm(EMPTY_FORM);
        setProjectOpen(false);
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
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#8a8a8a]">Réservez votre visite</p>
          <p className="flex items-center gap-1.5 text-[11px] text-[#8a8a8a]">
            <i className="fa-regular fa-clock" /> Environ 1 minute
          </p>
        </div>

        <h2 className="mb-2 text-2xl font-bold text-[#1a1a1a]">Participez à l'avant-première</h2>
        <p className="mb-6 text-sm leading-relaxed text-[#6b6b6b]">
          Choisissez votre jour de visite. Notre équipe vous contactera pour confirmer le créneau et vous
          communiquer le lieu exact.
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
                placeholder="5 XX XX XX XX"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Jour souhaité *"
              required
              value={form.visitDate}
              onChange={(e) => set({ visitDate: e.target.value, timeSlot: "" })}
            >
              <option value="">Choisir une date</option>
              {DATE_OPTIONS.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </Select>
            <Select
              label="Créneau préféré*"
              required
              disabled={!form.visitDate}
              value={form.timeSlot}
              onChange={(e) => set({ timeSlot: e.target.value })}
            >
              <option value="">Choisir un horaire</option>
              {slots.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </div>

          {/* Bloc facultatif : s'ouvre dans le formulaire, avec une animation de hauteur. */}
          <div className="rounded-md border border-[#E2E2E2] bg-white">
            <button
              type="button"
              aria-expanded={projectOpen}
              aria-controls="jpo-project-panel"
              onClick={() => setProjectOpen((o) => !o)}
              className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm text-[#1a1a1a]"
            >
              <span>
                <strong>Préciser mon projet</strong> (facultatif)
              </span>
              <i
                className={`fa-solid fa-plus text-xs transition-transform duration-300 ${projectOpen ? "rotate-45" : ""}`}
                style={{ color: GOLD }}
              />
            </button>
            <div
              id="jpo-project-panel"
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: projectOpen ? "1fr" : "0fr" }}
              {...(projectOpen ? {} : { inert: "", "aria-hidden": true })}
            >
              <div className="overflow-hidden">
                <div
                  className={`space-y-4 px-3 pb-4 pt-1 transition-opacity duration-300 ${projectOpen ? "opacity-100" : "opacity-0"}`}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <Select label="Votre profil" value={form.profile} onChange={(e) => set({ profile: e.target.value })}>
                      <option value="">Sélectionner</option>
                      {PROFILES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </Select>
                    <Select label="Typologie recherchée" value={form.typology} onChange={(e) => set({ typology: e.target.value })}>
                      {TYPOLOGIES.map((t) => <option key={t} value={t === "À définir" ? "" : t}>{t}</option>)}
                    </Select>
                  </div>
                  <Select label="Horizon du projet" value={form.horizon} onChange={(e) => set({ horizon: e.target.value })}>
                    <option value="">Sélectionner</option>
                    {HORIZONS.map((h) => <option key={h} value={h}>{h}</option>)}
                  </Select>
                  <div>
                    <label className={labelClass}>Question ou précision</label>
                    <textarea
                      rows={3}
                      maxLength={1500}
                      value={form.message}
                      onChange={(e) => set({ message: e.target.value })}
                      placeholder="Budget indicatif, typologie, financement ou question particulière"
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>
              </div>
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
              J'accepte que mes données soient utilisées par Aymen Promotion pour traiter ma demande de
              préinscription et me contacter au sujet de ma visite. *{" "}
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
            {loading ? "Envoi…" : "Confirmer mon inscription"}
          </button>

          <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-[#8a8a8a]">
            <i className="fa-solid fa-lock mt-0.5" />
            Votre créneau sera confirmé par notre équipe selon les disponibilités
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

function SectionTitle({ eyebrow, children, gold = false, center = false, className = "" }) {
  return (
    <div className={`${center ? "text-center" : ""} ${className}`}>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-white/80">{eyebrow}</p>
      <h2
        className="text-2xl font-bold uppercase leading-tight text-white md:text-4xl"
        style={gold ? { color: GOLD } : undefined}
      >
        {children}
      </h2>
    </div>
  );
}

export default function JpoHelenitePage() {
  const formRef = useRef(null);
  const countdown = useCountdown(EVENT_START);

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
    name: "Avant-première Résidence Hélénite — Aymen Promotion",
    startDate: "2026-10-23T15:00:00+01:00",
    endDate: "2026-10-29T18:00:00+01:00",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: ["https://aymenpromotion-dz.com/assets/jpo_helenite/flyer.webp"],
    isAccessibleForFree: true,
    location: {
      "@type": "Place",
      name: "Siège Commercial Aymen Promotion",
      address: { "@type": "PostalAddress", addressLocality: "Said Hamdine, Alger", addressCountry: "DZ" },
    },
    organizer: { "@type": "Organization", name: "Aymen Promotion", url: "https://aymenpromotion-dz.com" },
  };

  const CtaButton = ({ className = "" }) => (
    <button
      type="button"
      onClick={openForm}
      className={`rounded-md px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 ${className}`}
      style={{ background: RED }}
    >
      Réserver ma rencontre
    </button>
  );

  return (
    <>
      <Seo
        title="Avant-première Résidence Hélénite — Journées portes ouvertes Aymen Promotion"
        description="Du 23 au 29 octobre 2026, découvrez en avant-première le nouveau projet Hélénite à Said Hamdine : plans, prestations et conditions de lancement. Inscription gratuite."
        appendTitleSuffix={false}
        keywords="Hélénite, Aymen Promotion, avant-première, journées portes ouvertes, Said Hamdine, achat sur plan Alger"
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
                  Lancement du nouveau projet
                </p>
                <h1 className="mb-5 text-3xl font-bold uppercase leading-tight text-white md:text-4xl lg:text-5xl">
                  Avant-première{" "}
                  <span className="block font-extrabold" style={{ color: GOLD }}>Résidence Hélénite</span>
                </h1>
                <p className="mb-6 text-[15px] leading-relaxed text-white/80 md:text-base">
                  Pendant une semaine, découvrez en priorité le nouveau projet Hélénite, ses plans, ses
                  prestations et ses conditions de lancement.{" "}
                  <strong className="text-white">Une rencontre privilégiée pour concrétiser votre projet d'achat sur plan.</strong>
                </p>

                <div className="mb-7 flex flex-wrap gap-3">
                  <div className="flex items-center gap-3 rounded-[9px] px-4 py-3 backdrop-blur-[8px]" style={{ background: "rgba(255,255,255,0.2)", boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}>
                    <i className="fa-regular fa-calendar text-lg" style={{ color: GOLD }} />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Dates</p>
                      <p className="text-sm font-semibold text-white">Du 23 Oct à 15 h au 29 Oct 2026</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-[9px] px-4 py-3 backdrop-blur-[8px]" style={{ background: "rgba(255,255,255,0.2)", boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}>
                    <i className="fa-solid fa-location-dot text-lg" style={{ color: GOLD }} />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Lieu</p>
                      <p className="text-sm font-semibold text-white">Siège Commercial Said Hamdine</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <CtaButton />
                  <a
                    href="#avant-premiere"
                    className="rounded-md border border-white/40 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/10"
                  >
                    Découvrir l'avant-première
                  </a>
                </div>

                <p className="flex items-center gap-2 text-xs text-white/60">
                  <i className="fa-solid fa-shield-halved" style={{ color: GOLD }} />
                  Inscription gratuite · Vos informations restent confidentielles
                </p>
              </div>

              <div ref={formRef}>
                <JpoForm />
              </div>
            </div>

            {/* Points clés */}
            <div className="mx-auto mt-14 grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {KEY_POINTS.map((k) => (
                <div key={k.title} className="flex items-start gap-3 rounded-[8px] p-4 backdrop-blur-[7.5px]" style={glass}>
                  <i className={`fa-solid ${k.icon} mt-0.5 text-2xl`} style={{ color: GOLD }} />
                  <div>
                    <h3 className="text-sm font-bold uppercase leading-tight text-white">{k.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/60">{k.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Une semaine d'avant-première ── */}
          <section id="avant-premiere" className="scroll-mt-20 px-6 py-12 md:px-16 md:py-20">
            <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[minmax(0,380px)_1fr] md:gap-16">
              <img
                src={`${IMG}/flyer.webp`}
                alt="Avant-première Hélénite du 23 au 29 octobre à Said Hamdine"
                width={900}
                height={1208}
                loading="lazy"
                className="mx-auto w-full max-w-[380px] rounded-[20px] shadow-2xl"
              />
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-white/80">
                  Une semaine d'avant-première
                </p>
                <h2 className="mb-4 text-2xl font-bold uppercase leading-tight md:text-4xl" style={{ color: GOLD }}>
                  Une opportunité unique pour découvrir Hélénite avant son lancement
                </h2>
                <p className="mb-8 text-[15px] leading-relaxed text-white/70">
                  Aymen Promotion vous ouvre les portes de son nouveau projet. Venez découvrir la maquette,
                  les plans, les prestations et les premières conditions commerciales dans un cadre dédié à
                  votre projet immobilier.
                </p>
                <div className="mb-8 space-y-5">
                  {OPPORTUNITIES.map((o) => (
                    <div key={o.title} className="flex items-start gap-4">
                      <i className={`fa-solid ${o.icon} mt-0.5 w-8 text-center text-2xl`} style={{ color: GOLD }} />
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wide text-white">{o.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-white/60">{o.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <CtaButton />
              </div>
            </div>
          </section>

          {/* ── Pourquoi participer ── */}
          <section className="px-6 py-12 md:px-16 md:py-20">
            <div className="mx-auto max-w-6xl">
              <SectionTitle eyebrow="Pourquoi participer ?" center>
                Une avant-première pensée pour faire avancer votre projet
              </SectionTitle>
              <p className="mx-auto mb-10 mt-4 max-w-2xl text-center text-[15px] leading-relaxed text-white/70">
                Que vous recherchiez votre futur logement ou une opportunité patrimoniale, cette semaine vous
                permet d'obtenir des réponses concrètes.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {REASONS.map((r) => (
                  <div key={r.n} className="rounded-[8px] p-6 backdrop-blur-[7.5px]" style={glass}>
                    <div className="mb-3 flex items-center gap-3">
                      <span className="text-4xl font-extrabold leading-none" style={{ color: GOLD }}>{r.n}</span>
                      <h3 className="text-sm font-bold uppercase leading-tight text-white">{r.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-white/70">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Galerie ── */}
          <section className="px-6 py-12 md:px-16 md:py-20">
            <div className="mx-auto max-w-6xl">
              <SectionTitle eyebrow="L'expérience Aymen Promotion" className="mb-4">
                L'ambiance de nos précédentes journées portes ouvertes
              </SectionTitle>
              <p className="mb-10 max-w-2xl text-[15px] leading-relaxed text-white/70">
                Des rencontres personnalisées, des présentations immersives et un accompagnement conçu pour
                aider chaque visiteur à avancer sereinement.
              </p>
              <div className="grid gap-3 md:h-[520px] md:grid-cols-[1.7fr_1fr_1fr] md:grid-rows-2">
                {GALLERY.map((g) => (
                  <figure key={g.src} className={`min-h-0 overflow-hidden rounded-[28px] ${g.cls}`}>
                    <img
                      src={g.src}
                      alt={g.alt}
                      loading="lazy"
                      style={{ objectPosition: g.pos }}
                      className="aspect-[16/10] w-full object-cover md:aspect-auto md:h-full"
                    />
                  </figure>
                ))}
              </div>
            </div>
          </section>

          {/* ── Votre visite en trois étapes ── */}
          <section className="px-6 py-12 md:px-16 md:py-20">
            <div className="mx-auto max-w-6xl">
              <SectionTitle eyebrow="Votre visite en trois étapes" center>
                Une inscription simple, un accueil personnalisé
              </SectionTitle>
              <div className="mt-10 flex flex-col items-stretch gap-4 md:flex-row md:items-center">
                {STEPS.map((step, i, arr) => (
                  <React.Fragment key={step.n}>
                    <div className="flex-1 self-stretch rounded-[8px] p-6 backdrop-blur-[7.5px]" style={glass}>
                      <div className="mb-2 flex items-center gap-3">
                        <span className="text-4xl font-extrabold leading-none" style={{ color: GOLD }}>{step.n}</span>
                        <h3 className="text-sm font-bold uppercase leading-tight text-white">{step.title}</h3>
                      </div>
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
            </div>
          </section>

          {/* ── Informations pratiques ── */}
          <section className="px-6 py-12 md:px-16 md:py-20">
            <div
              className="relative mx-auto max-w-6xl overflow-hidden rounded-[40px]"
              style={{
                backgroundImage: `linear-gradient(90deg, rgba(3,27,19,0.82), rgba(3,27,19,0.35)), url('${IMG}/infos-bg.webp')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="grid gap-8 p-8 md:grid-cols-[1.2fr_1fr] md:items-center md:p-12">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-white/80">
                    Informations pratiques
                  </p>
                  <h2 className="mb-3 text-xl font-bold uppercase leading-tight text-white md:text-3xl">
                    Une semaine pour faire le premier pas vers votre avenir
                  </h2>
                  <p className="mb-6 text-[15px] leading-relaxed text-white/80">
                    Inscrivez-vous dès maintenant. L'adresse exacte et la confirmation du créneau vous seront
                    envoyées après traitement de votre demande.
                  </p>
                  <div className="mb-6 flex gap-3" role="timer" aria-label="Temps restant avant le début de l'avant-première">
                    {[
                      { v: countdown.days, l: "Jours" },
                      { v: countdown.hours, l: "Heures" },
                      { v: countdown.minutes, l: "Minutes" },
                    ].map((c) => (
                      <div key={c.l} className="min-w-[72px] rounded-[10px] px-3 py-2 text-center backdrop-blur-[8px]" style={{ background: "rgba(255,255,255,0.15)" }}>
                        <p className="text-2xl font-extrabold leading-none" style={{ color: GOLD }}>{c.v}</p>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/80">{c.l}</p>
                      </div>
                    ))}
                  </div>
                  <CtaButton />
                </div>

                <div className="space-y-3">
                  {[
                    { icon: "fa-regular fa-calendar", label: "Dates", text: "Du 23 Oct à 15 h au 29 Oct 2026" },
                    { icon: "fa-solid fa-location-dot", label: "Lieu", text: "Siège Commercial, Said Hamdine" },
                    { icon: "fa-regular fa-building", label: "Projet", text: "Résidence Hélénite — Nouveau lancement Aymen Promotion" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-3 rounded-[9px] px-4 py-3 backdrop-blur-[8px]" style={{ background: "rgba(255,255,255,0.18)", boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}>
                      <i className={`${row.icon} w-6 text-center text-xl`} style={{ color: GOLD }} />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">{row.label}</p>
                        <p className="text-sm font-semibold text-white">{row.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="px-6 py-12 md:px-16 md:py-20">
            <div className="mx-auto max-w-4xl">
              <SectionTitle eyebrow="Questions fréquentes" gold className="mb-8">
                Avant de vous inscrire
              </SectionTitle>
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
                  Prêt à découvrir Hélénite en avant-première ?
                </h2>
                <p className="text-sm text-white/70">
                  Réservez votre visite et faites partie des premiers à explorer notre nouveau projet.
                </p>
              </div>
              <CtaButton className="mx-auto block w-fit shrink-0 px-8 md:mx-0" />
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}
