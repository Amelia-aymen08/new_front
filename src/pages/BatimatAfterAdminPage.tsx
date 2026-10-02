// @ts-nocheck
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/batimat-after`;
// Même jeton que le dashboard Batimat (BATIMAT_DASHBOARD_TOKEN) : une seule connexion pour les deux.
const TOKEN_KEY = "batimat_admin_token";
const REFRESH_INTERVAL_MS = 10000;
const PAGE_SIZE = 50;
const GOLD = "#E1BB7F";

const DAYS = {
  samedi: { label: "Samedi 3", color: "#166534", bg: "#DCFCE7" },
  dimanche: { label: "Dimanche 4", color: "#1E3A8A", bg: "#DBEAFE" },
  flexible: { label: "Flexible", color: "#92400E", bg: "#FEF3C7" },
};

function formatDateTime(value) {
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

function formatTime(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return value;
  }
}

// Clé de jour dans le fuseau du navigateur (yyyy-mm-dd).
function dayKey(date) {
  const d = new Date(date);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function toCsv(rows) {
  const headers = [
    "Prénom", "Nom", "Email", "Téléphone", "Jour souhaité", "Badge envoyé le",
    "Arrivée", "Départ", "Newsletter", "Source", "Inscrit le",
  ];
  const lines = rows.map((r) => [
    r.firstName,
    r.lastName,
    r.email,
    r.phone,
    DAYS[r.visitDay]?.label || r.visitDay,
    formatDateTime(r.badgeSentAt),
    formatDateTime(r.checkedInAt),
    formatDateTime(r.checkedOutAt),
    r.newsletterOptIn ? "Oui" : "Non",
    [r.qrCampaign, r.qrSource].filter(Boolean).join(" / "),
    formatDateTime(r.createdAt),
  ]);
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [headers, ...lines].map((r) => r.map(esc).join(",")).join("\n");
}

function downloadCsv(rows) {
  const blob = new Blob(["﻿" + toCsv(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `batimat-after-inscrits-${new Date().toISOString().slice(0, 10)}.csv`;
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
      const res = await fetch(API_URL, { headers: { Authorization: `Bearer ${tokenInput.trim()}` } });
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
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#05241F] p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl text-base font-bold text-[#031B17]" style={{ background: GOLD }}>
            P
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Batimat After — Admin</h1>
            <p className="text-xs text-white/40">Accès réservé</p>
          </div>
        </div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50">Token d'accès</label>
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
          style={{ background: GOLD }}
        >
          {checking ? "Vérification…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

function Kpi({ label, value, hint, accent, active, onClick, big }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={`rounded-xl border bg-white px-5 py-4 text-left shadow-sm transition-all ${
        onClick ? "hover:shadow-md" : ""
      } ${active ? "border-[#031B17] ring-1 ring-[#031B17]" : "border-[#E5E7EB]"}`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
        <span className="text-xs font-semibold uppercase tracking-wide text-[#8A8F98]">{label}</span>
      </div>
      <span className={`${big ? "text-4xl" : "text-2xl"} font-bold text-[#031B17]`}>{value}</span>
      {hint && <p className="mt-1 text-xs text-[#8A8F98]">{hint}</p>}
    </Tag>
  );
}

function DailyChart({ rows }) {
  const bars = useMemo(() => {
    if (!rows.length) return [];
    const counts = new Map();
    rows.forEach((r) => {
      const k = dayKey(r.createdAt);
      counts.set(k, (counts.get(k) || 0) + 1);
    });
    const first = new Date(Math.min(...rows.map((r) => new Date(r.createdAt).getTime())));
    first.setHours(12, 0, 0, 0);
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const out = [];
    for (let d = new Date(first); d <= today && out.length < 60; d.setDate(d.getDate() + 1)) {
      const k = dayKey(d);
      out.push({ key: k, label: `${k.slice(8, 10)}/${k.slice(5, 7)}`, count: counts.get(k) || 0 });
    }
    return out.slice(-21);
  }, [rows]);

  const max = Math.max(1, ...bars.map((b) => b.count));
  if (!bars.length) {
    return <p className="py-8 text-center text-sm text-[#8A8F98]">Pas encore d'inscription.</p>;
  }
  return (
    <div className="flex h-40 items-end gap-1.5" role="img" aria-label="Inscriptions par jour">
      {bars.map((b) => (
        <div key={b.key} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
          <span className="text-[10px] font-semibold text-[#031B17]">{b.count || ""}</span>
          <div
            className="w-full rounded-t"
            style={{ height: `${(b.count / max) * 100}%`, minHeight: b.count ? 4 : 2, background: b.count ? "#031B17" : "#E5E7EB" }}
          />
          <span className="text-[9px] text-[#8A8F98]">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

function Pagination({ page, totalPages, total, onChange }) {
  if (totalPages <= 1) return null;
  const start = (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);
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
          className="rounded-md border border-[#E5E7EB] px-2.5 py-1.5 text-xs font-medium text-[#4B5563] hover:bg-[#F5F6F8] disabled:opacity-40"
        >
          Précédent
        </button>
        <span className="px-2 text-xs text-[#4B5563]">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="rounded-md border border-[#E5E7EB] px-2.5 py-1.5 text-xs font-medium text-[#4B5563] hover:bg-[#F5F6F8] disabled:opacity-40"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}

function Dashboard({ token, onLogout }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dayFilter, setDayFilter] = useState("all");
  const [badgeFilter, setBadgeFilter] = useState("all"); // all | sent | failed
  const [presenceFilter, setPresenceFilter] = useState("all"); // all | onsite | left | absent
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [resendingId, setResendingId] = useState(null);
  const [notice, setNotice] = useState("");
  const intervalRef = useRef(null);

  const fetchRows = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const res = await fetch(API_URL, { headers: { Authorization: `Bearer ${token}` } });
        if (res.status === 401) {
          sessionStorage.removeItem(TOKEN_KEY);
          onLogout();
          return;
        }
        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();
        setRows((Array.isArray(data) ? data : []).map((r) => ({ ...r, createdAt: r.createdAt || r.created_at })));
        setLastUpdated(new Date());
        setError("");
      } catch {
        setError("Impossible de récupérer les données. Nouvelle tentative dans 10 s.");
      } finally {
        setLoading(false);
      }
    },
    [token, onLogout]
  );

  useEffect(() => {
    fetchRows();
    intervalRef.current = setInterval(() => fetchRows(true), REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [fetchRows]);

  const resendBadge = async (id) => {
    setResendingId(id);
    setNotice("");
    setError("");
    try {
      const res = await fetch(`${API_URL}/${id}/resend-badge`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Échec de l'envoi.");
      setNotice("Badge renvoyé.");
      await fetchRows(true);
    } catch (e) {
      setError(e?.message || "Échec de l'envoi du badge.");
    } finally {
      setResendingId(null);
    }
  };

  const stats = useMemo(() => {
    const now = Date.now();
    const todayKey = dayKey(new Date());
    const s = {
      total: rows.length,
      today: 0,
      lastHour: 0,
      samedi: 0,
      dimanche: 0,
      flexible: 0,
      sent: 0,
      failed: 0,
      onSite: 0,
      left: 0,
      newsletter: 0,
    };
    rows.forEach((r) => {
      if (dayKey(r.createdAt) === todayKey) s.today += 1;
      if (now - new Date(r.createdAt).getTime() < 3600 * 1000) s.lastHour += 1;
      if (s[r.visitDay] !== undefined) s[r.visitDay] += 1;
      if (r.badgeSentAt) s.sent += 1;
      else s.failed += 1;
      if (r.checkedInAt && !r.checkedOutAt) s.onSite += 1;
      if (r.checkedOutAt) s.left += 1;
      if (r.newsletterOptIn) s.newsletter += 1;
    });
    return s;
  }, [rows]);

  const sources = useMemo(() => {
    const map = new Map();
    rows.forEach((r) => {
      const k = [r.qrCampaign, r.qrSource].filter(Boolean).join(" / ") || "Direct / inconnu";
      map.set(k, (map.get(k) || 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [rows]);

  const filtered = useMemo(() => {
    let result = rows;
    if (dayFilter !== "all") result = result.filter((r) => r.visitDay === dayFilter);
    if (badgeFilter === "sent") result = result.filter((r) => r.badgeSentAt);
    if (badgeFilter === "failed") result = result.filter((r) => !r.badgeSentAt);
    if (presenceFilter === "onsite") result = result.filter((r) => r.checkedInAt && !r.checkedOutAt);
    if (presenceFilter === "left") result = result.filter((r) => r.checkedOutAt);
    if (presenceFilter === "absent") result = result.filter((r) => !r.checkedInAt);
    const q = search.trim().toLowerCase();
    if (q) {
      const qDigits = q.replace(/[^\d]/g, "");
      result = result.filter((r) => {
        const nameMatch = `${r.firstName} ${r.lastName}`.toLowerCase().includes(q);
        const emailMatch = r.email?.toLowerCase().includes(q);
        const phoneMatch = qDigits && r.phone?.replace(/[^\d]/g, "").includes(qDigits);
        return nameMatch || emailMatch || phoneMatch;
      });
    }
    return result;
  }, [rows, dayFilter, badgeFilter, presenceFilter, search]);

  useEffect(() => {
    setPage(1);
  }, [dayFilter, badgeFilter, presenceFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage]
  );

  const pct = (n) => (stats.total ? `${Math.round((n / stats.total) * 100)} %` : "—");

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <div className="border-b border-[#E5E7EB] bg-[#031B17]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-[#031B17]" style={{ background: GOLD }}>
              P
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Batimat After — Paris, 3 &amp; 4 octobre 2026</h1>
              <p className="flex items-center gap-1.5 text-xs text-white/40">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                En direct
                {lastUpdated && <span>· actualisé à {lastUpdated.toLocaleTimeString("fr-FR")}</span>}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => fetchRows()} className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/5">
              Actualiser
            </button>
            <button
              onClick={() => downloadCsv(filtered)}
              disabled={!filtered.length}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-[#031B17] hover:opacity-90 disabled:opacity-40"
              style={{ background: GOLD }}
            >
              Exporter CSV
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem(TOKEN_KEY);
                onLogout();
              }}
              className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white/60 hover:bg-white/5"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Indicateurs principaux */}
        <div className="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-2">
            <Kpi big label="Inscrits" value={stats.total} accent="#031B17" hint={`${stats.today} aujourd'hui · ${stats.lastHour} sur la dernière heure`} active={dayFilter === "all" && badgeFilter === "all" && presenceFilter === "all"} onClick={() => { setDayFilter("all"); setBadgeFilter("all"); setPresenceFilter("all"); }} />
          </div>
          {Object.entries(DAYS).map(([key, d]) => (
            <Kpi key={key} label={d.label} value={stats[key]} hint={pct(stats[key])} accent={d.color} active={dayFilter === key} onClick={() => setDayFilter(dayFilter === key ? "all" : key)} />
          ))}
          <Kpi label="Newsletter" value={stats.newsletter} hint={pct(stats.newsletter)} accent="#7C3AED" />
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi label="Badges envoyés" value={stats.sent} hint={pct(stats.sent)} accent="#16A34A" active={badgeFilter === "sent"} onClick={() => setBadgeFilter(badgeFilter === "sent" ? "all" : "sent")} />
          <Kpi label="Badges en échec" value={stats.failed} hint={stats.failed ? "À renvoyer" : "Aucun"} accent="#DC2626" active={badgeFilter === "failed"} onClick={() => setBadgeFilter(badgeFilter === "failed" ? "all" : "failed")} />
          <Kpi label="Présents sur place" value={stats.onSite} hint="Arrivés, pas encore sortis" accent="#0EA5E9" active={presenceFilter === "onsite"} onClick={() => setPresenceFilter(presenceFilter === "onsite" ? "all" : "onsite")} />
          <Kpi label="Déjà sortis" value={stats.left} hint="Check-out effectué" accent="#64748B" active={presenceFilter === "left"} onClick={() => setPresenceFilter(presenceFilter === "left" ? "all" : "left")} />
        </div>

        <div className="mb-6 grid gap-3 lg:grid-cols-3">
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#8A8F98]">Inscriptions par jour</h2>
            <DailyChart rows={rows} />
          </div>
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#8A8F98]">Origine des inscriptions</h2>
            {sources.length ? (
              <ul className="space-y-2.5">
                {sources.map(([name, n]) => (
                  <li key={name} className="text-sm">
                    <div className="mb-1 flex justify-between gap-2">
                      <span className="truncate text-[#031B17]">{name}</span>
                      <span className="font-semibold text-[#031B17]">{n}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#EDEEF1]">
                      <div className="h-full rounded-full bg-[#031B17]" style={{ width: `${(n / stats.total) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-8 text-center text-sm text-[#8A8F98]">Aucune donnée.</p>
            )}
          </div>
        </div>

        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {notice && <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</div>}

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3.5 py-2.5 shadow-sm focus-within:border-[#031B17]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, email ou téléphone…"
              aria-label="Rechercher"
              className="w-full border-0 bg-transparent text-sm text-[#031B17] outline-none placeholder:text-[#A7ABB4]"
            />
            {search && (
              <button onClick={() => setSearch("")} className="shrink-0 text-xs font-medium text-[#8A8F98] hover:text-[#031B17]">
                Effacer
              </button>
            )}
          </div>
          <select
            value={presenceFilter}
            onChange={(e) => setPresenceFilter(e.target.value)}
            aria-label="Filtrer par présence"
            className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#031B17] shadow-sm outline-none"
          >
            <option value="all">Toutes présences</option>
            <option value="absent">Pas encore arrivés</option>
            <option value="onsite">Sur place</option>
            <option value="left">Sortis</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#FAFAFB] text-[11px] uppercase tracking-wide text-[#8A8F98]">
                  <th className="px-5 py-3 font-semibold">Contact</th>
                  <th className="px-5 py-3 font-semibold">Coordonnées</th>
                  <th className="px-5 py-3 font-semibold">Jour</th>
                  <th className="px-5 py-3 font-semibold">Badge</th>
                  <th className="px-5 py-3 font-semibold">Présence</th>
                  <th className="px-5 py-3 font-semibold">Origine</th>
                  <th className="px-5 py-3 font-semibold">Inscrit le</th>
                </tr>
              </thead>
              <tbody>
                {loading && !rows.length ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-14 text-center text-sm text-[#8A8F98]">Chargement…</td>
                  </tr>
                ) : !paged.length ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-14 text-center text-sm text-[#8A8F98]">
                      {rows.length ? "Aucun résultat pour ces filtres." : "Aucune inscription pour le moment."}
                    </td>
                  </tr>
                ) : (
                  paged.map((r) => {
                    const day = DAYS[r.visitDay];
                    return (
                      <tr key={r.id} className="border-b border-[#F0F1F3] last:border-0 hover:bg-[#FAFAFB]">
                        <td className="px-5 py-3 font-semibold text-[#031B17]">{r.firstName} {r.lastName}</td>
                        <td className="px-5 py-3">
                          <div className="flex flex-col">
                            <span className="text-[#031B17]">{r.email}</span>
                            <span className="font-mono text-xs text-[#8A8F98]">{r.phone}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          {day ? (
                            <span className="inline-block rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: day.bg, color: day.color }}>
                              {day.label}
                            </span>
                          ) : (
                            <span className="text-[#C1C4CB]">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          {r.badgeSentAt ? (
                            <span className="text-xs text-emerald-700" title={formatDateTime(r.badgeSentAt)}>✓ Envoyé à {formatTime(r.badgeSentAt)}</span>
                          ) : (
                            <button
                              onClick={() => resendBadge(r.id)}
                              disabled={resendingId === r.id}
                              className="rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                            >
                              {resendingId === r.id ? "Envoi…" : "Non envoyé · Renvoyer"}
                            </button>
                          )}
                        </td>
                        <td className="px-5 py-3 text-xs">
                          {r.checkedOutAt ? (
                            <span className="text-[#64748B]">Sorti à {formatTime(r.checkedOutAt)}</span>
                          ) : r.checkedInAt ? (
                            <span className="font-semibold text-sky-700">Sur place · arrivé {formatTime(r.checkedInAt)}</span>
                          ) : (
                            <span className="text-[#C1C4CB]">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-xs text-[#4B5563]">
                          {[r.qrCampaign, r.qrSource].filter(Boolean).join(" / ") || <span className="text-[#C1C4CB]">—</span>}
                        </td>
                        <td className="px-5 py-3 text-xs text-[#8A8F98]">{formatDateTime(r.createdAt)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <Pagination page={currentPage} totalPages={totalPages} total={filtered.length} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}

export default function BatimatAfterAdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY));

  return (
    <>
      <Helmet>
        <title>Batimat After — Admin</title>
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
