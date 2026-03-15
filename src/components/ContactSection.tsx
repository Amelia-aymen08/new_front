import React, { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../config";

export default function ContactSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState(0); // 0 none, 1 bg, 2 panels, 3 content

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" });
  const [consent, setConsent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
        setStatus({ type: 'error', message: "Veuillez accepter le consentement." });
        return;
    }

    setLoading(true);
    setStatus({ type: null, message: "" });

    // Simulation d'envoi pour la présentation
    setTimeout(() => {
      setStatus({ 
        type: 'success', 
        message: "Message envoyé avec succès !" 
      });
      setFormData({ fullName: "", phone: "", email: "", message: "" });
      setConsent(false);
      setLoading(false);
    }, 1500);

    // Code réel pour le backend (commenté pour la présentation)
    /*
    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...formData,
            subject: "Contact Rapide (Section Contact)",
            type: "Contact Rapide"
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: "Message envoyé !" });
        setFormData({ fullName: "", phone: "", email: "", message: "" });
        setConsent(false);
      } else {
        setStatus({ type: 'error', message: data.message || "Erreur." });
      }
    } catch (error) {
      setStatus({ type: 'error', message: "Erreur serveur." });
    } finally {
      setLoading(false);
    }
    */
  };

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let fired = false;
    const fire = () => {
      if (fired) return;
      fired = true;
      setPhase(1);
    };

    const handleScroll = () => {
      const r = node.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // Trigger when the section is significantly visible (e.g., top enters the bottom 80% of viewport)
      if (r.top < vh * 0.8 && r.bottom > 0) fire();
    };

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fire();
          obs.disconnect();
          window.removeEventListener("scroll", handleScroll);
          window.removeEventListener("resize", handleScroll);
        }
      },
      { threshold: 0.2 }
    );

    obs.observe(node);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (phase !== 1) return;
    // Wait 2 seconds (zoom animation) before showing panels
    const t2 = setTimeout(() => setPhase(2), 2000);
    return () => clearTimeout(t2);
  }, [phase]);

  useEffect(() => {
    if (phase !== 2) return;
    // Content appears slowly after panels start closing
    const t3 = setTimeout(() => setPhase(3), 800);
    return () => clearTimeout(t3);
  }, [phase]);

  const bgVisible = phase >= 1;
  const panelsVisible = phase >= 2;
  const contentVisible = phase >= 3;

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden text-white mt-16"
      style={{ height: "85vh" }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/contact.png"
          alt=""
          className="h-full w-full origin-center transform object-cover transition-all ease-[cubic-bezier(0.22,0.61,0.36,1)]"
          style={{
            opacity: bgVisible ? 1 : 0,
            transform: bgVisible ? "scale(1.1)" : "scale(1)",
            transitionDuration: "2000ms", // 2 seconds zoom
          }}
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative grid h-full grid-cols-1 md:grid-cols-12">
        {/* LEFT PANEL */}
        <div
          className={`relative col-span-1 flex h-auto md:h-full bg-[#0C2A24] px-6 py-10 md:col-span-5 md:px-12 md:py-14 transition-all duration-[800ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
            panelsVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
          }`}
          style={{ willChange: "transform, opacity" }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
            style={{ backgroundImage: "url(/texture.png)", backgroundSize: "cover", backgroundPosition: "center" }}
          />

          <div
            className={`relative flex h-full w-full flex-col justify-start md:justify-center items-start md:items-end text-left md:text-right md:pr-12 transition-transform transition-opacity duration-[700ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ willChange: "transform, opacity" }}
          >
            {/* Logo hidden on mobile, visible on desktop if needed, but simplified here */}
            
            <div className="mb-8 md:mb-12 space-y-1 md:space-y-2">
              <div className="text-3xl md:text-4xl font-extrabold tracking-wide text-[#F7C66A] md:text-5xl">EXPRIMEZ</div>
              <div className="text-3xl md:text-4xl font-regular tracking-wide text-white md:text-5xl">VOTRE INTÉRÊT</div>
            </div>

          </div>

          <div className="pointer-events-none absolute inset-y-0 right-0 w-3 bg-gradient-to-r from-transparent to-black/30 md:w-4 hidden md:block" />
        </div>

        {/* RIGHT PANEL */}
        <div
          className={`relative col-span-1 flex h-full md:col-span-7 transition-all duration-[800ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
            panelsVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
          style={{ willChange: "transform, opacity" }}
        >
          <div className="absolute inset-0 bg-[#0C2A24] md:bg-gradient-to-r md:from-black/70 md:via-black/55 md:to-black/60 md:backdrop-blur-[3px]" />

          <div
            className={`relative z-10 flex h-full w-full items-start md:items-center justify-start px-6 pt-6 md:pl-12 md:pt-0 transition-transform transition-opacity duration-[800ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ willChange: "transform, opacity" }}
          >
            {status.type === 'success' ? (
              <div className="w-full max-w-xl py-10">
                <div className="bg-green-500/20 border border-green-500 rounded-lg p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-green-500/30 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-check text-4xl text-green-300"></i>
                  </div>
                  <h3 className="text-2xl font-medium text-green-300 mb-3">Message envoyé !</h3>
                  <p className="text-green-200 mb-6 text-base">
                    {status.message || "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais."}
                  </p>
                  <button 
                    onClick={() => setStatus({ type: null, message: "" })}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md text-sm"
                  >
                    Envoyer un nouveau message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full max-w-xl pb-10 md:pb-0">
                <div className="grid grid-cols-1 gap-6">
                    <label className="block">
                      <span className="mb-1 block text-xs md:text-sm text-white/60 uppercase tracking-wider">NOM</span>
                      <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          className="w-full border-0 border-b border-[#F7C66A]/50 bg-transparent py-2 text-white outline-none transition focus:border-[#F7C66A] placeholder:text-white/60"
                        />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs md:text-sm text-white/60 uppercase tracking-wider">TÉLÉPHONE</span>
                      <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full border-0 border-b border-[#F7C66A]/50 bg-transparent py-2 text-white outline-none transition focus:border-[#F7C66A] placeholder:text-white/60"
                        />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs md:text-sm text-white/60 uppercase tracking-wider">EMAIL</span>
                      <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full border-0 border-b border-[#F7C66A]/50 bg-transparent py-2 text-white outline-none transition focus:border-[#F7C66A] placeholder:text-white/60"
                        />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs md:text-sm text-white/60 uppercase tracking-wider">MESSAGE</span>
                      <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={2}
                          className="w-full border-0 border-b border-[#F7C66A]/50 bg-transparent py-2 text-white outline-none transition focus:border-[#F7C66A] placeholder:text-white/60 resize-none"
                        />
                    </label>
                </div>

                <div className="mt-6 mb-6">
                   <label className="flex items-start gap-2 cursor-pointer">
                      <input 
                          type="checkbox" 
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                          className="mt-1 w-3 h-3 accent-[#F7C66A] bg-transparent border-white/30 rounded" 
                      />
                      <span className="text-[10px] text-white/60 leading-tight">
                        CONSENTEMENT : J'accepte que mes données soient utilisées pour le traitement de ma demande en conformité avec la loi 18-07 révisée et compléter par la loi 11-25.
                      </span>
                   </label>
                </div>

                {status.type === 'error' && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-xs flex items-center gap-2">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    <span>{status.message}</span>
                  </div>
                )}

                <div className="mt-4 flex justify-start md:justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-full border border-[#F7C66A] px-8 py-3 text-xs md:text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-[#F7C66A] hover:text-black w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                        ENVOI...
                      </>
                    ) : (
                      'PRENDRE CONTACT'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}