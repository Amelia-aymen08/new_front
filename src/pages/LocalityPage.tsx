import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

// --- Types ---
type Project = {
  id: number;
  title: string;
  location: string;
  description: string;
  image: string;
};

// --- Mock Data ---
const LOCALITY_DATA = {
  title: "LA COMMUNE DE KOUBA",
  description: `Située sur les hauteurs d'Alger, la commune de Kouba séduit par son équilibre entre patrimoine, dynamisme et cadre de vie résidentiel avec une riche histoire marquée par des édifices emblématiques comme le Fort Ottoman et l’ancienne Église Saint-Vincent-de-Paul, elle abrite également le Palais de la Culture Moufdi Zakaria, haut lieu de la scène artistique algérienne Pour ceux en quête de nature, la Forêt de Kouba propose un espace vert idéal pour la détente et les activités en plein air qui est proche du parc zoologique de Ben Aknoun, du centre commercial de Bab Ezzouar et de plusieurs établissements d’enseignement supérieur, Kouba attire autant les familles que les investisseurs grâce à son cadre de vie harmonieux alliant modernité et commodités`,
};

const RESIDENCES: Project[] = [
  {
    id: 3,
    title: "RÉSIDENCE AZURITE",
    location: "Kouba, Alger",
    description: "Une résidence d'exception alliant architecture moderne et confort absolu, située au cœur de Kouba.",
    image: "/assets/projets/azurite.png",
  },
  {
    id: 6,
    title: "RÉSIDENCE AGATE",
    location: "Kouba, Alger",
    description: "Un havre de paix urbain offrant des appartements haut standing avec des finitions raffinées.",
    image: "/assets/projets/agate.png",
  },
  {
    id: 1, // Mock ID
    title: "RÉSIDENCE OPALE",
    location: "Kouba, Alger",
    description: "L'élégance au quotidien dans une résidence sécurisée, proche de toutes les commodités.",
    image: "/assets/projets/ametrine.png", // Placeholder pour Opale
  },
];

// --- Components ---

function LocationPinIcon() {
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" className="text-[#F7C66A]">
      <path d="M7 9.5C8.38071 9.5 9.5 8.38071 9.5 7C9.5 5.61929 8.38071 4.5 7 4.5C5.61929 4.5 4.5 5.61929 4.5 7C4.5 8.38071 5.61929 9.5 7 9.5Z" fill="currentColor"/>
      <path d="M7 0C3.13 0 0 3.13 0 7C0 12.25 7 18 7 18C7 18 14 12.25 14 7C14 3.13 10.87 0 7 0ZM7 10.5C5.07 10.5 3.5 8.93 3.5 7C3.5 5.07 5.07 3.5 7 3.5C8.93 3.5 10.5 5.07 10.5 7C10.5 8.93 8.93 10.5 7 10.5Z" fill="currentColor"/>
    </svg>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link 
      to={`/projet/${project.id}`}
      className="group relative flex h-full overflow-hidden rounded-lg bg-[#052620] shadow-lg transition hover:shadow-2xl animate-fadeInUp"
    >
      {/* Left Content */}
      <div className="flex flex-1 flex-col justify-between p-6 z-10">
        <div>
          <h3 className="mb-2 text-lg font-bold uppercase text-white leading-tight">
            {project.title}
          </h3>
          <div className="mb-4 flex items-center gap-2 text-xs text-white/80 font-medium">
            <LocationPinIcon />
            <span>{project.location}</span>
          </div>
          <p className="mb-6 text-[11px] leading-relaxed text-white/60 line-clamp-4">
            {project.description}
          </p>
        </div>
        <span className="w-fit text-xs font-bold uppercase tracking-widest text-[#F7C66A] transition hover:text-white border-b border-transparent hover:border-white pb-0.5">
          DÉCOUVRIR
        </span>
      </div>

      {/* Right Image (Cube effect) */}
      <div className="relative w-[45%] h-full">
         <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={project.image}
              alt={project.title}
              className="h-[120%] w-full object-contain object-center transition duration-700 group-hover:scale-105"
              style={{ filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.5))" }} 
              onError={(e) => {
                e.currentTarget.style.display = 'none'; // Hide if image fails
              }}
            />
         </div>
      </div>
    </Link>
  );
}

function MapMarker({ top, left, label }: { top: string; left: string; label?: string }) {
  return (
    <div className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10" style={{ top, left }}>
       {/* Google Maps Style Pin */}
       <div className="relative drop-shadow-xl hover:scale-110 transition-transform duration-300">
         <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M12 0C7.58 0 4 3.58 4 8C4 13.54 12 24 12 24C12 24 20 13.54 20 8C20 3.58 16.42 0 12 0Z" fill="#EA4335"/>
           <circle cx="12" cy="8" r="3.5" fill="white"/>
         </svg>
       </div>
       
       {/* Label (Always visible or on hover based on design, screenshot implies visible for main one) */}
       {label && (
         <div className="absolute left-full top-0 ml-2 bg-white px-3 py-1.5 rounded-lg text-[11px] font-bold text-[#333] shadow-lg whitespace-nowrap min-w-[120px] flex flex-col justify-center border border-gray-200">
           <span className="text-[#EA4335] leading-tight">{label}</span>
           <span className="text-[9px] text-gray-500 font-normal">Aymen Promotion...</span>
         </div>
       )}
    </div>
  );
}

export default function LocalityPage() {
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
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 md:px-10 z-10 flex flex-col items-center">
        {/* Container Titre plus étroit */}
        <div className="max-w-3xl text-center mb-16">
          {/* Titre style "Découvrez" - Beaucoup plus grand */}
          <div className="relative mb-0 leading-none">
             <span className="font-['PhotographSignature'] text-xl md:text-[10rem] text-[#F7C66A] relative z-10 block transform -rotate-3 leading-[0.6]">
               Découvrez
             </span>
          </div>
          
          {/* Titre Principal - Plus petit que Découvrez */}
          <h1 className="text-2xl md:text-4xl font-bold uppercase tracking-[0.2em] text-white drop-shadow-lg mt-6">
            {LOCALITY_DATA.title}
          </h1>
        </div>
          
        {/* Boîte de description plus large que le titre */}
        <div className="w-full max-w-6xl bg-gradient-to-b from-[#1F3A35]/80 to-[#0F2520]/90 backdrop-blur-md rounded-2xl p-8 md:p-14 border border-white/5 shadow-2xl">
           <p className="text-sm md:text-[17px] leading-8 text-gray-200 text-center font-light tracking-wide">
             {LOCALITY_DATA.description}
           </p>
        </div>
      </section>

      {/* Map Section */}
      <section className="px-4 md:px-10 mb-20">
        <div className="mx-auto max-w-7xl relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#052620]">
           {/* Map Image */}
           <img 
             src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Alger_centre_map.png/800px-Alger_centre_map.png"
             onError={(e) => {
               e.currentTarget.src = "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600";
             }}
             alt="Carte de Kouba, Alger" 
             className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.1]"
           />
           
           {/* Markers Simulation */}
           <MapMarker top="40%" left="45%" label="Résidence Azurite" />
           <MapMarker top="55%" left="52%" label="Résidence Agate" />
           <MapMarker top="35%" left="60%" label="Résidence Opale" />

           {/* Overlay Gradient */}
           <div className="absolute inset-0 bg-gradient-to-t from-[#031B17] via-transparent to-transparent pointer-events-none"></div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-4 md:px-10 pb-24">
        <div className="mx-auto max-w-7xl">
           <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
             {RESIDENCES.map((project, idx) => (
               <ProjectCard key={idx} project={project} />
             ))}
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
