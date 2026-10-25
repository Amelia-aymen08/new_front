// @ts-nocheck
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { API_BASE_URL } from "../config";
import { BarChart, Card, Kpi, LoginGate } from "./JpoHeleniteAdminPage";
import { LinkGenerator } from "../components/JpoLinkTools";

const API_URL = `${API_BASE_URL}/api/jpo-nice`;
// Même jeton que les autres dashboards (clé de session partagée) : une seule connexion.
const TOKEN_KEY = "batimat_admin_token";
const REFRESH_INTERVAL_MS = 15000;
const PAGE_SIZE = 50;
const GOLD = "#E1BB7F";
const PAGE_URL = "https://aymenpromotion-dz.com/jpo_nice";
const DEFAULT_CAMPAIGN = "jpo-nice";

const DAYS = {
  samedi: "Samedi 31 oct.",
  dimanche: "Dimanche 1er nov.",
  flexible: "Jour flexible",
};
const TIMES = {
  matin: "Matin",
  apres_midi: "Après-midi",
  flexible: "Horaire flexible",
  a_confirmer: "À confirmer",
};
const STATUSES = {
  nouveau: { label: "À confirmer", color: "#92400E", bg: "#FEF3C7" },
  confirme: { label: "Confirmé", color: "#166534", bg: "#DCFCE7" },
  annule: { label: "Annulé", color: "#991B1B", bg: "#FEE2E2" },
};

function formatDateTime(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return value;
  }
}
function dayKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
const digits = (v) => String(v || "").replace(/\D/g, "");
const linkKey = (c, s, m) => [c, s, m].map((v) => String(v || "").trim().toLowerCase()).join("|");
const countBy = (rows, pick) => {
  const m = new Map();
  rows.forEach((r) => {
    const v = pick(r);
    if (v) m.set(v, (m.get(v) || 0) + 1);
  });
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
};

function toDailyBars(countsByDay) {
  const keys = Object.keys(countsByDay).sort();
  if (!keys.length) return [];
  const first = new Date(`${keys[0]}T12:00:00`);
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const out = [];
  for (let d = new Date(first); d <= today && out.length < 90; d.setDate(d.getDate() + 1)) {
    const k = dayKey(d);
    out.push({ key: k, label: `${k.slice(8, 10)}/${k.slice(5, 7)}`, count: countsByDay[k] || 0 });
  }
  return out.slice(-21);
}

function toCsv(rows) {
  const headers = [
    "Inscrit le", "Prénom", "Nom", "E-mail", "Téléphone", "Jour souhaité", "Préférence horaire", "Pays de résidence", "Ville",
    "Profil", "Objectif", "Typologie", "Horizon", "Question", "Newsletter", "Statut", "Campagne", "Source", "Medium", "Badge envoyé le",
  ];
  const lines = rows.map((r) => [
    formatDateTime(r.createdAt), r.firstName, r.lastName, r.email, r.phone, DAYS[r.visitDay] || r.visitDay, TIMES[r.timePref] || r.timePref,
    r.residenceCountry, r.city, r.profile, r.objective, r.typology, r.horizon, r.message, r.newsletterOptIn ? "Oui" : "Non",
    STATUSES[r.status]?.label || r.status, r.qrCampaign, r.qrSource, r.qrMedium, formatDateTime(r.badgeSentAt),
  ]);
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [headers, ...lines].map((r) => r.map(esc).join(";")).join("\n");
}

function downloadCsv(rows) {
  const blob = new Blob(["﻿" + toCsv(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `jpo-nice-inscrits-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function BreakdownList({ items, total, empty = "Aucune donnée." }) {
  if (!items.length) return <p className="py-6 text-center text-sm text-[#8A8F98]">{empty}</p>;
  return (
    <ul className="space-y-2.5">
      {items.map(([name, n]) => (
        <li key={name} className="text-sm">
          <div className="mb-1 flex justify-between gap-2">
            <span className="truncate text-[#031B17]">{name}</span>
            <span className="font-semibold text-[#031B17]">{n}</span>
          </div>
          <div className="h-1.5 rounded-full bg-[#EDEEF1]">
            <div className="h-full rounded-full bg-[#031B17]" style={{ width: `${total ? (n / total) * 100 : 0}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Dashboard({ token, onLogout }) {
  const [rows, setRows] = useState([]);
  const [linkStats, setLinkStats] = useState({ links: [], daily: [], unavailable: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dayFilter, setDayFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState(null);
  const intervalRef = useRef(null);
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const fetchAll = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const [res, resLinks] = await Promise.all([fetch(API_URL, { headers }), fetch(`${API_URL}/link-stats`, { headers })]);
        if (res.status === 401) {
          sessionStorage.removeItem(TOKEN_KEY);
          onLogout();
          return;
        }
        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();
        setRows((Array.isArray(data) ? data : []).map((r) => ({ ...r, createdAt: r.createdAt || r.created_at })));
        if (resLinks.ok) setLinkStats(await resLinks.json());
        setLastUpdated(new Date());
        setError("");
      } catch {
        setError("Impossible de récupérer les données. Nouvelle tentative dans 15 s.");
      } finally {
        setLoading(false);
      }
    },
    [headers, onLogout]
  );

  useEffect(() => {
    fetchAll();
    intervalRef.current = setInterval(() => fetchAll(true), REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [fetchAll]);

  const changeStatus = async (id, status) => {
    const previous = rows;
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      const res = await fetch(`${API_URL}/${id}/status`, { method: "PATCH", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      if (!res.ok) throw new Error();
    } catch {
      setRows(previous);
      setError("Le statut n'a pas pu être modifié.");
    }
  };

  const resendBadge = async (id) => {
    setBusyId(id);
    setNotice("");
    setError("");
    try {
      const res = await fetch(`${API_URL}/${id}/resend-badge`, { method: "POST", headers });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Échec de l'envoi.");
      setNotice("Badge renvoyé.");
      await fetchAll(true);
    } catch (e) {
      setError(e?.message || "Échec de l'envoi du badge.");
    } finally {
      setBusyId(null);
    }
  };

  const stats = useMemo(() => {
    const todayKey = dayKey(new Date());
    const s = { total: rows.length, today: 0, nouveau: 0, confirme: 0, annule: 0, badgeSent: 0, newsletter: 0, tracked: 0, samedi: 0, dimanche: 0, flexible: 0 };
    rows.forEach((r) => {
      if (dayKey(r.createdAt) === todayKey) s.today += 1;
      if (s[r.status] !== undefined) s[r.status] += 1;
      if (s[r.visitDay] !== undefined) s[r.visitDay] += 1;
      if (r.badgeSentAt) s.badgeSent += 1;
      if (r.newsletterOptIn) s.newsletter += 1;
      if (r.qrSource || r.qrCampaign) s.tracked += 1;
    });
    return s;
  }, [rows]);

  const regBars = useMemo(() => {
    const counts = {};
    rows.forEach((r) => {
      const k = dayKey(r.createdAt);
      counts[k] = (counts[k] || 0) + 1;
    });
    return toDailyBars(counts);
  }, [rows]);

  const visitBars = useMemo(() => {
    const counts = {};
    (linkStats.daily || []).forEach((d) => {
      counts[String(d.day).slice(0, 10)] = d.scans;
    });
    return toDailyBars(counts);
  }, [linkStats]);

  // Jour × préférence horaire (hors annulés)
  const matrix = useMemo(() => {
    const m = {};
    rows.forEach((r) => {
      if (r.status === "annule") return;
      const k = `${r.visitDay}|${r.timePref}`;
      m[k] = (m[k] || 0) + 1;
    });
    return m;
  }, [rows]);
  const matrixMax = Math.max(1, ...Object.values(matrix));

  // Performance des liens : visites (qr_scans) + inscriptions (table), par campagne / source / medium.
  const linkRows = useMemo(() => {
    const map = new Map();
    const get = (c, s, m) => {
      const k = linkKey(c, s, m);
      if (!map.has(k)) map.set(k, { key: k, campaign: c || "", source: s || "", medium: m || "", scans: 0, uniques: 0, regs: 0, lastScanAt: null });
      return map.get(k);
    };
    (linkStats.links || []).forEach((l) => {
      const row = get(l.campaign, l.source, l.medium);
      row.scans += l.scans;
      row.uniques += l.uniques;
      row.lastScanAt = l.lastScanAt;
    });
    let direct = 0;
    rows.forEach((r) => {
      if (!r.qrCampaign && !r.qrSource) {
        direct += 1;
        return;
      }
      get(r.qrCampaign, r.qrSource, r.qrMedium).regs += 1;
    });
    return { list: [...map.values()].sort((a, b) => b.regs - a.regs || b.scans - a.scans), direct };
  }, [linkStats, rows]);
  const totalUniques = linkRows.list.reduce((n, l) => n + l.uniques, 0);

  const sourceOptions = useMemo(() => [...new Set(rows.map((r) => r.qrSource).filter(Boolean))].sort(), [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (dayFilter !== "all" && r.visitDay !== dayFilter) return false;
      if (timeFilter !== "all" && r.timePref !== timeFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (sourceFilter === "direct" && (r.qrCampaign || r.qrSource)) return false;
      if (sourceFilter !== "all" && sourceFilter !== "direct" && r.qrSource !== sourceFilter) return false;
      if (!q) return true;
      return `${r.firstName} ${r.lastName} ${r.email} ${r.phone} ${r.city} ${r.message}`.toLowerCase().includes(q);
    });
  }, [rows, dayFilter, timeFilter, statusFilter, sourceFilter, search]);

  useEffect(() => setPage(1), [dayFilter, timeFilter, statusFilter, sourceFilter, search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const pct = (n) => (stats.total ? `${Math.round((n / stats.total) * 100)} %` : "—");
  const selectClass = "rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#031B17] outline-none focus:border-[#031B17]";
  const th = "py-2 pr-4 font-semibold";

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-[#031B17]">
      <div className="border-b border-[#E5E7EB] bg-[#031B17]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-[#031B17]" style={{ background: GOLD }}>N</div>
            <div>
              <h1 className="text-base font-bold text-white">JPO Nice — 31 octobre & 1er novembre 2026</h1>
              <p className="flex items-center gap-1.5 text-xs text-white/40">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                En direct
                {lastUpdated && <span>· actualisé à {lastUpdated.toLocaleTimeString("fr-FR")}</span>}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/jpo-helenite-admin" className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/5">JPO Hélénite</a>
            <button onClick={() => fetchAll()} className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/5">Actualiser</button>
            <button onClick={() => downloadCsv(filtered)} disabled={!filtered.length} className="rounded-lg px-4 py-2 text-sm font-semibold text-[#031B17] hover:opacity-90 disabled:opacity-40" style={{ background: GOLD }}>Exporter CSV</button>
            <button onClick={() => { sessionStorage.removeItem(TOKEN_KEY); onLogout(); }} className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white/60 hover:bg-white/5">Déconnexion</button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {notice && <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</div>}

        {/* Indicateurs */}
        <div className="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-5">
          <div className="col-span-2">
            <Kpi big label="Inscrits" value={stats.total} accent="#031B17" hint={`${stats.today} aujourd'hui`} active={statusFilter === "all" && dayFilter === "all"} onClick={() => { setStatusFilter("all"); setDayFilter("all"); }} />
          </div>
          <Kpi label="À confirmer" value={stats.nouveau} hint={pct(stats.nouveau)} accent="#D97706" active={statusFilter === "nouveau"} onClick={() => setStatusFilter(statusFilter === "nouveau" ? "all" : "nouveau")} />
          <Kpi label="Confirmés" value={stats.confirme} hint={pct(stats.confirme)} accent="#16A34A" active={statusFilter === "confirme"} onClick={() => setStatusFilter(statusFilter === "confirme" ? "all" : "confirme")} />
          <Kpi label="Annulés" value={stats.annule} hint={pct(stats.annule)} accent="#DC2626" active={statusFilter === "annule"} onClick={() => setStatusFilter(statusFilter === "annule" ? "all" : "annule")} />
        </div>
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
          <Kpi label="Samedi 31 oct." value={stats.samedi} hint={pct(stats.samedi)} accent="#0EA5E9" active={dayFilter === "samedi"} onClick={() => setDayFilter(dayFilter === "samedi" ? "all" : "samedi")} />
          <Kpi label="Dimanche 1er nov." value={stats.dimanche} hint={pct(stats.dimanche)} accent="#7C3AED" active={dayFilter === "dimanche"} onClick={() => setDayFilter(dayFilter === "dimanche" ? "all" : "dimanche")} />
          <Kpi label="Jour flexible" value={stats.flexible} hint={pct(stats.flexible)} accent="#64748B" active={dayFilter === "flexible"} onClick={() => setDayFilter(dayFilter === "flexible" ? "all" : "flexible")} />
          <Kpi label="Badges envoyés" value={stats.badgeSent} hint={stats.total - stats.badgeSent ? `${stats.total - stats.badgeSent} à renvoyer` : "Tous envoyés"} accent="#16A34A" />
          <Kpi label="Visiteurs via liens suivis" value={totalUniques} hint={`${stats.tracked} inscrit${stats.tracked > 1 ? "s" : ""} (${pct(stats.tracked)})`} accent="#0EA5E9" />
        </div>

        {/* Courbes */}
        <div className="mb-6 grid gap-3 lg:grid-cols-2">
          <Card title="Inscriptions par jour"><BarChart bars={regBars} empty="Pas encore d'inscription." /></Card>
          <Card title="Visites des liens suivis par jour"><BarChart bars={visitBars} color="#0EA5E9" empty={linkStats.unavailable ? "Suivi des visites indisponible." : "Aucune visite suivie pour le moment."} /></Card>
        </div>

        {/* Jour × horaire */}
        <Card title="Jours et horaires souhaités (hors annulés)" className="mb-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-separate border-spacing-1 text-center text-sm">
              <thead>
                <tr className="text-xs text-[#8A8F98]">
                  <th className="px-2 py-1 text-left font-semibold">Jour</th>
                  {Object.entries(TIMES).map(([k, v]) => <th key={k} className="px-2 py-1 font-semibold">{v}</th>)}
                  <th className="px-2 py-1 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(DAYS).map(([dk, dv]) => {
                  const total = Object.keys(TIMES).reduce((n, tk) => n + (matrix[`${dk}|${tk}`] || 0), 0);
                  return (
                    <tr key={dk}>
                      <td className="whitespace-nowrap px-2 py-1 text-left font-semibold text-[#031B17]">{dv}</td>
                      {Object.keys(TIMES).map((tk) => {
                        const n = matrix[`${dk}|${tk}`] || 0;
                        return (
                          <td key={tk} className="rounded py-2 font-semibold" style={{ background: n ? `rgba(3,27,23,${0.12 + (n / matrixMax) * 0.78})` : "#fff", color: n && n / matrixMax > 0.5 ? "#fff" : "#031B17", border: "1px solid #EDEEF1" }}>
                            {n || ""}
                          </td>
                        );
                      })}
                      <td className="px-2 py-1 font-bold text-[#031B17]">{total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Profils */}
        <div className="mb-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Card title="Profil"><BreakdownList items={countBy(rows, (r) => r.profile)} total={rows.length} /></Card>
          <Card title="Objectif"><BreakdownList items={countBy(rows, (r) => r.objective)} total={rows.length} /></Card>
          <Card title="Typologie recherchée"><BreakdownList items={countBy(rows, (r) => r.typology)} total={rows.length} /></Card>
          <Card title="Horizon du projet"><BreakdownList items={countBy(rows, (r) => r.horizon)} total={rows.length} /></Card>
          <Card title="Pays de résidence"><BreakdownList items={countBy(rows, (r) => r.residenceCountry).slice(0, 8)} total={rows.length} /></Card>
          <Card title="Villes"><BreakdownList items={countBy(rows, (r) => (r.city || "").trim()).slice(0, 8)} total={rows.length} empty="Aucune ville renseignée." /></Card>
        </div>

        {/* Performance des liens */}
        <Card title="Performance des liens" className="mb-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#EDEEF1] text-[11px] uppercase tracking-wide text-[#8A8F98]">
                  <th className={th}>Source</th><th className={th}>Medium</th><th className={th}>Campagne</th>
                  <th className={`${th} text-right`}>Visites</th><th className={`${th} text-right`}>Visiteurs uniques</th>
                  <th className={`${th} text-right`}>Inscrits</th><th className={`${th} text-right`}>Conversion</th>
                  <th className="py-2 font-semibold">Dernière visite</th>
                </tr>
              </thead>
              <tbody>
                {linkRows.list.map((l) => (
                  <tr key={l.key} className="border-b border-[#F3F4F6]">
                    <td className="py-2.5 pr-4 font-semibold text-[#031B17]">{l.source || "—"}</td>
                    <td className="py-2.5 pr-4 text-[#4B5563]">{l.medium || "—"}</td>
                    <td className="py-2.5 pr-4 text-[#4B5563]">{l.campaign || "—"}</td>
                    <td className="py-2.5 pr-4 text-right">{l.scans}</td>
                    <td className="py-2.5 pr-4 text-right">{l.uniques}</td>
                    <td className="py-2.5 pr-4 text-right font-semibold text-[#031B17]">{l.regs}</td>
                    <td className="py-2.5 pr-4 text-right">{l.uniques ? `${Math.round((l.regs / l.uniques) * 100)} %` : "—"}</td>
                    <td className="py-2.5 text-xs text-[#8A8F98]">{formatDateTime(l.lastScanAt)}</td>
                  </tr>
                ))}
                <tr>
                  <td className="py-2.5 pr-4 font-semibold text-[#031B17]">Direct / sans lien suivi</td>
                  <td className="py-2.5 pr-4 text-[#8A8F98]">—</td><td className="py-2.5 pr-4 text-[#8A8F98]">—</td>
                  <td className="py-2.5 pr-4 text-right text-[#8A8F98]">—</td><td className="py-2.5 pr-4 text-right text-[#8A8F98]">—</td>
                  <td className="py-2.5 pr-4 text-right font-semibold text-[#031B17]">{linkRows.direct}</td>
                  <td className="py-2.5 pr-4 text-right text-[#8A8F98]">—</td><td />
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] text-[#8A8F98]">
            Conversion = inscrits ÷ visiteurs uniques du lien. Les visites ne sont comptées que sur les liens munis d'une UTM ou d'un suffixe (/jpo_nice/commerciaux) ; les accès directs à la page ne sont pas mesurables.
          </p>
        </Card>

        <div className="mb-6">
          <LinkGenerator
            Card={Card}
            pageUrl={PAGE_URL}
            campaign={DEFAULT_CAMPAIGN}
            filePrefix="jpo-nice"
            intro="Chaque lien ouvre la même page « Nice, on arrive ». Les visites sont comptées par source ; une inscription est rattachée au lien utilisé. Copiez un lien prêt à l'emploi, générez son QR code, ou créez-en un (ex. un lien par commercial)."
          />
        </div>

        {/* Liste des inscrits */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher nom, e-mail, téléphone, ville…" className={`${selectClass} min-w-[240px] flex-1`} />
          <select value={dayFilter} onChange={(e) => setDayFilter(e.target.value)} className={selectClass}>
            <option value="all">Tous les jours</option>
            {Object.entries(DAYS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className={selectClass}>
            <option value="all">Tous horaires</option>
            {Object.entries(TIMES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
            <option value="all">Tous statuts</option>
            {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className={selectClass}>
            <option value="all">Toutes les sources</option>
            <option value="direct">Direct / sans lien suivi</option>
            {sourceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className="text-sm text-[#8A8F98]">{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
          <table className="w-full min-w-[1040px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#EDEEF1] text-[11px] uppercase tracking-wide text-[#8A8F98]">
                <th className="px-4 py-3 font-semibold">Inscrit le</th>
                <th className="px-4 py-3 font-semibold">Nom</th>
                <th className="px-4 py-3 font-semibold">Contact</th>
                <th className="px-4 py-3 font-semibold">Visite</th>
                <th className="px-4 py-3 font-semibold">Résidence</th>
                <th className="px-4 py-3 font-semibold">Projet</th>
                <th className="px-4 py-3 font-semibold">Source</th>
                <th className="px-4 py-3 font-semibold">Statut</th>
                <th className="px-4 py-3 font-semibold">Badge</th>
              </tr>
            </thead>
            <tbody>
              {loading && !rows.length && <tr><td colSpan={9} className="px-4 py-10 text-center text-[#8A8F98]">Chargement…</td></tr>}
              {!loading && !paged.length && <tr><td colSpan={9} className="px-4 py-10 text-center text-[#8A8F98]">Aucune inscription.</td></tr>}
              {paged.map((r) => {
                const st = STATUSES[r.status] || STATUSES.nouveau;
                return (
                  <tr key={r.id} className="border-b border-[#F3F4F6] align-top">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-[#4B5563]">{formatDateTime(r.createdAt)}</td>
                    <td className="px-4 py-3 font-semibold text-[#031B17]">{r.firstName} {r.lastName}</td>
                    <td className="px-4 py-3 text-xs text-[#4B5563]">
                      <div>{r.email}</div>
                      <a href={`https://wa.me/${digits(r.phone)}`} target="_blank" rel="noopener noreferrer" className="text-[#166534] hover:underline">{r.phone}</a>
                      {r.newsletterOptIn && <div className="text-[#7C3AED]">Newsletter</div>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs">
                      <div className="font-semibold text-[#031B17]">{DAYS[r.visitDay] || r.visitDay}</div>
                      <div className="text-[#4B5563]">{TIMES[r.timePref] || r.timePref}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#4B5563]">{[r.city, r.residenceCountry].filter(Boolean).join(", ") || "—"}</td>
                    <td className="max-w-[240px] px-4 py-3 text-xs text-[#4B5563]">
                      {[r.profile, r.objective, r.typology, r.horizon].filter(Boolean).join(" · ") || "—"}
                      {r.message && <div className="mt-1 truncate italic text-[#8A8F98]" title={r.message}>« {r.message} »</div>}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#4B5563]">
                      {r.qrSource || r.qrCampaign ? (
                        <>
                          <div className="font-semibold text-[#031B17]">{r.qrSource || r.qrCampaign}</div>
                          <div>{[r.qrMedium, r.qrSource ? r.qrCampaign : null].filter(Boolean).join(" · ")}</div>
                        </>
                      ) : "Direct"}
                    </td>
                    <td className="px-4 py-3">
                      <select value={r.status || "nouveau"} onChange={(e) => changeStatus(r.id, e.target.value)} className="rounded-md border-0 px-2 py-1 text-xs font-semibold outline-none" style={{ background: st.bg, color: st.color }}>
                        {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs">
                      {r.badgeSentAt ? <span className="text-[#166534]">✓ {formatDateTime(r.badgeSentAt)}</span> : <span className="text-[#DC2626]">Non envoyé</span>}
                      <button onClick={() => resendBadge(r.id)} disabled={busyId === r.id} className="mt-1 block rounded border border-[#E5E7EB] px-2 py-0.5 text-[11px] text-[#4B5563] hover:bg-[#F5F6F8] disabled:opacity-50">
                        {busyId === r.id ? "Envoi…" : "Renvoyer"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#EDEEF1] px-5 py-3.5">
              <p className="text-xs text-[#8A8F98]">Page {currentPage} / {totalPages}</p>
              <div className="flex gap-1">
                <button onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} className="rounded-md border border-[#E5E7EB] px-2.5 py-1.5 text-xs font-medium text-[#4B5563] hover:bg-[#F5F6F8] disabled:opacity-40">Précédent</button>
                <button onClick={() => setPage(currentPage + 1)} disabled={currentPage === totalPages} className="rounded-md border border-[#E5E7EB] px-2.5 py-1.5 text-xs font-medium text-[#4B5563] hover:bg-[#F5F6F8] disabled:opacity-40">Suivant</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JpoNiceAdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY));
  return (
    <>
      <Helmet>
        <title>JPO Nice — Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {token ? <Dashboard token={token} onLogout={() => setToken(null)} /> : <LoginGate onAuthenticated={(t) => setToken(t)} title="JPO Nice — Dashboard" letter="N" checkUrl={API_URL} />}
    </>
  );
}
