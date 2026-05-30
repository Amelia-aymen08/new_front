import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../config";

type TerrainPaperKey =
  | "PERMIS_DE_CONSTRUIRE"
  | "ACTE_DE_PROPRIETE"
  | "CERTIFICAT_URBANISME"
  | "ACTE_LIVRET_FONCIER"
  | "PLAN_CADASTRAL"
  | "FERIDA";

type TerrainFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  landAddress: string;
  facade: string;
  area: string;
  papers: Record<TerrainPaperKey, boolean>;
  consent: boolean;
};

const defaultPapers: Record<TerrainPaperKey, boolean> = {
  PERMIS_DE_CONSTRUIRE: false,
  ACTE_DE_PROPRIETE: false,
  CERTIFICAT_URBANISME: false,
  ACTE_LIVRET_FONCIER: false,
  PLAN_CADASTRAL: false,
  FERIDA: false,
};

export default function TerrainPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  const [form, setForm] = useState<TerrainFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    landAddress: "",
    facade: "",
    area: "",
    papers: defaultPapers,
    consent: false,
  });

  const paperOptions = useMemo(
    () => [
      { key: "PERMIS_DE_CONSTRUIRE" as const, label: "Permis de construire" },
      { key: "ACTE_DE_PROPRIETE" as const, label: "Acte de propriété" },
      { key: "CERTIFICAT_URBANISME" as const, label: "Certificat urbanisme" },
      { key: "ACTE_LIVRET_FONCIER" as const, label: "Acte livret foncier" },
      { key: "PLAN_CADASTRAL" as const, label: "Plan cadastral" },
      { key: "FERIDA" as const, label: "Ferida" },
    ],
    []
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onTogglePaper = (key: TerrainPaperKey) => {
    setForm((prev) => ({
      ...prev,
      papers: { ...prev.papers, [key]: !prev.papers[key] },
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.landAddress) {
      setStatus({ type: "error", message: "Veuillez remplir les champs obligatoires (Nom, Prénom, Email, Téléphone, Adresse du terrain)." });
      return;
    }
    if (!form.consent) {
      setStatus({ type: "error", message: "Veuillez accepter la politique de confidentialité pour envoyer votre demande." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/terrain-leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: `+213 ${form.phone}`.trim(),
          subject: form.subject,
          landAddress: form.landAddress,
          facade: form.facade,
          area: form.area,
          papers: form.papers,
          consent: true,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ type: "error", message: data?.message || "Une erreur est survenue. Veuillez réessayer." });
        return;
      }

      setStatus({ type: "success", message: data?.message || "Votre demande a été envoyée avec succès." });
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        landAddress: "",
        facade: "",
        area: "",
        papers: defaultPapers,
        consent: false,
      });
    } catch (err) {
      setStatus({ type: "error", message: "Impossible de se connecter au serveur. Veuillez réessayer plus tard." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#031B17] font-['Montserrat'] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(21,105,83,0.3),transparent_70%)]" />
        <div className="absolute top-[40%] right-[-10%] w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(225,187,127,0.1),transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage: 'url("/texture.png")',
            backgroundSize: "1200px",
            backgroundRepeat: "repeat",
          }}
        />
      </div>

      <Header className="absolute top-0 left-0 z-40 w-full" />

      <section className="relative w-full">
        <div className="relative h-[72vh] min-h-[520px]">
          <img src="/hero_terrain.png" alt="Nous achetons votre terrain à Alger — Contactez Aymen Promotion" className="h-full w-full object-cover object-center" draggable={false} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />

          <div className="absolute inset-0">
            <div className="mx-auto h-full max-w-7xl px-4 md:px-10 flex items-center">
              <div className="max-w-xl">
                <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-wide leading-tight text-[#F7C66A]">
                  Nous achetons
                  <br />
                  votre terrain
                </h1>
                <p className="mt-4 text-sm md:text-base text-white/85 font-light leading-relaxed max-w-md">
                  Évaluez le prix de votre terrain et profitez au maximum de votre propriété.
                </p>
                <button
                  type="button"
                  onClick={() => document.getElementById("terrain-form")?.scrollIntoView({ behavior: "smooth" })}
                  className="mt-8 inline-flex items-center justify-center rounded-full border border-[#F7C66A] px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#F7C66A] hover:text-[#031B17] transition-colors"
                >
                  En savoir plus
                </button>
              </div>
            </div>
          </div>
        </div>

        <div id="terrain-form" className="relative z-10 py-16 md:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-10">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="pt-2">
                  <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-[#F7C66A]">
                    Vous souhaitez vendre
                    <br />
                    votre terrain ?
                  </h2>
                  <p className="mt-5 text-sm text-white/70 leading-relaxed font-light text-justify">
                    Pionnier de l'immobilier neuf, de la construction et de la promotion immobilière en Algérie, Aymen Promotion immobilière œuvre dans l'amélioration de
                    l'environnement urbain dans lequel se trouvent ses résidences à Alger. Pour cela, Aymen Promotion choisit les meilleurs terrains pour bâtir ses projets.
                    Vous souhaitez que votre terrain soit le berceau d'un de nos projets de grande envergure ? Remplissez le formulaire avec les informations nécessaires.
                  </p>

                  <div className="mt-8 space-y-3 text-sm text-white/80">
                    <div className="flex items-center gap-3">
                      <span className="text-[#F7C66A]"><i className="fa-solid fa-phone" /></span>
                      <a href="tel:+213560582959" className="hover:underline">+213 560 58 29 59</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#F7C66A]"><i className="fa-solid fa-envelope" /></span>
                      <a href="mailto:terrain@aymenpromotion.com" className="hover:underline">terrain@aymenpromotion.com</a>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-[#F7C66A] mt-0.5"><i className="fa-solid fa-location-dot" /></span>
                      <div>
                        Ilot N 52 Section 05, Bir Mourad Raïs,
                        <br />
                        Alger 16000
                      </div>
                    </div>
                  </div>
              </div>

              <div className="pt-2">
                  {status.type && (
                    <div
                      className={[
                        "mb-6 rounded-2xl border px-5 py-4 text-sm",
                        status.type === "success" ? "border-green-500/40 bg-green-500/15 text-green-100" : "border-red-500/40 bg-red-500/15 text-red-100",
                      ].join(" ")}
                    >
                      {status.message}
                    </div>
                  )}

                  <form onSubmit={onSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        name="lastName"
                        value={form.lastName}
                        onChange={onChange}
                        placeholder="Nom*"
                        className="w-full bg-transparent border-b border-white/20 focus:border-[#F7C66A] outline-none px-1 py-3 text-sm placeholder:text-white/40"
                      />
                      <input
                        name="firstName"
                        value={form.firstName}
                        onChange={onChange}
                        placeholder="Prénom*"
                        className="w-full bg-transparent border-b border-white/20 focus:border-[#F7C66A] outline-none px-1 py-3 text-sm placeholder:text-white/40"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="Adresse email*"
                        type="email"
                        className="w-full bg-transparent border-b border-white/20 focus:border-[#F7C66A] outline-none px-1 py-3 text-sm placeholder:text-white/40"
                      />
                      <input
                        name="subject"
                        value={form.subject}
                        onChange={onChange}
                        placeholder="Objet"
                        className="w-full bg-transparent border-b border-white/20 focus:border-[#F7C66A] outline-none px-1 py-3 text-sm placeholder:text-white/40"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-end gap-3 border-b border-white/20 focus-within:border-[#F7C66A] px-1 py-2.5">
                        <span className="text-white/60 text-sm">+213</span>
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={onChange}
                          placeholder="Téléphone*"
                          className="w-full bg-transparent outline-none text-sm placeholder:text-white/40"
                          inputMode="tel"
                        />
                      </div>
                      <input
                        name="landAddress"
                        value={form.landAddress}
                        onChange={onChange}
                        placeholder="Adresse du terrain*"
                        className="w-full bg-transparent border-b border-white/20 focus:border-[#F7C66A] outline-none px-1 py-3 text-sm placeholder:text-white/40"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        name="facade"
                        value={form.facade}
                        onChange={onChange}
                        placeholder="Façade"
                        className="w-full bg-transparent border-b border-white/20 focus:border-[#F7C66A] outline-none px-1 py-3 text-sm placeholder:text-white/40"
                      />
                      <input
                        name="area"
                        value={form.area}
                        onChange={onChange}
                        placeholder="Superficie"
                        className="w-full bg-transparent border-b border-white/20 focus:border-[#F7C66A] outline-none px-1 py-3 text-sm placeholder:text-white/40"
                      />
                    </div>

                    <div className="pt-2">
                      <div className="text-xs font-bold uppercase tracking-widest text-[#F7C66A] mb-3">Papier du terrain :</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {paperOptions.map((p) => (
                          <label key={p.key} className="flex items-center gap-3 text-xs text-white/80 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={form.papers[p.key]}
                              onChange={() => onTogglePaper(p.key)}
                              className="h-4 w-4 accent-[#F7C66A]"
                            />
                            <span>{p.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <label className="flex items-start gap-3 text-xs text-white/70 cursor-pointer select-none pt-2">
                      <input
                        type="checkbox"
                        checked={form.consent}
                        onChange={() => setForm((prev) => ({ ...prev, consent: !prev.consent }))}
                        className="mt-0.5 h-4 w-4 accent-[#F7C66A]"
                      />
                      <span>
                        J'accepte que mes données soient traitées conformément à la politique de confidentialité.
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={loading}
                      className={[
                        "mt-4 w-full md:w-auto px-10 py-3 rounded-full bg-[#F7C66A] text-[#031B17] text-xs font-bold uppercase tracking-widest",
                        "hover:bg-white transition-colors",
                        loading ? "opacity-60 cursor-not-allowed" : "",
                      ].join(" ")}
                    >
                      {loading ? "Envoi..." : "Prendre contact"}
                    </button>

                    {!isMobile && <div className="pt-2" />}
                  </form>
              </div>
              </div>
            </div>
          </div>
      </section>

      <Footer />
    </div>
  );
}
