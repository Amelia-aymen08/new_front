// @ts-nocheck
import React, { useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Seo from "../components/Seo";
import { API_BASE_URL } from "../config";
import { getHubspotContext } from "../utils/hubspotContext";
import { getAttribution, getCurrentLinkAttribution } from "../utils/attribution";
import { COUNTRIES } from "../data/countries";

const GOLD = "#F7C66A";
const RED = "#BF0D0D";
const IMG = "/assets/jpo_nice";

const VENUE = "Sheraton Nice";
const ADDRESS = "480 Promenade des Anglais, 06200 Nice";
const MAPS_QUERY = `${VENUE} ${ADDRESS}`;
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`;
const MAPS_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(MAPS_QUERY)}&output=embed`;

// Listes déroulantes du formulaire (mêmes valeurs que le backend : jpoNiceController.js).
const DAY_OPTIONS = [
  { value: "samedi", label: "Samedi 31 octobre" },
  { value: "dimanche", label: "Dimanche 1er novembre" },
  { value: "flexible", label: "Je suis flexible" },
];
const TIME_OPTIONS = [
  { value: "a_confirmer", label: "À confirmer" },
  { value: "matin", label: "Matin" },
  { value: "apres_midi", label: "Après-midi" },
  { value: "flexible", label: "Je suis flexible" },
];
const PROFILES = ["Futur acquéreur", "Investisseur", "Projet familial", "Diaspora / retour en Algérie", "Autre"];
const OBJECTIVES = ["Résidence principale", "Résidence secondaire", "Investissement locatif", "Patrimoine familial", "Découvrir les projets"];
const TYPOLOGIES = ["F2", "F3", "F4", "F5", "Duplex / penthouse"];
const HORIZONS = ["Immédiat / moins de 3 mois", "3 à 6 mois", "6 à 12 mois", "Plus de 12 mois"];

const KEY_POINTS = [
  { icon: "fa-star", title: "Badge par e-mail", text: "Accès nominatif après inscription" },
  { icon: "fa-people-group", title: "Conseillers dédiés", text: "Un échange adapté à votre projet" },
  { icon: "fa-building", title: "Projets haut standing", text: "Résidences et opportunités à Alger" },
  { icon: "fa-calendar-check", title: "Deux journées à Nice", text: "31 octobre et 1er novembre" },
];

const BENEFITS = [
  { icon: "fa-house", title: "Découvrez nos projets", text: "Explorez les résidences, les typologies, les emplacements et les prestations proposées." },
  { icon: "fa-circle-plus", title: "Clarifiez votre acquisition", text: "Posez vos questions sur l'achat, l'accompagnement et les prochaines étapes de votre projet." },
  { icon: "fa-chart-line", title: "Parlez investissement", text: "Échangez autour de la résidence secondaire, du placement et du patrimoine familial." },
  { icon: "fa-square-check", title: "Préparez un rendez-vous ciblé", text: "Vos réponses au formulaire permettent à l'équipe de préparer un échange plus pertinent." },
];

const GALLERY = [
  { src: `${IMG}/gallery-talk.webp`, alt: "Un conseiller Aymen Promotion échange avec une visiteuse autour d'une table", cls: "md:row-span-2", pos: "40% 50%" },
  { src: `${IMG}/gallery-laptop.webp`, alt: "Un conseiller présente un projet sur ordinateur à des visiteurs", cls: "", pos: "45% 50%" },
  { src: `${IMG}/gallery-maquette.webp`, alt: "Visiteurs découvrant la maquette d'une résidence Aymen Promotion", cls: "", pos: "45% 50%" },
  { src: `${IMG}/gallery-wide.webp`, alt: "Échange personnalisé entre un conseiller et des visiteurs", cls: "md:col-span-2", pos: "50% 45%" },
];

const STEPS = [
  { n: "01", title: "Complétez le formulaire", text: "Indiquez vos coordonnées et quelques informations utiles pour préparer votre échange" },
  { n: "02", title: "Recevez votre badge", text: "Après validation, votre badge nominatif et les informations pratiques sont envoyés par e-mail" },
  { n: "03", title: "Rencontrez nos experts", text: "Présentez votre badge à l'accueil et profitez d'un échange personnalisé au Sheraton Nice" },
];

const FAQ_ITEMS = [
  {
    question: "Comment vais-je recevoir mon badge ?",
    answer: "Après validation de votre inscription, le badge nominatif et les informations pratiques seront envoyés à l'adresse e-mail renseignée. Vérifiez également votre dossier de courriers indésirables.",
  },
  {
    question: "Dois-je inscrire chaque participant séparément ?",
    answer: "Oui. Le badge étant nominatif, une inscription distincte doit être réalisée pour chaque visiteur.",
  },
  {
    question: "Puis-je choisir mon jour de visite ?",
    answer: "Oui. Le formulaire vous permet d'indiquer le samedi 31 octobre, le dimanche 1er novembre ou une disponibilité flexible. L'équipe confirmera les détails par e-mail ou par téléphone.",
  },
  {
    question: "Que dois-je préparer avant la rencontre ?",
    answer: "Vous pouvez préciser votre objectif, la typologie recherchée, votre horizon et vos questions. Ces informations permettent à nos conseillers de préparer un échange plus utile.",
  },
  {
    question: "Je n'ai pas reçu mon badge, que faire ?",
    answer: "Vérifiez vos courriers indésirables puis contactez l'équipe Aymen Promotion au +213 560 58 29 59 en indiquant votre nom et votre adresse e-mail d'inscription.",
  },
];

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  countryCode: "FR",
  phone: "",
  visitDay: "",
  timePref: "a_confirmer",
  residenceCountry: "France",
  city: "",
  profile: "",
  objective: "",
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

const labelClass = "mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a]";
const inputClass =
  "w-full rounded-md border border-[#E2E2E2] bg-white px-3 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#BF0D0D]";

function Select({ label, children, className = "", ...props }) {
  return (
    <div className={className}>
      {label && <label className={labelClass}>{label}</label>}
      <div className="relative">
        <select
          {...props}
          className="w-full appearance-none rounded-md border border-[#E2E2E2] bg-white px-3 py-2.5 pr-9 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#BF0D0D]"
        >
          {children}
        </select>
        <i className="fa-solid fa-chevron-down pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6b6b6b]" />
      </div>
    </div>
  );
}

function ProgressBar({ step }) {
  return (
    <div className="flex gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={2} aria-valuenow={step}>
      <span className="h-1 w-8 rounded-full" style={{ background: "#013A33" }} />
      <span className="h-1 w-8 rounded-full" style={{ background: step === 2 ? "#013A33" : "#D4D4D4" }} />
    </div>
  );
}

function NiceForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });
  const [done, setDone] = useState(null);
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const goToStep2 = (e) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });
    setStep(2);
  };

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
      const res = await fetch(`${API_BASE_URL}/api/jpo-nice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Le lien utilisé pour arriver sur la page (utm_* ou /jpo_nice/<source>) prime sur une attribution mémorisée.
        body: JSON.stringify({ ...form, ...getHubspotContext(), ...getAttribution(), ...getCurrentLinkAttribution() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setDone({ message: data.message || "Votre inscription a bien été enregistrée.", email: form.email });
        setForm(EMPTY_FORM);
        setStep(1);
      } else {
        setStatus({ type: "error", message: data.message || "Une erreur est survenue." });
        // Erreur sur un champ de l'étape 1 (doublon, téléphone…) : on y ramène le visiteur.
        if (res.status === 409 || /téléphone|e-mail|indicatif/i.test(data.message || "")) setStep(1);
      }
    } catch {
      setStatus({ type: "error", message: "Une erreur est survenue. Veuillez réessayer." });
    } finally {
      setLoading(false);
    }
  };

  const shell = (children) => (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-2xl">
      <div className="mx-auto h-1 w-[40%]" style={{ background: "linear-gradient(to right, #013A33, #F7C66A)" }} />
      <div className="p-6 md:p-10">{children}</div>
    </div>
  );

  if (done) {
    return shell(
      <div className="py-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "#E6F2EE" }}>
          <i className="fa-solid fa-check text-2xl text-[#013A33]" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-[#1a1a1a]">Inscription enregistrée</h2>
        <p className="mx-auto mb-2 max-w-md text-sm leading-relaxed text-[#6b6b6b]">{done.message}</p>
        <p className="mx-auto mb-6 max-w-md text-xs leading-relaxed text-[#8a8a8a]">
          Pensez à vérifier vos courriers indésirables. Un autre participant ? Le badge étant nominatif, une inscription distincte est nécessaire.
        </p>
        <button
          type="button"
          onClick={() => setDone(null)}
          className="rounded-md border border-[#013A33] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#013A33] transition-colors hover:bg-[#013A33]/5"
        >
          Inscrire une autre personne
        </button>
      </div>
    );
  }

  return shell(
    <>
      <div className="mb-3 flex items-start justify-between gap-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a]">Inscription visiteur</p>
        <div className="flex flex-col items-end gap-1.5">
          <ProgressBar step={step} />
          {step === 2 && (
            <p className="flex items-center gap-1.5 text-[11px] text-[#8a8a8a]">
              <i className="fa-regular fa-clock" /> Environ 1 minute
            </p>
          )}
        </div>
      </div>

      <h2 className="mb-1 text-2xl font-bold text-[#1a1a1a]">Recevez votre badge</h2>
      <p className="mb-6 text-sm text-[#6b6b6b]">Étape {step} sur 2 · moins de deux minutes.</p>

      {step === 1 ? (
        <form onSubmit={goToStep2} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Prénom*</label>
              <input required name="firstname" autoComplete="given-name" value={form.firstName} onChange={(e) => set({ firstName: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Nom*</label>
              <input required name="lastname" autoComplete="family-name" value={form.lastName} onChange={(e) => set({ lastName: e.target.value })} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Adresse e-mail*</label>
            <input required name="email" type="email" autoComplete="email" value={form.email} onChange={(e) => set({ email: e.target.value })} className={inputClass} />
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
                  <option key={c.code} value={c.code}>{c.code} {c.dial}</option>
                ))}
              </select>
              <input required name="phone" type="tel" autoComplete="tel-national" value={form.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="6 XX XX XX XX" className={inputClass} />
            </div>
          </div>

          {status.type && (
            <div role="alert" className="rounded border border-red-500/30 bg-red-50 px-4 py-3 text-sm text-red-700">{status.message}</div>
          )}

          <div className="flex flex-col-reverse items-stretch justify-between gap-4 pt-2 md:flex-row md:items-center">
            <p className="flex items-center gap-1.5 text-[11px] text-[#8a8a8a]">
              <i className="fa-solid fa-lock" style={{ color: GOLD }} />
              Votre créneau sera confirmé par notre équipe selon les disponibilités
            </p>
            <button type="submit" className="rounded-md px-10 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-opacity hover:opacity-90" style={{ background: RED }}>
              Continuer
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Select label="Jour souhaité *" required value={form.visitDay} onChange={(e) => set({ visitDay: e.target.value })}>
              <option value="">Choisir une date</option>
              {DAY_OPTIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </Select>
            <Select label="Préférence horaire*" required value={form.timePref} onChange={(e) => set({ timePref: e.target.value })}>
              {TIME_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </Select>

            <Select label="Pays de résidence" value={form.residenceCountry} onChange={(e) => set({ residenceCountry: e.target.value })}>
              {COUNTRIES.map((c) => <option key={c.code} value={c.name}>{c.name}</option>)}
            </Select>
            <div>
              <label className={labelClass}>Ville</label>
              <input name="city" autoComplete="address-level2" value={form.city} onChange={(e) => set({ city: e.target.value })} placeholder="Ex. Nice" className={inputClass} />
            </div>

            <Select label="Votre profil" value={form.profile} onChange={(e) => set({ profile: e.target.value })}>
              <option value="">Sélectionner</option>
              {PROFILES.map((p) => <option key={p} value={p}>{p}</option>)}
            </Select>
            <Select label="Votre objectif" value={form.objective} onChange={(e) => set({ objective: e.target.value })}>
              <option value="">Sélectionner</option>
              {OBJECTIVES.map((o) => <option key={o} value={o}>{o}</option>)}
            </Select>

            <Select label="Typologie recherchée" value={form.typology} onChange={(e) => set({ typology: e.target.value })}>
              <option value="">À définir</option>
              {TYPOLOGIES.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
            <Select label="Horizon du projet" value={form.horizon} onChange={(e) => set({ horizon: e.target.value })}>
              <option value="">À définir</option>
              {HORIZONS.map((h) => <option key={h} value={h}>{h}</option>)}
            </Select>
          </div>

          <div>
            <label className={labelClass}>Une question ou une précision ?</label>
            <textarea
              rows={3}
              maxLength={1500}
              value={form.message}
              onChange={(e) => set({ message: e.target.value })}
              placeholder="Localisation souhaitée, critères, budget indicatif ou question à préparer avant votre rendez-vous."
              className={`${inputClass} resize-none`}
            />
          </div>

          <label className="flex cursor-pointer items-start gap-2.5">
            <input type="checkbox" required checked={form.consent} onChange={(e) => set({ consent: e.target.checked })} className="mt-0.5 h-4 w-4 shrink-0 accent-[#BF0D0D]" />
            <span className="text-xs leading-relaxed text-[#6b6b6b]">
              J'accepte que mes données soient utilisées par Aymen Promotion pour traiter ma demande de préinscription et me contacter au sujet de ma visite. *{" "}
              <a href="/confidentialite" className="font-semibold underline hover:text-[#BF0D0D]">Politique de confidentialité</a>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-2.5">
            <input type="checkbox" checked={form.newsletterOptIn} onChange={(e) => set({ newsletterOptIn: e.target.checked })} className="mt-0.5 h-4 w-4 shrink-0 accent-[#BF0D0D]" />
            <span className="text-xs leading-relaxed text-[#6b6b6b]">
              Je souhaite également recevoir les actualités et offres d'Aymen Promotion. Ce choix est facultatif.
            </span>
          </label>

          {status.type && (
            <div role="alert" className="rounded border border-red-500/30 bg-red-50 px-4 py-3 text-sm text-red-700">{status.message}</div>
          )}

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setStatus({ type: null, message: "" }); setStep(1); }}
              disabled={loading}
              className="rounded-md bg-[#DCDCDC] px-8 py-3 text-xs font-bold uppercase tracking-wider text-[#1a1a1a] shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Retour
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50 md:px-8"
              style={{ background: RED }}
            >
              {loading ? "Envoi…" : "Recevoir mon badge"}
            </button>
          </div>

          <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-[#8a8a8a]">
            <i className="fa-solid fa-lock mt-0.5" style={{ color: GOLD }} />
            Vos informations sont traitées de manière confidentielle. Le badge est nominatif et sera envoyé à l'adresse e-mail renseignée après validation
          </p>
        </form>
      )}
    </>
  );
}

function FaqAccordion() {
  const [open, setOpen] = useState(-1);
  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, i) => (
        <div key={item.question} className="rounded-[19px] border-[1.5px] border-white/20 px-5 backdrop-blur-[7.5px]" style={{ boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}>
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

function Eyebrow({ children }) {
  return <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-white/80">{children}</p>;
}

export default function JpoNicePage() {
  const formRef = useRef(null);

  // Le formulaire est toujours affiché ; les boutons « Réserver » y font défiler la page.
  const openForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const CtaButton = ({ children, className = "" }) => (
    <button
      type="button"
      onClick={openForm}
      className={`rounded-md px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 ${className}`}
      style={{ background: RED }}
    >
      {children}
    </button>
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Nice, on arrive — Rencontres Aymen Promotion",
    startDate: "2026-10-31",
    endDate: "2026-11-01",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: ["https://aymenpromotion-dz.com/assets/jpo_nice/hero.webp"],
    isAccessibleForFree: true,
    location: {
      "@type": "Place",
      name: VENUE,
      address: { "@type": "PostalAddress", streetAddress: "480 Promenade des Anglais", postalCode: "06200", addressLocality: "Nice", addressCountry: "FR" },
    },
    organizer: { "@type": "Organization", name: "Aymen Promotion", url: "https://aymenpromotion-dz.com" },
  };

  const datesChip = (
    <div className="flex items-center gap-3">
      <i className="fa-regular fa-calendar text-3xl lg:text-[2.1rem]" style={{ color: GOLD }} />
      <div>
        <p className="text-xs uppercase tracking-widest text-white/90 lg:text-sm">Dates</p>
        <p className="text-base text-white lg:text-lg">Du <strong>31</strong> Oct au <strong>01</strong> Nov 2026</p>
      </div>
    </div>
  );
  const placeChip = (
    <div className="flex items-center gap-3">
      <i className="fa-solid fa-location-dot text-3xl lg:text-[2.1rem]" style={{ color: GOLD }} />
      <div>
        <p className="text-xs uppercase tracking-widest text-white/90 lg:text-sm">Lieu</p>
        <p className="text-base font-semibold text-white lg:text-lg">Sheraton, Nice</p>
      </div>
    </div>
  );
  const hero = <div className="flex flex-wrap gap-x-10 gap-y-4">{datesChip}{placeChip}</div>;

  return (
    <>
      <Seo
        title="Nice, on arrive — Rencontres Aymen Promotion les 31 octobre et 1er novembre 2026"
        description="Aymen Promotion vous accueille au Sheraton Nice les 31 octobre et 1er novembre 2026 pour parler de votre projet immobilier en Algérie. Inscrivez-vous et recevez votre badge nominatif par e-mail."
        appendTitleSuffix={false}
        keywords="Aymen Promotion Nice, rencontre immobilier Algérie Nice, Sheraton Nice, projets immobiliers Alger, diaspora immobilier Algérie"
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
            style={{ backgroundImage: "url('/texture.webp')", backgroundSize: "1200px", backgroundRepeat: "repeat", opacity: 0.14, mixBlendMode: "soft-light" }}
          />
        </div>

        <div className="relative z-10">
          {/* ── Hero (cadrage identique au Figma : 1280 x 656) ── */}
          <section className="relative">
            <img
              src={`${IMG}/hero.webp`}
              alt="Nice, on arrive — Aymen Promotion vous donne rendez-vous à Nice, de la Promenade des Anglais à Alger"
              width={1920}
              height={1179}
              // Mobile : hauteur fixe, image centrée. Bureau : cadre au rapport 1280/656 comme sur la maquette,
              // image calée pour garder le logo, la devise et « NICE ON ARRIVE » entiers.
              className="h-[300px] w-full object-cover sm:h-[420px] md:h-auto md:aspect-[1280/656]"
              style={{ objectPosition: "50% 62%" }}
            />
            {/* Tablette : dates et lieu centrés en bas ; grand écran : positions de la maquette. */}
            <div className="absolute inset-x-0 bottom-0 hidden px-16 pb-8 md:block lg:hidden">
              <div className="mx-auto flex max-w-6xl justify-center gap-16">{datesChip}{placeChip}</div>
            </div>
            <div className="hidden lg:block">
              <div className="absolute bottom-[5%] left-[21.5%]">{datesChip}</div>
              <div className="absolute bottom-[5%] left-[57.6%]">{placeChip}</div>
            </div>
          </section>
          <div className="px-6 pt-6 md:hidden">{hero}</div>

          {/* ── Introduction + formulaire (le formulaire passe en premier sur mobile) ── */}
          <section className="px-6 pb-12 pt-8 md:px-16 md:pb-20 md:pt-14">
            <div className="mx-auto flex max-w-[960px] flex-col gap-10">
              <div className="order-2 grid gap-8 md:order-1 md:grid-cols-[1fr_322px] md:items-center">
                <div>
                  <p className="mb-2 text-sm font-normal uppercase tracking-[0.2em] text-white/90 md:text-base">Nice · Côte d'Azur · Rencontres privées</p>
                  <h1 className="mb-4 text-4xl uppercase leading-tight text-white md:text-[3.1rem]">
                    <span className="font-medium">Nice,</span> <span className="font-extrabold" style={{ color: GOLD }}>on arrive</span>
                  </h1>
                  <p className="max-w-2xl text-[15px] leading-relaxed text-white/85 md:text-lg">
                    Les <strong className="text-white">samedi 31 octobre</strong> et <strong className="text-white">dimanche 1er novembre 2026</strong>,
                    Aymen Promotion vous accueille à Nice pour deux journées dédiées à vos projets immobiliers en Algérie.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-[9px] px-4 py-3 backdrop-blur-[8px]" style={glass}>
                    <i className="fa-solid fa-house text-3xl" style={{ color: GOLD }} />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/70">Format</p>
                      <p className="text-sm font-bold text-white">Rencontres sur inscription</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-[9px] px-4 py-3 backdrop-blur-[8px]" style={glass}>
                    <i className="fa-solid fa-envelope-circle-check text-3xl" style={{ color: GOLD }} />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/70">Confirmation</p>
                      <p className="text-sm font-bold text-white">Badge envoyé par e-mail</p>
                    </div>
                  </div>
                </div>
              </div>

              <div ref={formRef} className="order-1 w-full scroll-mt-24 md:order-2">
                <NiceForm />
              </div>
            </div>
          </section>

          {/* ── Points clés ── */}
          <section className="px-6 pb-12 md:px-16 md:pb-16">
            <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

          {/* ── Venez avec votre projet ── */}
          <section className="px-6 py-12 md:px-16 md:py-16">
            <div className="mx-auto max-w-6xl">
              <Eyebrow>Une rencontre utile et personnalisée</Eyebrow>
              <h2 className="mb-4 text-2xl font-bold uppercase leading-tight md:text-4xl" style={{ color: GOLD }}>
                Venez avec votre projet<br className="hidden md:block" /> repartez avec des réponses
              </h2>
              <p className="mb-10 max-w-3xl text-[15px] leading-relaxed text-white/75">
                Cette rencontre est conçue pour vous aider à mieux comprendre les projets Aymen Promotion et à avancer concrètement,
                que votre objectif soit d'habiter, d'investir ou de constituer un patrimoine en Algérie
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {BENEFITS.map((b) => (
                  <div key={b.title} className="rounded-[8px] p-5 backdrop-blur-[7.5px]" style={glass}>
                    <div className="mb-3 flex items-center gap-3">
                      <i className={`fa-solid ${b.icon} text-2xl`} style={{ color: GOLD }} />
                      <h3 className="text-sm font-bold uppercase leading-tight text-white">{b.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-white/70">{b.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Parcours en trois étapes ── */}
          <section className="px-6 py-12 md:px-16 md:py-16">
            <div className="mx-auto max-w-6xl">
              <Eyebrow>Votre parcours en trois étapes</Eyebrow>
              <h2 className="mb-4 text-2xl font-bold uppercase leading-tight text-white md:text-4xl">
                Inscrivez-vous. Recevez votre badge. Rencontrons-nous à Nice.
              </h2>
              <p className="mb-10 max-w-3xl text-[15px] leading-relaxed text-white/75">
                Des rencontres personnalisées, des présentations immersives et un accompagnement conçu pour aider chaque visiteur à avancer sereinement
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

              <div className="mt-8 flex flex-col items-stretch gap-4 md:flex-row md:items-center">
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

              <div className="mt-10 text-center">
                <CtaButton>Je réserve ma rencontre</CtaButton>
              </div>
            </div>
          </section>

          {/* ── Bandeau : votre projet commence à Nice ── */}
          <section className="px-6 py-8 md:px-16 md:py-12">
            <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[28px] md:grid-cols-2" style={{ background: "rgba(3,27,19,0.8)" }}>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <p className="mb-2 text-xs uppercase tracking-[0.3em] text-white/80">Habiter · Investir · Transmettre</p>
                <h2 className="mb-3 text-xl font-bold uppercase leading-tight text-white md:text-2xl">
                  Votre projet en Algérie commence par une rencontre à Nice
                </h2>
                <p className="mb-4 text-sm leading-relaxed text-white/80">
                  Profitez de ces deux journées pour expliquer votre besoin, découvrir les projets correspondant à vos critères et comprendre les options disponibles.
                </p>
                <ul className="mb-6 space-y-2 text-sm text-white/90">
                  {[
                    "Présentation des résidences, plans, typologies et prestations",
                    "Échange sur votre objectif : résidence, investissement ou patrimoine",
                    "Accompagnement personnalisé pour identifier les prochaines étapes",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <i className="fa-solid fa-check mt-1 text-xs" style={{ color: GOLD }} />
                      {t}
                    </li>
                  ))}
                </ul>
                <div><CtaButton>Obtenir mon badge</CtaButton></div>
              </div>
              <img src={`${IMG}/banner.webp`} alt="Une conseillère Aymen Promotion accueille des visiteurs devant une maquette" loading="lazy" className="h-64 w-full object-cover object-[60%_30%] md:h-full" />
            </div>
          </section>

          {/* ── Informations pratiques ── */}
          <section className="px-6 py-12 md:px-16 md:py-16">
            <div className="mx-auto max-w-6xl">
              <Eyebrow>Informations pratiques</Eyebrow>
              <h2 className="mb-3 text-2xl font-bold uppercase leading-tight text-white md:text-4xl">Retrouvez-nous à Nice au Sheraton</h2>
              <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-white/75">
                Un emplacement accessible, à proximité immédiate de l'aéroport Nice Côte d'Azur et de la Promenade des Anglais
              </p>

              <div className="grid gap-8 rounded-[10px] p-6 backdrop-blur-[7.5px] md:grid-cols-2 md:p-10" style={{ ...glass, background: "rgba(255,255,255,0.07)" }}>
                <div>
                  <h3 className="mb-2 text-lg font-bold uppercase text-white">Sheraton Nice</h3>
                  <p className="mb-5 text-sm leading-relaxed text-white/70">
                    Les détails de votre créneau et les indications d'accès seront également repris dans l'e-mail accompagnant votre badge
                  </p>
                  <div className="space-y-3 text-sm">
                    {[
                      { icon: "fa-location-dot", label: "Adresse", value: ADDRESS },
                      { icon: "fa-calendar", label: "Dates", value: "Samedi 31 octobre & dimanche 1er novembre 2026" },
                      { icon: "fa-star", label: "Accès", value: "Badge nominatif envoyé par e-mail" },
                      { icon: "fa-building", label: "Entrée", value: "Via l'avenue des Grenouillères, côté Parc Phoenix" },
                    ].map((row) => (
                      <div key={row.label} className="flex items-start gap-3">
                        <i className={`fa-solid ${row.icon} mt-0.5 w-5 text-center text-lg`} style={{ color: GOLD }} />
                        <div>
                          <p className="text-xs text-white/60">{row.label}</p>
                          <p className="font-semibold text-white">{row.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block rounded-md px-6 py-3 text-xs font-bold uppercase tracking-wider text-white underline transition-opacity hover:opacity-90"
                    style={{ background: RED }}
                  >
                    Voir l'itinéraire
                  </a>
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-bold uppercase text-white">Localisation</h3>
                  <iframe
                    title="Carte — Sheraton Nice, 480 Promenade des Anglais"
                    src={MAPS_EMBED}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-64 w-full rounded-[6px] border-0 bg-[#d9d9d9] md:h-72"
                  />
                  <p className="mt-3 text-sm font-bold text-white">Sheraton Nice</p>
                  <p className="text-sm text-white/70">480 Promenade des Anglais · 06200 Nice</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="px-6 py-12 md:px-16 md:py-16">
            <div className="mx-auto max-w-4xl">
              <Eyebrow>Questions fréquentes</Eyebrow>
              <h2 className="mb-8 text-2xl font-bold uppercase leading-tight md:text-3xl" style={{ color: GOLD }}>Avant de réserver votre rencontre</h2>
              <FaqAccordion />
            </div>
          </section>

          {/* ── CTA finale ── */}
          <section className="px-6 pb-20 md:px-16 md:pb-28">
            <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-[42px] p-8 md:flex-row md:items-center md:p-12" style={{ background: "rgba(3,27,19,0.8)" }}>
              <div>
                <h2 className="mb-2 text-2xl font-bold uppercase leading-tight text-white md:text-3xl">
                  Nice, on arrive.<br />Votre projet aussi.
                </h2>
                <p className="text-sm text-white/70 md:text-base">Réservez votre rencontre et recevez votre badge d'accès par e-mail</p>
              </div>
              <CtaButton className="mx-auto w-fit shrink-0 px-8 md:mx-0">Je m'inscris maintenant</CtaButton>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}
