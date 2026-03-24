import React, { useEffect, useMemo, useState } from "react";

type HubspotFormProps = {
  formId?: string;
  portalId?: string;
  region?: string;
  className?: string;
};

let formsShellPromise: Promise<void> | null = null;

function loadHubspotFormsShell() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.hbspt?.forms?.create) return Promise.resolve();

  if (formsShellPromise) return formsShellPromise;

  formsShellPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector('script[data-hubspot-forms-shell="true"]') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load HubSpot forms shell")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.hsforms.net/forms/shell.js";
    script.async = true;
    script.defer = true;
    script.setAttribute("data-hubspot-forms-shell", "true");
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("Failed to load HubSpot forms shell")), { once: true });
    document.body.appendChild(script);
  });

  return formsShellPromise;
}

export default function HubspotForm({
  formId,
  portalId = "39983056",
  region = "na1",
  className,
}: HubspotFormProps) {
  const targetId = useMemo(() => `hubspot-form-${Math.random().toString(36).slice(2)}`, []);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!formId) return;

    let cancelled = false;

    loadHubspotFormsShell()
      .then(() => {
        if (cancelled) return;
        if (!window.hbspt?.forms?.create) return;

        const target = `#${targetId}`;
        const el = document.querySelector(target);
        if (!el) return;
        (el as HTMLElement).innerHTML = "";

        window.hbspt.forms.create({
          region,
          portalId,
          formId,
          target,
        });
        setReady(true);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [formId, portalId, region, targetId]);

  if (!formId) return null;

  return <div id={targetId} className={className} data-ready={ready ? "true" : "false"} />;
}

