import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { LOCALITIES, PROJECTS as MOCK_PROJECTS, Project, Locality } from "../data/mockData";
import { MapContainer, TileLayer, Marker, useMap, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { fetchProjects } from "../services/projectService";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom Icon (Red Pin)
const createCustomIcon = (isSelected: boolean) => {
    return L.divIcon({
        html: `
         <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.5)); transform: translate(-50%, -100%); transition: transform 0.2s;">
           <path d="M12 0C7.58 0 4 3.58 4 8C4 13.54 12 24 12 24C12 24 20 13.54 20 8C20 3.58 16.42 0 12 0Z" fill="${isSelected ? '#EA4335' : '#F7C66A'}"/>
           <circle cx="12" cy="8" r="3.5" fill="white"/>
         </svg>
        `,
        className: "", // Remove default class to avoid square box
        iconSize: [40, 40],
        iconAnchor: [20, 40], // Tip of the pin
    });
};

// Component to recenter map when selected project changes
function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
}


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

function MapCard({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [projects]);

  // Default center (Algiers) if no projects
  const centerPosition: [number, number] = selectedProject?.lat && selectedProject?.lng 
    ? [selectedProject.lat, selectedProject.lng] 
    : [36.7525, 3.0420];

  return (
    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#052620] flex flex-col md:flex-row">
      {/* Left: Map */}
      <div className="w-full md:w-2/3 h-full relative z-0">
         <MapContainer 
            center={centerPosition} 
            zoom={13} 
            style={{ width: '100%', height: '100%' }}
            scrollWheelZoom={false}
         >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {selectedProject?.lat && selectedProject?.lng && (
                <MapRecenter lat={selectedProject.lat} lng={selectedProject.lng} />
            )}
            
            {projects.map((p) => (
               p.lat && p.lng && (
                   <Marker 
                     key={p.id} 
                     position={[p.lat, p.lng]} 
                     icon={createCustomIcon(selectedProject?.id === p.id)}
                     eventHandlers={{
                        click: () => setSelectedProject(p),
                     }}
                   >
                     <Tooltip direction="top" offset={[0, -40]} opacity={1} className="custom-tooltip">
                        <span className="font-bold text-[#052620] uppercase text-xs">{p.title}</span>
                     </Tooltip>
                   </Marker>
               )
            ))}
         </MapContainer>
      </div>

      {/* Right: Projects List (Cards) */}
       <div className="w-full md:w-1/3 bg-[#0F2520] flex flex-col relative z-10 shadow-[-10px_0_20px_rgba(0,0,0,0.2)] h-full border-l border-white/5">
          <div className="p-6 border-b border-white/10 bg-[#0F2520] z-20">
             <h3 className="text-lg font-bold text-[#F7C66A] uppercase tracking-wider">
               Projets ({projects.length})
             </h3>
             <p className="text-xs text-white/50 mt-1">Cliquez sur une carte pour localiser</p>
          </div>
         
         {/* Scrollable List of Cards */}
         <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
             {projects.map((p) => (
               <div 
                 key={p.id}
                 onClick={() => setSelectedProject(p)}
                 className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col gap-3 group
                    ${selectedProject?.id === p.id 
                      ? "bg-[#0A2F25] border-[#F7C66A] shadow-lg scale-[1.02]" 
                      : "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10"
                    }`}
               >
                  {/* Top: Image & Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-xl bg-white/5 overflow-hidden flex-shrink-0 border border-white/10 relative">
                        <img src={p.image} alt={p.title} className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                        <h4 className={`text-sm font-bold uppercase leading-tight ${selectedProject?.id === p.id ? "text-white" : "text-white/90"}`}>
                        {p.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#F7C66A] font-medium mt-2">
                        <LocationPinIcon />
                        <span className="truncate">{p.location.split(',')[0]}</span>
                        </div>
                    </div>
                  </div>

                  {/* Bottom: Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
                     <Link 
                        to={`/projet/${p.id}`}
                        className="text-[10px] font-bold uppercase tracking-widest text-white/70 hover:text-[#F7C66A] transition-colors"
                     >
                        DÉCOUVRIR
                     </Link>
                     
                     {p.lat && p.lng ? (
                        <a 
                            href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold uppercase tracking-widest text-[#F7C66A] hover:text-white transition-colors flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span>ITINÉRAIRE</span>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </a>
                     ) : (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 cursor-not-allowed">
                            ITINÉRAIRE
                        </span>
                     )}
                  </div>
               </div>
             ))}
         </div>
      </div>
    </div>
  );
}

export default function LocalityPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dbProjects, setDbProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch projects from API
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        if (data && data.length > 0) {
           // Map API data to component Project type
           const mappedProjects: Project[] = data.map(p => ({
             id: p.id,
             title: p.title,
             location: p.address || "", // API has 'address'
             description: p.description,
             image: p.coverImage ? `http://localhost:5000/${p.coverImage}` : "/assets/projets/cyanite.png", // Handle image path
             lat: p.latitude,
             lng: p.longitude,
             typology: p.type,
             isNightMode: false,
             status: "EN COURS" 
           }));
           setDbProjects(mappedProjects);
        } else {
           // Fallback to mock data if API empty/fails
           setDbProjects(MOCK_PROJECTS);
        }
      } catch (err) {
        console.error("Failed to load projects from DB, using mock data", err);
        setDbProjects(MOCK_PROJECTS);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const locality = useMemo(() => {
    return LOCALITIES.find((l) => l.id === Number(id));
  }, [id]);

  const localityProjects = useMemo(() => {
    if (!locality) return [];
    const mainName = locality.name.split(',')[0].trim().toUpperCase();
    // Use dbProjects instead of static PROJECTS
    return dbProjects.filter((p) => p.location.toUpperCase().includes(mainName));
  }, [locality, dbProjects]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!locality) {
    return (
        <div className="min-h-screen bg-[#031B17] flex items-center justify-center text-white">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Localité non trouvée</h1>
                <button onClick={() => navigate('/projets')} className="text-[#F7C66A] underline">Retour aux projets</button>
            </div>
        </div>
    );
  }

  // Format title for "LA COMMUNE DE ..."
  // locality.name is like "KOUBA, ALGER". We want "LA COMMUNE DE KOUBA"
  const cityOnly = locality.name.split(',')[0].trim();
  const displayTitle = isMobile ? `Découvrez la commune de ${cityOnly}` : `LA COMMUNE DE ${cityOnly}`;

  // Get mobile hero image path
  const mobileHeroImage = `/assets/locality-mobile/${cityOnly.toLowerCase().replace(/ /g, '-')}-mobile.png`;

  return (
    <div className="relative min-h-screen bg-[#031B17] font-['Montserrat'] text-white overflow-x-hidden">
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
      <section className={`relative w-full ${isMobile ? 'min-h-screen' : 'h-screen min-h-[800px] flex items-center pt-20'}`}>
         {/* Background Image (Hero) */}
         <div className={`absolute top-0 left-0 w-full z-0 ${isMobile ? 'h-[65vh]' : 'h-full'}`}>
             <img 
               src={isMobile ? mobileHeroImage : (locality.heroImage || locality.image)} 
               alt={locality.name}
               className="w-full h-full object-cover"
               onError={(e) => {
                   if (isMobile) e.currentTarget.src = locality.heroImage || locality.image;
               }}
             />
             {/* Dark Overlay Gradient */}
             <div className={`absolute inset-0 ${isMobile ? 'bg-gradient-to-t from-[#031B17] via-transparent to-transparent' : 'bg-gradient-to-r from-[#031B17]/90 via-[#031B17]/70 to-transparent'}`} />
         </div>

         <div className={`container mx-auto px-4 md:px-10 relative z-10 ${isMobile ? 'pt-[55vh] pb-20' : 'flex flex-col md:flex-row items-center h-full justify-center'}`}>
            {/* Left Text Content */}
            <div className={`w-full md:w-1/2 ${isMobile ? '' : 'pt-0'}`}>
                {!isMobile && (
                    <div className="relative mb-4">
                        <span className="font-['PhotographSignature'] text-5xl md:text-8xl text-[#F7C66A] block transform -rotate-2">
                        Nos Signatures
                        </span>
                        <span className="text-2xl md:text-4xl font-light text-white block uppercase tracking-widest mt-2">
                        RÉSIDENTIELLES À
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-wide text-white leading-tight mt-2">
                            {cityOnly}
                        </h1>
                    </div>
                )}
                
                {isMobile ? (
                    <>
                         {/* Mobile Layout */}
                         <div className="w-8 h-1 bg-white mb-4 rounded-full shadow-lg"></div>
                         <h1 className="text-3xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                            {displayTitle}
                         </h1>
                         <div className="relative">
                            {/* Description continues on background */}
                            <p className="text-sm leading-relaxed text-gray-200 font-light text-justify">
                                {locality.description}
                            </p>
                         </div>
                    </>
                ) : (
                    <>
                        <p className="text-sm md:text-base leading-relaxed text-gray-200 font-light max-w-xl text-justify mt-8">
                            {locality.description}
                        </p>
                    </>
                )}
            </div>

            {/* Right Side - Optional Building Overlay or Empty to let BG show */}
            <div className="w-full md:w-1/2 h-full relative hidden md:block">
            </div>
         </div>
      </section>

      {/* Map & Featured Project Section */}
      <section className="px-4 md:px-10 py-20 relative z-10 -mt-20">
         <div className="container mx-auto">
             <MapCard projects={localityProjects} />
         </div>
      </section>

      <Footer />
    </div>
  );
}