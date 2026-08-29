// Suivi des arrivées via QR code / liens tracés (flyers, bâches BATIMAT, ...).
//
// Deux modes :
//
//  1. EXPLICITE — le QR encode une URL avec paramètre  ?qr=<campagne>
//     (ou des UTM standard : ?utm_source=flyer&utm_medium=qr&utm_campaign=...).
//     Fiable. À utiliser pour toute nouvelle campagne.
//
//  2. HEURISTIQUE — pour les QR déjà imprimés, figés sur des URLs nues
//     (flyer -> "/", bâche BATIMAT -> "/batimat"). On ne peut pas ajouter de
//     paramètre : on déduit le scan de la signature d'arrivée :
//       page d'entrée de session + appareil mobile + aucun référent.
//     -> Très fiable pour "/batimat" (page profonde, ~0 trafic direct).
//     -> Approximatif pour "/" (la home reçoit aussi des accès directs :
//        URL tapée, favori, partage WhatsApp...). À lire comme une tendance /
//        un plafond, pas un compte exact.
//
// Dans les deux cas : 1 scan max par session et par campagne, et la campagne est
// mémorisée (localStorage, 90 j) pour l'attribuer à une conversion ultérieure.

import { API_BASE_URL } from "../config";

const VISITOR_KEY = "qr_visitor_id";
const ATTRIBUTION_KEY = "qr_attribution";
const SESSION_ENTERED_KEY = "qr_session_entered";
const ATTRIBUTION_TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 jours

// QR imprimés existants : chemin d'arrivée -> nom de campagne.
const PRINTED_QR = [
  { path: "/", campaign: "flyer" },
  { path: "/batimat", campaign: "batimat-bache" },
];

const AD_PARAM_KEYS = [
  "qr",
  "qr_campaign",
  "utm_source",
  "utm_campaign",
  "utm_medium",
  "gclid",
  "fbclid",
  "msclkid",
];

function safeLocal(fn, fallback) {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

function randomId() {
  try {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  } catch {
    /* noop */
  }
  return `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizePath(pathname) {
  const p = (pathname || "/").replace(/\/+$/, "");
  return p === "" ? "/" : p.toLowerCase();
}

function isMobileDevice() {
  try {
    if (navigator.userAgentData && navigator.userAgentData.mobile === true) return true;
  } catch {
    /* noop */
  }
  return /Android|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile|BlackBerry/i.test(
    navigator.userAgent || ""
  );
}

export function getVisitorId() {
  return safeLocal(() => {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = randomId();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  }, null);
}

// Retourne { qrCampaign, qrSource } si une attribution valide existe, sinon {}.
export function getAttribution() {
  const raw = safeLocal(() => localStorage.getItem(ATTRIBUTION_KEY), null);
  if (!raw) return {};
  try {
    const data = JSON.parse(raw);
    if (!data?.campaign) return {};
    if (data.landedAt && Date.now() - data.landedAt > ATTRIBUTION_TTL_MS) return {};
    return { qrCampaign: data.campaign, qrSource: data.source || null };
  } catch {
    return {};
  }
}

// Mode 1 : paramètre explicite dans l'URL.
function parseExplicitCampaign(search) {
  const params = new URLSearchParams(search || "");
  const qr = (params.get("qr") || params.get("qr_campaign") || "").trim().toLowerCase();
  const utmCampaign = (params.get("utm_campaign") || "").trim().toLowerCase();
  const utmSource = (params.get("utm_source") || "").trim().toLowerCase();
  const utmMedium = (params.get("utm_medium") || "").trim().toLowerCase();

  const campaign = qr || utmCampaign || utmSource;
  if (!campaign) return null;

  return {
    campaign: campaign.slice(0, 60),
    source: (utmSource || (qr ? "qr" : "")).slice(0, 60) || null,
    medium: (utmMedium || (qr ? "qr" : "")).slice(0, 60) || null,
    heuristic: false,
  };
}

// Mode 2 : déduction pour les QR imprimés figés (aucun paramètre possible).
function detectPrintedQrCampaign(isSessionEntry) {
  if (!isSessionEntry) return null; // navigation interne -> pas un scan

  const match = PRINTED_QR.find((c) => c.path === normalizePath(window.location.pathname));
  if (!match) return null;

  const params = new URLSearchParams(window.location.search || "");
  if (AD_PARAM_KEYS.some((k) => params.has(k))) return null; // déjà tracké autrement

  const ref = safeLocal(() => document.referrer, "") || "";
  const isDirect = ref === "" || ref.startsWith("android-app://");
  if (!isDirect) return null; // vient d'un moteur / réseau social / lien : pas un QR

  if (!isMobileDevice()) return null; // un QR imprimé se scanne au téléphone

  return { campaign: match.campaign, source: "print-qr", medium: "qr", heuristic: true };
}

// À appeler une fois au démarrage de l'app.
export function captureAttribution() {
  const isSessionEntry = !safeLocal(() => sessionStorage.getItem(SESSION_ENTERED_KEY), null);
  safeLocal(() => sessionStorage.setItem(SESSION_ENTERED_KEY, "1"));

  let info = null;
  try {
    info = parseExplicitCampaign(window.location.search) || detectPrintedQrCampaign(isSessionEntry);
  } catch {
    info = null;
  }
  if (!info) return;

  const visitorId = getVisitorId();
  const landingPath = safeLocal(() => window.location.pathname, "/") || "/";

  // Attribution "first touch" : on ne réécrit pas une campagne déjà mémorisée.
  const existing = getAttribution();
  if (!existing.qrCampaign) {
    safeLocal(() => {
      localStorage.setItem(
        ATTRIBUTION_KEY,
        JSON.stringify({
          campaign: info.campaign,
          source: info.source,
          path: landingPath,
          landedAt: Date.now(),
        })
      );
    });
  }

  // Un scan par session et par campagne (évite de compter les rechargements).
  const sessionFlag = `qr_scan_sent:${info.campaign}`;
  if (safeLocal(() => sessionStorage.getItem(sessionFlag), null)) return;
  safeLocal(() => sessionStorage.setItem(sessionFlag, "1"));

  // Événement GA / GTM (déjà en place sur le site).
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "qr_scan",
      qr_campaign: info.campaign,
      qr_source: info.source,
      qr_heuristic: info.heuristic,
    });
  } catch {
    /* noop */
  }

  try {
    fetch(`${API_BASE_URL}/api/track/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        campaign: info.campaign,
        source: info.source,
        medium: info.medium,
        landingPath,
        referrer: safeLocal(() => document.referrer, "") || null,
        visitorId,
        heuristic: info.heuristic,
      }),
    }).catch(() => {});
  } catch {
    /* noop */
  }
}
