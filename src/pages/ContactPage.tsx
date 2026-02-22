import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../config";

export default function ContactPage() {
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({ code: "+213", flag: "dz", name: "Algérie" });

  const countries = [
    { code: "+213", flag: "dz", name: "Algérie" },
    { code: "+33", flag: "fr", name: "France" },
    { code: "+1", flag: "ca", name: "Canada" },
    { code: "+1", flag: "us", name: "États-Unis" },
    { code: "+44", flag: "gb", name: "Royaume-Uni" },
    { code: "+971", flag: "ae", name: "Émirats arabes unis" },
    { code: "+216", flag: "tn", name: "Tunisie" },
    { code: "+212", flag: "ma", name: "Maroc" },
  ];

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });

    // Simulation d'envoi pour la présentation
    setTimeout(() => {
      setStatus({ 
        type: 'success', 
        message: "Votre message a été envoyé avec succès !" 
      });
      setFormData({ fullName: "", email: "", phone: "", subject: "", message: "", type: "" });
      setLoading(false);
    }, 1500);

    // Code réel pour le backend (commenté pour la présentation)
    /*
    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...formData,
            phone: `${selectedCountry.code} ${formData.phone}`
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: "Votre message a été envoyé avec succès !" });
        setFormData({ fullName: "", email: "", phone: "", subject: "", message: "", type: "" });
      } else {
        setStatus({ type: 'error', message: data.message || "Une erreur est survenue." });
      }
    } catch (error) {
      setStatus({ type: 'error', message: "Impossible de contacter le serveur." });
    } finally {
      setLoading(false);
    }
    */
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#031B17] font-['Montserrat'] text-white overflow-hidden">
      {/* Background Texture & Lights */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(21,105,83,0.3),transparent_70%)]" />
        <div className="absolute top-[40%] right-[-10%] w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(225,187,127,0.1),transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{ 
          backgroundImage: 'url("/texture.png")', 
          backgroundSize: '1200px', 
          backgroundRepeat: 'repeat' 
        }} />
      </div>

      <Header className="absolute top-0 left-0 z-40 w-full" />

      {/* Hero Section with Form */}
      <section className="relative w-full min-h-screen flex flex-col items-center pt-32 pb-20">
        {/* Background Image - Absolute */}
        <div className="absolute top-0 left-0 w-full h-[60vh] md:h-[70vh] z-0">
          <img 
            src="/contact_hero.png" 
            alt="Contact Hero" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-[#031B17]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl px-4 md:px-0 mt-80 md:mt-[30rem]">
          {/* Form Container */}
          <motion.div 
            className="bg-[#0C2A24]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-10">
              <span className="font-['PhotographSignature'] text-5xl md:text-6xl text-white block mb-2">
                N'hésitez Pas
              </span>
              <h1 className="text-2xl md:text-3xl font-light uppercase tracking-widest text-white">
                à nous <span className="font-bold">CONTACTER</span>
              </h1>
            </div>

            {status.type === 'success' ? (
              <div className="bg-green-500/20 border border-green-500 rounded-lg p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-8 bg-green-500/30 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-check text-5xl text-green-300"></i>
                </div>
                <h3 className="text-3xl font-medium text-green-300 mb-4">Message envoyé !</h3>
                <p className="text-green-200 mb-8 text-lg">
                  {status.message || "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais."}
                </p>
                <button 
                  onClick={() => setStatus({ type: null, message: "" })}
                  className="bg-green-600 text-white px-10 py-4 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md text-lg"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-gray-300">Nom et Prénom* :</label>
                    <input required name="fullName" value={formData.fullName} onChange={handleChange} type="text" className="w-full bg-transparent border-b border-white/30 py-2 focus:border-[#F7C66A] outline-none transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-gray-300">Email* :</label>
                    <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full bg-transparent border-b border-white/30 py-2 focus:border-[#F7C66A] outline-none transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-gray-300">Téléphone* :</label>
                    <div className="flex items-center gap-2 border-b border-white/30 py-2 transition-colors focus-within:border-[#F7C66A]">
                      <div className="relative">
                        <button 
                          type="button"
                          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                          className="flex items-center gap-1 pr-2 border-r border-white/30 hover:bg-white/5 rounded px-1 transition-colors"
                        >
                          <img src={`https://flagcdn.com/w20/${selectedCountry.flag}.png`} alt={selectedCountry.name} className="h-4 w-6 object-cover rounded-[2px]" />
                          <span className="text-white text-sm">{selectedCountry.code}</span>
                          <i className={`fa-solid fa-caret-down text-[10px] text-white/70 ml-1 transition-transform ${showCountryDropdown ? "rotate-180" : ""}`}></i>
                        </button>
                        
                        {showCountryDropdown && (
                          <div className="absolute top-full left-0 mt-2 w-48 max-h-60 overflow-y-auto bg-[#0C2A24] border border-white/10 rounded-lg shadow-xl z-50">
                            {countries.map((country) => (
                              <button
                                key={`${country.flag}-${country.code}`}
                                type="button"
                                onClick={() => {
                                  setSelectedCountry(country);
                                  setShowCountryDropdown(false);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/10 transition-colors text-left"
                              >
                                <img src={`https://flagcdn.com/w20/${country.flag}.png`} alt={country.name} className="h-4 w-6 object-cover rounded-[2px]" />
                                <span className="text-white text-sm">{country.name}</span>
                                <span className="text-white/50 text-xs ml-auto">{country.code}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full bg-transparent text-white outline-none placeholder:text-white/60 pl-2" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-gray-300">Objet* :</label>
                    <input required name="subject" value={formData.subject} onChange={handleChange} type="text" className="w-full bg-transparent border border-white/30 rounded-lg px-4 py-2 focus:border-[#F7C66A] outline-none transition-colors" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-gray-300">MESSAGE* :</label>
                  <textarea required name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full bg-transparent border border-white/30 rounded-lg px-4 py-2 focus:border-[#F7C66A] outline-none transition-colors resize-none"></textarea>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-gray-300">TYPE DE DEMANDE * :</label>
                  <div className="relative">
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-transparent border border-white/30 rounded-lg px-4 py-3 appearance-none focus:border-[#F7C66A] outline-none transition-colors cursor-pointer text-white">
                      <option className="bg-[#0C2A24]" value="">-- Choisir un type --</option>
                      <option className="bg-[#0C2A24]" value="Information">Information</option>
                      <option className="bg-[#0C2A24]" value="Devis">Devis</option>
                      <option className="bg-[#0C2A24]" value="Réclamation">Réclamation</option>
                      <option className="bg-[#0C2A24]" value="Demande d'emploi">Demande d'emploi</option>
                      <option className="bg-[#0C2A24]" value="Offre de service">Offre de service</option>
                      <option className="bg-[#0C2A24]" value="Vente de terrain">Vente de terrain</option>
                      <option className="bg-[#0C2A24]" value="Autres">Autres</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-gray-300">PIÈCE JOINTE</label>
                  <div className="flex items-center justify-between border-b border-white/30 py-2">
                    <span className="text-sm text-gray-400 italic">Aucun fichier sélectionné</span>
                    <label className="cursor-pointer bg-[#F7C66A] text-[#031B17] px-4 py-1 rounded-full text-xs font-bold uppercase hover:bg-white transition-colors">
                      CHOISIR UN FICHIER
                      <input type="file" className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="flex items-start gap-3 mt-4">
                  <input required type="checkbox" id="terms" className="mt-1 accent-[#F7C66A]" />
                  <label htmlFor="terms" className="text-xs text-gray-300 leading-relaxed">
                    CONSENTEMENT : J'accepte que mes données soient utilisées pour le traitement de ma demande en conformité avec la loi 18-07 révisée et compléter par la loi 11-25.
                  </label>
                </div>

                {status.type === 'error' && (
                  <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-circle-exclamation"></i>
                      <span>{status.message}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-center mt-8">
                  <button disabled={loading} type="submit" className="bg-[#F7C66A] text-[#031B17] px-10 py-3 rounded-md font-bold uppercase tracking-wider hover:bg-white transition-colors shadow-lg shadow-[#F7C66A]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[200px]">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#031B17] border-t-transparent"></div>
                        ENVOI EN COURS...
                      </>
                    ) : (
                      'PRENDRE CONTACT'
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>

        {/* Info Cards */}
        <div className="relative z-10 w-full max-w-6xl px-4 md:px-10 mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#15332D] rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-2 border border-white/5 hover:border-[#F7C66A]/50 transition-colors group">
              <div className="w-10 h-10 mb-2 flex items-center justify-center text-white group-hover:text-[#F7C66A] transition-colors">
                <i className="fa-solid fa-phone text-2xl"></i>
              </div>
              <h3 className="text-white font-bold uppercase tracking-wider">TÉLÉPHONE</h3>
              <p className="text-gray-300 text-sm font-light">+213 560 58 29 59</p>
            </div>

            <div className="bg-[#15332D] rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-2 border border-white/5 hover:border-[#F7C66A]/50 transition-colors group">
              <div className="w-10 h-10 mb-2 flex items-center justify-center text-white group-hover:text-[#F7C66A] transition-colors">
                <i className="fa-solid fa-envelope text-2xl"></i>
              </div>
              <h3 className="text-white font-bold uppercase tracking-wider">EMAIL</h3>
              <p className="text-gray-300 text-sm font-light">contact@aymenpromotion.com</p>
            </div>

            <div className="bg-[#15332D] rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-2 border border-white/5 hover:border-[#F7C66A]/50 transition-colors group">
              <div className="w-10 h-10 mb-2 flex items-center justify-center text-white group-hover:text-[#F7C66A] transition-colors">
                <i className="fa-solid fa-location-dot text-2xl"></i>
              </div>
              <h3 className="text-white font-bold uppercase tracking-wider">ADRESSE</h3>
              <p className="text-gray-300 text-sm font-light">Ilot N 52 Section 05,<br/>Bir Mourad Rais, Alger 16000</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-20 px-4 md:px-10 max-w-7xl mx-auto">
         <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold uppercase text-[#F7C66A] tracking-wide">
              Foire Aux Questions
            </h2>
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto font-light">
              Retrouvez les réponses aux questions les plus fréquentes sur nos projets et nos services.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Sidebar Categories */}
             <div className="md:col-span-4 space-y-2">
                {["Avant l'achat : Informations générales", "Paiement & Financement", "Personnalisation & Équipements", "Gestion & Copropriété", "Suivi & Livraison", "Autres questions fréquentes"].map((cat, idx) => (
                   <button 
                     key={idx}
                     className={`w-full text-left p-4 rounded-lg transition-all ${idx === 0 ? "bg-[#F7C66A] text-[#031B17] font-bold" : "bg-[#0C2A24] text-white/70 hover:bg-[#15332D]"}`}
                   >
                     {cat}
                   </button>
                ))}
             </div>

            {/* Accordion Content */}
            <div className="md:col-span-8 space-y-4">
               {/* Active Item */}
               <div className="bg-[#0C2A24] rounded-xl border border-white/5 overflow-hidden">
                  <div className="bg-[#F7C66A] p-6 flex justify-between items-center cursor-pointer">
                     <h3 className="text-[#031B17] font-bold text-lg">Tout savoir avant de vous engager</h3>
                     <i className="fa-solid fa-minus text-[#031B17]"></i>
                  </div>
                  <div className="p-6 border-l-4 border-[#F7C66A] bg-[#0C2A24]">
                     <p className="text-gray-300 leading-relaxed font-light text-sm">
                        En choisissant Aymen Promotion, vous investissez dans un logement haut standing conçu avec des matériaux de qualité, dans des emplacements stratégiques à Alger, avec un accompagnement personnalisé du premier contact jusqu'à la remise des clés.
                     </p>
                  </div>
               </div>

               {/* Collapsed Items */}
               {["Comment réserver un appartement ?", "Puis-je visiter un appartement témoin ?"].map((q, idx) => (
                  <div key={idx} className="bg-[#0C2A24] rounded-xl border border-white/5 overflow-hidden">
                     <div className="p-6 flex justify-between items-center cursor-pointer hover:bg-[#15332D] transition-colors">
                        <h3 className="text-white font-bold text-lg">{q}</h3>
                        <i className="fa-solid fa-plus text-white"></i>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Map Section */}
      <section className="w-full h-[400px] md:h-[500px] relative z-10 mb-20 max-w-7xl mx-auto px-4 md:px-0">
        <div className="w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.6958189670557!2d3.0561571764495535!3d36.73124037931669!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fb26046467c6d%3A0x673412590212009!2sAymen%20Promotion%20Immobili%C3%A8re!5e0!3m2!1sfr!2sdz!4v1707920000000!5m2!1sfr!2sdz"
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Map Location"
            className="opacity-90 hover:opacity-100 transition-opacity duration-500"
          ></iframe>
        </div>
        
        {/* Map Overlay Card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:left-10 bg-[#0C2A24] p-5 rounded-xl shadow-xl max-w-xs border border-white/10 w-[90%] md:w-auto">
           <div className="flex items-start gap-4">
              <div className="text-[#F7C66A] mt-1"><i className="fa-solid fa-location-dot text-2xl"></i></div>
              <div>
                 <h4 className="text-white font-bold text-sm mb-1">Aymen Promotion Immobilière</h4>
                 <p className="text-white/70 text-xs mb-3">Siège commercial, Said Hamdine, Alger</p>
                 <a 
                   href="https://www.google.com/maps/dir//Aymen+Promotion+Immobili%C3%A8re,+Said+Hamdine+ilot+N+52+section+05,+Bir+Mourad+Ra%C3%AFs+16000/@36.7312404,3.0561572,17z" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-[#F7C66A] text-xs font-bold uppercase tracking-wider hover:underline flex items-center gap-2"
                 >
                   Itinéraire
                   <i className="fa-solid fa-arrow-right"></i>
                 </a>
              </div>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}