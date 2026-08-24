// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/batimat`;
const TOKEN_KEY = "batimat_admin_token";
const REFRESH_INTERVAL_MS = 20000;

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

const STATUT_STYLES = {
  nouveau: { bg: "#FEF3C7", color: "#92400E" },
  traité: { bg: "#DBEAFE", color: "#1E40AF" },
  badge_envoyé: { bg: "#DCFCE7", color: "#166534" },
};

function StatutBadge({ statut }) {
  const style = STATUT_STYLES[statut] || { bg: "#E5E7EB", color: "#374151" };
  return (
    <span
      className="inline-block rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ background: style.bg, color: style.color }}
    >
      {statut}
    </span>
  );
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
    <div className="flex min-h-screen items-center justify-center bg-[#F5F5F4] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-[#E2E2E2] bg-white p-8 shadow-sm"
      >
        <h1 className="mb-1 text-xl font-bold text-[#1a1a1a]">Batimat — Admin</h1>
        <p className="mb-6 text-sm text-[#6b6b6b]">Accès réservé, entrez le token d'accès.</p>
        <input
          type="password"
          autoFocus
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="Token d'accès"
          className="mb-3 w-full rounded-md border border-[#E2E2E2] px-3 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-[#BF0D0D]"
        />
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={checking}
          className="w-full rounded-md bg-[#BF0D0D] py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {checking ? "Vérification…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

function Dashboard({ token, onLogout }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  const fetchLeads = useCallback(
    async (silent = false) => {
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
        setLeads(Array.isArray(data) ? data : []);
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

  return (
    <div className="min-h-screen bg-[#F5F5F4] px-4 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a1a]">Préinscriptions BATIMAT 2026</h1>
            <p className="text-sm text-[#6b6b6b]">
              {leads.length} inscription{leads.length !== 1 ? "s" : ""}
              {lastUpdated && (
                <span className="ml-2 text-[#9a9a9a]">
                  · Actualisé à {lastUpdated.toLocaleTimeString("fr-FR")}
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchLeads()}
              className="rounded-md border border-[#E2E2E2] bg-white px-4 py-2 text-sm font-semibold text-[#1a1a1a] hover:bg-[#F5F5F4]"
            >
              Actualiser
            </button>
            <button
              onClick={() => downloadCsv(leads)}
              disabled={!leads.length}
              className="rounded-md bg-[#1a1a1a] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40"
            >
              Exporter CSV
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem(TOKEN_KEY);
                onLogout();
              }}
              className="rounded-md border border-[#E2E2E2] bg-white px-4 py-2 text-sm font-semibold text-[#6b6b6b] hover:bg-[#F5F5F4]"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border border-[#E2E2E2] bg-white">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#E2E2E2] bg-[#FAFAFA] text-xs uppercase tracking-wider text-[#8a8a8a]">
                <th className="px-4 py-3">Prénom</th>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Téléphone</th>
                <th className="px-4 py-3">Profil</th>
                <th className="px-4 py-3">Newsletter</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading && !leads.length ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[#8a8a8a]">
                    Chargement…
                  </td>
                </tr>
              ) : !leads.length ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[#8a8a8a]">
                    Aucune inscription pour le moment.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-[#F0F0F0] last:border-0 hover:bg-[#FAFAFA]">
                    <td className="px-4 py-3 font-medium text-[#1a1a1a]">{lead.firstName}</td>
                    <td className="px-4 py-3 text-[#1a1a1a]">{lead.lastName}</td>
                    <td className="px-4 py-3 text-[#4b4b4b]">{lead.email}</td>
                    <td className="px-4 py-3 text-[#4b4b4b]">{lead.phone}</td>
                    <td className="px-4 py-3 text-[#4b4b4b]">{lead.profile || "—"}</td>
                    <td className="px-4 py-3 text-[#4b4b4b]">{lead.newsletterOptIn ? "Oui" : "Non"}</td>
                    <td className="px-4 py-3">
                      <StatutBadge statut={lead.statut} />
                    </td>
                    <td className="px-4 py-3 text-[#8a8a8a]">{formatDate(lead.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
