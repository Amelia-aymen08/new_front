// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Seo from "../components/Seo";
import { PROJECTS } from "../data/mockData";

const GOLD = "#F7C66A";

// Résidences affichées sur la page : toutes celles qui ont une visite virtuelle
// renseignée dans mockData.ts. Ajouter un virtualTourUrl à une résidence l'ajoute
// automatiquement ici, sans retouche de code.
const TOUR_PROJECTS = PROJECTS.filter((p) => !!p.virtualTourUrl);

// Copy éditoriale spécifique à la page visite virtuelle, par résidence.
// Une résidence avec virtualTourUrl mais absente de cette table s'affiche quand
// même (badges neutres, pas de phrase de disponibilité inventée).
const TOUR_COPY = {
  JAIS: {
    availability: "disponible",
    badges: ["Disponible", "Livré", "360°"],
    blurb:
      "À Sebala, à quelques minutes de Draria. La visite suit le chemin d'une vraie journée : l'entrée, le séjour, la cuisine, puis le couloir des chambres. Faites-la deux fois — la seconde, on voit tout ce qu'on avait manqué.",
    note: "La seule de nos résidences déjà livrées où il reste des appartements. Les disponibilités évoluent chaque semaine.",
    alt: "Intérieur d'un appartement de la résidence Jais à Sebala, Draria",
  },
  CITRINE: {
    availability: "complet",
    badges: ["F5", "Livré", "360°"],
    blurb:
      "Un F5 livré à Birkhadem, dans l'une de nos résidences les plus demandées. La visite montre ce qu'une photo cache toujours : la hauteur sous plafond, la profondeur des rangements, la distance entre la cuisine et la table.",
    note: "Vendue en totalité. Nous construisons actuellement à Birkhadem et sur d'autres communes.",
    noteLinkLabel: "voir les projets en cours",
    noteLinkTo: "/projets?utm_source=visite-virtuelle&utm_content=en-cours",
    alt: "Séjour d'un appartement F5 de la résidence Citrine à Birkhadem, Alger",
  },
  RUBIS: {
    availability: "complet",
    badges: ["Livré", "360°"],
    blurb:
      "Sur les hauteurs d'Oued Romane, la lumière entre tôt et reste tard. Passez d'une chambre au séjour, approchez-vous des fenêtres : c'est la façon la plus honnête de juger d'une orientation sans y passer la matinée.",
    note: "Résidence complète. Si c'est ce style d'intérieur que vous cherchez, nos résidences disponibles reprennent les mêmes finitions.",
    noteLinkLabel: "nos résidences disponibles",
    noteLinkTo: "/projets?utm_source=visite-virtuelle&utm_content=dispo",
    alt: "Intérieur d'un appartement de la résidence Rubis à Oued Romane, Alger",
  },
};

const FAQ_ITEMS = [
  {
    question: "Puis-je voir l'appartement en entier, comme une maquette ?",
    answer:
      "Oui. Le bouton en bas de la visite fait basculer l'appartement en vue d'ensemble : le logement apparaît alors en volume, comme une maquette que l'on ferait tourner dans la main, avec toutes les cloisons visibles d'un seul regard. Un second mode affiche le plan vu du dessus, à l'échelle.",
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
  const styles =
    tone === "gold"
      ? { background: "#F7D677", color: "#01463D" }
      : { background: "rgba(255,255,255,0.15)", color: "#fff" };
  return (
    <span
      className="rounded-[8px] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide backdrop-blur-sm"
      style={styles}
    >
      {children}
    </span>
  );
}

function PrimaryButton({ children, ...props }) {
  return (
    <Link
      className="inline-flex items-center justify-center rounded-[8px] bg-[#F7C66A] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#031B13] transition-transform hover:scale-[1.03]"
      {...props}
    >
      {children}
    </Link>
  );
}

function SecondaryButton({ children, ...props }) {
  return (
    <Link
      className="inline-flex items-center justify-center rounded-[8px] border border-[#F7C66A]/50 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-[#F7C66A] hover:text-[#F7C66A]"
      {...props}
    >
      {children}
    </Link>
  );
}

function TourCard({ project }) {
  const copy = TOUR_COPY[project.title];
  const isAvailable = copy?.availability === "disponible";

  return (
    <FadeInSection>
      <article
        className="overflow-hidden rounded-[8px] border border-white/5"
        style={{
          background: "linear-gradient(135deg, #0A2E25 0%, #031B17 100%)",
          boxShadow: "4px 5px 4px 0px rgba(0,0,0,0.32)",
        }}
      >
        <div className="flex flex-col md:flex-row-reverse">
          {/* Visuel — déclenche l'ouverture de la visite Matterport */}
          <VisitTrigger project={project} copy={copy} />

          {/* Texte */}
          <div className="flex-1 p-6 md:p-8">
            <p className="text-[13px] font-light uppercase tracking-widest text-white/60">
              résidence
            </p>
            <h3 className="mb-2 text-2xl font-semibold" style={{ color: GOLD }}>
              {project.title.charAt(0) + project.title.slice(1).toLowerCase()}
            </h3>
            <p className="mb-4 flex items-center gap-1.5 text-sm text-white">
              <i className="fa-solid fa-location-dot text-[#F7C66A]/70" />
              {project.location}
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

            {copy?.blurb && (
              <p className="mb-4 text-[15px] leading-relaxed text-white/90">{copy.blurb}</p>
            )}

            {copy?.note && (
              <>
                <div className="mb-4 h-px w-full bg-white/10" />
                <p className="mb-6 text-sm leading-relaxed text-white/70">
                  {copy.note}{" "}
                  {copy.noteLinkTo && (
                    <Link to={copy.noteLinkTo} className="underline decoration-[#F7C66A]/50 hover:text-[#F7C66A]">
                      {copy.noteLinkLabel}
                    </Link>
                  )}
                </p>
              </>
            )}

            <div className="flex flex-wrap gap-3">
              {isAvailable && (
                <PrimaryButton to="/contact" onClick={() => track("cta_reserver_visite_click")}>
                  Réserver une visite
                </PrimaryButton>
              )}
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

function VisitTrigger({ project, copy }) {
  const [open, setOpen] = useState(false);
  const image = project.coverImage || project.image;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          track("cta_visite_360_open");
        }}
        className="group relative block h-56 w-full shrink-0 md:h-auto md:w-[43%]"
        aria-label={`Ouvrir la visite virtuelle de la résidence ${project.title}`}
      >
        <img
          src={image}
          alt={copy?.alt || `Intérieur de la résidence ${project.title}, ${project.location}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F7C66A] text-[#031B13] shadow-lg">
            <i className="fa-solid fa-play text-xl" />
          </div>
        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Fermer la visite virtuelle"
          >
            <i className="fa-solid fa-xmark text-lg" />
          </button>
          <div className="relative aspect-video w-full max-w-6xl overflow-hidden rounded-[8px] border border-white/10">
            <iframe
              src={project.virtualTourUrl}
              title={`Visite virtuelle 360° — Résidence ${project.title}`}
              className="absolute inset-0 h-full w-full"
              frameBorder="0"
              allow="xr-spatial-tracking; gyroscope; accelerometer"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}

export default function VisiteVirtuellePage() {
  const toursRef = useRef(null);
  const availabilityRef = useRef(null);
  const [activeCommune, setActiveCommune] = useState("Toutes");
  const [openFaq, setOpenFaq] = useState(0);

  const communes = useMemo(
    () => Array.from(new Set(TOUR_PROJECTS.map((p) => p.location.split(",")[0].trim()))),
    []
  );

  const filteredProjects =
    activeCommune === "Toutes"
      ? TOUR_PROJECTS
      : TOUR_PROJECTS.filter((p) => p.location.split(",")[0].trim() === activeCommune);

  const availableCount = TOUR_PROJECTS.filter((p) => TOUR_COPY[p.title]?.availability === "disponible").length;
  const soldOutCount = TOUR_PROJECTS.length - availableCount;

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
        description="Visitez nos appartements haut standing à Alger en 360° : Birkhadem, El Achour, Draria. Scans réels de logements livrés, accessibles sans rendez-vous."
        appendTitleSuffix={false}
        keywords="visite virtuelle appartement Alger, visite virtuelle immobilier Algérie, appartement F5 Birkhadem, appartement Draria, appartement haut standing Alger, visiter un appartement en ligne, appartement 360 Alger, acheter un appartement à Alger depuis l'étranger"
        image="https://aymenpromotion-dz.com/assets/visite_virtuelle/banner_vr.png"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Header className="absolute top-0 left-0 z-40 w-full" />

      {/* ── Hero ── */}
      <div className="relative h-[90vh] min-h-[560px] w-full overflow-hidden" style={{ background: "#031B17" }}>
        <img
          src="/assets/visite_virtuelle/banner_vr.png"
          alt="Visite virtuelle d'appartement 360° — Aymen Promotion"
          className="absolute inset-0 h-full w-full object-cover object-right"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#031B17] via-[#031B17]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#031B17]" />

        <div className="relative z-10 flex h-full max-w-3xl flex-col justify-center px-6 pt-20 md:px-16">
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
            Trois appartements livrés, scannés pièce par pièce. Ouvrez les portes, montez dans les
            chambres, regardez par les fenêtres. Ouvert jour et nuit, sans rendez-vous, sans
            engagement.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => scrollTo(toursRef)}
              className="rounded-[8px] bg-[#F7C66A] px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#031B13] transition-transform hover:scale-[1.03]"
            >
              Commencer la visite
            </button>
            <button
              onClick={() => scrollTo(availabilityRef)}
              className="rounded-[8px] border border-white/30 px-7 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-[#F7C66A] hover:text-[#F7C66A]"
            >
              Voir les disponibilités
            </button>
          </div>
        </div>
      </div>

      {/* ── Bandeau de preuve ── */}
      <div className="border-y border-white/10" style={{ background: "#031B17" }}>
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 py-6 text-center text-sm font-medium text-white/90 md:flex-row md:justify-center md:gap-8 md:text-base">
          <span>
            <strong style={{ color: GOLD }}>20 ans</strong> de construction à Alger
          </span>
          <span className="hidden h-4 w-px bg-white/20 md:block" />
          <span>
            <strong style={{ color: GOLD }}>25</strong> résidences livrées
          </span>
          <span className="hidden h-4 w-px bg-white/20 md:block" />
          <span>
            <strong style={{ color: GOLD }}>98 %</strong> livrées dans les délais
          </span>
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
              className={`rounded-[8px] border px-5 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
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
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
          {filteredProjects.map((p) => (
            <TourCard key={p.id} project={p} />
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
            <h2 className="mb-5 text-2xl font-bold text-white md:text-3xl">
              Ces appartements sont vendus. Les prochains ne le sont pas encore.
            </h2>
            <p className="text-[15px] leading-relaxed text-white/70 md:text-base">
              {soldOutCount} des {TOUR_PROJECTS.length} résidences que vous venez de visiter sont
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
            ].map((card) => (
              <div
                key={card.title}
                className="flex flex-col rounded-[8px] border border-white/5 p-6"
                style={{ background: "linear-gradient(135deg, #0A2E25 0%, #031B17 100%)" }}
              >
                <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-white/50">
                  {card.eyebrow}
                </p>
                <h3 className="mb-3 text-lg font-semibold text-white">{card.title}</h3>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-white/70">{card.text}</p>
                <SecondaryButton
                  to={card.to}
                  onClick={() => track(`cta_${card.to.includes("catalogue") ? "catalogue" : "projets"}_click`)}
                >
                  {card.cta}
                </SecondaryButton>
              </div>
            ))}
          </div>
        </FadeInSection>
      </section>

      {/* ── Bloc de conversion ── */}
      <section style={{ background: "#0a3d2e" }} className="px-6 py-16 md:py-24">
        <FadeInSection>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">
              Un écran ne remplace pas{" "}
              <span className="font-['PhotographSignature'] text-4xl md:text-5xl" style={{ color: GOLD }}>
                une clé
              </span>
            </h2>
            <p className="mb-8 mt-4 text-[15px] leading-relaxed text-white/80 md:text-base">
              La visite vous a montré les volumes. Nos conseillers vous montreront le reste : les
              disponibilités du moment, les plans, les modalités de paiement. Au siège de Saïd
              Hamdine, ou directement sur place.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <PrimaryButton to="/contact" onClick={() => track("cta_rdv_click")}>
                Prendre rendez-vous
              </PrimaryButton>
              <a
                href="https://wa.me/213560582959"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("cta_whatsapp_click")}
                className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-[#F7C66A]/50 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-[#F7C66A] hover:text-[#F7C66A]"
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
            <h2 className="mb-10 text-2xl font-bold text-white md:text-3xl">
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
                    <span className="text-base font-bold text-white">{item.question}</span>
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
          <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                Visiter un appartement à Alger sans se déplacer
              </h3>
              <p className="text-sm leading-relaxed text-white/70">
                Choisir un appartement à Alger demande du temps, et surtout de la disponibilité :
                trafic, horaires de bureau, résidences situées à l'opposé les unes des autres. La
                visite virtuelle lève cette contrainte. En quelques minutes, vous comparez un F5 à
                Birkhadem, un appartement à El Achour et un logement à Draria, sans quitter votre
                fauteuil, puis vous ne vous déplacez que pour celui qui vous a convaincu.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold text-white">
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
    </>
  );
}
