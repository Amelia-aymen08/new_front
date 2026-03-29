import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Document, Page as PdfPage, pdfjs } from "react-pdf";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Utilisation d'un CDN fiable pour le worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface Catalogue {
  id: string;
  title: string;
  date: string;
  coverColor: string;
  pages: number;
  pdfUrl?: string;
}

const CATALOGUE: Catalogue = {
    id: "catalogue-2025",
    title: "Catalogue Général",
    date: "2025",
    coverColor: "from-[#031B17] to-[#0A2E25]",
    pages: 20, // Nombre de pages estimé
    pdfUrl: "/assets/catalogue/Catalogue.pdf",
};

const LANDSCAPE_RATIO = 1.414; // Largeur > Hauteur

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

interface PageProps {
  number: number;
  children: React.ReactNode;
  noPadding?: boolean;
}

const Page = React.forwardRef<HTMLDivElement, PageProps>(({ number, children, noPadding = false }, ref) => {
  return (
    <div className="page h-full w-full overflow-hidden relative bg-white" ref={ref}>
      {children}
      {!noPadding && (
        <span className="absolute bottom-4 right-4 text-[10px] text-gray-400 z-10">
          {number}
        </span>
      )}
    </div>
  );
});
Page.displayName = "Page";

const CatalogueCard = ({ cat, onClick }: { cat: Catalogue; onClick: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group cursor-pointer flex flex-col gap-4 items-center w-full"
      onClick={onClick}
    >
      <div className="relative aspect-[1.414/1] w-full max-w-[800px] perspective-1000 mx-auto px-4">
        <div
          className={`
            absolute inset-4 md:inset-0 rounded-sm shadow-2xl transition-transform duration-500 ease-out 
            group-hover:-translate-y-2 group-hover:shadow-[20px_20px_40px_rgba(0,0,0,0.4)]
            bg-gradient-to-br from-[#031B17] to-[#0A2E25] overflow-hidden border border-white/10
            flex flex-col items-center justify-center p-4 md:p-8
          `}
        >
          {/* Design de couverture statique (toujours visible) */}
          <div className="relative z-10 text-center border-[2px] md:border-[3px] border-[#F7C66A]/30 p-6 md:p-12 w-full h-full flex flex-col items-center justify-center">
             <div className="absolute top-2 left-2 md:top-4 md:left-4 w-8 h-8 md:w-16 md:h-16 border-t-2 border-l-2 border-[#F7C66A]/50" />
             <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-8 h-8 md:w-16 md:h-16 border-b-2 border-r-2 border-[#F7C66A]/50" />
             
             <h3 className="font-['PhotographSignature'] text-4xl md:text-7xl text-[#F7C66A] mb-2 md:mb-4">Aymen Promotion</h3>
             <h2 className="text-white text-xl md:text-4xl font-bold uppercase tracking-[0.2em] mb-2 leading-tight">{cat.title}</h2>
             
             <div className="mt-4 md:mt-8 px-4 md:px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-[10px] md:text-xs uppercase tracking-widest group-hover:bg-[#F7C66A] group-hover:text-[#031B17] transition-all">
                Cliquer pour lire
             </div>
          </div>

          {/* Effet de brillance */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-0" />
        </div>
      </div>
    </motion.div>
  );
};

const ReaderModal = ({ cat, onClose }: { cat: Catalogue; onClose: () => void }) => {
  const [numPages, setNumPages] = useState<number>(cat.pages);
  const [isPdfLoaded, setIsPdfLoaded] = useState(false);

  // Empêcher le clic droit (context menu) pour limiter le téléchargement
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsPdfLoaded(true);
  }

  const pagesArray = Array.from({ length: numPages }, (_, i) => i + 1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[6000] flex flex-col items-center justify-start bg-black/95 backdrop-blur-md overflow-y-auto"
    >
      <div className="sticky top-0 w-full flex justify-between items-center p-4 bg-black/80 backdrop-blur-md z-50">
        <h3 className="text-white font-bold">{cat.title}</h3>
        <button onClick={onClose} className="p-2 text-white/70 hover:text-white transition bg-white/10 rounded-full">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="w-full max-w-4xl py-8 px-4 flex flex-col items-center gap-4 select-none pointer-events-none" style={{ WebkitUserSelect: 'none', userSelect: 'none' }}>
        {/* Couche de protection transparente par dessus le PDF pour empêcher les interactions */}
        <div className="fixed inset-0 z-40 pointer-events-auto" onContextMenu={(e) => e.preventDefault()} />
        
        {cat.pdfUrl ? (
          <Document
            file={cat.pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="text-white flex flex-col items-center mt-20">
                <div className="w-12 h-12 border-4 border-[#F7C66A] border-t-transparent rounded-full animate-spin mb-4" />
                Chargement du Catalogue...
              </div>
            }
            error={
              <div className="text-white text-center p-8 bg-red-900/20 rounded-lg border border-red-500/30 mt-20">
                <p className="text-xl font-bold mb-2">Impossible de charger le PDF.</p>
              </div>
            }
            className="flex flex-col items-center gap-8 relative z-10"
          >
            {isPdfLoaded && pagesArray.map((pageNum) => (
              <div key={pageNum} className="relative shadow-2xl bg-white w-full max-w-[800px]">
                <PdfPage
                  pageNumber={pageNum}
                  width={window.innerWidth < 800 ? window.innerWidth - 32 : 800}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="!flex !justify-center"
                />
              </div>
            ))}
          </Document>
        ) : null}
      </div>
    </motion.div>
  );
};

export default function CataloguePage() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#031B17] font-['Montserrat'] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(21,105,83,0.3),transparent_70%)]" />
        <div className="absolute top-[40%] right-[-10%] w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(225,187,127,0.1),transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage: 'url("/texture.png")',
            backgroundSize: "1200px",
            backgroundRepeat: "repeat",
          }}
        />
      </div>

      <Header className="absolute top-0 left-0 z-40 w-full" />

      <main className="relative z-10 pt-32 pb-20 px-6 min-h-[80vh] flex flex-col justify-center">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <span className="font-['PhotographSignature'] text-6xl text-[#F7C66A] block mb-2">Catalogue Officiel</span>
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest">AYMEN PROMOTION</h1>
            <p className="mt-6 max-w-2xl mx-auto text-white/70 leading-relaxed">
              Découvrez l'ensemble de nos projets et nos offres exclusives à travers notre catalogue interactif.
            </p>
          </div>

          <div className="flex justify-center w-full">
            <CatalogueCard cat={CATALOGUE} onClick={() => setIsOpen(true)} />
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isOpen && <ReaderModal cat={CATALOGUE} onClose={() => setIsOpen(false)} />}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
