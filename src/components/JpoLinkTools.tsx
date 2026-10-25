// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import { buildBrandedQrSvg, downloadQrPng, downloadQrSvg } from "../utils/brandedQr";

// Liens de suivi (UTM générées automatiquement) et QR codes, pour une page d'événement donnée.
// Utilisé par le dashboard JPO Nice ; reprend le fonctionnement du dashboard JPO Hélénite.

export const QUICK_LINKS = [
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

export const slug = (v) =>
  String(v || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

export function buildLink({ pageUrl, source, medium, campaign }) {
  const params = new URLSearchParams();
  if (source) params.set("utm_source", source);
  if (medium) params.set("utm_medium", medium);
  params.set("utm_campaign", campaign);
  return `${pageUrl}?${params.toString()}`;
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

// Fenêtre d'aperçu du QR code d'un lien, avec téléchargement PNG / SVG.
export function QrModal({ qr, onClose, filePrefix }) {
  const [busy, setBusy] = useState(false);
  const svg = useMemo(() => buildBrandedQrSvg(qr.url, 360).replace('width="360" height="360"', 'width="100%" height="100%"'), [qr.url]);
  const fileBase = `qr-${filePrefix}-${slug(qr.name) || "lien"}`;

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

// `Card` est passé en prop pour éviter une dépendance circulaire avec les pages de dashboard.
export function LinkGenerator({ Card, pageUrl, campaign: defaultCampaign, filePrefix, intro }) {
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("link");
  const [campaign, setCampaign] = useState(defaultCampaign);
  const [name, setName] = useState("");
  const [copied, setCopied] = useState("");
  const [qr, setQr] = useState(null);

  const finalSource = slug(name ? `${source || "commerciaux"}-${name}` : source);
  const customLink = finalSource ? buildLink({ pageUrl, source: finalSource, medium: slug(medium), campaign: slug(campaign) || defaultCampaign }) : "";

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
      <p className="mb-4 text-sm text-[#4B5563]">{intro}</p>

      <div className="mb-5 grid gap-2 md:grid-cols-2">
        {QUICK_LINKS.map((q) => {
          const url = buildLink({ pageUrl, source: q.source, medium: q.medium, campaign: defaultCampaign });
          return (
            <div key={q.label} className="flex items-center justify-between gap-3 rounded-lg border border-[#EDEEF1] px-3 py-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#031B17]">{q.label}</p>
                <p className="truncate text-[11px] text-[#8A8F98]" title={url}>{url}</p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button onClick={() => { setSource(q.source); setMedium(q.medium); }} className="rounded-md border border-[#E5E7EB] px-2 py-1 text-xs text-[#4B5563] hover:bg-[#F5F6F8]">Éditer</button>
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
      {qr && <QrModal qr={qr} onClose={() => setQr(null)} filePrefix={filePrefix} />}
    </Card>
  );
}
