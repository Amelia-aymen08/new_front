import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../config";

type SalesAgent = {
  id: number;
  fullName: string;
  email: string;
};

type LoginState = {
  email: string;
};

type ProspectState = {
  prospectLastName: string;
  prospectFirstName: string;
  phone: string;
  email: string;
  projectName: string;
  appointmentDate: string;
  appointmentSlot: string;
};

const STORAGE_KEY = "batimatech_portal_session";
const PROJECT_TITLES = [
  "CÉLESTINE",
  "RUBIS",
  "CORNALINE",
  "CITRINE",
  "SELENITE",
  "SERAPHINITE",
  "DIAR EL AMANE",
  "LES CRÊTES",
  "JAIS",
  "OPALE",
  "LARIMAR",
  "PYRITE",
  "AMETRINE",
  "AGATE",
  "AZURITE",
  "CYANITE",
  "ALTHEA",
];

function buildTimeSlots() {
  const slots: string[] = [];
  for (let hour = 9; hour <= 18; hour += 1) {
    slots.push(`${String(hour).padStart(2, "0")}:00`);
  }
  return slots;
}

export default function BatimatechPortalPage() {
  const [authLoading, setAuthLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState("");
  const [salesAgent, setSalesAgent] = useState<SalesAgent | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [login, setLogin] = useState<LoginState>({ email: "" });
  const [prospect, setProspect] = useState<ProspectState>({
    prospectLastName: "",
    prospectFirstName: "",
    phone: "",
    email: "",
    projectName: "",
    appointmentDate: "",
    appointmentSlot: "",
  });
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  const timeSlots = useMemo(() => buildTimeSlots(), []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const savedToken = localStorage.getItem(STORAGE_KEY) || "";
    if (!savedToken) {
      setAuthLoading(false);
      return;
    }

    const bootstrap = async () => {
      const result = await fetchMe(savedToken);
      if (result) {
        setToken(savedToken);
        setSalesAgent(result);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      setAuthLoading(false);
    };

    bootstrap();
  }, []);

  const fetchMe = async (sessionToken: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/batimatech/me`, {
        headers: { Authorization: `Bearer ${sessionToken}` },
      });
      const data = await res.json();
      if (!res.ok || !data?.salesAgent) return null;
      return data.salesAgent as SalesAgent;
    } catch {
      return null;
    }
  };

  const loadBookedSlots = async (sessionToken: string, date: string) => {
    if (!date) {
      setBookedSlots([]);
      return;
    }
    setSlotsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/batimatech/slots?date=${encodeURIComponent(date)}`, {
        headers: { Authorization: `Bearer ${sessionToken}` },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(data?.bookedSlots)) {
        setBookedSlots(data.bookedSlots);
      } else {
        setBookedSlots([]);
      }
    } catch {
      setBookedSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const onLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  const onProspectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProspect((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "appointmentDate" ? { appointmentSlot: "" } : {}),
    }));
  };

  useEffect(() => {
    if (!token || !salesAgent) return;
    if (!prospect.appointmentDate) {
      setBookedSlots([]);
      return;
    }
    loadBookedSlots(token, prospect.appointmentDate);
  }, [token, salesAgent, prospect.appointmentDate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/batimatech/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.token || !data?.salesAgent) {
        setStatus({ type: "error", message: data?.message || "Connexion impossible." });
        return;
      }

      setToken(data.token);
      setSalesAgent(data.salesAgent);
      localStorage.setItem(STORAGE_KEY, data.token);
      setStatus({ type: null, message: "" });
    } catch {
      setStatus({ type: "error", message: "Erreur réseau lors de la connexion." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setToken("");
    setSalesAgent(null);
    setStatus({ type: null, message: "" });
  };

  const handleProspectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    if (!prospect.prospectLastName || !prospect.prospectFirstName || !prospect.phone || !prospect.appointmentDate || !prospect.appointmentSlot) {
      setStatus({ type: "error", message: "Veuillez renseigner les champs obligatoires du prospect et du rendez-vous." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/batimatech/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(prospect),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus({ type: "error", message: data?.message || "Impossible d'enregistrer le rendez-vous." });
        return;
      }

      setStatus({ type: "success", message: data?.message || "Prospect enregistré avec succès." });
      setProspect({
        prospectLastName: "",
        prospectFirstName: "",
        phone: "",
        email: "",
        projectName: "",
        appointmentDate: "",
        appointmentSlot: "",
      });
    } catch {
      setStatus({ type: "error", message: "Erreur réseau lors de l'enregistrement du prospect." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#031B17] font-['Montserrat'] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(21,105,83,0.3),transparent_70%)]" />
        <div className="absolute top-[40%] right-[-10%] w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(225,187,127,0.1),transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{ backgroundImage: 'url("/texture.png")', backgroundSize: "1200px", backgroundRepeat: "repeat" }}
        />
      </div>

      <Header className="absolute top-0 left-0 z-40 w-full" />

      <section className="relative z-10 pt-32 pb-20">
        <div className="mx-auto max-w-6xl px-4 md:px-10">
          <div className="mb-10 text-center">
            <span className="font-['PhotographSignature'] text-5xl md:text-7xl text-[#F7C66A] block mb-3">Portail</span>
            <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-wide">Batimatech</h1>
            <p className="mt-4 text-white/70 max-w-2xl mx-auto">
              Portail commercial pour l’identification des commerciaux et la planification des rendez-vous prospects.
            </p>
          </div>

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

          {authLoading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F7C66A] border-t-transparent" />
            </div>
          ) : !salesAgent ? (
            <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-[#0C2A24]/75 backdrop-blur-md p-6 md:p-10 shadow-2xl">
              <h2 className="text-2xl font-bold uppercase tracking-wide text-[#F7C66A] mb-8">Connexion Commercial</h2>
              <p className="mb-6 text-sm text-white/65 leading-relaxed">
                Saisissez uniquement votre adresse email professionnelle. L'accès est autorisé si cet email existe dans la base de données des commerciaux Aymen Promotion Immobilière.
              </p>
              <form onSubmit={handleLogin} className="space-y-6">
                <input
                  name="email"
                  type="email"
                  value={login.email}
                  onChange={onLoginChange}
                  placeholder="Email professionnel autorisé"
                  className="w-full bg-transparent border-b border-white/20 focus:border-[#F7C66A] outline-none px-1 py-3 text-sm placeholder:text-white/40"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-[#F7C66A] px-8 py-3 text-xs font-bold uppercase tracking-widest text-[#031B17] hover:bg-white transition-colors disabled:opacity-60"
                >
                  {submitting ? "Connexion..." : "Accéder au portail"}
                </button>
              </form>
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-[#0C2A24]/75 backdrop-blur-md p-6 md:p-10 shadow-2xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/50">Commercial connecté</div>
                  <div className="text-2xl font-bold text-[#F7C66A]">{salesAgent.fullName}</div>
                  <div className="text-sm text-white/60">{salesAgent.email}</div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-white/15 px-5 py-2 text-xs font-bold uppercase tracking-widest text-white/80 hover:border-[#F7C66A] hover:text-[#F7C66A] transition-colors"
                >
                  Déconnexion
                </button>
              </div>

              <form onSubmit={handleProspectSubmit} className="space-y-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Nom prénom du commercial</label>
                    <input
                      value={salesAgent.fullName}
                      readOnly
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/85"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    name="prospectLastName"
                    value={prospect.prospectLastName}
                    onChange={onProspectChange}
                    placeholder="Nom du prospect*"
                    className="w-full bg-transparent border-b border-white/20 focus:border-[#F7C66A] outline-none px-1 py-3 text-sm placeholder:text-white/40"
                  />
                  <input
                    name="prospectFirstName"
                    value={prospect.prospectFirstName}
                    onChange={onProspectChange}
                    placeholder="Prénom du prospect*"
                    className="w-full bg-transparent border-b border-white/20 focus:border-[#F7C66A] outline-none px-1 py-3 text-sm placeholder:text-white/40"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    name="phone"
                    value={prospect.phone}
                    onChange={onProspectChange}
                    placeholder="Téléphone*"
                    className="w-full bg-transparent border-b border-white/20 focus:border-[#F7C66A] outline-none px-1 py-3 text-sm placeholder:text-white/40"
                  />
                  <input
                    name="email"
                    type="email"
                    value={prospect.email}
                    onChange={onProspectChange}
                    placeholder="Email"
                    className="w-full bg-transparent border-b border-white/20 focus:border-[#F7C66A] outline-none px-1 py-3 text-sm placeholder:text-white/40"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <select
                    name="projectName"
                    value={prospect.projectName}
                    onChange={onProspectChange}
                    className="w-full bg-[#0A241F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#F7C66A]"
                  >
                    <option value="" disabled hidden>
                      Projet Aymen Promotion
                    </option>
                    {PROJECT_TITLES.map((title) => (
                      <option
                        key={title}
                        value={title}
                        style={{ backgroundColor: "#FFFFFF", color: "#031B17" }}
                      >
                        {title}
                      </option>
                    ))}
                  </select>

                  <input
                    name="appointmentDate"
                    type="date"
                    value={prospect.appointmentDate}
                    onChange={onProspectChange}
                    className="w-full bg-[#0A241F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#F7C66A]"
                  />

                  <select
                    name="appointmentSlot"
                    value={prospect.appointmentSlot}
                    onChange={onProspectChange}
                    disabled={!prospect.appointmentDate}
                    className="w-full bg-[#0A241F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#F7C66A] disabled:opacity-50"
                  >
                    <option value="">{slotsLoading ? "Chargement..." : "Créneau horaire"}</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-[#F7C66A] px-10 py-3 text-xs font-bold uppercase tracking-widest text-[#031B17] hover:bg-white transition-colors disabled:opacity-60"
                >
                  {submitting ? "Enregistrement..." : "Enregistrer le prospect"}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
