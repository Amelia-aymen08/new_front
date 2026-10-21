// @ts-nocheck
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { API_BASE_URL } from "../config";
import { BarChart, Card, Kpi, LoginGate } from "./JpoHeleniteAdminPage";

const API_URL = `${API_BASE_URL}/api/jpo-helenite`;
// Même jeton que le dashboard des inscriptions (clé de session partagée).
const TOKEN_KEY = "batimat_admin_token";
const REFRESH_INTERVAL_MS = 20000;
const PAGE_SIZE = 50;
const GOLD = "#E1BB7F";
const TZ = "Africa/Algiers";

const STATUS_LABELS = {
  a_contacter: "À contacter",
  contacte: "Contacté",
  rdv_a_confirmer: "RDV à confirmer",
  rdv_confirme: "RDV confirmé",
  a_relancer: "À relancer",
  qualifie: "Qualifié",
  sans_suite: "Sans suite",
};
const CLOSED = ["qualifie", "sans_suite"];
const TEMP = {
  hot: { label: "HOT", color: "#D93A1F", bg: "#FDE7E2" },
  warm: { label: "WARM", color: "#B97800", bg: "#FFF1CF" },
  cold: { label: "COLD", color: "#2B6CB0", bg: "#E1EDFA" },
};

function fmt(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("fr-FR", { timeZone: TZ, day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  } catch {
    return value;
  }
}

// Jour (yyyy-mm-dd) et heure à Alger d'un instant ISO.
const algiersParts = (iso) => {
  const f = new Intl.DateTimeFormat("fr-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23" });
  const p = Object.fromEntries(f.formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return { day: `${p.year}-${p.month}-${p.day}`, hour: Number(p.hour) };
};
const endOfTodayAlgiers = () => {
  const shifted = new Date(Date.now() + 3600000);
  shifted.setUTCHours(23, 59, 59, 999);
  return new Date(shifted.getTime() - 3600000);
};
const digits = (v) => String(v || "").replace(/\D/g, "");

const csvEsc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
function leadsToCsv(list) {
  const headers = [
    "Date du scan", "Commercial", "Prénom", "Nom", "Téléphone", "E-mail", "Visite prévue", "Profil", "Typologie", "Horizon",
    "Intérêt", "Note /5", "Statut", "Prochaine action", "Relance", "Compte rendu", "Nb de scans", "Traité",
  ];
  const lines = list.map((l) => {
    const v = l.visitor || {};
    return [
      fmt(l.firstScannedAt), l.agentName, v.firstName, v.lastName, v.phone, v.email, `${v.visitDate || ""} ${v.timeSlot || ""}`.trim(),
      v.profile, v.typology, v.horizon, TEMP[l.temperature]?.label || "", l.rating, STATUS_LABELS[l.status] || l.status,
      l.nextAction, fmt(l.followUpAt), l.note, l.scanCount, l.treatedAt ? "Oui" : "Non",
    ];
  });
  return [headers, ...lines].map((r) => r.map(csvEsc).join(";")).join("\n");
}
function download(filename, content) {
  const blob = new Blob(["﻿" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
const fileSlug = (v) => String(v || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function TempBadge({ value }) {
  const t = TEMP[value];
  if (!t) return <span className="text-xs text-[#8A8F98]">—</span>;
  return <span className="rounded-md px-2 py-0.5 text-xs font-bold" style={{ background: t.bg, color: t.color }}>{t.label}</span>;
}

function PasswordModal({ info, onClose }) {
  const [copied, setCopied] = useState(false);
  if (!info) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-1 text-base font-bold text-[#031B17]">{info.title}</h3>
        <p className="mb-4 text-sm text-[#4B5563]">{info.agent.name} · {info.agent.email}</p>
        <div className="mb-3 rounded-lg bg-[#F5F6F8] px-4 py-3 text-center font-mono text-xl font-bold tracking-wider text-[#031B17]">{info.password}</div>
        <p className="mb-4 text-xs text-[#B45309]">Ce mot de passe ne sera plus affiché : copie-le et transmets-le maintenant.</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={async () => { try { await navigator.clipboard.writeText(`E-mail : ${info.agent.email}\nMot de passe : ${info.password}`); setCopied(true); } catch { /* noop */ } }}
            className="rounded-lg bg-[#031B17] py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            {copied ? "Copié ✓" : "Copier"}
          </button>
          <button onClick={onClose} className="rounded-lg border border-[#E5E7EB] py-2.5 text-sm font-semibold text-[#031B17] hover:bg-[#F5F6F8]">Fermer</button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ token, onLogout }) {
  const [data, setData] = useState({ agents: [], leads: [], scans: [] });
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [agentFilter, setAgentFilter] = useState("all");
  const [tempFilter, setTempFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [onlyUntreated, setOnlyUntreated] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [passwordInfo, setPasswordInfo] = useState(null);
  const [newAgent, setNewAgent] = useState({ name: "", email: "", role: "commercial" });
  const [teamOpen, setTeamOpen] = useState(false);
  const intervalRef = useRef(null);
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}`, "Content-Type": "application/json" }), [token]);

  const fetchAll = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [res, resRegs] = await Promise.all([fetch(`${API_URL}/admin/overview`, { headers }), fetch(API_URL, { headers })]);
      if (res.status === 401) {
        sessionStorage.removeItem(TOKEN_KEY);
        onLogout();
        return;
      }
      if (!res.ok) throw new Error("Erreur serveur");
      setData(await res.json());
      if (resRegs.ok) {
        const regs = await resRegs.json();
        setRegistrations(Array.isArray(regs) ? regs : []);
      }
      setLastUpdated(new Date());
      setError("");
    } catch {
      setError("Impossible de récupérer les données. Nouvelle tentative dans 20 s.");
    } finally {
      setLoading(false);
    }
  }, [headers, onLogout]);

  useEffect(() => {
    fetchAll();
    intervalRef.current = setInterval(() => fetchAll(true), REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [fetchAll]);

  const call = async (path, method, body) => {
    const res = await fetch(`${API_URL}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.message || "Opération impossible.");
    return json;
  };

  const reassign = async (leadId, agentId) => {
    try {
      await call(`/admin/leads/${leadId}`, "PATCH", { agentId: Number(agentId) });
      await fetchAll(true);
    } catch (e) {
      setError(e.message);
    }
  };
  const toggleActive = async (agent) => {
    try {
      await call(`/admin/agents/${agent.id}`, "PATCH", { active: !agent.active });
      await fetchAll(true);
    } catch (e) {
      setError(e.message);
    }
  };
  const resetPassword = async (agent) => {
    if (!window.confirm(`Générer un nouveau mot de passe pour ${agent.name} ? L'ancien ne fonctionnera plus.`)) return;
    try {
      const res = await call(`/admin/agents/${agent.id}/reset-password`, "POST");
      setPasswordInfo({ title: "Nouveau mot de passe", agent: res.agent, password: res.password });
    } catch (e) {
      setError(e.message);
    }
  };
  const addAgent = async (e) => {
    e.preventDefault();
    try {
      const res = await call("/admin/agents", "POST", newAgent);
      setPasswordInfo({ title: "Compte créé", agent: res.agent, password: res.password });
      setNewAgent({ name: "", email: "", role: "commercial" });
      await fetchAll(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const { agents, leads, scans } = data;
  const dueEnd = useMemo(() => endOfTodayAlgiers(), [data]);
  const isDue = (l) => l.followUpAt && new Date(l.followUpAt) <= dueEnd && !CLOSED.includes(l.status);
  const isAppointment = (l) => l.status === "rdv_a_confirmer" || l.status === "rdv_confirme";

  const stats = useMemo(() => {
    const s = { leads: leads.length, hot: 0, warm: 0, cold: 0, none: 0, untreated: 0, appointments: 0, due: 0, qualified: 0 };
    leads.forEach((l) => {
      if (TEMP[l.temperature]) s[l.temperature] += 1;
      else s.none += 1;
      if (!l.treatedAt) s.untreated += 1;
      if (isAppointment(l)) s.appointments += 1;
      if (isDue(l)) s.due += 1;
      if (l.status === "qualifie") s.qualified += 1;
    });
    s.duplicateScans = scans.filter((x) => x.isDuplicate).length;
    s.multiScanned = leads.filter((l) => l.scanCount > 1).length;
    return s;
  }, [leads, scans, dueEnd]);

  // Résultats par commercial (tous les comptes, même sans scan).
  const perAgent = useMemo(() => {
    const rows = new Map(agents.map((a) => [a.id, { agent: a, leads: 0, scans: 0, hot: 0, warm: 0, cold: 0, untreated: 0, appointments: 0, due: 0, qualified: 0, lastScan: null }]));
    leads.forEach((l) => {
      const r = rows.get(l.agentId);
      if (!r) return;
      r.leads += 1;
      if (TEMP[l.temperature]) r[l.temperature] += 1;
      if (!l.treatedAt) r.untreated += 1;
      if (isAppointment(l)) r.appointments += 1;
      if (isDue(l)) r.due += 1;
      if (l.status === "qualifie") r.qualified += 1;
    });
    scans.forEach((s) => {
      const r = rows.get(s.agentId);
      if (!r) return;
      r.scans += 1;
      if (!r.lastScan || s.scannedAt > r.lastScan) r.lastScan = s.scannedAt;
    });
    return [...rows.values()].sort((a, b) => b.leads - a.leads || a.agent.name.localeCompare(b.agent.name));
  }, [agents, leads, scans, dueEnd]);

  // Scans par jour et par heure (heure d'Alger).
  const { dayBars, hourBars } = useMemo(() => {
    const byDay = {};
    const byHour = {};
    scans.forEach((s) => {
      const { day, hour } = algiersParts(s.scannedAt);
      byDay[day] = (byDay[day] || 0) + 1;
      byHour[hour] = (byHour[hour] || 0) + 1;
    });
    const days = Object.keys(byDay).sort();
    const hours = Object.keys(byHour).map(Number);
    const hMin = hours.length ? Math.min(...hours, 8) : 8;
    const hMax = hours.length ? Math.max(...hours, 18) : 18;
    return {
      dayBars: days.map((d) => ({ key: d, label: `${d.slice(8, 10)}/${d.slice(5, 7)}`, count: byDay[d] })),
      hourBars: Array.from({ length: hMax - hMin + 1 }, (_, i) => hMin + i).map((h) => ({ key: String(h), label: `${h}h`, count: byHour[h] || 0 })),
    };
  }, [scans]);

  const statusCounts = useMemo(() => {
    const m = {};
    leads.forEach((l) => { m[l.status] = (m[l.status] || 0) + 1; });
    return Object.keys(STATUS_LABELS).map((k) => [k, m[k] || 0]);
  }, [leads]);

  const todo = useMemo(
    () => leads
      .filter((l) => (isAppointment(l) || l.status === "a_relancer" || l.followUpAt) && !CLOSED.includes(l.status))
      .sort((a, b) => (a.followUpAt || "9").localeCompare(b.followUpAt || "9")),
    [leads, dueEnd]
  );

  const multiScanned = useMemo(() => {
    const byLead = {};
    scans.forEach((s) => {
      (byLead[s.leadId] = byLead[s.leadId] || []).push(s);
    });
    const nameById = new Map(agents.map((a) => [a.id, a.name]));
    return leads.filter((l) => l.scanCount > 1).map((l) => ({
      lead: l,
      scanners: [...new Set((byLead[l.id] || []).map((s) => nameById.get(s.agentId) || `#${s.agentId}`))],
    }));
  }, [leads, scans, agents]);

  // Même personne inscrite plusieurs fois (même e-mail ou même téléphone) : risque de doublon.
  const duplicatePeople = useMemo(() => {
    const groups = new Map();
    const add = (key, r) => { if (key) groups.set(key, [...(groups.get(key) || []), r]); };
    registrations.forEach((r) => {
      add(r.email ? `e:${String(r.email).toLowerCase()}` : "", r);
      const d = digits(r.phone).slice(-9);
      add(d.length >= 8 ? `p:${d}` : "", r);
    });
    const seen = new Set();
    const out = [];
    for (const [key, list] of groups) {
      if (list.length < 2) continue;
      const sig = list.map((r) => r.id).sort().join(",");
      if (seen.has(sig)) continue;
      seen.add(sig);
      out.push({ key, list });
    }
    return out;
  }, [registrations]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (agentFilter !== "all" && String(l.agentId) !== agentFilter) return false;
      if (tempFilter === "none" && l.temperature) return false;
      if (tempFilter !== "all" && tempFilter !== "none" && l.temperature !== tempFilter) return false;
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (onlyUntreated && l.treatedAt) return false;
      if (!q) return true;
      const v = l.visitor || {};
      return `${v.firstName} ${v.lastName} ${v.email} ${v.phone} ${l.agentName} ${l.note}`.toLowerCase().includes(q);
    });
  }, [leads, agentFilter, tempFilter, statusFilter, onlyUntreated, search]);

  useEffect(() => setPage(1), [agentFilter, tempFilter, statusFilter, onlyUntreated, search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const pct = (n, total) => (total ? `${Math.round((n / total) * 100)} %` : "—");
  const selectClass = "rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#031B17] outline-none focus:border-[#031B17]";
  const exportAgent = (agent) => download(`jpo-helenite-prospects-${fileSlug(agent.name)}.csv`, leadsToCsv(leads.filter((l) => l.agentId === agent.id)));
  const th = "py-2 pr-3 font-semibold";

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <div className="border-b border-[#E5E7EB] bg-[#031B17]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-[#031B17]" style={{ background: GOLD }}>H</div>
            <div>
              <h1 className="text-base font-bold text-white">JPO Hélénite — Prospects commerciaux</h1>
              <p className="flex items-center gap-1.5 text-xs text-white/40">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                En direct
                {lastUpdated && <span>· actualisé à {lastUpdated.toLocaleTimeString("fr-FR")}</span>}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/jpo-helenite-admin" className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/5">Inscriptions</a>
            <button onClick={() => fetchAll()} className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/5">Actualiser</button>
            <button onClick={() => download(`jpo-helenite-prospects-${new Date().toISOString().slice(0, 10)}.csv`, leadsToCsv(leads))} disabled={!leads.length} className="rounded-lg px-4 py-2 text-sm font-semibold text-[#031B17] hover:opacity-90 disabled:opacity-40" style={{ background: GOLD }}>Export global</button>
            <button onClick={() => { sessionStorage.removeItem(TOKEN_KEY); onLogout(); }} className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white/60 hover:bg-white/5">Déconnexion</button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        {/* Indicateurs */}
        <div className="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi big label="Prospects scannés" value={stats.leads} accent="#031B17" hint={`${pct(stats.leads, registrations.length)} des ${registrations.length} inscrits`} />
          <Kpi label="Non traités" value={stats.untreated} accent="#D97706" hint={pct(stats.untreated, stats.leads)} active={onlyUntreated} onClick={() => setOnlyUntreated((v) => !v)} />
          <Kpi label="Rendez-vous" value={stats.appointments} accent="#7C3AED" hint="à confirmer + confirmés" onClick={() => { setStatusFilter("all"); setSearch(""); document.getElementById("a-faire")?.scrollIntoView({ behavior: "smooth" }); }} />
          <Kpi label="Relances à faire" value={stats.due} accent="#DC2626" hint="échues ou prévues aujourd'hui" onClick={() => document.getElementById("a-faire")?.scrollIntoView({ behavior: "smooth" })} />
        </div>
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
          <Kpi label="HOT" value={stats.hot} accent={TEMP.hot.color} hint={pct(stats.hot, stats.leads)} active={tempFilter === "hot"} onClick={() => setTempFilter(tempFilter === "hot" ? "all" : "hot")} />
          <Kpi label="WARM" value={stats.warm} accent={TEMP.warm.color} hint={pct(stats.warm, stats.leads)} active={tempFilter === "warm"} onClick={() => setTempFilter(tempFilter === "warm" ? "all" : "warm")} />
          <Kpi label="COLD" value={stats.cold} accent={TEMP.cold.color} hint={pct(stats.cold, stats.leads)} active={tempFilter === "cold"} onClick={() => setTempFilter(tempFilter === "cold" ? "all" : "cold")} />
          <Kpi label="Non qualifiés" value={stats.none} accent="#8A9690" hint="sans niveau d'intérêt" active={tempFilter === "none"} onClick={() => setTempFilter(tempFilter === "none" ? "all" : "none")} />
          <Kpi label="Qualifiés" value={stats.qualified} accent="#16A34A" hint={pct(stats.qualified, stats.leads)} />
        </div>

        {/* Résultats par commercial */}
        <Card title="Résultats par commercial" className="mb-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#EDEEF1] text-[11px] uppercase tracking-wide text-[#8A8F98]">
                  <th className={th}>Commercial</th>
                  <th className={`${th} text-right`}>Prospects</th>
                  <th className={`${th} text-right`}>Scans</th>
                  <th className={`${th} text-right`} style={{ color: TEMP.hot.color }}>HOT</th>
                  <th className={`${th} text-right`} style={{ color: TEMP.warm.color }}>WARM</th>
                  <th className={`${th} text-right`} style={{ color: TEMP.cold.color }}>COLD</th>
                  <th className={`${th} text-right`}>Non traités</th>
                  <th className={`${th} text-right`}>RDV</th>
                  <th className={`${th} text-right`}>Relances</th>
                  <th className={`${th} text-right`}>Qualifiés</th>
                  <th className={th}>Dernier scan</th>
                  <th className="py-2 font-semibold" />
                </tr>
              </thead>
              <tbody>
                {perAgent.map((r) => (
                  <tr key={r.agent.id} className={`border-b border-[#F3F4F6] ${r.agent.active ? "" : "opacity-50"}`}>
                    <td className="py-2.5 pr-3">
                      <button onClick={() => setAgentFilter(agentFilter === String(r.agent.id) ? "all" : String(r.agent.id))} className="text-left font-semibold text-[#031B17] hover:underline">
                        {r.agent.name}
                      </button>
                      {r.agent.role === "manager" && <span className="ml-2 rounded bg-[#E1BB7F]/30 px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#7A5A12]">Manager</span>}
                    </td>
                    <td className="py-2.5 pr-3 text-right font-semibold">{r.leads}</td>
                    <td className="py-2.5 pr-3 text-right text-[#4B5563]">{r.scans}</td>
                    <td className="py-2.5 pr-3 text-right">{r.hot}</td>
                    <td className="py-2.5 pr-3 text-right">{r.warm}</td>
                    <td className="py-2.5 pr-3 text-right">{r.cold}</td>
                    <td className="py-2.5 pr-3 text-right">{r.untreated}</td>
                    <td className="py-2.5 pr-3 text-right">{r.appointments}</td>
                    <td className="py-2.5 pr-3 text-right">{r.due}</td>
                    <td className="py-2.5 pr-3 text-right">{r.qualified}</td>
                    <td className="py-2.5 pr-3 text-xs text-[#8A8F98]">{fmt(r.lastScan)}</td>
                    <td className="py-2.5 text-right">
                      <button onClick={() => exportAgent(r.agent)} disabled={!r.leads} className="rounded-md border border-[#E5E7EB] px-2 py-1 text-xs text-[#4B5563] hover:bg-[#F5F6F8] disabled:opacity-40">Export CSV</button>
                    </td>
                  </tr>
                ))}
                {!perAgent.length && <tr><td colSpan={12} className="py-8 text-center text-[#8A8F98]">Aucun compte commercial. Crée-les avec le script ou depuis « Équipe » plus bas.</td></tr>}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] text-[#8A8F98]">« Prospects » = personnes rattachées au commercial (1er à les scanner). « Scans » inclut les rescans.</p>
        </Card>

        {/* Évolution */}
        <div className="mb-6 grid gap-3 lg:grid-cols-2">
          <Card title="Scans par jour"><BarChart bars={dayBars} color="#0EA5E9" empty="Aucun scan pour le moment." /></Card>
          <Card title="Scans par heure (heure d'Alger)"><BarChart bars={hourBars} color="#7C3AED" empty="Aucun scan pour le moment." /></Card>
        </div>

        {/* Statuts + à faire */}
        <div className="mb-6 grid gap-3 lg:grid-cols-3">
          <Card title="Statuts commerciaux">
            <ul className="space-y-2.5">
              {statusCounts.map(([k, n]) => (
                <li key={k} className="text-sm">
                  <div className="mb-1 flex justify-between gap-2"><span className="text-[#031B17]">{STATUS_LABELS[k]}</span><span className="font-semibold text-[#031B17]">{n}</span></div>
                  <div className="h-1.5 rounded-full bg-[#EDEEF1]"><div className="h-full rounded-full bg-[#031B17]" style={{ width: `${stats.leads ? (n / stats.leads) * 100 : 0}%` }} /></div>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Rendez-vous et relances à effectuer" className="lg:col-span-2">
            <div id="a-faire" className="max-h-80 overflow-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#EDEEF1] text-[11px] uppercase tracking-wide text-[#8A8F98]">
                    <th className={th}>Échéance</th><th className={th}>Prospect</th><th className={th}>Commercial</th><th className={th}>Statut</th><th className="py-2 font-semibold">Prochaine action</th>
                  </tr>
                </thead>
                <tbody>
                  {todo.slice(0, 100).map((l) => (
                    <tr key={l.id} className="border-b border-[#F3F4F6] align-top">
                      <td className={`whitespace-nowrap py-2 pr-3 text-xs font-semibold ${isDue(l) ? "text-[#DC2626]" : "text-[#4B5563]"}`}>{l.followUpAt ? fmt(l.followUpAt) : "—"}</td>
                      <td className="py-2 pr-3 text-[#031B17]">{l.visitor?.firstName} {l.visitor?.lastName}<div className="text-xs text-[#8A8F98]">{l.visitor?.phone}</div></td>
                      <td className="py-2 pr-3 text-xs text-[#4B5563]">{l.agentName}</td>
                      <td className="py-2 pr-3 text-xs">{STATUS_LABELS[l.status]}</td>
                      <td className="py-2 text-xs text-[#4B5563]">{l.nextAction || "—"}</td>
                    </tr>
                  ))}
                  {!todo.length && <tr><td colSpan={5} className="py-8 text-center text-[#8A8F98]">Aucun rendez-vous ni relance planifié.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Doublons */}
        <div className="mb-6 grid gap-3 lg:grid-cols-2">
          <Card title={`Personnes scannées plusieurs fois (${multiScanned.length})`}>
            <div className="max-h-64 overflow-auto">
              {multiScanned.length ? (
                <ul className="space-y-2.5 text-sm">
                  {multiScanned.map(({ lead, scanners }) => (
                    <li key={lead.id} className="rounded-lg border border-[#EDEEF1] px-3 py-2">
                      <div className="font-semibold text-[#031B17]">{lead.visitor?.firstName} {lead.visitor?.lastName} <span className="text-xs font-normal text-[#8A8F98]">· {lead.scanCount} scans</span></div>
                      <div className="text-xs text-[#4B5563]">Rattaché à <b>{lead.agentName}</b> · 1er scan {fmt(lead.firstScannedAt)}</div>
                      <div className="text-xs text-[#8A8F98]">Scanné par : {scanners.join(", ")}</div>
                    </li>
                  ))}
                </ul>
              ) : <p className="py-6 text-center text-sm text-[#8A8F98]">Aucun rescan pour le moment.</p>}
            </div>
          </Card>
          <Card title={`Inscriptions en double potentiel (${duplicatePeople.length})`}>
            <div className="max-h-64 overflow-auto">
              {duplicatePeople.length ? (
                <ul className="space-y-2.5 text-sm">
                  {duplicatePeople.map(({ key, list }) => (
                    <li key={key} className="rounded-lg border border-[#EDEEF1] px-3 py-2">
                      <div className="text-xs font-semibold uppercase text-[#B45309]">{key.startsWith("e:") ? "Même e-mail" : "Même téléphone"}</div>
                      {list.map((r) => <div key={r.id} className="text-xs text-[#4B5563]">#{r.id} {r.firstName} {r.lastName} · {r.email} · {r.phone}</div>)}
                    </li>
                  ))}
                </ul>
              ) : <p className="py-6 text-center text-sm text-[#8A8F98]">Aucune inscription en double détectée.</p>}
            </div>
          </Card>
        </div>

        {/* Liste complète */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher nom, téléphone, e-mail, note…" className={`${selectClass} min-w-[240px] flex-1`} />
          <select value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)} className={selectClass}>
            <option value="all">Tous les commerciaux</option>
            {agents.map((a) => <option key={a.id} value={String(a.id)}>{a.name}</option>)}
          </select>
          <select value={tempFilter} onChange={(e) => setTempFilter(e.target.value)} className={selectClass}>
            <option value="all">Tous niveaux</option><option value="hot">HOT</option><option value="warm">WARM</option><option value="cold">COLD</option><option value="none">Non qualifié</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
            <option value="all">Tous statuts</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <label className="flex cursor-pointer items-center gap-1.5 text-sm text-[#4B5563]"><input type="checkbox" checked={onlyUntreated} onChange={(e) => setOnlyUntreated(e.target.checked)} className="accent-[#031B17]" /> Non traités</label>
          <button onClick={() => download(`jpo-helenite-prospects-filtres-${new Date().toISOString().slice(0, 10)}.csv`, leadsToCsv(filtered))} disabled={!filtered.length} className="rounded-lg border border-[#031B17] px-3 py-2 text-sm font-semibold text-[#031B17] hover:bg-white disabled:opacity-40">Exporter la sélection ({filtered.length})</button>
        </div>

        <div className="mb-8 overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#EDEEF1] text-[11px] uppercase tracking-wide text-[#8A8F98]">
                <th className="px-4 py-3 font-semibold">Scanné le</th>
                <th className="px-4 py-3 font-semibold">Prospect</th>
                <th className="px-4 py-3 font-semibold">Contact</th>
                <th className="px-4 py-3 font-semibold">Commercial</th>
                <th className="px-4 py-3 font-semibold">Intérêt</th>
                <th className="px-4 py-3 font-semibold">Statut</th>
                <th className="px-4 py-3 font-semibold">Suivi</th>
              </tr>
            </thead>
            <tbody>
              {loading && !leads.length && <tr><td colSpan={7} className="px-4 py-10 text-center text-[#8A8F98]">Chargement…</td></tr>}
              {!loading && !paged.length && <tr><td colSpan={7} className="px-4 py-10 text-center text-[#8A8F98]">Aucun prospect.</td></tr>}
              {paged.map((l) => {
                const v = l.visitor || {};
                return (
                  <tr key={l.id} className="border-b border-[#F3F4F6] align-top">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-[#4B5563]">{fmt(l.firstScannedAt)}{l.scanCount > 1 && <div className="text-[#B45309]">{l.scanCount} scans</div>}</td>
                    <td className="px-4 py-3"><div className="font-semibold text-[#031B17]">{v.firstName} {v.lastName}</div><div className="text-xs text-[#8A8F98]">{[v.profile, v.typology, v.horizon].filter(Boolean).join(" · ")}</div></td>
                    <td className="px-4 py-3 text-xs text-[#4B5563]"><div>{v.email}</div><a href={`https://wa.me/${digits(v.phone)}`} target="_blank" rel="noopener noreferrer" className="text-[#166534] hover:underline">{v.phone}</a></td>
                    <td className="px-4 py-3">
                      <select value={String(l.agentId)} onChange={(e) => reassign(l.id, e.target.value)} className="rounded-md border border-[#E5E7EB] bg-white px-2 py-1 text-xs text-[#031B17] outline-none">
                        {agents.map((a) => <option key={a.id} value={String(a.id)}>{a.name}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3"><TempBadge value={l.temperature} />{l.rating ? <div className="mt-1 text-xs font-semibold text-[#B97800]">★ {l.rating}/5</div> : null}</td>
                    <td className="px-4 py-3 text-xs">{STATUS_LABELS[l.status] || l.status}{!l.treatedAt && <div className="text-[#D97706]">non traité</div>}</td>
                    <td className="max-w-[300px] px-4 py-3 text-xs text-[#4B5563]">
                      {l.followUpAt && <div className={isDue(l) ? "font-semibold text-[#DC2626]" : ""}>Relance {fmt(l.followUpAt)}</div>}
                      {l.nextAction && <div>{l.nextAction}</div>}
                      {l.note && <div className="mt-1 italic text-[#8A8F98]" title={l.note}>« {l.note.length > 140 ? `${l.note.slice(0, 140)}…` : l.note} »</div>}
                      {!l.followUpAt && !l.nextAction && !l.note && "—"}
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

        {/* Équipe */}
        <Card
          title={`Équipe commerciale (${agents.length} comptes)`}
          right={<button onClick={() => setTeamOpen((v) => !v)} className="rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-xs font-semibold text-[#031B17] hover:bg-[#F5F6F8]">{teamOpen ? "Masquer" : "Gérer les comptes"}</button>}
        >
          {teamOpen ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#EDEEF1] text-[11px] uppercase tracking-wide text-[#8A8F98]">
                      <th className={th}>Nom</th><th className={th}>E-mail (identifiant)</th><th className={th}>Rôle</th><th className={th}>Dernière connexion</th><th className={th}>Compte</th><th className="py-2 font-semibold" />
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map((a) => (
                      <tr key={a.id} className="border-b border-[#F3F4F6]">
                        <td className="py-2.5 pr-3 font-semibold text-[#031B17]">{a.name}</td>
                        <td className="py-2.5 pr-3 text-xs text-[#4B5563]">{a.email}</td>
                        <td className="py-2.5 pr-3 text-xs">{a.role === "manager" ? "Manager" : "Commercial"}</td>
                        <td className="py-2.5 pr-3 text-xs text-[#8A8F98]">{fmt(a.lastLoginAt)}</td>
                        <td className="py-2.5 pr-3"><span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${a.active ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#FEE2E2] text-[#991B1B]"}`}>{a.active ? "Actif" : "Désactivé"}</span></td>
                        <td className="whitespace-nowrap py-2.5 text-right">
                          <button onClick={() => resetPassword(a)} className="mr-2 rounded-md border border-[#E5E7EB] px-2 py-1 text-xs text-[#4B5563] hover:bg-[#F5F6F8]">Nouveau mot de passe</button>
                          <button onClick={() => toggleActive(a)} className="rounded-md border border-[#E5E7EB] px-2 py-1 text-xs text-[#4B5563] hover:bg-[#F5F6F8]">{a.active ? "Désactiver" : "Réactiver"}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <form onSubmit={addAgent} className="mt-5 grid gap-3 rounded-lg bg-[#F5F6F8] p-4 md:grid-cols-[1fr_1fr_160px_auto]">
                <input required value={newAgent.name} onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })} placeholder="Nom complet" className={selectClass} />
                <input required type="email" value={newAgent.email} onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })} placeholder="E-mail professionnel" className={selectClass} />
                <select value={newAgent.role} onChange={(e) => setNewAgent({ ...newAgent, role: e.target.value })} className={selectClass}><option value="commercial">Commercial</option><option value="manager">Manager</option></select>
                <button type="submit" className="rounded-lg bg-[#031B17] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">Ajouter</button>
              </form>
            </>
          ) : <p className="text-sm text-[#8A8F98]">Création de comptes, nouveaux mots de passe et désactivation. Les mots de passe ne sont jamais conservés en clair.</p>}
        </Card>
      </div>
      <PasswordModal info={passwordInfo} onClose={() => setPasswordInfo(null)} />
    </div>
  );
}

export default function JpoHeleniteLeadsPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY));
  return (
    <>
      <Helmet>
        <title>JPO Hélénite — Prospects commerciaux</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {token ? <Dashboard token={token} onLogout={() => setToken(null)} /> : <LoginGate onAuthenticated={(t) => setToken(t)} />}
    </>
  );
}
