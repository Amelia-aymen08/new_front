// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Seo from "../components/Seo";
import { PROJECTS, LOCALITIES } from "../data/mockData";
import { API_BASE_URL } from "../config";

const GOLD = "#F7C66A";

// Certaines résidences sont enregistrées dans mockData.ts sous leur adresse
// administrative réelle (utilisée pour la carte/l'adresse), différente du nom
// de commune utilisé dans la communication (confirmé par le client via Figma
// et les liens Matterport). On n'altère pas mockData — seul l'affichage de
// cette page utilise ce nom.
const DISPLAY_LOCATION = {
  RUBIS: "Oued Romane, Alger",
};

function displayLocation(project) {
  return DISPLAY_LOCATION[project.title] || project.location;
}

// Ordre des résidences tel qu'il figure sur la maquette Figma (JAIS, BÉRYL,
// RUBIS, CITRINE) — Géode est exclue (pas de fiche, pas de scan Matterport).
const TOUR_ITEMS = [
  PROJECTS.find((p) => p.title === "JAIS"),
  PROJECTS.find((p) => p.title === "BÉRYL"),
  PROJECTS.find((p) => p.title === "RUBIS"),
  PROJECTS.find((p) => p.title === "CITRINE"),
].filter(Boolean);

// Copy éditoriale spécifique à la page visite virtuelle, par résidence.
const TOUR_COPY = {
  JAIS: {
    availability: "disponible",
    badges: ["Disponible", "Livré", "360°"],
    blurbParagraphs: [
      "À Sebala, à quelques minutes de Draria. La visite suit le chemin d'une vraie journée : l'entrée, le séjour, la cuisine, puis le couloir des chambres.",
      "Faites-la deux fois — la seconde, on voit tout ce qu'on avait manqué.",
    ],
    note: "La seule de nos résidences déjà livrées où il reste des appartements. Les disponibilités évoluent chaque semaine.",
    alt: "Intérieur d'un appartement de la résidence Jais à Sebala, Draria",
  },
  BÉRYL: {
    availability: "complet",
    badges: ["Appartement témoin", "Livré", "360°"],
    blurbParagraphs: [
      "L'appartement témoin, exactement tel qu'il sort de chantier. Poussez la porte d'entrée, traversez le séjour, ouvrez les placards de la cuisine. Rien n'a été ajouté à l'image, rien n'a été retiré.",
    ],
    note: "Cette résidence est entièrement vendue. Elle reste ouverte à la visite pour ce qu'elle montre de notre niveau de finition.",
    noteLinkLabel: "voir les résidences encore disponibles",
    noteLinkTo: "/projets?utm_source=visite-virtuelle&utm_content=dispo",
    alt: "Séjour de l'appartement témoin de la résidence Béryl à Dely Ibrahim, Alger",
  },
  RUBIS: {
    availability: "complet",
    badges: ["Livré", "360°"],
    blurbParagraphs: [
      "Sur les hauteurs d'Oued Romane, la lumière entre tôt et reste tard. Passez d'une chambre au séjour, approchez-vous des fenêtres : c'est la façon la plus honnête de juger d'une orientation sans y passer la matinée.",
    ],
    note: "Résidence complète. Si c'est ce style d'intérieur que vous cherchez, nos résidences disponibles reprennent les mêmes finitions.",
    noteLinkLabel: "nos résidences disponibles",
    noteLinkTo: "/projets?utm_source=visite-virtuelle&utm_content=dispo",
    alt: "Intérieur d'un appartement de la résidence Rubis à Oued Romane, Alger",
  },
  CITRINE: {
    availability: "complet",
    badges: ["F5", "Livré", "360°"],
    blurbParagraphs: [
      "Un F5 livré à Birkhadem, dans l'une de nos résidences les plus demandées. La visite montre ce qu'une photo cache toujours : la hauteur sous plafond, la profondeur des rangements, la distance entre la cuisine et la table.",
    ],
    note: "Vendue en totalité. Nous construisons actuellement à Birkhadem et sur d'autres communes.",
    noteLinkLabel: "voir les projets en cours",
    noteLinkTo: "/projets?utm_source=visite-virtuelle&utm_content=en-cours",
    alt: "Séjour d'un appartement F5 de la résidence Citrine à Birkhadem, Alger",
  },
};

// Ordre d'affichage des filtres par commune, tel que sur la maquette.
const COMMUNE_ORDER = ["Dely Ibrahim", "Birkhadem", "Oued Romane", "Draria"];

// Localisations proposées dans la popup de prise de rendez-vous : les 12
// localités du site (mêmes données que le footer), affichées sur 3 colonnes.
const RDV_COMMUNES = LOCALITIES.map((l) => l.name.split(",")[0].trim());

const FAQ_ITEMS = [
  {
    question: "Comment fonctionne une visite virtuelle d'appartement ?",
    answer:
      "Vous cliquez sur l'image, la visite s'ouvre, et vous vous déplacez d'un point à l'autre du logement en cliquant au sol. Vous pouvez regarder dans toutes les directions, monter dans les chambres, revenir au séjour. Rien à installer, rien à créer comme compte.",
  },
  {
    question: "Puis-je voir l'appartement en entier, comme une maquette ?",
    answer:
      "Oui. Le bouton en bas de la visite fait basculer l'appartement en vue d'ensemble : le logement apparaît alors en volume, comme une maquette que l'on ferait tourner dans la main, avec toutes les cloisons visibles d'un seul regard. Un second mode affiche le plan vu du dessus, à l'échelle.",
  },
  {
    question: "La visite correspond-elle vraiment à l'appartement livré ?",
    answer:
      "Oui. Il ne s'agit ni d'un plan 3D ni d'une image de synthèse, mais d'un scan réalisé à l'intérieur de l'appartement une fois celui-ci terminé. Les volumes, les finitions et les matériaux que vous voyez sont ceux que vous trouverez sur place.",
  },
  {
    question: "Puis-je mesurer les pièces pendant la visite ?",
    answer:
      "Oui. L'outil de mesure intégré permet de relever une longueur de mur, une largeur de porte ou la surface d'une chambre. Pratique pour vérifier si vos meubles actuels trouveront leur place.",
  },
  {
    question: "Les appartements visités sont-ils disponibles à la vente ?",
    answer:
      "La résidence Jais dispose encore d'appartements. Béryl, Rubis et Citrine sont complètes : elles restent en ligne parce qu'elles montrent le niveau de finition que vous retrouverez dans nos résidences en cours. Les disponibilités du moment figurent sur la page de nos projets et dans le catalogue.",
  },
  {
    question: "Puis-je visiter depuis l'étranger ?",
    answer:
      "Oui, la page est accessible partout et à toute heure, sur ordinateur comme sur téléphone. Nos conseillers peuvent également vous accompagner pendant la visite par appel vidéo, et répondre à vos questions en direct.",
  },
  {
    question: "Comment visiter l'appartement en personne ?",
    answer:
      "Prenez rendez-vous depuis cette page ou écrivez-nous sur WhatsApp. Nous organisons les visites au siège commercial de Saïd Hamdine, à Bir Mourad Raïs, ou directement dans la résidence qui vous intéresse.",
  },
];

function track(event) {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event });
  }
}

function useOnScreen(ref, rootMargin = "0px") {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, rootMargin]);
  return isIntersecting;
}

function FadeInSection({ children, delay = 0 }) {
  const ref = useRef(null);
  const isVisible = useOnScreen(ref, "-60px");
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Badge({ children, tone = "neutral" }) {
  if (tone === "gold") {
    return (
      <span
        className="rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide"
        style={{ background: "#F7C66A", color: "#01463D" }}
      >
        {children}
      </span>
    );
  }
  return (
    <span className="rounded-full border border-white/25 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white/90">
      {children}
    </span>
  );
}

function PrimaryButton({ children, to, ...props }) {
  const className =
    "inline-flex items-center justify-center rounded-full bg-[#F7C66A] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#031B13] transition-transform hover:scale-[1.03]";
  if (to) {
    return (
      <Link to={to} className={className} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={className} {...props}>
      {children}
    </button>
  );
}

const SECONDARY_BUTTON_CLASS =
  "inline-flex items-center justify-center rounded-full border border-[#F7C66A]/50 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-[#F7C66A] hover:text-[#F7C66A]";

function SecondaryButton({ children, to, ...props }) {
  if (to) {
    return (
      <Link to={to} className={SECONDARY_BUTTON_CLASS} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={SECONDARY_BUTTON_CLASS} {...props}>
      {children}
    </button>
  );
}

function TourCard({ project, index, onReserve }) {
  const copy = TOUR_COPY[project.title];
  const imageOnLeft = index % 2 === 1;

  return (
    <FadeInSection>
      <article
        className="overflow-hidden rounded-[8px] border border-white/10"
        style={{
          background: "linear-gradient(135deg, #0A2E25 0%, #031B17 100%)",
          boxShadow: "0px 8px 20px 0px rgba(0,0,0,0.45)",
        }}
      >
        <div
          className={`flex flex-col md:gap-8 md:p-8 ${
            imageOnLeft ? "md:flex-row" : "md:flex-row-reverse"
          }`}
        >
          {/* Rendu Matterport en direct — pas d'image statique */}
          <div className="relative h-64 w-full shrink-0 overflow-hidden rounded-t-[8px] md:h-auto md:w-[43%] md:rounded-[8px]">
            {project.virtualTourUrl ? (
              <iframe
                src={project.virtualTourUrl}
                title={`Visite virtuelle 360° — Résidence ${project.title}`}
                className="absolute inset-0 h-full w-full"
                frameBorder="0"
                loading="lazy"
                allow="autoplay; fullscreen; web-share; xr-spatial-tracking"
                allowFullScreen
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: "#E8CE8F" }}
              >
                <span className="px-6 text-center text-xs font-bold uppercase tracking-widest text-[#5c4a1f]">
                  Visite 360° disponible prochainement
                </span>
              </div>
            )}
          </div>

          {/* Texte */}
          <div className="flex-1 p-6 md:p-0">
            <h3 className="mb-2 text-xl font-bold uppercase tracking-wide text-white md:text-2xl">
              Résidence <span style={{ color: GOLD }}>{project.title}</span>
            </h3>
            <p className="mb-4 flex items-center gap-1.5 text-sm text-white">
              <i className="fa-solid fa-location-dot text-[#F7C66A]/70" />
              {displayLocation(project)}
            </p>

            {copy?.badges && (
              <div className="mb-5 flex flex-wrap gap-2">
                {copy.badges.map((b) => (
                  <Badge key={b} tone={b === "Disponible" ? "gold" : "neutral"}>
                    {b}
                  </Badge>
                ))}
              </div>
            )}

            {copy?.blurbParagraphs?.map((p, i) => (
              <p key={i} className="mb-4 text-[15px] leading-relaxed text-white/90">
                {p}
              </p>
            ))}

            {copy?.note && (
              <div className="mb-6 border-l-2 pl-4" style={{ borderColor: GOLD }}>
                <p className="text-sm leading-relaxed text-white/70">
                  {copy.note}{" "}
                  {copy.noteLinkTo && (
                    <Link to={copy.noteLinkTo} className="underline decoration-[#F7C66A]/50 hover:text-[#F7C66A]">
                      {copy.noteLinkLabel}
                    </Link>
                  )}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <PrimaryButton onClick={onReserve}>Réservez une visite</PrimaryButton>
              <SecondaryButton to={`/projet/${project.title.toLowerCase()}`}>
                Voir la résidence
              </SecondaryButton>
            </div>
          </div>
        </div>
      </article>
    </FadeInSection>
  );
}

function RdvPopup({ open, onClose }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    localisations: [],
    consent: false,
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });

  if (!open) return null;

  const toggleCommune = (c) => {
    setForm((f) => ({
      ...f,
      localisations: f.localisations.includes(c)
        ? f.localisations.filter((x) => x !== c)
        : [...f.localisations, c],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.consent) {
      setStatus({ type: "error", message: "Merci d'accepter les conditions pour continuer." });
      return;
    }
    setLoading(true);
    setStatus({ type: null, message: "" });
    try {
      const res = await fetch(`${API_BASE_URL}/api/visite-virtuelle-rdv`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.phone ? `+213 ${form.phone}` : "",
          localisations: form.localisations,
          consent: form.consent,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus({ type: "success", message: data.message || "Votre demande a bien été envoyée." });
        setForm({ firstName: "", lastName: "", email: "", phone: "", localisations: [], consent: false });
        track("cta_rdv_submit_success");
      } else {
        setStatus({ type: "error", message: data.message || "Une erreur est survenue." });
      }
    } catch {
      setStatus({ type: "error", message: "Une erreur est survenue. Veuillez réessayer." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md overflow-y-auto rounded-[8px] p-6 md:p-8"
        style={{ background: "linear-gradient(135deg, #0A2E25 0%, #031B17 100%)", maxHeight: "92vh" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <i className="fa-solid fa-xmark" />
        </button>

        <div className="mb-6 text-center">
          <p className="font-['PhotographSignature'] text-4xl text-white md:text-5xl">Prendre</p>
          <p className="-mt-2 text-2xl font-semibold text-white md:text-3xl">Rendez-vous</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/60">
                Nom*
              </label>
              <input
                required
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                className="w-full border-b border-white/30 bg-transparent py-2 text-sm text-white outline-none focus:border-[#F7C66A]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/60">
                Prénom*
              </label>
              <input
                required
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                className="w-full border-b border-white/30 bg-transparent py-2 text-sm text-white outline-none focus:border-[#F7C66A]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/60">
              Email*
            </label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full border-b border-white/30 bg-transparent py-2 text-sm text-white outline-none focus:border-[#F7C66A]"
            />
          </div>

          <div className="flex items-center gap-2 rounded-[8px] border border-white/20 px-4 py-3">
            <span className="shrink-0 text-sm text-white/70">+213</span>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="5XX XXX XXX"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            />
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
              Localisation souhaitée
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
              {RDV_COMMUNES.map((c) => (
                <label key={c} className="flex cursor-pointer items-center gap-2 text-sm text-white">
                  <input
                    type="checkbox"
                    checked={form.localisations.includes(c)}
                    onChange={() => toggleCommune(c)}
                    className="h-4 w-4 shrink-0 rounded border-[#F7C66A]/50 accent-[#F7C66A]"
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3 pt-2">
            <input
              type="checkbox"
              required
              checked={form.consent}
              onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#F7C66A]/50 accent-[#F7C66A]"
            />
            <span className="text-xs leading-relaxed text-white/70">
              En soumettant ce formulaire, j'accepte les Conditions Générales d'Utilisation et
              j'accepte que les informations saisies soient utilisées par AYMEN PROMOTION pour me
              recontacter dans le cadre de la relation qui découle de ma demande. *
            </span>
          </label>

          {status.type && (
            <div
              className={`rounded px-4 py-3 text-sm ${
                status.type === "success"
                  ? "border border-green-500/30 bg-green-900/40 text-green-300"
                  : "border border-red-500/30 bg-red-900/40 text-red-300"
              }`}
            >
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#F7C66A] py-3 text-xs font-bold uppercase tracking-wider text-[#031B13] transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "Envoi…" : "Prendre contact"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function VisiteVirtuellePage() {
  const toursRef = useRef(null);
  const availabilityRef = useRef(null);
  const [activeCommune, setActiveCommune] = useState("Toutes");
  const [openFaq, setOpenFaq] = useState(0);
  const [rdvOpen, setRdvOpen] = useState(false);

  const openRdv = (source) => {
    track(`cta_rdv_open_${source}`);
    setRdvOpen(true);
  };

  const communes = useMemo(() => {
    const present = new Set(TOUR_ITEMS.map((p) => displayLocation(p).split(",")[0].trim()));
    return COMMUNE_ORDER.filter((c) => present.has(c));
  }, []);

  const filteredProjects =
    activeCommune === "Toutes"
      ? TOUR_ITEMS
      : TOUR_ITEMS.filter((p) => displayLocation(p).split(",")[0].trim() === activeCommune);

  const availableCount = TOUR_ITEMS.filter((p) => TOUR_COPY[p.title]?.availability === "disponible").length;
  const soldOutCount = TOUR_ITEMS.length - availableCount;

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <Seo
        title="Visite virtuelle appartement Alger 360° | Aymen Promotion"
        description="Visitez nos appartements haut standing à Alger en 360° : Dely Ibrahim, Birkhadem, Oued Romane, Draria. Scans réels de logements livrés, accessibles sans rendez-vous."
        appendTitleSuffix={false}
        keywords="visite virtuelle appartement Alger, visite virtuelle immobilier Algérie, appartement F5 Birkhadem, appartement Draria, appartement haut standing Alger, visiter un appartement en ligne, appartement 360 Alger, acheter un appartement à Alger depuis l'étranger"
        image="https://aymenpromotion-dz.com/assets/visite_virtuelle/banner_vr.png"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Header className="absolute top-0 left-0 z-40 w-full" />

      {/* ── Hero ── */}
      {/*
        Mobile : image contenue en haut (hauteur fixe), texte en flux normal
        en dessous sur fond uni — pas de superposition texte/image.
        Desktop : image plein cadre en fond, texte superposé (dégradés).
      */}
      <div className="relative w-full overflow-hidden md:h-[90vh] md:min-h-[560px]" style={{ background: "#031B17" }}>
        <div className="relative h-[52vh] min-h-[340px] w-full md:absolute md:inset-0 md:h-full md:min-h-0">
          <img
            src="/assets/visite_virtuelle/banner_vr.png"
            alt="Visite virtuelle d'appartement 360° — Aymen Promotion"
            className="absolute inset-0 h-full w-full object-cover object-[70%_center] md:object-right"
            draggable={false}
          />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-[#031B17] via-[#031B17]/75 to-transparent md:block" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#031B17] md:via-transparent" />
        </div>

        <div className="relative z-10 px-6 py-10 md:flex md:h-full md:max-w-3xl md:flex-col md:justify-center md:px-16 md:py-0">
          <p
            className="mb-4 text-xs font-bold uppercase tracking-[0.3em]"
            style={{ color: GOLD }}
          >
            Visite virtuelle 360°
          </p>
          <h1 className="mb-5 text-3xl font-bold leading-tight text-white md:text-5xl">
            Visitez nos appartements à Alger.{" "}
            <span style={{ color: GOLD }}>Sans bouger de chez vous.</span>
          </h1>
          <p className="mb-8 max-w-xl text-[15px] leading-relaxed text-white/80 md:text-base">
            Une sélection de nos appartements, scannés pièce par pièce. Explorez-les à votre guise,
            quand vous voulez. Accessible jour et nuit, sans rendez-vous, sans engagement.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => scrollTo(toursRef)}
              className="rounded-full bg-[#F7C66A] px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#031B13] transition-transform hover:scale-[1.03]"
            >
              Commencer la visite
            </button>
            <button
              onClick={() => scrollTo(availabilityRef)}
              className="rounded-full border border-white/30 px-7 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-[#F7C66A] hover:text-[#F7C66A]"
            >
              Voir les disponibilités
            </button>
          </div>
        </div>
      </div>

      {/* ── Bandeau de preuve ── */}
      {/* "20ans" et les "+30/+15/+1500" sont des graphismes Figma (typographie
          sur-mesure), pas du texte — on utilise donc les visuels exportés. */}
      <div className="border-y border-white/10 px-6 py-12 text-center" style={{ background: "#031B17" }}>
        <img
          src="/assets/visite_virtuelle/stats/20ans.svg"
          alt="20 ans d'expérience"
          className="mx-auto h-14 w-auto md:h-16"
        />
        <p className="mb-8 mt-2 text-xs font-bold uppercase tracking-[0.3em] text-white/60">
          D'expérience
        </p>
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-16">
          {[
            { src: "/assets/visite_virtuelle/stats/plus30.png", label: "Résidences haut standing" },
            { src: "/assets/visite_virtuelle/stats/plus15.png", label: "Communes prestigieuses" },
            { src: "/assets/visite_virtuelle/stats/plus1500.png", label: "Appartements livrés" },
          ].map((stat) => (
            <div key={stat.label}>
              <img src={stat.src} alt={stat.label} className="mx-auto h-9 w-auto" />
              <p className="mt-2 text-[11px] uppercase tracking-widest text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <section style={{ background: "#031B17" }} className="px-6 py-16 md:py-24">
        {/* ── Intro ── */}
        <FadeInSection>
          <p className="mx-auto mb-16 max-w-3xl text-center text-base leading-relaxed text-white md:text-lg">
            Une photo se retouche. Un plan 3D s'embellit. <strong>Une visite virtuelle, non</strong> :
            chaque appartement présenté ici a été scanné après livraison, tel qu'il est. Ce que vous
            voyez à l'écran est exactement ce que vous trouverez le jour où l'on vous remet les
            clés.
            <br />
            <span className="font-['PhotographSignature'] text-3xl md:text-4xl" style={{ color: GOLD }}>
              Prenez le temps qu'il vous faut — la porte reste ouverte.
            </span>
          </p>
        </FadeInSection>

        {/* ── Filtres par commune ── */}
        <div ref={toursRef} className="mx-auto mb-10 flex max-w-5xl flex-wrap justify-center gap-3 scroll-mt-24">
          {["Toutes", ...communes].map((c) => (
            <button
              key={c}
              onClick={() => setActiveCommune(c)}
              className={`rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                activeCommune === c
                  ? "border-[#F7C66A] bg-[#F7C66A] text-[#031B13]"
                  : "border-white/20 text-white hover:border-[#F7C66A] hover:text-[#F7C66A]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* ── Cartes de visite ── */}
        <div className="mx-auto flex max-w-5xl flex-col gap-12 md:gap-8">
          {filteredProjects.map((p, i) => (
            <TourCard key={p.id} project={p} index={i} onReserve={() => openRdv("card")} />
          ))}
        </div>
      </section>

      {/* ── Disponibilités ── */}
      <section ref={availabilityRef} style={{ background: "#031B17" }} className="scroll-mt-24 px-6 py-16 md:py-24">
        <FadeInSection>
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>
              Disponibilités
            </p>
            <h2 className="mb-5 text-2xl font-bold uppercase leading-snug md:text-3xl">
              <span className="text-white">Ces appartements sont vendus.</span>{" "}
              <span style={{ color: GOLD }}>Les prochains ne le sont pas encore.</span>
            </h2>
            <p className="text-[15px] leading-relaxed text-white/70 md:text-base">
              {soldOutCount} des {TOUR_ITEMS.length} résidences que vous venez de visiter sont
              complètes. C'est la meilleure preuve que nous puissions vous donner de ce qui vous
              attend — et la raison de ne pas attendre pour les suivantes.
            </p>
          </div>
        </FadeInSection>

        <FadeInSection delay={150}>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
            {[
              {
                eyebrow: "Livrées",
                title: "Résidences disponibles",
                text: "Les appartements prêts à recevoir leurs propriétaires, dans nos résidences déjà livrées. Vous pouvez emménager sans attendre.",
                cta: "Voir les résidences",
                to: "/projets?utm_source=visite-virtuelle&utm_content=dispo",
              },
              {
                eyebrow: "En construction",
                title: "Projets en cours",
                text: "Nos chantiers en cours dans la wilaya d'Alger. C'est le moment où le choix de l'étage, de l'orientation et de la typologie est encore entièrement ouvert.",
                cta: "Voir les projets",
                to: "/projets?utm_source=visite-virtuelle&utm_content=en-cours",
              },
              {
                eyebrow: "Document",
                title: "Le catalogue",
                text: "Toutes nos résidences, les plans 2D de chaque typologie, nos intérieurs et nos commodités, réunis dans un seul document à parcourir tranquillement.",
                cta: "Consulter le catalogue",
                to: "/catalogue?utm_source=visite-virtuelle&utm_content=catalogue",
              },
            ].map((card, i) => {
              const ButtonComponent = i === 0 ? PrimaryButton : SecondaryButton;
              return (
                <div
                  key={card.title}
                  className="flex flex-col rounded-[8px] border border-white/5 p-6"
                  style={{ background: "linear-gradient(135deg, #0A2E25 0%, #031B17 100%)" }}
                >
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-white/50">
                    {card.eyebrow}
                  </p>
                  <h3 className="mb-3 text-lg font-bold uppercase text-white">{card.title}</h3>
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-white/70">{card.text}</p>
                  <ButtonComponent
                    to={card.to}
                    onClick={() => track(`cta_${card.to.includes("catalogue") ? "catalogue" : "projets"}_click`)}
                  >
                    {card.cta}
                  </ButtonComponent>
                </div>
              );
            })}
          </div>
        </FadeInSection>
      </section>

      {/* ── Bloc de conversion ── */}
      <section style={{ background: "#0a3d2e" }} className="px-6 py-16 md:py-24">
        <FadeInSection>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-2 text-2xl font-bold uppercase text-white md:text-3xl">
              Un écran ne remplace pas{" "}
              <span className="font-['PhotographSignature'] normal-case text-4xl md:text-5xl" style={{ color: GOLD }}>
                une clé
              </span>
            </h2>
            <p className="mb-8 mt-4 text-[15px] leading-relaxed text-white/80 md:text-base">
              La visite vous a montré les volumes. Nos conseillers vous montreront le reste :{" "}
              <strong>les disponibilités du moment</strong>,{" "}
              <strong>les plans, les modalités de paiement</strong>. Au siège de Saïd Hamdine, ou
              directement sur place.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <SecondaryButton onClick={() => openRdv("conversion")}>
                Prendre rendez-vous
              </SecondaryButton>
              <a
                href="https://wa.me/213560582959"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("cta_whatsapp_click")}
                className={`${SECONDARY_BUTTON_CLASS} gap-2`}
              >
                <i className="fa-brands fa-whatsapp text-[#25D366]" />
                Écrire sur WhatsApp
              </a>
            </div>
            <p className="mt-6 font-['PhotographSignature'] text-2xl italic" style={{ color: GOLD }}>
              Frappez à la bonne porte.
            </p>
          </div>
        </FadeInSection>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: "#031B17" }} className="px-6 py-16 md:py-24">
        <FadeInSection>
          <div className="mx-auto max-w-3xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>
              Questions fréquentes
            </p>
            <h2 className="mb-10 text-2xl font-bold uppercase text-white md:text-3xl">
              Ce que l'on nous demande le plus souvent
            </h2>
            <div>
              {FAQ_ITEMS.map((item, i) => (
                <div key={item.question} className="border-b border-[#282726]">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="text-base font-bold uppercase text-white">{item.question}</span>
                    <i
                      className={`fa-solid ${openFaq === i ? "fa-minus" : "fa-plus"} shrink-0 text-sm`}
                      style={{ color: GOLD }}
                    />
                  </button>
                  {openFaq === i && (
                    <p className="pb-5 text-[15px] leading-relaxed text-[#949391]">{item.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* ── Bloc éditorial ── */}
      <section style={{ background: "#031B17" }} className="px-6 pb-20 md:pb-28">
        <FadeInSection>
          <div className="mx-auto max-w-3xl space-y-8">
            <p className="font-['PhotographSignature'] text-3xl text-center" style={{ color: GOLD }}>
              À propos
            </p>

            <div>
              <h3 className="mb-3 text-lg font-bold uppercase text-white">
                Visiter un appartement à Alger sans se déplacer
              </h3>
              <p className="text-sm leading-relaxed text-white/70">
                Choisir un appartement à Alger demande du temps, et surtout de la disponibilité :
                trafic, horaires de bureau, résidences situées à l'opposé les unes des autres. La
                visite virtuelle lève cette contrainte. En quelques minutes, vous comparez un F5 à
                Birkhadem, un appartement à Oued Romane et un logement à Draria, sans quitter votre
                fauteuil, puis vous ne vous déplacez que pour celui qui vous a convaincu.
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-bold uppercase" style={{ color: GOLD }}>
                Ce qui reste disponible aujourd'hui
              </h3>
              <p className="text-sm leading-relaxed text-white/70">
                Parmi les appartements ouverts à la visite sur cette page, seule{" "}
                <strong className="text-white">la résidence Jais</strong>, à Sebala près de Draria,
                dispose encore de logements. <strong className="text-white">Béryl</strong> à Dely
                Ibrahim, <strong className="text-white">Rubis</strong> à Oued Romane et{" "}
                <strong className="text-white">Citrine</strong> à Birkhadem sont entièrement
                vendues. Elles restent en ligne parce qu'elles témoignent, mieux qu'un argumentaire,
                du niveau de finition que nous livrons. Pour les appartements encore libres et les
                chantiers en cours, consultez{" "}
                <Link
                  to="/projets?utm_source=visite-virtuelle&utm_content=en-cours"
                  className="text-white underline decoration-[#F7C66A]/50 hover:text-[#F7C66A]"
                >
                  l'ensemble de nos projets
                </Link>{" "}
                ou notre catalogue.
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-bold uppercase text-white">
                Une entreprise de promotion immobilière à Alger depuis 20 ans
              </h3>
              <p className="text-sm leading-relaxed text-white/70">
                Aymen Promotion Immobilière construit des résidences de haut standing dans la
                wilaya d'Alger depuis plus de vingt ans, avec vingt-cinq projets livrés à ce jour,
                de Bab Ezzouar à Hydra. Notre engagement le plus concret n'est pas une promesse
                commerciale, c'est un chiffre : 98 % de nos résidences ont été livrées dans les
                délais annoncés.
              </p>
            </div>
          </div>
        </FadeInSection>
      </section>

      <Footer />

      <RdvPopup open={rdvOpen} onClose={() => setRdvOpen(false)} />
    </>
  );
}
