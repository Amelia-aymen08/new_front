import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { PROJECTS } from "../data/mockData";
import { 
  ReceptionIcon, 
  DomotiqueIcon, 
  ClimatisationIcon, 
  AbattoirIcon, 
  AireDeJeuxIcon 
} from "../components/icons/AmenityIcons";

// --- SVG Icons Map ---
const AMENITIES_ICONS: Record<string, React.ReactNode> = {
  "RECEPTION": <ReceptionIcon />,
  "DOMOTIQUE": <DomotiqueIcon />,
  "CLIMATISATION CENTRALISÉE": <ClimatisationIcon />,
  "ABATTOIR": <AbattoirIcon />,
  "AIRE DE JEUX": <AireDeJeuxIcon />,
  
  // Icônes génériques (utilisant FontAwesome par défaut)
  "PARKING SOUS-SOL": <i className="fa-solid fa-square-parking"></i>,
  "GARDIENNAGE 24/7": <i className="fa-solid fa-shield-halved"></i>,
  "CUISINE ÉQUIPÉE": <i className="fa-solid fa-kitchen-set"></i>,
  "VUE DÉGAGÉE": <i className="fa-solid fa-mountain"></i>,
  "ACCÈS AUTOROUTE": <i className="fa-solid fa-road"></i>,
  "ARCHITECTURE MODERNE": <i className="fa-solid fa-building"></i>,
  "ESPACES VERTS": <i className="fa-solid fa-tree"></i>
};

type ProjectData = {
  title: string;
  status: string;
  description: string;
  stats: {
    address: string;
    blocs: string;
    progress: string;
    typologie?: string;
    surface?: string;
  };
  heroImage: string;
  amenities: { label: string; svg?: React.ReactNode; icon?: string }[];
  gallery: string[];
  plans: { type: string; area: string; image: string }[];
  location: { mapUrl: string; description: string };
};

type Amenity = {
  label: string;
  svg?: React.ReactNode;
  icon?: string;
};
type Plan = ProjectData["plans"][0];
type LocationData = ProjectData["location"];

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const project = PROJECTS.find(p => p.id === Number(id));
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    if (project?.gallery) {
      setGalleryImages(project.gallery);
    }
  }, [project]);

  if (!project) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#031B17] text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#F7C66A]">Projet introuvable</h1>
          <p className="mt-4 text-lg">Le projet que vous cherchez n'existe pas ou a été déplacé.</p>
        </div>
      </div>
    );
  }

  // Trouver les valeurs spécifiques dans les détails
  const typologieDetail = project.details?.find(d => d.label.toLowerCase().includes("typologie"));
  const surfaceDetail = project.details?.find(d => d.label.toLowerCase().includes("surface"));
  const blocsDetail = project.details?.find(d => d.label === "Blocs");
  const avancementDetail = project.details?.find(d => d.label.toLowerCase().includes("avancement"));

  // Transform project data to component format
  const projectData: ProjectData = {
    title: `RÉSIDENCE ${project.title}`,
    status: project.status === "EN COURS" ? "EN COURS DE RÉALISATION" : "PROJET TERMINÉ",
    description: project.fullDescription || project.description,
    stats: {
      address: project.location.split(',')[0].trim(), // Prend seulement la ville (ex: "Kouba")
      blocs: blocsDetail?.value || "01",
      progress: avancementDetail?.value || (project.status === "EN COURS" ? "01 %" : "100 %"),
      typologie: typologieDetail?.value,
      surface: surfaceDetail?.value,
    },
    heroImage: project.coverImage || project.image,
    amenities: (project.features || []).map(f => ({
      label: f,
      svg: AMENITIES_ICONS[f] || undefined,
      icon: !AMENITIES_ICONS[f] ? "fa-solid fa-check" : undefined
    })),
    gallery: galleryImages,
    plans: (project.plans || []).map(p => ({
        type: p.type, // Maintenant on utilise p.type car c'est la structure dans mockData
        area: p.area,
        image: p.image
    })),
    location: {
      mapUrl: `https://www.google.com/maps/search/?api=1&query=${project.lat || 36.7},${project.lng || 3.0}`,
      description: project.location
    }
  };

  return (
    <div className="relative min-h-screen bg-[#031B17] text-white font-['Montserrat']">
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
      
      <div className="relative z-10">
        <Header className="absolute top-0 left-0 z-40 w-full" />
        
        <FadeInSection>
          <DetailsHero data={projectData} />
        </FadeInSection>
        
        {projectData.amenities.length > 0 && (
          <FadeInSection delay={200}>
            <AmenitiesList amenities={projectData.amenities} />
          </FadeInSection>
        )}
        
        {projectData.gallery.length > 0 && (
          <FadeInSection delay={300}>
            <ProjectGallery images={projectData.gallery} />
          </FadeInSection>
        )}
        
        {projectData.plans.length > 0 && (
          <FadeInSection delay={400}>
            <PlansAndLocation plans={projectData.plans} location={projectData.location} />
          </FadeInSection>
        )}
        
        <FadeInSection delay={500}>
          <DetailsContact projectTitle={project.title} />
        </FadeInSection>
        
        <Footer />
      </div>
    </div>
  );
}

// --- Sub-components ---

function DetailsHero({ data }: { data: ProjectData }) {
  // Extract just the name if title is "RÉSIDENCE NAME"
  const projectName = data.title.replace("RÉSIDENCE ", "");

  return (
    <section className="w-full px-4 pt-40 pb-20 md:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-20">
          
          {/* Left Content */}
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <span className="text-2xl font-light text-white/90">Résidence</span>
              <h1 className="font-['PhotographSignature'] text-6xl md:text-8xl text-[#F7C66A] transform -rotate-2 origin-left leading-[1.2] lg:leading-[1.1] py-2">
                {projectName.charAt(0) + projectName.slice(1).toLowerCase()}
              </h1>
            </div>

            <p className="max-w-xl text-sm leading-relaxed text-white/80 md:text-base font-light">
              {data.description}
            </p>

            <div className="space-y-6">
              <p className="text-sm font-bold uppercase tracking-widest text-[#F7C66A]">
                {data.status}
              </p>

              <div className="flex flex-wrap gap-4">
                <StatBox label="Adresse" value={data.stats.address} />
                {data.stats.typologie && <StatBox label="Typologie" value={data.stats.typologie} />}
                {data.stats.surface && <StatBox label="Surface" value={data.stats.surface} />}
                <StatBox label="Blocs" value={data.stats.blocs} />
                <StatBox label="État d'avancement" value={data.stats.progress} />
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-[400px] w-full flex-1 overflow-hidden rounded-3xl md:h-[500px] shadow-2xl border border-white/10">
            <img
              src={data.heroImage}
              alt={data.title}
              className="h-full w-full object-cover"
            />
          </div>
          
        </div>
      </div>
    </section>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[140px] rounded-xl bg-[#2C4A44] px-6 py-4 border border-white/5 shadow-lg">
      <div className="text-[10px] font-medium text-white/70 uppercase tracking-wide mb-1">{label}</div>
      <div className="text-xl font-bold text-white">{value}</div>
    </div>
  );
}

function AmenitiesList({ amenities }: { amenities: Amenity[] }) {
  return (
    <section className="py-16 px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-10 md:gap-20">
        {amenities.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-4 text-center group">
            <div className="flex h-24 w-24 items-center justify-center text-4xl text-white transition-all duration-300 group-hover:scale-110 group-hover:text-[#F7C66A]">
               {/* Render SVG if available, otherwise fallback to Icon */}
               {item.svg ? (
                 <div className="h-full w-full [&>svg]:h-full [&>svg]:w-full [&>svg]:fill-current">
                   {item.svg}
                 </div>
               ) : (
                 <i className={item.icon}></i>
               )}
            </div>
            <span className="max-w-[120px] text-xs font-bold uppercase tracking-wider text-white">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  // Duplicate images to create a longer strip for scrolling effect
  const displayImages = [...images, ...images];

  useEffect(() => {
    const handleResize = () => {
      // Tailwind md breakpoint is 768px
      if (window.innerWidth >= 768) {
        setItemsPerView(3);
      } else {
        setItemsPerView(1);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const maxIndex = displayImages.length - itemsPerView;
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const maxIndex = displayImages.length - itemsPerView;
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  return (
    <section className="py-20 px-4 md:px-8">
       <div className="mx-auto max-w-7xl relative group">
         
         {/* Arrows */}
         <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 z-20 -translate-y-1/2 -translate-x-2 md:-translate-x-12 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#031B17] shadow-xl transition hover:scale-110 active:scale-95"
            aria-label="Previous slide"
         >
           <i className="fa-solid fa-chevron-left"></i>
         </button>

         <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 z-20 -translate-y-1/2 translate-x-2 md:translate-x-12 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#031B17] shadow-xl transition hover:scale-110 active:scale-95"
            aria-label="Next slide"
         >
           <i className="fa-solid fa-chevron-right"></i>
         </button>

         {/* Carousel Window */}
         <div className="overflow-hidden px-2 md:px-0">
           <div 
             className="flex transition-transform duration-500 ease-out"
             style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
           >
             {displayImages.map((img, idx) => (
               <div 
                 key={idx} 
                 className="flex-shrink-0 px-3"
                 style={{ width: `${100 / itemsPerView}%` }}
               >
                 <div className="overflow-hidden rounded-xl border border-white/10 shadow-lg group relative aspect-square">
                    <img 
                      src={img} 
                      alt={`Gallery ${idx}`} 
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                 </div>
               </div>
             ))}
           </div>
         </div>
       </div>
    </section>
  );
}

function PlansAndLocation({ plans, location }: { plans: Plan[]; location: LocationData }) {
  const [activeTab, setActiveTab] = useState(plans[0]?.type);
  
  if (!plans || plans.length === 0) return null;

  const currentPlan = plans.find(p => p.type === activeTab) || plans[0];

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-2">
      {/* Left: Typologies */}
      <div className="flex flex-col rounded-3xl bg-[#052620] p-8 shadow-2xl">
        <h2 className="mb-2 text-2xl font-bold uppercase tracking-wide">Typologies</h2>
        <p className="mb-8 text-[#F7C66A] font-bold">
          <span className="font-extrabold">{activeTab}</span> {currentPlan.area}
        </p>
        
        <div className="mb-8 flex-1 flex items-center justify-center">
           {/* Plan Image */}
           <img src={currentPlan.image} alt={activeTab} className="max-h-[500px] w-full object-contain filter invert opacity-90" />
        </div>

        <div className="flex flex-wrap gap-4">
          {plans.map((p) => (
            <button
              key={p.type}
              onClick={() => setActiveTab(p.type)}
              className={`rounded-full border px-8 py-3 text-sm font-bold uppercase transition-all
                ${activeTab === p.type 
                  ? "border-[#F7C66A] bg-[#F7C66A] text-[#031B17]" 
                  : "border-white/30 text-white hover:border-white"
                }
              `}
            >
              {p.type}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Localisation */}
      <div className="flex flex-col rounded-3xl bg-[#052620] p-8 shadow-2xl">
        <h2 className="mb-8 text-2xl font-bold uppercase tracking-wide">Localisation</h2>
        
        <a 
          href={location.mapUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative mb-6 aspect-square w-full overflow-hidden rounded-2xl bg-gray-800"
        >
           {/* Map Image Placeholder - using a dark map style image or generic placeholder */}
           <img 
             src="/sections/map-placeholder.png" 
             onError={(e) => {
               e.currentTarget.src = "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000"; // Fallback generic map image
             }}
             alt="Localisation" 
             className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40" 
           />
           
           {/* Overlay Button */}
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="flex items-center gap-3 rounded-full bg-[#F7C66A] px-6 py-3 text-[#031B17] shadow-lg transition-transform duration-300 group-hover:scale-105">
               <i className="fa-solid fa-location-dot text-lg"></i>
               <span className="font-bold uppercase tracking-wide text-sm">Voir sur la carte</span>
             </div>
           </div>
        </a>

        <p className="text-white/70 text-sm leading-relaxed text-center">
          {location.description}
        </p>
      </div>
    </section>
  );
}

function DetailsContact({ projectTitle }: { projectTitle?: string }) {
  const [formData, setFormData] = useState({
    email: "",
    lastName: "",
    firstName: "",
    phone: "",
    country: "",
    wilaya: "",
    budget: "",
    profession: "",
    financing: "",
    interest: "",
    locations: [] as string[],
    contactDays: [] as string[],
    contactTime: "",
    projectStatus: "",
    consent: false,
    sourceProject: projectTitle || "RÉSIDENCE AZURITE"
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        if (name === 'consent') {
            setFormData(prev => ({ ...prev, consent: checked }));
        }
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, arrayName: 'locations' | 'contactDays') => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const currentArray = prev[arrayName];
      if (checked) {
        return { ...prev, [arrayName]: [...currentArray, value] };
      } else {
        return { ...prev, [arrayName]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const response = await fetch("http://localhost:5000/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: "Votre demande de devis a été envoyée avec succès !" });
        setFormData({
            email: "",
            lastName: "",
            firstName: "",
            phone: "",
            country: "",
            wilaya: "",
            budget: "",
            profession: "",
            financing: "",
            interest: "",
            locations: [],
            contactDays: [],
            contactTime: "",
            projectStatus: "",
            consent: false,
            sourceProject: projectTitle || "RÉSIDENCE AZURITE"
        });
      } else {
        setStatus({ type: 'error', message: data.message || "Une erreur est survenue." });
      }
    } catch (error) {
      setStatus({ type: 'error', message: "Impossible de contacter le serveur." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="mb-12 text-3xl font-bold uppercase tracking-wide text-white">Devis</h2>
      
      <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-2">
        {/* Left Column - Personal & Project Info */}
        <div className="space-y-6">
           <InputGroup label="Email*" name="email" type="email" value={formData.email} onChange={handleChange} required />
           <div className="grid grid-cols-2 gap-4">
             <InputGroup label="Nom*" name="lastName" type="text" value={formData.lastName} onChange={handleChange} required />
             <InputGroup label="Prénom*" name="firstName" type="text" value={formData.firstName} onChange={handleChange} required />
           </div>
           
           {/* Phone */}
           <div className="border-b border-white/20 pt-4">
             <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 border-r border-white/20 pr-3">
                   <img src="https://flagcdn.com/w20/dz.png" alt="DZ" className="h-4 w-6 object-cover" />
                   <span className="text-white">+213</span>
                </div>
                <input 
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent py-2 text-white placeholder-white/50 focus:outline-none focus:placeholder-[#F7C66A] transition-colors" 
                  placeholder="Téléphone"
                />
             </div>
           </div>

           <SelectGroup label="Pays" name="country" value={formData.country} onChange={handleChange} options={["Algeria", "France", "Canada", "Autre"]} />
           <SelectGroup label="Wilaya *" name="wilaya" value={formData.wilaya} onChange={handleChange} options={["Alger", "Oran", "Constantine", "Autre"]} required />
           <SelectGroup label="Budget estimé *" name="budget" value={formData.budget} onChange={handleChange} options={["< 20M DA", "20M DA - 40M DA", "> 40M DA"]} required />
           <SelectGroup label="Secteur d'activité *" name="profession" value={formData.profession} onChange={handleChange} options={["Salarié", "Profession Libérale", "Commerçant", "Autre"]} required />
           <SelectGroup label="Type de financement *" name="financing" value={formData.financing} onChange={handleChange} options={["Fonds Propres", "Crédit Bancaire", "Mixte"]} required />
           <SelectGroup label="Intéressé par *" name="interest" value={formData.interest} onChange={handleChange} options={["Appartement", "Duplex", "Local Commercial", "Bureau"]} required />
        </div>

        {/* Right Column - Preferences */}
        <div className="space-y-8">
           {/* Localisation */}
           <div>
             <label className="mb-4 block text-sm font-bold uppercase text-[#F7C66A]">Localisation souhaitée</label>
             <div className="grid grid-cols-2 gap-y-3 sm:grid-cols-3">
                {["Hydra", "Dely Ibrahim", "Draria", "Ruisseau", "Birkhadem", "Bad Ezzouar", "El Achour", "Kouba", "Dar el Beida", "Chéraga", "Said Hamdine"].map(loc => (
                  <label key={loc} className="flex items-center gap-3 text-white/80 cursor-pointer hover:text-white">
                    <input 
                        type="checkbox" 
                        value={loc}
                        checked={formData.locations.includes(loc)}
                        onChange={(e) => handleArrayCheckboxChange(e, 'locations')}
                        className="h-4 w-4 rounded border-white/30 bg-transparent text-[#F7C66A] focus:ring-[#F7C66A]" 
                    />
                    <span className="text-sm">{loc}</span>
                  </label>
                ))}
             </div>
           </div>

           {/* Jours de contact */}
           <div>
             <label className="mb-4 block text-sm font-bold uppercase text-[#F7C66A]">Jours de contact préférés *</label>
             <div className="grid grid-cols-2 gap-y-3 sm:grid-cols-3">
                {["Samedi", "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi"].map(day => (
                  <label key={day} className="flex items-center gap-3 text-white/80 cursor-pointer hover:text-white">
                    <input 
                        type="checkbox" 
                        value={day}
                        checked={formData.contactDays.includes(day)}
                        onChange={(e) => handleArrayCheckboxChange(e, 'contactDays')}
                        className="h-4 w-4 rounded border-white/30 bg-transparent text-[#F7C66A] focus:ring-[#F7C66A]" 
                    />
                    <span className="text-sm">{day}</span>
                  </label>
                ))}
             </div>
           </div>

           <SelectGroup label="Heure de contact préférée" name="contactTime" value={formData.contactTime} onChange={handleChange} options={["Matin (9h-12h)", "Après-midi (13h-17h)", "Soir (17h-20h)"]} />
           <SelectGroup label="Statut du projet *" name="projectStatus" value={formData.projectStatus} onChange={handleChange} options={["Urgent", "Moyen terme", "Long terme"]} required />
        </div>

        {/* Bottom Full Width */}
        <div className="lg:col-span-2 pt-8 border-t border-white/10">
          <label className="flex items-start gap-3 text-sm text-white/60 cursor-pointer mb-8">
             <input 
                type="checkbox" 
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                required
                className="mt-1 h-4 w-4 rounded border-white/30 bg-transparent text-[#F7C66A]" 
             />
             <span className="leading-relaxed">CONSENTEMENT : J'accepte que mes données soient utilisées pour le traitement de ma demande en conformité avec la loi 18-07 révisée et compléter par la loi 11-25.</span>
          </label>
          
          {status.message && (
            <div className={`p-4 mb-4 rounded-md ${status.type === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
              {status.message}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-none border border-[#F7C66A] bg-[#F7C66A] py-4 text-sm font-bold uppercase tracking-widest text-[#031B17] transition hover:bg-transparent hover:text-[#F7C66A] disabled:opacity-50"
          >
             {loading ? 'ENVOI EN COURS...' : 'ENVOYER'}
          </button>
        </div>
      </form>
    </section>
  );
}

function InputGroup({ label, name, type, placeholder, value, onChange, required }: { label: string; name: string; type: string; placeholder?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean }) {
  const displayPlaceholder = placeholder || label;
  return (
    <div className="border-b border-white/20 pt-4">
      <input 
        type={type} 
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={displayPlaceholder}
        className="w-full bg-transparent py-2 text-white placeholder-white/50 focus:outline-none focus:placeholder-[#F7C66A] transition-colors" 
      />
    </div>
  );
}

function SelectGroup({ label, name, options, value, onChange, required }: { label: string; name: string; options: string[]; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; required?: boolean }) {
  return (
    <div className="relative border-b border-white/20 pt-4">
       <select 
         name={name}
         value={value}
         onChange={onChange}
         required={required}
         className="w-full appearance-none bg-transparent py-2 text-white/70 focus:text-white focus:outline-none [&>option]:bg-[#031B17]"
       >
          <option value="" disabled>{label}</option>
          {options.map(o => <option key={o} value={o} className="text-white">{o}</option>)}
       </select>
       <div className="pointer-events-none absolute right-0 top-1/2 mt-2 -translate-y-1/2 text-white/50">
         <i className="fa-solid fa-chevron-down text-xs"></i>
       </div>
    </div>
  );
}

function useOnScreen(ref: React.RefObject<HTMLElement>, rootMargin = "0px") {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, rootMargin]);
  return isIntersecting;
}

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref as React.RefObject<HTMLElement>);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}