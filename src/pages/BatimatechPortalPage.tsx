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
  projectNames: string[];
  note: string;
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

type DropdownOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MultiSelectDropdown({
  value,
  placeholder,
  options,
  onChange,
}: {
  value: string[];
  placeholder: string;
  options: DropdownOption[];
  onChange: (value: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

  const selectedLabels = useMemo(() => {
    const set = new Set(value);
    return options.filter((o) => set.has(o.value)).map((o) => o.label);
  }, [options, value]);

  const display = selectedLabels.length ? selectedLabels.join(", ") : "";

  const toggle = (v: string) => {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "w-full flex items-center justify-between gap-4 rounded-xl px-4 py-3 text-sm outline-none transition-colors",
          "bg-[#0A241F] border border-white/10 text-white hover:border-[#F7C66A]/60 focus-visible:border-[#F7C66A]",
        ].join(" ")}
      >
        <span className={display ? "text-white" : "text-white/50"}>{display || placeholder}</span>
        <span className={open ? "text-[#F7C66A]" : "text-white/60"}>
          <ChevronDownIcon />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-[#F7C66A]/25 bg-[#031B17] shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="text-xs uppercase tracking-widest text-white/60">Sélection</div>
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-xs uppercase tracking-widest text-[#F7C66A] hover:text-white transition-colors"
            >
              Effacer
            </button>
          </div>
          <div className="max-h-72 overflow-y-auto py-2">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggle(opt.value)}
                className="w-full px-4 py-2.5 text-left text-sm transition-colors text-white hover:bg-white/5"
              >
                <span className="inline-flex items-center gap-3">
                  <span
                    className={[
                      "h-4 w-4 rounded border border-white/20 flex items-center justify-center",
                      value.includes(opt.value) ? "bg-[#F7C66A] border-[#F7C66A] text-[#031B17]" : "bg-transparent text-transparent",
                    ].join(" ")}
                  >
                    <i className="fa-solid fa-check text-[10px]" />
                  </span>
                  <span>{opt.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function normalizeNote(value: string) {
  const raw = typeof value === "string" ? value : "";
  return raw.length > 1200 ? raw.slice(0, 1200) : raw;
}

function Dropdown({
  value,
  placeholder,
  options,
  onChange,
  disabled,
}: {
  value: string;
  placeholder: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label || "";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        className={[
          "w-full flex items-center justify-between gap-4 rounded-xl px-4 py-3 text-sm outline-none transition-colors",
          "bg-[#0A241F] border border-white/10 text-white",
          "focus-visible:border-[#F7C66A]",
          disabled ? "opacity-50 cursor-not-allowed" : "hover:border-[#F7C66A]/60",
        ].join(" ")}
      >
        <span className={value ? "text-white" : "text-white/50"}>{value ? selectedLabel : placeholder}</span>
        <span className={open ? "text-[#F7C66A]" : "text-white/60"}>
          <ChevronDownIcon />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-[#F7C66A]/25 bg-[#031B17] shadow-2xl">
          <div className="max-h-72 overflow-y-auto py-2">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                disabled={Boolean(opt.disabled)}
                onClick={() => {
                  if (opt.disabled) return;
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={[
                  "w-full px-4 py-2.5 text-left text-sm transition-colors",
                  opt.disabled ? "text-white/30 cursor-not-allowed" : "text-white hover:bg-[#F7C66A] hover:text-[#031B17]",
                  opt.value === value && !opt.disabled ? "bg-[#F7C66A]/10 text-[#F7C66A]" : "",
                ].join(" ")}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BatimatechPortalPage() {
  const [authLoading, setAuthLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState("");
  const [salesAgent, setSalesAgent] = useState<SalesAgent | null>(null);
  const [login, setLogin] = useState<LoginState>({ email: "" });
  const [prospect, setProspect] = useState<ProspectState>({
    prospectLastName: "",
    prospectFirstName: "",
    phone: "",
    email: "",
    projectNames: [],
    note: "",
  });
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

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


  const onLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  const onProspectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProspect((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

    if (!prospect.prospectLastName || !prospect.prospectFirstName || !prospect.phone) {
      setStatus({ type: "error", message: "Veuillez renseigner les champs obligatoires du prospect." });
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
        projectNames: [],
        note: "",
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <MultiSelectDropdown
                    value={prospect.projectNames}
                    placeholder="Projets Aymen Promotion"
                    options={PROJECT_TITLES.map((t) => ({ value: t, label: t }))}
                    onChange={(v) => setProspect((prev) => ({ ...prev, projectNames: v }))}
                  />
                  <textarea
                    name="note"
                    value={prospect.note}
                    onChange={(e) => setProspect((prev) => ({ ...prev, note: normalizeNote(e.target.value) }))}
                    placeholder="Note"
                    rows={3}
                    className="w-full bg-[#0A241F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#F7C66A] outline-none"
                  />
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
