// QR code « aux couleurs d'Aymen Promotion » : modules carrés noirs sur fond blanc, logo (toit rouge +
// cadre vert) au centre dans un carré blanc arrondi. Tout est généré en SVG (vectoriel) ; le PNG est
// obtenu en dessinant ce même SVG dans un canvas. Correction d'erreur « H » (30 %) : le logo masque
// ~5 % de la surface, le code reste lisible.
import QRCode from "qrcode";

const QUIET_ZONE = 4; // modules blancs autour (norme QR)
const LOGO_RATIO = 0.22; // côté du logo / côté du QR (sans la marge)

// Logo dessiné dans un repère 564 x 564 (carré blanc arrondi + icône).
const LOGO_SVG = `
<rect width="564" height="564" rx="72" fill="#fff"/>
<polygon points="45,137 283,47 521,137" fill="#D40C19"/>
<g fill="#00826F">
  <polygon points="112,157 410,157 462,203 112,203"/>
  <polygon points="418,215 465,215 465,442 418,490"/>
  <polygon points="112,445 407,445 407,492 158,492"/>
  <polygon points="112,265 158,237 158,392 112,435"/>
  <polygon points="168,233 372,233 392,274 168,274"/>
  <polygon points="346,290 392,290 392,380 346,412"/>
</g>
<polygon points="197,362 337,362 337,408 222,408" fill="#1A1A1A"/>`;

// Renvoie le SVG (chaîne) du QR code pour `text`. `size` = taille en px du SVG.
export function buildBrandedQrSvg(text, size = 1024) {
  const qr = QRCode.create(String(text), { errorCorrectionLevel: "H" });
  const n = qr.modules.size;
  const total = n + QUIET_ZONE * 2;

  // Une seule <path> : une bande par suite de modules noirs consécutifs d'une ligne.
  let d = "";
  for (let r = 0; r < n; r += 1) {
    let c = 0;
    while (c < n) {
      if (!qr.modules.get(r, c)) {
        c += 1;
        continue;
      }
      const start = c;
      while (c < n && qr.modules.get(r, c)) c += 1;
      d += `M${start + QUIET_ZONE} ${r + QUIET_ZONE}h${c - start}v1h-${c - start}z`;
    }
  }

  const logoSide = Math.round(n * LOGO_RATIO);
  const logoPos = (total - logoSide) / 2;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${total} ${total}">` +
    `<rect width="${total}" height="${total}" fill="#fff"/>` +
    `<path d="${d}" fill="#000" shape-rendering="crispEdges"/>` +
    `<g transform="translate(${logoPos} ${logoPos}) scale(${logoSide / 564})">${LOGO_SVG}</g>` +
    `</svg>`
  );
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadQrSvg(text, filename) {
  const svg = buildBrandedQrSvg(text, 1024);
  triggerDownload(new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${svg}`], { type: "image/svg+xml" }), filename);
}

// PNG 1600 x 1600 (impression nette en A5 / flyer).
export function downloadQrPng(text, filename, px = 1600) {
  return new Promise((resolve, reject) => {
    const svg = buildBrandedQrSvg(text, px);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = px;
      canvas.height = px;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, px, px);
      ctx.drawImage(img, 0, 0, px, px);
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("PNG indisponible"));
        triggerDownload(blob, filename);
        resolve();
      }, "image/png");
    };
    img.onerror = () => reject(new Error("QR illisible"));
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}
