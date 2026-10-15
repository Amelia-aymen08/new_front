// @ts-nocheck
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { API_BASE_URL } from "../config";
import { buildBrandedQrSvg, downloadQrPng, downloadQrSvg } from "../utils/brandedQr";

const API_URL = `${API_BASE_URL}/api/jpo-helenite`;
// Même jeton que les dashboards Batimat (clé de session partagée) : une seule connexion.
const TOKEN_KEY = "batimat_admin_token";
const REFRESH_INTERVAL_MS = 15000;
const PAGE_SIZE = 50;
const GOLD = "#E1BB7F";
const PAGE_URL = "https://aymenpromotion-dz.com/jpo_helenite";
const DEFAULT_CAMPAIGN = "jpo-helenite";

// Jours et créneaux de l'événement (mêmes valeurs que le formulaire public).
const DATES = [
  { value: "2026-10-23", label: "Ven. 23 oct.", from: 15 },
  { value: "2026-10-24", label: "Sam. 24 oct.", from: 8 },
  { value: "2026-10-25", label: "Dim. 25 oct.", from: 8 },
  { value: "2026-10-26", label: "Lun. 26 oct.", from: 8 },
  { value: "2026-10-27", label: "Mar. 27 oct.", from: 8 },
  { value: "2026-10-28", label: "Mer. 28 oct.", from: 8 },
  { value: "2026-10-29", label: "Jeu. 29 oct.", from: 8 },
];
const SLOT_HOURS = Array.from({ length: 11 }, (_, i) => 8 + i); // 08h → 19h
const slotLabel = (h) => `${String(h).padStart(2, "0")}h - ${String(h + 1).padStart(2, "0")}h`;
const dateLabel = (v) => DATES.find((d) => d.value === v)?.label || v;
const isSlotOffered = (date, h) => {
  const d = DATES.find((x) => x.value === date);
  if (!d) return false;
  return date === "2026-10-23" ? h >= 15 && h <= 18 : h >= 8 && h <= 17;
};

const STATUSES = {
  nouveau: { label: "À confirmer", color: "#92400E", bg: "#FEF3C7" },
  confirme: { label: "Confirmé", color: "#166534", bg: "#DCFCE7" },
  annule: { label: "Annulé", color: "#991B1B", bg: "#FEE2E2" },
};

// Liens suivis proposés d'office : l'UTM est générée automatiquement à partir de ces couples.
const QUICK_LINKS = [
  { label: "Commerciaux", source: "commerciaux", medium: "link" },
  { label: "Instagram", source: "instagram", medium: "social" },
  { label: "Facebook", source: "facebook", medium: "social" },
  { label: "TikTok", source: "tiktok", medium: "social" },
  { label: "LinkedIn", source: "linkedin", medium: "social" },
  { label: "WhatsApp", source: "whatsapp", medium: "message" },
  { label: "E-mail / newsletter", source: "newsletter", medium: "email" },
  { label: "SMS", source: "sms", medium: "sms" },
  { label: "Google Ads", source: "google", medium: "cpc" },
  { label: "Meta Ads", source: "meta", medium: "paid-social" },
  { label: "QR flyer", source: "flyer", medium: "qr" },
  { label: "QR affiche / bâche", source: "affiche", medium: "qr" },
];

const slug = (v) =>
  String(v || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

function buildLink({ source, medium, campaign }) {
  const params = new URLSearchParams();
  if (source) params.set("utm_source", source);
  if (medium) params.set("utm_medium", medium);
  params.set("utm_campaign", campaign || DEFAULT_CAMPAIGN);
  return `${PAGE_URL}?${params.toString()}`;
}

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

const linkKey = (c, s, m) => [c, s, m].map((v) => String(v || "").trim().toLowerCase()).join("|");

function toCsv(rows) {
  const headers = [
    "Inscrit le", "Prénom", "Nom", "E-mail", "Téléphone", "Jour", "Créneau", "Statut", "Profil", "Typologie", "Horizon",
    "Précision", "Newsletter", "Campagne", "Source", "Medium", "Badge envoyé le",
  ];
  const lines = rows.map((r) => [
    formatDateTime(r.createdAt), r.firstName, r.lastName, r.email, r.phone, dateLabel(r.visitDate), r.timeSlot,
    STATUSES[r.status]?.label || r.status, r.profile, r.typology, r.horizon, r.message, r.newsletterOptIn ? "Oui" : "Non",
    r.qrCampaign, r.qrSource, r.qrMedium, formatDateTime(r.badgeSentAt),
  ]);
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [headers, ...lines].map((r) => r.map(esc).join(";")).join("\n");
}

function downloadCsv(rows) {
  const blob = new Blob(["﻿" + toCsv(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `jpo-helenite-inscrits-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
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
      } else if (!res.ok) {
        setError("Erreur serveur, réessayez.");
      } else {
        sessionStorage.setItem(TOKEN_KEY, tokenInput.trim());
        onAuthenticated(tokenInput.trim());
        return;
      }
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau.");
    }
    setChecking(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#031B17] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#05241F] p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl text-base font-bold text-[#031B17]" style={{ background: GOLD }}>H</div>
          <div>
            <h1 className="text-lg font-bold text-white">JPO Hélénite — Dashboard</h1>
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
        <button type="submit" disabled={checking} className="w-full rounded-lg py-2.5 text-sm font-bold uppercase tracking-wider text-[#031B17] transition-opacity hover:opacity-90 disabled:opacity-50" style={{ background: GOLD }}>
          {checking ? "Vérification…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

function Kpi({ label, value, hint, accent, active, onClick, big }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag onClick={onClick} className={`rounded-xl border bg-white px-5 py-4 text-left shadow-sm transition-all ${onClick ? "hover:shadow-md" : ""} ${active ? "border-[#031B17] ring-1 ring-[#031B17]" : "border-[#E5E7EB]"}`}>
      <div className="mb-2 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
        <span className="text-xs font-semibold uppercase tracking-wide text-[#8A8F98]">{label}</span>
      </div>
      <span className={`${big ? "text-4xl" : "text-2xl"} font-bold text-[#031B17]`}>{value}</span>
      {hint && <p className="mt-1 text-xs text-[#8A8F98]">{hint}</p>}
    </Tag>
  );
}

function Card({ title, right, children, className = "" }) {
  return (
    <div className={`rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[#8A8F98]">{title}</h2>
        {right}
      </div>
      {children}
    </div>
  );
}

function BarChart({ bars, color = "#031B17", empty }) {
  const max = Math.max(1, ...bars.map((b) => b.count));
  if (!bars.length) return <p className="py-8 text-center text-sm text-[#8A8F98]">{empty}</p>;
  return (
    <div className="flex h-40 items-end gap-1.5" role="img">
      {bars.map((b) => (
        <div key={b.key} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
          <span className="text-[10px] font-semibold text-[#031B17]">{b.count || ""}</span>
          <div className="w-full rounded-t" style={{ height: `${(b.count / max) * 100}%`, minHeight: b.count ? 4 : 2, background: b.count ? color : "#E5E7EB" }} />
          <span className="text-[9px] text-[#8A8F98]">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

// Dernières 21 journées entre la 1re donnée et aujourd'hui.
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

const countBy = (rows, pick) => {
  const m = new Map();
  rows.forEach((r) => {
    const v = pick(r);
    if (v) m.set(v, (m.get(v) || 0) + 1);
  });
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
};

// Fenêtre d'aperçu du QR code d'un lien, avec téléchargement PNG / SVG.
function QrModal({ qr, onClose }) {
  const [busy, setBusy] = useState(false);
  const svg = useMemo(() => buildBrandedQrSvg(qr.url, 360).replace('width="360" height="360"', 'width="100%" height="100%"'), [qr.url]);
  const fileBase = `qr-jpo-helenite-${slug(qr.name) || "lien"}`;

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const png = async () => {
    setBusy(true);
    try {
      await downloadQrPng(qr.url, `${fileBase}.png`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#8A8F98]">QR code</p>
            <h3 className="text-base font-bold text-[#031B17]">{qr.name}</h3>
          </div>
          <button onClick={onClose} aria-label="Fermer" className="rounded-md px-2 py-1 text-[#8A8F98] hover:bg-[#F5F6F8]">✕</button>
        </div>
        <div className="mb-3 aspect-square overflow-hidden rounded-xl border border-[#EDEEF1]" dangerouslySetInnerHTML={{ __html: svg }} />
        <p className="mb-4 break-all text-[11px] text-[#8A8F98]">{qr.url}</p>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={png} disabled={busy} className="rounded-lg bg-[#031B17] py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
            {busy ? "Génération…" : "Télécharger PNG"}
          </button>
          <button onClick={() => downloadQrSvg(qr.url, `${fileBase}.svg`)} className="rounded-lg border border-[#031B17] py-2.5 text-sm font-semibold text-[#031B17] hover:bg-[#F5F6F8]">
            Télécharger SVG
          </button>
        </div>
        <p className="mt-3 text-[11px] text-[#8A8F98]">PNG 1600 × 1600 px pour l'impression · SVG vectoriel pour les agrandissements (affiche, bâche).</p>
      </div>
    </div>
  );
}

function LinkGenerator() {
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("link");
  const [campaign, setCampaign] = useState(DEFAULT_CAMPAIGN);
  const [name, setName] = useState("");
  const [copied, setCopied] = useState("");
  const [qr, setQr] = useState(null);

  const finalSource = slug(name ? `${source || "commerciaux"}-${name}` : source);
  const customLink = finalSource ? buildLink({ source: finalSource, medium: slug(medium), campaign: slug(campaign) || DEFAULT_CAMPAIGN }) : "";

  const copy = async (url) => {
    if (await copyText(url)) {
      setCopied(url);
      setTimeout(() => setCopied(""), 1800);
    }
  };

  const inputClass = "w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#031B17] outline-none focus:border-[#031B17]";
  const labelClass = "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#8A8F98]";

  return (
    <Card title="Liens de suivi (UTM générées automatiquement)">
      <p className="mb-4 text-sm text-[#4B5563]">
        Chaque lien ouvre la même page d'avant-première. Les visites sont comptées par source ; une inscription est
        rattachée au lien utilisé. Copiez un lien prêt à l'emploi, ou créez-en un (ex. un lien par commercial).
      </p>

      <div className="mb-5 grid gap-2 md:grid-cols-2">
        {QUICK_LINKS.map((q) => {
          const url = buildLink({ source: q.source, medium: q.medium, campaign: DEFAULT_CAMPAIGN });
          return (
            <div key={q.label} className="flex items-center justify-between gap-3 rounded-lg border border-[#EDEEF1] px-3 py-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#031B17]">{q.label}</p>
                <p className="truncate text-[11px] text-[#8A8F98]" title={url}>{url}</p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button onClick={() => setSource(q.source) || setMedium(q.medium)} className="rounded-md border border-[#E5E7EB] px-2 py-1 text-xs text-[#4B5563] hover:bg-[#F5F6F8]">Éditer</button>
                <button onClick={() => setQr({ name: q.label, url })} className="rounded-md border border-[#E5E7EB] px-2 py-1 text-xs font-semibold text-[#031B17] hover:bg-[#F5F6F8]">QR</button>
                <button onClick={() => copy(url)} className="rounded-md bg-[#031B17] px-2.5 py-1 text-xs font-semibold text-white hover:opacity-90">
                  {copied === url ? "Copié ✓" : "Copier"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg bg-[#F5F6F8] p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#031B17]">Créer un lien personnalisé</p>
        <div className="grid gap-3 md:grid-cols-4">
          <div>
            <label className={labelClass}>Source (utm_source)</label>
            <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="commerciaux" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Nom (optionnel)</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="ex. Karim" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Medium (utm_medium)</label>
            <input value={medium} onChange={(e) => setMedium(e.target.value)} placeholder="link, social, email, qr…" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Campagne (utm_campaign)</label>
            <input value={campaign} onChange={(e) => setCampaign(e.target.value)} className={inputClass} />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input readOnly value={customLink || "Renseignez au moins une source"} onFocus={(e) => e.target.select()} className={`${inputClass} flex-1 font-mono text-xs`} />
          <button disabled={!customLink} onClick={() => setQr({ name: finalSource, url: customLink })} className="rounded-lg border border-[#031B17] px-4 py-2 text-sm font-semibold text-[#031B17] hover:bg-white disabled:opacity-40">
            Générer le QR code
          </button>
          <button disabled={!customLink} onClick={() => copy(customLink)} className="rounded-lg bg-[#031B17] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40">
            {copied === customLink ? "Copié ✓" : "Copier"}
          </button>
        </div>
        <p className="mt-2 text-[11px] text-[#8A8F98]">Le nom est ajouté à la source : « commerciaux » + « Karim » → source « commerciaux-karim ».</p>
      </div>
      {qr && <QrModal qr={qr} onClose={() => setQr(null)} />}
    </Card>
  );
}

function Dashboard({ token, onLogout }) {
  const [rows, setRows] = useState([]);
  const [linkStats, setLinkStats] = useState({ links: [], daily: [], unavailable: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");
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
        const [res, resLinks] = await Promise.all([
          fetch(API_URL, { headers }),
          fetch(`${API_URL}/link-stats`, { headers }),
        ]);
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
    const s = { total: rows.length, today: 0, nouveau: 0, confirme: 0, annule: 0, badgeSent: 0, newsletter: 0, tracked: 0 };
    rows.forEach((r) => {
      if (dayKey(r.createdAt) === todayKey) s.today += 1;
      if (s[r.status] !== undefined) s[r.status] += 1;
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

  // Créneaux : jour × heure.
  const matrix = useMemo(() => {
    const m = {};
    rows.forEach((r) => {
      if (r.status === "annule") return;
      const h = parseInt(String(r.timeSlot).slice(0, 2), 10);
      const k = `${r.visitDate}|${h}`;
      m[k] = (m[k] || 0) + 1;
    });
    return m;
  }, [rows]);
  const matrixMax = Math.max(1, ...Object.values(matrix));

  // Suivi des liens : visites (qr_scans) + inscriptions (table), regroupées par campagne / source / medium.
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
    const list = [...map.values()].sort((a, b) => b.regs - a.regs || b.scans - a.scans);
    return { list, direct };
  }, [linkStats, rows]);

  const sourceOptions = useMemo(() => [...new Set(rows.map((r) => r.qrSource).filter(Boolean))].sort(), [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (dateFilter !== "all" && r.visitDate !== dateFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (sourceFilter === "direct" && (r.qrCampaign || r.qrSource)) return false;
      if (sourceFilter !== "all" && sourceFilter !== "direct" && r.qrSource !== sourceFilter) return false;
      if (!q) return true;
      return `${r.firstName} ${r.lastName} ${r.email} ${r.phone}`.toLowerCase().includes(q);
    });
  }, [rows, dateFilter, statusFilter, sourceFilter, search]);

  useEffect(() => setPage(1), [dateFilter, statusFilter, sourceFilter, search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const totalUniques = linkRows.list.reduce((n, l) => n + l.uniques, 0);
  const pct = (n) => (stats.total ? `${Math.round((n / stats.total) * 100)} %` : "—");
  const selectClass = "rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#031B17] outline-none focus:border-[#031B17]";

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <div className="border-b border-[#E5E7EB] bg-[#031B17]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-[#031B17]" style={{ background: GOLD }}>H</div>
            <div>
              <h1 className="text-base font-bold text-white">JPO Hélénite — 23 au 29 octobre 2026</h1>
              <p className="flex items-center gap-1.5 text-xs text-white/40">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                En direct
                {lastUpdated && <span>· actualisé à {lastUpdated.toLocaleTimeString("fr-FR")}</span>}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
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
            <Kpi big label="Inscrits" value={stats.total} accent="#031B17" hint={`${stats.today} aujourd'hui`} active={statusFilter === "all"} onClick={() => setStatusFilter("all")} />
          </div>
          <Kpi label="À confirmer" value={stats.nouveau} hint={pct(stats.nouveau)} accent="#D97706" active={statusFilter === "nouveau"} onClick={() => setStatusFilter(statusFilter === "nouveau" ? "all" : "nouveau")} />
          <Kpi label="Confirmés" value={stats.confirme} hint={pct(stats.confirme)} accent="#16A34A" active={statusFilter === "confirme"} onClick={() => setStatusFilter(statusFilter === "confirme" ? "all" : "confirme")} />
          <Kpi label="Annulés" value={stats.annule} hint={pct(stats.annule)} accent="#DC2626" active={statusFilter === "annule"} onClick={() => setStatusFilter(statusFilter === "annule" ? "all" : "annule")} />
        </div>
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi label="Visiteurs via liens suivis" value={totalUniques} hint="Visiteurs uniques (hors robots)" accent="#0EA5E9" />
          <Kpi label="Inscrits via liens suivis" value={stats.tracked} hint={pct(stats.tracked)} accent="#7C3AED" />
          <Kpi label="Badges envoyés" value={stats.badgeSent} hint={stats.total - stats.badgeSent ? `${stats.total - stats.badgeSent} à renvoyer` : "Tous envoyés"} accent="#16A34A" />
          <Kpi label="Newsletter" value={stats.newsletter} hint={pct(stats.newsletter)} accent="#64748B" />
        </div>

        {/* Courbes */}
        <div className="mb-6 grid gap-3 lg:grid-cols-2">
          <Card title="Inscriptions par jour"><BarChart bars={regBars} empty="Pas encore d'inscription." /></Card>
          <Card title="Visites des liens suivis par jour"><BarChart bars={visitBars} color="#0EA5E9" empty={linkStats.unavailable ? "Suivi des visites indisponible." : "Aucune visite suivie pour le moment."} /></Card>
        </div>

        {/* Suivi des liens */}
        <Card title="Performance des liens" className="mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#EDEEF1] text-[11px] uppercase tracking-wide text-[#8A8F98]">
                  <th className="py-2 pr-4 font-semibold">Source</th>
                  <th className="py-2 pr-4 font-semibold">Medium</th>
                  <th className="py-2 pr-4 font-semibold">Campagne</th>
                  <th className="py-2 pr-4 text-right font-semibold">Visites</th>
                  <th className="py-2 pr-4 text-right font-semibold">Visiteurs uniques</th>
                  <th className="py-2 pr-4 text-right font-semibold">Inscrits</th>
                  <th className="py-2 pr-4 text-right font-semibold">Conversion</th>
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
                  <td className="py-2.5 pr-4 text-[#8A8F98]">—</td>
                  <td className="py-2.5 pr-4 text-[#8A8F98]">—</td>
                  <td className="py-2.5 pr-4 text-right text-[#8A8F98]">—</td>
                  <td className="py-2.5 pr-4 text-right text-[#8A8F98]">—</td>
                  <td className="py-2.5 pr-4 text-right font-semibold text-[#031B17]">{linkRows.direct}</td>
                  <td className="py-2.5 pr-4 text-right text-[#8A8F98]">—</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] text-[#8A8F98]">
            Conversion = inscrits ÷ visiteurs uniques du lien. Les visites ne sont comptées que sur les liens munis d'une UTM ou d'un suffixe (/jpo_helenite/commerciaux) ; les accès directs à la page ne sont pas mesurables.
          </p>
        </Card>

        <div className="mb-6"><LinkGenerator /></div>

        {/* Créneaux */}
        <Card title="Remplissage des créneaux (hors annulés)" className="mb-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-separate border-spacing-1 text-center text-xs">
              <thead>
                <tr className="text-[#8A8F98]">
                  <th className="px-2 py-1 text-left font-semibold">Jour</th>
                  {SLOT_HOURS.map((h) => <th key={h} className="px-1 py-1 font-semibold">{slotLabel(h).replace(" - ", "–")}</th>)}
                  <th className="px-2 py-1 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {DATES.map((d) => {
                  const total = SLOT_HOURS.reduce((n, h) => n + (matrix[`${d.value}|${h}`] || 0), 0);
                  return (
                    <tr key={d.value}>
                      <td className="whitespace-nowrap px-2 py-1 text-left font-semibold text-[#031B17]">{d.label}</td>
                      {SLOT_HOURS.map((h) => {
                        if (!isSlotOffered(d.value, h)) return <td key={h} className="rounded bg-[#F3F4F6]" />;
                        const n = matrix[`${d.value}|${h}`] || 0;
                        return (
                          <td key={h} className="rounded py-1.5 font-semibold" style={{ background: n ? `rgba(3,27,23,${0.12 + (n / matrixMax) * 0.78})` : "#fff", color: n && n / matrixMax > 0.5 ? "#fff" : "#031B17", border: "1px solid #EDEEF1" }}>
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
        <div className="mb-6 grid gap-3 lg:grid-cols-3">
          <Card title="Profil"><BreakdownList items={countBy(rows, (r) => r.profile)} total={rows.length} /></Card>
          <Card title="Typologie recherchée"><BreakdownList items={countBy(rows, (r) => r.typology)} total={rows.length} /></Card>
          <Card title="Horizon du projet"><BreakdownList items={countBy(rows, (r) => r.horizon)} total={rows.length} /></Card>
        </div>

        {/* Liste des inscrits */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher nom, e-mail, téléphone…" className={`${selectClass} min-w-[240px] flex-1`} />
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className={selectClass}>
            <option value="all">Tous les jours</option>
            {DATES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className={selectClass}>
            <option value="all">Toutes les sources</option>
            <option value="direct">Direct / sans lien suivi</option>
            {sourceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className="text-sm text-[#8A8F98]">{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#EDEEF1] text-[11px] uppercase tracking-wide text-[#8A8F98]">
                <th className="px-4 py-3 font-semibold">Inscrit le</th>
                <th className="px-4 py-3 font-semibold">Nom</th>
                <th className="px-4 py-3 font-semibold">Contact</th>
                <th className="px-4 py-3 font-semibold">Visite</th>
                <th className="px-4 py-3 font-semibold">Projet</th>
                <th className="px-4 py-3 font-semibold">Source</th>
                <th className="px-4 py-3 font-semibold">Statut</th>
                <th className="px-4 py-3 font-semibold">Badge</th>
              </tr>
            </thead>
            <tbody>
              {loading && !rows.length && <tr><td colSpan={8} className="px-4 py-10 text-center text-[#8A8F98]">Chargement…</td></tr>}
              {!loading && !paged.length && <tr><td colSpan={8} className="px-4 py-10 text-center text-[#8A8F98]">Aucune inscription.</td></tr>}
              {paged.map((r) => {
                const st = STATUSES[r.status] || STATUSES.nouveau;
                const wa = String(r.phone || "").replace(/\D/g, "");
                return (
                  <tr key={r.id} className="border-b border-[#F3F4F6] align-top">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-[#4B5563]">{formatDateTime(r.createdAt)}</td>
                    <td className="px-4 py-3 font-semibold text-[#031B17]">{r.firstName} {r.lastName}</td>
                    <td className="px-4 py-3 text-xs text-[#4B5563]">
                      <div>{r.email}</div>
                      <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="text-[#166534] hover:underline">{r.phone}</a>
                      {r.newsletterOptIn && <div className="text-[#7C3AED]">Newsletter</div>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs">
                      <div className="font-semibold text-[#031B17]">{dateLabel(r.visitDate)}</div>
                      <div className="text-[#4B5563]">{r.timeSlot}</div>
                    </td>
                    <td className="max-w-[240px] px-4 py-3 text-xs text-[#4B5563]">
                      {[r.profile, r.typology, r.horizon].filter(Boolean).join(" · ") || "—"}
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

export default function JpoHeleniteAdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY));
  return (
    <>
      <Helmet>
        <title>JPO Hélénite — Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {token ? <Dashboard token={token} onLogout={() => setToken(null)} /> : <LoginGate onAuthenticated={(t) => setToken(t)} />}
    </>
  );
}
