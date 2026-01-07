import React, { useState, useMemo, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useLocation } from "react-router-dom";

// --- Types & Mock Data ---

type Project = {
  id: number;
  title: string;
  location: string;
  description: string;
  image: string;
  typology?: string;
  status?: string;
};

type Locality = {
  id: number;
  name: string; // e.g. "Kouba, Alger"
  description: string;
  svgPath: string; // Placeholder for the map shape
};

// Augmented data to have 7+ items for the layout test
const PROJECTS: Project[] = [
  {
    id: 1,
    title: "RÉSIDENCE AGATE",
    location: "Oued Romane, Alger",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique pulvinar enim. Mauris ut mauris fringilla, vulputate..",
    image: "/projets/agate.png",
  },
  {
    id: 2,
    title: "RÉSIDENCE AMETRINE",
    location: "Said Hamdine, Alger",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique pulvinar enim. Mauris ut mauris fringilla, vulputate..",
    image: "/projets/ametrine.png",
  },
  {
    id: 3,
    title: "RÉSIDENCE AZURITE",
    location: "Kouba, Alger",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique pulvinar enim. Mauris ut mauris fringilla, vulputate..",
    image: "/projets/azurite.png",
  },
  {
    id: 4,
    title: "RÉSIDENCE CELESTINE",
    location: "Bab Ezzouar, Alger",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique pulvinar enim. Mauris ut mauris fringilla, vulputate..",
    image: "/projets/celestine.png",
  },
  {
    id: 5,
    title: "RÉSIDENCE CONALINE",
    location: "Hydra, Alger",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique pulvinar enim. Mauris ut mauris fringilla, vulputate..",
    image: "/projets/cornaline.png",
  },
  {
    id: 6,
    title: "RÉSIDENCE AZURITE",
    location: "Kouba, Alger",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique pulvinar enim. Mauris ut mauris fringilla, vulputate..",
    image: "/projets/azurite.png",
  },
  // Added 7th project to trigger the layout
  {
    id: 7,
    title: "RÉSIDENCE OPALE",
    location: "Draria, Alger",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique pulvinar enim. Mauris ut mauris fringilla, vulputate..",
    image: "/projets/cornaline.png",
  },
];

const LOCALITIES: Locality[] = [
  {
    id: 1,
    name: "Kouba, Alger",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique pulvinar enim. Mauris ut mauris fringilla, vulputate..",
    svgPath: "M10 10 H 90 V 90 H 10 Z",
  },
  {
    id: 2,
    name: "Kouba, Alger",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique pulvinar enim. Mauris ut mauris fringilla, vulputate..",
    svgPath: "M10 10 H 90 V 90 H 10 Z",
  },
  {
    id: 3,
    name: "Kouba, Alger",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique pulvinar enim. Mauris ut mauris fringilla, vulputate..",
    svgPath: "M10 10 H 90 V 90 H 10 Z",
  },
  {
    id: 4,
    name: "Kouba, Alger",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique pulvinar enim. Mauris ut mauris fringilla, vulputate..",
    svgPath: "M10 10 H 90 V 90 H 10 Z",
  },
  {
    id: 5,
    name: "Kouba, Alger",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique pulvinar enim. Mauris ut mauris fringilla, vulputate..",
    svgPath: "M10 10 H 90 V 90 H 10 Z",
  },
  {
    id: 6,
    name: "Kouba, Alger",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique pulvinar enim. Mauris ut mauris fringilla, vulputate..",
    svgPath: "M10 10 H 90 V 90 H 10 Z",
  },
];

// --- Icons ---

function LocalityShape({ className }: { className?: string }) {
  // Unique IDs for the filter and gradient to avoid conflicts if used elsewhere
  const filterId = "filter0_d_175_313";
  const gradientId = "paint0_linear_175_313";
  
  return (
    <svg 
      width="129" 
      height="117" 
      viewBox="0 0 129 117" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    > 
      <g filter={`url(#${filterId})`}> 
        <path 
          fillRule="evenodd" 
          clipRule="evenodd" 
          d="M84.1788 0.00329503C84.1472 0.054396 84.1688 0.0824196 84.1338 0.135169C83.7392 0.746732 83.1614 1.42423 82.5887 2.05723C81.488 3.27705 80.4224 4.25127 80.3375 4.32875L90.1781 13.8962V18.876L80.9119 28.0495L71.689 24.423L61.3189 23.8988L51.2135 15.5545L46.1832 14.9858L39.741 11.6659H34.3129L34.9756 18.3502L38.329 20.2722L39.4763 28.6165L23.1934 26.0829L16.4865 25.8208L14.2353 29.1407C14.2353 29.1407 14.923 29.7935 16.0452 30.626C17.1658 31.4584 18.7327 32.459 20.4144 33.2915C21.2553 33.7069 21.8747 34.3234 22.3559 34.9959C22.8371 35.6685 23.1518 36.435 23.3266 37.1801C23.5015 37.9252 23.5381 38.6406 23.4598 39.2769C23.3816 39.9131 23.2101 40.4588 22.9303 40.8066C22.3692 41.5006 18.2298 43.1605 14.2369 44.6507C10.2441 46.1409 6.38274 47.4464 6.38274 47.4464L4 46.9651L4.5295 52.5137C4.5295 52.5137 8.35253 55.8599 12.5169 59.765C14.5983 61.7184 16.7429 63.8235 18.5628 65.7059C20.3828 67.5884 21.8447 69.2649 22.5341 70.3809C23.2234 71.4968 24.6803 72.926 26.462 74.4871C28.2436 76.0481 30.3683 77.7213 32.4197 79.3796C34.471 81.0379 36.4358 82.6912 37.9361 84.0973C39.4347 85.5034 40.4587 86.6985 40.5836 87.5046C40.8333 89.1168 40.7584 91.352 40.5386 93.7076C40.3188 96.0632 39.9442 98.5457 39.5679 100.654C39.3797 101.707 39.3581 102.584 39.4796 103.362C39.6012 104.14 39.8959 104.798 40.3188 105.372C40.7417 105.945 41.2796 106.419 41.9956 106.857C42.7115 107.296 43.5974 107.708 44.5998 108.08C45.6021 108.453 47.2655 108.627 49.277 108.736C51.2884 108.845 53.6545 108.868 55.9406 108.868C57.0895 108.868 57.4226 108.997 58.4999 109C58.5132 108.964 58.6764 108.563 58.6764 108.563C58.6764 108.563 67.3082 103.582 76.283 98.5161C85.2578 93.4505 94.5773 88.2761 95.9193 87.9448C96.3406 87.8409 100.811 87.6777 102.715 87.5508C102.645 87.5195 102.518 87.4947 102.45 87.4634C101.231 86.9194 100.275 86.4035 99.6258 85.8463C98.9764 85.2892 98.6717 84.7122 98.7866 84.1419C99.2461 81.8654 100.385 78.4268 102.052 75.0113C102.886 73.3035 103.848 71.5974 104.921 70.0314C105.993 68.4654 107.185 67.0642 108.451 65.9252C109.716 64.7861 111.383 63.8086 113.173 62.9547C114.963 62.1009 116.846 61.3838 118.601 60.8134C122.109 59.6744 125 59.109 125 59.109C125 59.109 123.388 55.3308 121.778 51.2889C120.168 47.247 118.556 42.9034 118.556 41.766C118.556 40.9714 119.519 37.9499 120.321 35.3009C120.081 35.474 119.667 35.7822 119.482 35.9124C119.044 36.2223 118.018 36.257 116.746 36.0872C115.474 35.9174 113.965 35.535 112.51 35.0388C111.055 34.5426 109.661 33.9146 108.671 33.2469C108.176 32.914 107.78 32.5892 107.523 32.2414C107.267 31.8936 107.152 31.5342 107.214 31.193C107.715 28.4649 108.699 16.3144 108.449 14.3297C108.386 13.8335 107.788 13.2368 106.861 12.5824C105.933 11.928 104.706 11.2274 103.374 10.5284C100.713 9.13388 97.6843 7.77064 96.1807 6.90193C94.6772 6.03486 91.2288 4.24962 87.9735 2.35889C86.5915 1.55611 85.331 0.77146 84.1788 0V0.00329503Z" 
          fill={`url(#${gradientId})`}
        /> 
      </g> 
      <defs> 
        <filter id={filterId} x="0" y="0" width="129" height="117" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"> 
          <feFlood floodOpacity="0" result="BackgroundImageFix"/> 
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/> 
          <feOffset dy="4"/> 
          <feGaussianBlur stdDeviation="2"/> 
          <feComposite in2="hardAlpha" operator="out"/> 
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"/> 
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_175_313"/> 
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_175_313" result="shape"/> 
        </filter> 
        <linearGradient id={gradientId} x1="64.5" y1="23.0779" x2="64.5" y2="105.169" gradientUnits="userSpaceOnUse"> 
          <stop stopColor="#F4CE86"/> 
          <stop offset="1" stopColor="#EAB456"/> 
        </linearGradient> 
      </defs> 
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
      <path d="M1 1L6 6L11 1" stroke="#F7C66A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LocationPinIcon() {
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" className="text-[#F7C66A]">
      <path d="M7 9.5C8.38071 9.5 9.5 8.38071 9.5 7C9.5 5.61929 8.38071 4.5 7 4.5C5.61929 4.5 4.5 5.61929 4.5 7C4.5 8.38071 5.61929 9.5 7 9.5Z" fill="currentColor"/>
      <path d="M7 0C3.13 0 0 3.13 0 7C0 12.25 7 18 7 18C7 18 14 12.25 14 7C14 3.13 10.87 0 7 0ZM7 10.5C5.07 10.5 3.5 8.93 3.5 7C3.5 5.07 5.07 3.5 7 3.5C8.93 3.5 10.5 5.07 10.5 7C10.5 8.93 8.93 10.5 7 10.5Z" fill="currentColor"/>
    </svg>
  );
}

// --- Components ---

function FilterDropdown({ label }: { label: string }) {
  return (
    <button className="flex items-center justify-between gap-4 rounded border-[0.2px] border-[#F7C66A] px-4 py-2 text-xs font-medium uppercase tracking-wider text-white transition hover:bg-[#F7C66A]/10">
      {label}
      <ChevronDownIcon />
    </button>
  );
}

// "Cube" Card for Projects
function ProjectCard({ project, style }: { project: Project; style?: React.CSSProperties }) {
  return (
    <Link 
      to={`/projet/${project.id}`}
      className="group relative flex h-full overflow-hidden rounded-lg bg-[#052620] shadow-lg transition hover:shadow-2xl animate-fadeInUp"
      style={style}
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
         {/* We assume the image is a PNG with transparency (cut-out building) 
             placed on a transparent background to blend with the card. 
             In the screenshot, it looks like a 3D block. 
         */}
         <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={project.image}
              alt={project.title}
              className="h-[120%] w-full object-contain object-center transition duration-700 group-hover:scale-105"
              style={{ filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.5))" }} 
            />
         </div>
      </div>
    </Link>
  );
}

// Static Image Card (for the "fixed" images in the grid)
function StaticImageCard({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  return (
    <div 
      className="relative h-full w-full overflow-hidden rounded-lg shadow-lg animate-fadeInUp"
      style={style}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition duration-700 hover:scale-105"
      />
      {/* Optional overlay if needed to match tone */}
      <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none" />
    </div>
  );
}

function LocalityCard({ locality, style }: { locality: Locality; style?: React.CSSProperties }) {
  return (
    <Link 
      to={`/localite/${locality.id}`}
      className="group relative flex overflow-hidden rounded-lg bg-[#1a3c36] shadow-lg transition hover:bg-[#1a3c36]/80 animate-fadeInUp"
      style={style}
    >
      {/* Left Content */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
           <div className="mb-2 flex items-center gap-2 text-lg font-bold text-white">
            <LocationPinIcon />
            <span>{locality.name}</span>
          </div>
          <p className="mb-4 text-xs leading-relaxed text-white/60">
            {locality.description}
          </p>
        </div>
      </div>

      {/* Right SVG/Shape */}
      <div className="relative flex w-2/5 items-center justify-center p-4">
        <LocalityShape className="h-24 w-24 drop-shadow-lg transition duration-500 group-hover:scale-110" />
      </div>
    </Link>
  );
}

function Pagination() {
  const pages = [1, 2, 3, 4];
  return (
    <div className="mt-16 flex justify-center gap-2">
      {pages.map((p, i) => (
        <button
          key={p}
          className={`grid h-10 w-10 place-items-center rounded border text-sm font-medium transition
            ${i === 0 
              ? "border-[#F7C66A] bg-[#F7C66A] text-black" 
              : "border-white/20 text-white hover:border-[#F7C66A] hover:text-[#F7C66A]"
            }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

export default function ProjectsPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"PROJETS" | "LOCALITÉS">("PROJETS");

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  // Logic to mix projects with static images if count >= 7
  const displayItems = useMemo(() => {
    if (activeTab === "LOCALITÉS") return LOCALITIES;

    // Clone array to avoid mutation
    const items: (Project | { type: "image"; id: string; src: string })[] = [...PROJECTS];

    // Only apply the special layout if we have 7 or more projects
    if (PROJECTS.length >= 7) {
      // Insert Static Image 1 at index 1 (Center Top in 3-col grid)
      // Use a placeholder image or one of the project images as filler for now
      // The user said: "je modifierais après juste les urls"
      items.splice(1, 0, {
        type: "image",
        id: "static-1",
        src: "/projets/static1.png", // User will change this
      });

      // Insert Static Image 2 at index 6 (Bottom Left in 3-col grid)
      // Note: After first splice, the array length increased by 1.
      // Original index 6 is now index 7.
      // But we want it at visual position 6 (0-indexed).
      // Let's trace:
      // [P0, IMG1, P1, P2, P3, P4, IMG2, P5, P6...]
      // Visual indices:
      // 0: P0
      // 1: IMG1
      // 2: P1
      // 3: P2
      // 4: P3
      // 5: P4
      // 6: IMG2
      // So we need to insert at index 6 of the *new* array.
      items.splice(6, 0, {
        type: "image",
        id: "static-2",
        src: "/projets/static2.png", // User will change this
      });
    }

    return items;
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#031B17] font-['Montserrat'] text-white">
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
      
      <main className="mx-auto max-w-7xl px-4 pt-32 pb-20 md:px-10 relative z-10">
        
        {/* Title */}
        <h1 className="mb-12 text-center text-4xl font-bold text-[#F7C66A] md:text-5xl animate-fadeInUp">
          {activeTab === "LOCALITÉS" ? "NOS LOCALITÉS" : "NOS PROJETS"}
        </h1>

        {/* Tabs */}
        <div className="mb-12 flex justify-center animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
          <div className="flex gap-8">
            {(["PROJETS", "LOCALITÉS"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm tracking-widest uppercase transition-all
                  ${activeTab === tab 
                    ? "border-b-2 border-[#F7C66A] text-[#F7C66A]" 
                    : "border-b-2 border-transparent text-white/50 hover:text-white"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Filters & Sort */}
        <div className="relative mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-center animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
          {/* Centered Filters */}
          <div className="flex flex-wrap justify-center gap-4">
            {activeTab === "PROJETS" && (
              <>
                <FilterDropdown label="TYPOLOGIE" />
                <FilterDropdown label="STATUT" />
                <FilterDropdown label="LOCALITÉ" />
               
              </>
            )}
          </div>

          {/* Right-aligned Sort By (Absolute on desktop) */}
          <div className="flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-wide text-white/80 md:absolute md:right-0">
            <span>SORT BY :</span>
            <button className="flex items-center gap-1 text-white">
              TOUS
              <ChevronDownIcon />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeTab === "PROJETS" ? (
            // Mixed List (Projects + Static Images)
            (displayItems as any[]).map((item, idx) => {
              // Stagger animation delay based on index
              const delayStyle = { animationDelay: `${0.1 + idx * 0.1}s` };

              if (item.type === "image") {
                return (
                  <StaticImageCard 
                    key={item.id} 
                    src={item.src} 
                    alt="Featured Project" 
                    style={delayStyle} 
                  />
                );
              }
              return (
                <ProjectCard 
                  key={(item as Project).id} 
                  project={item as Project} 
                  style={delayStyle} 
                />
              );
            })
          ) : (
            // Localities List
            LOCALITIES.map((l, idx) => (
              <LocalityCard 
                key={l.id} 
                locality={l} 
                style={{ animationDelay: `${0.1 + idx * 0.1}s` }} 
              />
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="animate-fadeInUp" style={{ animationDelay: "0.8s" }}>
          <Pagination />
        </div>

      </main>

      <Footer />
    </div>
  );
}
