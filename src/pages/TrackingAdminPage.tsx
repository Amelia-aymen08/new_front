// @ts-nocheck
import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/track/stats`;
const TOKEN_KEY = "batimat_admin_token"; // partagé avec /batimat-admin
const REFRESH_INTERVAL_MS = 60000;

// Campagnes déduites (QR imprimés figés, sans paramètre possible).
const PRINTED_QR = [
  { campaign: "flyer", label: "Flyers → page d'accueil", note: "estimation haute (la home reçoit aussi du trafic direct)" },
  { campaign: "batimat-bache", label: "Bâches → /batimat", note: "fiable (page profonde, ~0 accès direct)" },
];

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
      const res = await fetch(`${API_URL}?days=1`, {
        headers: { Authorization: `Bearer ${tokenInput.trim()}` },
      });
      if (res.status === 401) {
        setError("Token incorrect.");
        setChecking(false);
        return;
      }
      if (res.status === 503) {
        setError("Dashboard non configuré côté serveur (BATIMAT_DASHBOARD_TOKEN).");
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
    <div className="flex min-h-screen items-center justify-center bg-[#0B1220] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111A2E] p-8 shadow-2xl"
      >
        <div className="mb-6">
          <h1 className="text-lg font-bold text-white">Suivi QR codes — Admin</h1>
          <p className="text-xs text-white/40">Accès réservé</p>
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
          className="mb-3 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#F7C66A]"
        />
        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={checking}
          className="w-full rounded-lg py-2.5 text-sm font-bold uppercase tracking-wider text-[#0B1220] transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "#F7C66A" }}
        >
          {checking ? "Vérification…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <div className="flex-1 rounded-xl border border-[#E5E7EB] bg-white px-5 py-4 shadow-sm">
      <span className="text-xs font-semibold uppercase tracking-wide text-[#8A8F98]">{label}</span>
      <div className="mt-1.5 text-2xl font-bold text-[#0B1220]">{value}</div>
      {hint && <p className="mt-0.5 text-xs text-[#8A8F98]">{hint}</p>}
    </div>
  );
}

function DailyChart({ daily, rangeDays }) {
  const perDay = useMemo(() => {
    const map = new Map();
    (daily || []).forEach((r) => {
      map.set(r.day, (map.get(r.day) || 0) + r.scans);
    });
    const out = [];
    for (let i = rangeDays - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      out.push({ key, label: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }), scans: map.get(key) || 0 });
    }
    return out;
  }, [daily, rangeDays]);

  const max = Math.max(1, ...perDay.map((d) => d.scans));

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold text-[#0B1220]">Scans par jour</h2>
      <div className="flex h-40 items-end gap-1 overflow-x-auto">
        {perDay.map((d) => (
          <div key={d.key} className="flex min-w-[14px] flex-1 flex-col items-center gap-1" title={`${d.label} : ${d.scans}`}>
            <div className="text-[9px] font-semibold text-[#8A8F98]">{d.scans || ""}</div>
            <div
              className="w-full rounded-t bg-[#F7C66A]"
              style={{ height: `${Math.max(2, (d.scans / max) * 120)}px` }}
            />
            <div className="text-[8px] text-[#B0B4BC]">{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ token, onLogout }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [days, setDays] = useState(30);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStats = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const res = await fetch(`${API_URL}?days=${days}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          sessionStorage.removeItem(TOKEN_KEY);
          onLogout();
          return;
        }
        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();
        setStats(data);
        setLastUpdated(new Date());
        setError("");
      } catch {
        setError("Impossible de récupérer les statistiques.");
      } finally {
        setLoading(false);
      }
    },
    [token, days, onLogout]
  );

  useEffect(() => {
    fetchStats();
    const id = setInterval(() => fetchStats(true), REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchStats]);

  const totals = stats?.totals || { scans: 0, uniques: 0, conversions: 0, campaigns: 0 };
  const byCampaign = stats?.byCampaign || [];

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <div className="border-b border-[#E5E7EB] bg-[#0B1220]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <h1 className="text-base font-bold text-white">Suivi des QR codes</h1>
            <p className="flex items-center gap-1.5 text-xs text-white/40">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              {lastUpdated ? `Actualisé à ${lastUpdated.toLocaleTimeString("fr-FR")}` : "Chargement…"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/80 outline-none"
            >
              <option value={7}>7 jours</option>
              <option value={30}>30 jours</option>
              <option value={90}>90 jours</option>
              <option value={365}>1 an</option>
            </select>
            <button
              onClick={() => fetchStats()}
              className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/5"
            >
              Actualiser
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

      <div className="mx-auto max-w-6xl px-6 py-8">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {stats?.needsMigration && (
          <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Base de données non initialisée : exécutez <code>backend/sql/qr_tracking.sql</code>{" "}
            dans phpMyAdmin (ou redémarrez le backend), puis actualisez.
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-3">
          <StatCard label="Scans (total)" value={loading ? "…" : totals.scans} hint="arrivées via un QR / lien tracé" />
          <StatCard label="Visiteurs uniques" value={loading ? "…" : totals.uniques} hint="appareils distincts" />
          <StatCard label="Conversions BATIMAT" value={loading ? "…" : totals.conversions} hint="préinscriptions attribuées" />
          <StatCard label="Campagnes actives" value={loading ? "…" : totals.campaigns} />
        </div>

        <div className="mb-6 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#FAFAFB] text-[11px] uppercase tracking-wide text-[#8A8F98]">
                <th className="px-5 py-3 font-semibold">Campagne</th>
                <th className="px-5 py-3 text-right font-semibold">Scans</th>
                <th className="px-5 py-3 text-right font-semibold">Uniques</th>
                <th className="px-5 py-3 text-right font-semibold">Conversions</th>
                <th className="px-5 py-3 text-right font-semibold">Taux conv.</th>
                <th className="px-5 py-3 font-semibold">Dernier scan</th>
              </tr>
            </thead>
            <tbody>
              {!byCampaign.length ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-[#8A8F98]">
                    {loading ? "Chargement…" : "Aucun scan sur la période."}
                  </td>
                </tr>
              ) : (
                byCampaign.map((c) => (
                  <tr key={c.campaign} className="border-b border-[#F0F1F3] last:border-0 hover:bg-[#FAFAFB]">
                    <td className="px-5 py-3 font-semibold text-[#0B1220]">
                      {c.campaign}
                      {c.estimated && (
                        <span
                          className="ml-2 rounded bg-[#FEF3C7] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#92400E]"
                          title="Scans déduits de la page d'arrivée (QR imprimé sans paramètre)"
                        >
                          estimation
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-[#0B1220]">{c.estimated ? "~" : ""}{c.scans}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-[#4B5563]">{c.uniques}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-[#4B5563]">{c.conversions}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-[#4B5563]">{c.conversionRate}%</td>
                    <td className="px-5 py-3 text-xs text-[#8A8F98]">{formatDate(c.lastScanAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {stats && <DailyChart daily={stats.daily} rangeDays={stats.rangeDays} />}

        <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-bold text-[#0B1220]">Comment les scans sont comptés</h2>
          <p className="mb-3 text-sm text-[#4B5563]">
            Les QR déjà imprimés pointent vers des URLs nues (aucun paramètre possible). Un scan
            est donc <strong>déduit</strong> quand une visite est : page d'entrée de session +
            appareil mobile + sans aucun référent.
          </p>
          <ul className="mb-3 space-y-1.5 text-sm">
            {PRINTED_QR.map((q) => (
              <li key={q.campaign} className="flex flex-wrap items-baseline gap-2">
                <code className="rounded bg-[#F5F6F8] px-2 py-0.5 text-xs font-semibold text-[#0B1220]">
                  {q.campaign}
                </code>
                <span className="text-[#4B5563]">{q.label}</span>
                <span className="text-xs text-[#8A8F98]">— {q.note}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-[#8A8F98]">
            Pour une <strong>nouvelle</strong> campagne, imprimez un QR avec
            <code className="mx-1 rounded bg-[#F5F6F8] px-1.5 py-0.5">?qr=nom-campagne</code>
            (ou des UTM). Le comptage devient alors exact et la campagne apparaît seule ici après
            le premier scan.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TrackingAdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY));

  return (
    <>
      <Helmet>
        <title>Suivi QR — Admin</title>
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
