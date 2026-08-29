// @ts-nocheck
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/batimat`;
const TOKEN_KEY = "batimat_admin_token";
const REFRESH_INTERVAL_MS = 20000;

const STATUTS = [
  { value: "nouveau", label: "Nouveau", bg: "#FEF3C7", color: "#92400E", dot: "#D97706" },
  { value: "confirmé", label: "Confirmé", bg: "#DCFCE7", color: "#166534", dot: "#16A34A" },
  { value: "annulé", label: "Annulé", bg: "#FEE2E2", color: "#991B1B", dot: "#DC2626" },
];

function statutMeta(value) {
  return STATUTS.find((s) => s.value === value) || STATUTS[0];
}

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

function toCsv(leads) {
  const headers = ["Prénom", "Nom", "Email", "Téléphone", "Profil", "Newsletter", "Statut", "Date"];
  const rows = leads.map((l) => [
    l.firstName,
    l.lastName,
    l.email,
    l.phone,
    l.profile || "",
    l.newsletterOptIn ? "Oui" : "Non",
    l.statut,
    formatDate(l.createdAt),
  ]);
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n");
}

function downloadCsv(leads) {
  const csv = toCsv(leads);
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `batimat-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function LoginGate({ onAuthenticated }) {
  const [tokenInput, setTokenInput] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    setChecking(true);
    setError("");
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${tokenInput.trim()}` },
      });
      if (res.status === 401) {
        setError("Token incorrect.");
        setChecking(false);
        return;
      }
      if (!res.ok) {
        setError("Erreur serveur, réessayez.");
        setChecking(false);
        return;
      }
      sessionStorage.setItem(TOKEN_KEY, tokenInput.trim());
      onAuthenticated(tokenInput.trim());
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau.");
      setChecking(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#031B17] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#05241F] p-8 shadow-2xl"
      >
        <div className="mb-6 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-base font-bold text-[#031B17]"
            style={{ background: "#E1BB7F" }}
          >
            B
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Batimat — Admin</h1>
            <p className="text-xs text-white/40">Accès réservé</p>
          </div>
        </div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50">
          Token d'accès
        </label>
        <input
          type="password"
          autoFocus
          autoComplete="off"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="••••••••••••••••"
          className="mb-3 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#E1BB7F]"
        />
        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={checking}
          className="w-full rounded-lg py-2.5 text-sm font-bold uppercase tracking-wider text-[#031B17] transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "#E1BB7F" }}
        >
          {checking ? "Vérification…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

function StatCard({ label, value, accent, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-xl border bg-white px-5 py-4 text-left shadow-sm transition-all hover:shadow-md ${
        active ? "border-[#031B17] ring-1 ring-[#031B17]" : "border-[#E5E7EB]"
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
        <span className="text-xs font-semibold uppercase tracking-wide text-[#8A8F98]">{label}</span>
      </div>
      <span className="text-2xl font-bold text-[#031B17]">{value}</span>
    </button>
  );
}

const AVATAR_PALETTE = ["#031B17", "#92400E", "#166534", "#1E3A8A", "#7C2D12", "#5B21B6", "#9D174D"];

function avatarColor(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function Avatar({ firstName, lastName }) {
  const initials = `${(firstName || "?")[0] || ""}${(lastName || "")[0] || ""}`.toUpperCase();
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
      style={{ background: avatarColor(`${firstName}${lastName}`) }}
    >
      {initials || "?"}
    </span>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#8A8F98]">
      <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Pagination({ page, totalPages, total, pageSize, onChange }) {
  if (totalPages <= 1) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const pages = [];
  const add = (p) => pages.push(p);
  add(1);
  for (let p = page - 1; p <= page + 1; p++) if (p > 1 && p < totalPages) add(p);
  if (totalPages > 1) add(totalPages);
  const uniquePages = [...new Set(pages)].sort((a, b) => a - b);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EDEEF1] px-5 py-3.5">
      <p className="text-xs text-[#8A8F98]">
        Affichage <span className="font-semibold text-[#031B17]">{start}–{end}</span> sur{" "}
        <span className="font-semibold text-[#031B17]">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="rounded-md border border-[#E5E7EB] px-2.5 py-1.5 text-xs font-medium text-[#4B5563] transition-colors hover:bg-[#F5F6F8] disabled:opacity-40"
        >
          Précédent
        </button>
        {uniquePages.map((p, i) => (
          <React.Fragment key={p}>
            {i > 0 && p - uniquePages[i - 1] > 1 && <span className="px-1 text-xs text-[#C1C4CB]">…</span>}
            <button
              onClick={() => onChange(p)}
              className={`h-7 min-w-[28px] rounded-md px-2 text-xs font-semibold transition-colors ${
                p === page ? "bg-[#031B17] text-white" : "text-[#4B5563] hover:bg-[#F5F6F8]"
              }`}
            >
              {p}
            </button>
          </React.Fragment>
        ))}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="rounded-md border border-[#E5E7EB] px-2.5 py-1.5 text-xs font-medium text-[#4B5563] transition-colors hover:bg-[#F5F6F8] disabled:opacity-40"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}

function StatutSelect({ statut, onChange, disabled }) {
  const meta = statutMeta(statut);
  return (
    <select
      value={statut}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="cursor-pointer appearance-none rounded-full border-0 px-3 py-1.5 pr-7 text-xs font-semibold outline-none disabled:cursor-wait disabled:opacity-60"
      style={{
        background: meta.bg,
        color: meta.color,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23000' stroke-opacity='0.4' stroke-width='1.5' fill='none' fill-rule='evenodd'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 8px center",
      }}
    >
      {STATUTS.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}

const PAGE_SIZE = 50;

function Dashboard({ token, onLogout }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [statutFilter, setStatutFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  const intervalRef = useRef(null);
  const updatingRef = useRef(false);

  const fetchLeads = useCallback(
    async (silent = false) => {
      // Ne pas écraser l'affichage pendant qu'une mise à jour de statut est en vol :
      // le rafraîchissement auto pourrait réafficher l'ancienne valeur.
      if (silent && updatingRef.current) return;
      if (!silent) setLoading(true);
      try {
        const res = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          sessionStorage.removeItem(TOKEN_KEY);
          onLogout();
          return;
        }
        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();
        const normalized = (Array.isArray(data) ? data : []).map((l) => ({
          ...l,
          createdAt: l.createdAt || l.created_at,
        }));
        setLeads(normalized);
        setLastUpdated(new Date());
        setError("");
      } catch {
        setError("Impossible de récupérer les données. Nouvelle tentative dans 20s.");
      } finally {
        setLoading(false);
      }
    },
    [token, onLogout]
  );

  useEffect(() => {
    fetchLeads();
    intervalRef.current = setInterval(() => fetchLeads(true), REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [fetchLeads]);

  const handleStatutChange = async (id, statut) => {
    const previousStatut = leads.find((l) => l.id === id)?.statut;
    setUpdatingId(id);
    updatingRef.current = true;
    setError("");
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, statut } : l)));
    try {
      const res = await fetch(`${API_URL}/${id}/statut`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ statut }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "failed");
      // On aligne la ligne sur ce que la base a réellement enregistré.
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...data } : l)));
    } catch (e) {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, statut: previousStatut } : l)));
      setError(
        e?.message && e.message !== "failed"
          ? e.message
          : "Échec de la mise à jour du statut, réessayez."
      );
    } finally {
      setUpdatingId(null);
      updatingRef.current = false;
    }
  };

  const counts = useMemo(() => {
    const c = { all: leads.length, nouveau: 0, confirmé: 0, annulé: 0 };
    leads.forEach((l) => {
      if (c[l.statut] !== undefined) c[l.statut] += 1;
    });
    return c;
  }, [leads]);

  const filteredLeads = useMemo(() => {
    let result = statutFilter === "all" ? leads : leads.filter((l) => l.statut === statutFilter);
    const q = search.trim().toLowerCase();
    if (q) {
      const qDigits = q.replace(/[^\d]/g, "");
      result = result.filter((l) => {
        const emailMatch = l.email?.toLowerCase().includes(q);
        const phoneMatch = qDigits && l.phone?.replace(/[^\d]/g, "").includes(qDigits);
        return emailMatch || phoneMatch;
      });
    }
    return result;
  }, [leads, statutFilter, search]);

  useEffect(() => {
    setPage(1);
  }, [statutFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedLeads = useMemo(
    () => filteredLeads.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filteredLeads, currentPage]
  );

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <div className="border-b border-[#E5E7EB] bg-[#031B17]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-[#031B17]"
              style={{ background: "#E1BB7F" }}
            >
              B
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Préinscriptions BATIMAT 2026</h1>
              <p className="flex items-center gap-1.5 text-xs text-white/40">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                En direct
                {lastUpdated && <span>· actualisé à {lastUpdated.toLocaleTimeString("fr-FR")}</span>}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchLeads()}
              className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/5"
            >
              Actualiser
            </button>
            <button
              onClick={() => downloadCsv(leads)}
              disabled={!leads.length}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-[#031B17] transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ background: "#E1BB7F" }}
            >
              Exporter CSV
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem(TOKEN_KEY);
                onLogout();
              }}
              className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/5"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex flex-wrap gap-3">
          <StatCard label="Toutes" value={counts.all} accent="#031B17" active={statutFilter === "all"} onClick={() => setStatutFilter("all")} />
          {STATUTS.map((s) => (
            <StatCard
              key={s.value}
              label={s.label}
              value={counts[s.value] || 0}
              accent={s.dot}
              active={statutFilter === s.value}
              onClick={() => setStatutFilter(s.value)}
            />
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-4 flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3.5 py-2.5 shadow-sm focus-within:border-[#031B17]">
          <SearchIcon />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par email ou numéro de téléphone…"
            className="w-full border-0 bg-transparent text-sm text-[#031B17] outline-none placeholder:text-[#A7ABB4]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="shrink-0 text-xs font-medium text-[#8A8F98] hover:text-[#031B17]"
            >
              Effacer
            </button>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#FAFAFB] text-[11px] uppercase tracking-wide text-[#8A8F98]">
                  <th className="px-5 py-3 font-semibold">Contact</th>
                  <th className="px-5 py-3 font-semibold">Coordonnées</th>
                  <th className="px-5 py-3 font-semibold">Profil</th>
                  <th className="px-5 py-3 text-center font-semibold">Newsletter</th>
                  <th className="px-5 py-3 font-semibold">Statut</th>
                  <th className="px-5 py-3 font-semibold">Inscrit le</th>
                </tr>
              </thead>
              <tbody>
                {loading && !leads.length ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-14 text-center text-sm text-[#8A8F98]">
                      Chargement…
                    </td>
                  </tr>
                ) : !pagedLeads.length ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-14 text-center text-sm text-[#8A8F98]">
                      {search
                        ? "Aucun résultat pour cette recherche."
                        : `Aucune inscription ${statutFilter !== "all" ? `avec le statut "${statutMeta(statutFilter).label}"` : "pour le moment"}.`}
                    </td>
                  </tr>
                ) : (
                  pagedLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-[#F0F1F3] last:border-0 hover:bg-[#FAFAFB]">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar firstName={lead.firstName} lastName={lead.lastName} />
                          <span className="font-semibold text-[#031B17]">
                            {lead.firstName} {lead.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-col">
                          <span className="text-[#031B17]">{lead.email}</span>
                          <span className="font-mono text-xs text-[#8A8F98]">{lead.phone}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        {lead.profile ? (
                          <span className="inline-block rounded-md border border-[#E5E7EB] bg-[#FAFAFB] px-2 py-1 text-xs font-medium text-[#4B5563]">
                            {lead.profile}
                          </span>
                        ) : (
                          <span className="text-[#C1C4CB]">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {lead.newsletterOptIn ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600" title="Inscrit à la newsletter">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#F5F6F8] text-[#C1C4CB]" title="Non inscrit">
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <StatutSelect
                          statut={lead.statut}
                          disabled={updatingId === lead.id}
                          onChange={(v) => handleStatutChange(lead.id, v)}
                        />
                      </td>
                      <td className="px-5 py-3 text-xs text-[#8A8F98]">{formatDate(lead.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            total={filteredLeads.length}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}

export default function BatimatAdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY));

  return (
    <>
      <Helmet>
        <title>Batimat — Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {token ? (
        <Dashboard token={token} onLogout={() => setToken(null)} />
      ) : (
        <LoginGate onAuthenticated={(t) => setToken(t)} />
      )}
    </>
  );
}
