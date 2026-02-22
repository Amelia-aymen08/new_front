import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_BASE_URL } from '../config';

const positions = [
  {
    id: 1,
    title: "Architecte Senior",
    department: "Design & Conception",
    location: "Alger, Algérie",
    type: "Temps plein",
    description: "Nous recherchons un architecte expérimenté pour diriger nos projets de conception résidentielle haut de gamme."
  },
  {
    id: 2,
    title: "Chef de Projet Construction",
    department: "Opérations",
    location: "Oran, Algérie",
    type: "Temps plein",
    description: "Superviser la réalisation de nos chantiers en assurant le respect des délais, du budget et de la qualité."
  },
  {
    id: 3,
    title: "Conseiller Commercial Immobilier",
    department: "Ventes",
    location: "Alger, Algérie",
    type: "Temps plein",
    description: "Développer notre portefeuille clients et accompagner les acquéreurs dans leur projet immobilier."
  }
];

const CareersPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    message: ''
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const data = new FormData();
      data.append('firstName', formData.firstName);
      data.append('lastName', formData.lastName);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('position', formData.position);
      data.append('message', formData.message);
      if (cvFile) {
        data.append('cv', cvFile);
      }

      const response = await fetch(`${API_BASE_URL}/api/candidates`, {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        setStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          position: '',
          message: ''
        });
        setCvFile(null);
        // Reset file input manually if needed, or rely on key change
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Une erreur est survenue.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'envoi.');
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Montserrat']">
      <Header className="absolute top-0 left-0 z-40 w-full" logoSrc="/logo_original.svg" />
      
      {/* Hero Section */}
      <div className="relative py-32 bg-[#031B17] text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="/contact_hero.png" // Using existing image
            alt="Bureau moderne" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 pt-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif mb-6">Rejoignez l'Excellence</h1>
            <p className="text-xl text-gray-300 mb-8 font-light">
              Participez à la création de cadres de vie exceptionnels et construisez votre carrière au sein d'une équipe passionnée.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Open Positions */}
          <div>
            <h2 className="text-3xl font-serif text-[#031B17] mb-8">Postes Ouverts</h2>
            <div className="space-y-6">
              {positions.map((position) => (
                <div key={position.id} className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{position.title}</h3>
                      <p className="text-[#F7C66A] font-medium">{position.department}</p>
                    </div>
                    <span className="bg-[#031B17]/10 text-[#031B17] text-xs px-3 py-1 rounded-full font-bold">
                      {position.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">{position.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <i className="fa-solid fa-location-dot w-3 h-3 text-center"></i>
                      {position.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <i className="fa-solid fa-clock w-3 h-3 text-center"></i>
                      Publié il y a 2 jours
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setFormData({...formData, position: position.title});
                      document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-[#031B17] font-bold hover:text-[#F7C66A] flex items-center gap-2 text-sm uppercase tracking-wider transition-colors"
                  >
                    Postuler <i className="fa-solid fa-arrow-right w-3 h-3 text-center"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Application Form */}
          <div id="application-form" className="bg-white p-8 rounded-xl shadow-xl border border-gray-100 h-fit sticky top-24">
            <h2 className="text-2xl font-serif text-[#031B17] mb-2">Candidature Spontanée</h2>
            <p className="text-gray-600 mb-6 text-sm">Vous ne trouvez pas le poste idéal ? Envoyez-nous votre candidature.</p>
            
            {status === 'success' ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <i className="fa-solid fa-circle-check w-12 h-12 text-green-500 mx-auto mb-4 text-5xl flex items-center justify-center"></i>
                <h3 className="text-xl font-medium text-green-800 mb-2">Candidature envoyée !</h3>
                <p className="text-green-600 mb-4 text-sm">
                  Merci de votre intérêt. Notre équipe RH examinera votre profil et vous recontactera si une opportunité correspond à vos compétences.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-bold uppercase"
                >
                  Envoyer une autre candidature
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Prénom</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F7C66A] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nom</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F7C66A] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F7C66A] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Téléphone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F7C66A] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Poste visé</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="ex: Architecte, Commercial..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F7C66A] focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CV (PDF, Word)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#F7C66A] transition-colors cursor-pointer relative group">
                    <input
                      type="file"
                      name="cv"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="space-y-1 text-center">
                      <i className="fa-solid fa-cloud-arrow-up mx-auto h-12 w-12 text-gray-400 group-hover:text-[#F7C66A] transition-colors text-5xl flex items-center justify-center"></i>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <span className="font-medium text-[#031B17] hover:text-[#F7C66A]">
                          {cvFile ? cvFile.name : "Téléchargez un fichier"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">PDF ou Word jusqu'à 10MB</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F7C66A] focus:border-transparent outline-none transition-all"
                    placeholder="Parlez-nous de vos motivations..."
                  ></textarea>
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                    <i className="fa-solid fa-circle-exclamation w-4 h-4 flex-shrink-0 flex items-center justify-center"></i>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-[#F7C66A] text-[#031B17] py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-[#031B17] hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                >
                  {status === 'submitting' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#031B17] border-t-transparent"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane w-4 h-4 flex items-center justify-center"></i>
                      Envoyer ma candidature
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CareersPage;
