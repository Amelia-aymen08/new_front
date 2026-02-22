  import React from "react";

export default function FloatingActions() {
  const items = [
    { label: "Téléphone", desc: "Appeler maintenant", icon: PhoneIcon },
    { label: "Écrire", desc: "WhatsApp / Email", icon: EditIcon },
    { label: "RDV", desc: "Planifier une visite", icon: CalendarIcon },
  ];

  return (
    <div className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 md:block">
      <div className="flex flex-col gap-3">
        {items.map((it, idx) => (
          <ActionPill key={it.label} item={it} idx={idx} />
        ))}
      </div>
    </div>
  );
}

function ActionPill({ item, idx }: { item: any; idx: number }) {
  return (
    <div className="group relative flex items-center justify-end">
      {/* Label */}
      <div
        className="
          pointer-events-none absolute right-full top-1/2 mr-3
          -translate-y-1/2 translate-x-[6px] opacity-0
          transition-all duration-300
          group-hover:translate-x-0 group-hover:opacity-100
        "
      >
        <div className="min-w-[220px] whitespace-nowrap rounded-lg bg-black/55 px-4 py-2 backdrop-blur-md ring-1 ring-white/15">
          <div className="text-sm font-semibold text-white/90 leading-none">{item.label}</div>
          <div className="mt-1 text-xs text-white/65 leading-none">{item.desc}</div>
        </div>
      </div>

      {/* Bouton rond + clignotement visible + blur simple */}
      <button
        type="button"
        aria-label={item.label}
        className="
          relative z-10 grid h-11 w-11 place-items-center rounded-full
          bg-white/10 backdrop-blur-md ring-1 ring-white/20
          transition hover:bg-white/15
        "
      >
        {/* Glow/attention (clignote) */}
        <span
          className="pointer-events-none absolute inset-0 rounded-full animate-attnBlink"
          style={{ animationDelay: `${idx * 220}ms` }}
        />
        <span className="text-white/90">
          <item.icon />
        </span>
      </button>
    </div>
  );
}

/* ------------------------ ICONS ------------------------ */

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/90">
      <path
        d="M6.6 10.8c1.4 2.7 3.6 4.9 6.3 6.3l2.1-2.1c.3-.3.8-.4 1.2-.2 1 .4 2 .6 3.1.6.7 0 1.2.5 1.2 1.2V20c0 .7-.5 1.2-1.2 1.2C10.5 21.2 2.8 13.5 2.8 4.8 2.8 4.1 3.3 3.6 4 3.6h3.3c.7 0 1.2.5 1.2 1.2 0 1.1.2 2.1.6 3.1.1.4 0 .9-.2 1.2L6.6 10.8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/90">
      <path d="M12 20h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/90">
      <path d="M7 3v3M17 3v3M4 8h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
