// @ts-nocheck
import React, { useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Seo from "../components/Seo";
import { API_BASE_URL } from "../config";

const GOLD = "#F7C66A";
const RED = "#BF0D0D";

const EVENT_DATE = new Date("2026-09-28T00:00:00+02:00");

const COUNTRIES = [
  { code: "DZ", dial: "+213", label: "DZ" },
  { code: "FR", dial: "+33", label: "FR" },
  { code: "TN", dial: "+216", label: "TN" },
  { code: "MA", dial: "+212", label: "MA" },
];

// À ajuster librement — non spécifié par la maquette.
const PROFILE_OPTIONS = [
  "Particulier",
  "Investisseur",
  "Professionnel de l'immobilier",
  "Architecte / Bureau d'études",
  "Journaliste / Média",
  "Autre",
];

const FAQ_ITEMS = [
  {
    question: "Le formulaire me donne-t-il immédiatement accès au salon ?",
    answer:
      "Non. Il enregistre votre demande auprès d'Aymen Promotion. Vous devrez attendre le badge officiel ou les instructions finales envoyées par notre équipe.",
  },
  {
    question: "Comment recevrai-je mon badge ?",
    answer:
      "Après traitement, il sera communiqué à l'adresse e-mail renseignée, ou notre équipe vous contactera si une information complémentaire est nécessaire.",
  },
  {
    question: "Puis-je inscrire plusieurs personnes avec le même formulaire ?",
    answer:
      "Pour faciliter le traitement et le suivi de chaque badge, merci d'envoyer une demande distincte pour chaque participant.",
  },
  {
    question: "Que faire si je me suis trompé dans mes coordonnées ?",
    answer:
      "Répondez à l'e-mail de confirmation en indiquant votre référence de demande et les informations à corriger.",
  },
];

function useCountdownDays(target) {
  const [days, setDays] = useState(() =>
    Math.max(0, Math.ceil((target.getTime() - Date.now()) / 86400000))
  );
  React.useEffect(() => {
    const id = setInterval(() => {
      setDays(Math.max(0, Math.ceil((target.getTime() - Date.now()) / 86400000)));
    }, 60000);
    return () => clearInterval(id);
  }, [target]);
  return days;
}

function BatimatForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "DZ",
    phone: "",
    profile: "",
    newsletterOptIn: false,
    consent: false,
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.consent) {
      setStatus({ type: "error", message: "Merci d'accepter les conditions pour continuer." });
      return;
    }
    setLoading(true);
    setStatus({ type: null, message: "" });
    try {
      const res = await fetch(`${API_BASE_URL}/api/batimat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          countryCode: form.countryCode,
          profile: form.profile,
          newsletterOptIn: form.newsletterOptIn,
          consent: form.consent,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus({ type: "success", message: data.message || "Votre demande a bien été envoyée." });
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          countryCode: "DZ",
          phone: "",
          profile: "",
          newsletterOptIn: false,
          consent: false,
        });
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
    <div className="overflow-hidden rounded-xl bg-white shadow-2xl">
      <div
        className="mx-auto h-1 w-[61%]"
        style={{ background: "linear-gradient(to right, #013A33, #F7C66A)" }}
      />
      <div className="p-6 md:p-8">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#8a8a8a]">
          Préinscription visiteur
        </p>
        <p className="flex items-center gap-1.5 text-[11px] text-[#8a8a8a]">
          <i className="fa-regular fa-clock" /> Environ 1 minute
        </p>
      </div>

      <h2 className="mb-2 text-2xl font-bold text-[#1a1a1a]">Recevez les prochaines étapes</h2>
      <p className="mb-6 text-sm leading-relaxed text-[#6b6b6b]">
        Tous les champs ci-dessous sont obligatoires pour ouvrir votre demande.
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
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
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
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
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
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Téléphone / WhatsApp *</label>
          <div className="flex gap-2">
            <select
              value={form.countryCode}
              onChange={(e) => setForm((f) => ({ ...f, countryCode: e.target.value }))}
              className="w-24 rounded-md border border-[#E2E2E2] bg-white px-2 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-[#BF0D0D]"
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
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="5 XX XX XX XX"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Votre profil*</label>
          <select
            required
            value={form.profile}
            onChange={(e) => setForm((f) => ({ ...f, profile: e.target.value }))}
            className="w-full rounded-md border border-[#E2E2E2] bg-white px-3 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-[#BF0D0D]"
          >
            <option value="">Sélectionner</option>
            {PROFILE_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            required
            checked={form.consent}
            onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#BF0D0D]"
          />
          <span className="text-xs leading-relaxed text-[#6b6b6b]">
            J'accepte que mes données soient utilisées par Aymen Promotion pour traiter ma demande
            de préinscription et me contacter au sujet de ma visite à BATIMAT 2026. *{" "}
            <a href="/confidentialite" className="underline hover:text-[#BF0D0D]">
              Politique de confidentialité
            </a>
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={form.newsletterOptIn}
            onChange={(e) => setForm((f) => ({ ...f, newsletterOptIn: e.target.checked }))}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#BF0D0D]"
          />
          <span className="text-xs leading-relaxed text-[#6b6b6b]">
            Je souhaite également recevoir les actualités et offres d'Aymen Promotion. Ce choix est
            facultatif.
          </span>
        </label>

        {status.type && (
          <div
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
          Cette demande ne constitue pas encore le badge officiel. Celui-ci sera communiqué après
          traitement et validation.
        </p>
      </form>
      </div>
    </div>
  );
}

export default function BatimatPage() {
  const [formOpen, setFormOpen] = useState(false);
  const formRef = useRef(null);
  const countdownDays = useCountdownDays(EVENT_DATE);

  const openForm = () => {
    setFormOpen(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
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

  return (
    <>
      <Seo
        title="Rencontrez Aymen Promotion à BATIMAT 2026 — Paris"
        description="Aymen Promotion à Paris pour BATIMAT 2026 (28 sept — 1 oct, Paris Expo Porte de Versailles). Transmettez vos coordonnées en moins d'une minute pour préparer votre visite."
        appendTitleSuffix={false}
        keywords="Batimat 2026, Aymen Promotion Paris, salon immobilier Paris, préinscription visiteur Batimat"
      />
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>

      <Header className="absolute top-0 left-0 z-40 w-full" />

      {/* Même halo lumineux + texture que la page d'accueil, mais sans le
          masque de .ambient-bg : ce masque est calé sur le hero plein écran
          (100vh) de la home page et faisait apparaître une bande/coupure de
          couleur au milieu du hero, plus court, de cette page. Ici le halo
          couvre tout de manière continue, sans coupure. */}
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
            {/* Colonne gauche */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>
                Aymen Promotion à Paris
              </p>
              <h1 className="mb-5 text-3xl font-bold uppercase leading-tight text-white md:text-4xl lg:text-5xl">
                Rencontrons-nous à <span style={{ color: GOLD }}>Batimat 2026</span>
              </h1>
              <p className="mb-6 text-[15px] leading-relaxed text-white/80 md:text-base">
                Vous prévoyez de visiter le salon ? Transmettez-nous vos coordonnées en moins d'une
                minute. <strong className="text-white">Notre équipe traitera votre demande de préinscription</strong>{" "}
                et vous communiquera les prochaines étapes pour votre badge visiteur.
              </p>

              <div className="mb-7 flex flex-wrap gap-3">
                <div
                  className="flex items-center gap-3 rounded-[9px] px-4 py-3 backdrop-blur-[8px]"
                  style={{ background: "rgba(255,255,255,0.2)", boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
                >
                  <i className="fa-regular fa-calendar text-lg" style={{ color: GOLD }} />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Dates</p>
                    <p className="text-sm font-semibold text-white">28 sept — 1 oct 2026</p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-3 rounded-[9px] px-4 py-3 backdrop-blur-[8px]"
                  style={{ background: "rgba(255,255,255,0.2)", boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
                >
                  <i className="fa-solid fa-location-dot text-lg" style={{ color: GOLD }} />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Lieu</p>
                    <p className="text-sm font-semibold text-white">Paris Expo, Porte de Versailles</p>
                  </div>
                </div>
              </div>

              {/* Bouton déclencheur — mobile uniquement, le formulaire étant
                  toujours visible en colonne droite sur desktop. */}
              <button
                type="button"
                onClick={openForm}
                className="mx-auto mb-4 block w-fit rounded-md px-8 py-3 text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 md:hidden"
                style={{ background: RED }}
              >
                Demander ma préinscription
              </button>

              <p className="flex items-center gap-2 text-xs text-white/60">
                <i className="fa-solid fa-shield-halved" style={{ color: GOLD }} />
                Données utilisées uniquement selon votre consentement
              </p>
            </div>

            {/* Colonne droite — formulaire */}
            <div>
              <div
                ref={formRef}
                className={`grid overflow-hidden transition-[grid-template-rows] duration-500 ease-in-out md:!grid-rows-[1fr] ${
                  formOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="min-h-0">
                  <BatimatForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Comment votre demande sera traitée ── */}
        <section className="relative z-0 -mt-24 px-6 pb-16 pt-32 md:-mt-28 md:px-16 md:pb-24 md:pt-40" style={{ background: "#031B13" }}>
          <div className="mx-auto max-w-6xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>
              Parcours simple et transparent
            </p>
            <h2 className="mb-4 max-w-2xl text-2xl font-bold uppercase leading-tight text-white md:text-3xl">
              Comment votre demande sera traitée
            </h2>
            <p className="mb-10 max-w-2xl text-[15px] leading-relaxed text-white/70">
              La page collecte uniquement les données nécessaires au premier contact. L'inscription
              officielle est ensuite prise en charge par l'équipe Aymen Promotion.
            </p>

            <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center">
              {[
                {
                  n: "01",
                  title: "Vous remplissez le formulaire",
                  text: "Prénom, nom, e-mail et téléphone. Une confirmation de réception vous est envoyée automatiquement.",
                },
                {
                  n: "02",
                  title: "Notre équipe traite la demande",
                  text: "Nous vérifions les informations et réalisons l'inscription correspondante sur la plateforme BATIMAT.",
                },
                {
                  n: "03",
                  title: "Vous recevez votre badge",
                  text: "Une fois le traitement terminé, le badge ou les instructions finales sont envoyés à votre adresse e-mail.",
                },
              ].map((step, i, arr) => (
                <React.Fragment key={step.n}>
                  <div
                    className="flex-1 rounded-[8px] p-6 backdrop-blur-[7.5px]"
                    style={{ background: "rgba(255,255,255,0.09)", boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
                  >
                    <p className="mb-2 text-3xl font-bold" style={{ color: GOLD }}>
                      {step.n}
                    </p>
                    <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/70">{step.text}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex shrink-0 items-center justify-center">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full"
                        style={{ background: GOLD }}
                      >
                        <i className="fa-solid fa-chevron-right rotate-90 text-xs text-[#0a3d2e] md:rotate-0" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ── Countdown + Préparez votre échange ── */}
        <section className="px-6 py-16 md:px-16 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
            <div
              className="mx-auto w-full max-w-xs rounded-[42px] border-[3.5px] border-white px-8 py-10 text-center backdrop-blur-[8px]"
              style={{ background: "rgba(3,27,19,0.23)", boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.41)" }}
            >
              <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-white/60">
                Prochain rendez-vous
              </p>
              <p className="mb-3 text-lg font-bold uppercase" style={{ color: GOLD }}>
                Batimat 2026
              </p>
              <p className="mb-3 text-6xl font-bold text-white">J-{countdownDays}</p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/60">
                Compte à rebours
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>
                Une rencontre utile
              </p>
              <h2 className="mb-6 text-2xl font-bold uppercase leading-tight text-white md:text-3xl">
                Préparez votre échange avec notre équipe
              </h2>
              <div className="space-y-5">
                {[
                  {
                    icon: "fa-building",
                    title: "Rencontre personnalisée",
                    text: "Échangez directement avec les représentants d'Aymen Promotion présents à Paris.",
                  },
                  {
                    icon: "fa-people-group",
                    title: "Présentation de nos projets",
                    text: "Découvrez notre vision de l'immobilier et les opportunités adaptées à votre projet.",
                  },
                  {
                    icon: "fa-handshake",
                    title: "Préparation en amont",
                    text: "Notre équipe peut vous contacter avant le salon afin de mieux comprendre votre besoin et préparer le rendez-vous.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <i className={`fa-solid ${item.icon} mt-1 text-xl`} style={{ color: GOLD }} />
                    <div>
                      <h3 className="mb-1 text-sm font-bold text-white">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-white/70">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Encadré info ── */}
        <section className="px-6 pb-4 md:px-16">
          <div
            className="mx-auto flex max-w-6xl gap-4 rounded-[42px] p-8 backdrop-blur-[7.5px]"
            style={{ background: "rgba(255,255,255,0.09)", boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
          >
            <i className="fa-solid fa-circle-info mt-0.5 shrink-0 text-lg text-white/70" />
            <div>
              <h3 className="mb-1 text-sm font-bold text-white">
                Information importante sur la préinscription
              </h3>
              <p className="text-sm leading-relaxed text-white/70">
                Ce formulaire appartient à Aymen Promotion et sert à recueillir votre demande. Il ne
                remplace pas l'inscription officielle BATIMAT. L'accès au salon reste soumis à la
                validation du badge et aux conditions fixées par l'organisateur.
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="px-6 py-16 md:px-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>
              Questions fréquentes
            </p>
            <h2 className="mb-8 text-2xl font-bold uppercase leading-tight text-white md:text-3xl">
              Avant d'envoyer votre demande
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
                Prêt à préparer votre visite ?
              </h2>
              <p className="text-sm text-white/70">
                Complétez la préinscription maintenant et notre équipe prendra le relais.
              </p>
            </div>
            <button
              type="button"
              onClick={openForm}
              className="mx-auto block w-fit shrink-0 rounded-md px-8 py-3 text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 md:hidden"
              style={{ background: RED }}
            >
              Demander ma préinscription
            </button>
          </div>
        </section>
        </div>
      </div>

      <Footer />
    </>
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
            onClick={() => setOpen(open === i ? -1 : i)}
            className="flex w-full items-center justify-between gap-4 py-4 text-left"
          >
            <span className="text-sm font-bold text-white">{item.question}</span>
            <i
              className={`fa-solid ${open === i ? "fa-minus" : "fa-plus"} shrink-0 text-xs`}
              style={{ color: GOLD }}
            />
          </button>
          {open === i && (
            <p className="pb-4 text-sm leading-relaxed text-white/70">{item.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
}
