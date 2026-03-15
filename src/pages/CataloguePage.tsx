import React, { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
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
      <div className="relative aspect-[1.414/1] w-full max-w-[1000px] perspective-1000 mx-auto">
        <div
          className={`
            absolute inset-0 rounded-sm shadow-2xl transition-transform duration-500 ease-out 
            group-hover:-translate-y-2 group-hover:shadow-[20px_20px_40px_rgba(0,0,0,0.4)]
            bg-gradient-to-br from-[#031B17] to-[#0A2E25] overflow-hidden border border-white/10
            flex flex-col items-center justify-center p-8
          `}
        >
          {/* Design de couverture statique (toujours visible) */}
          <div className="relative z-10 text-center border-[3px] border-[#F7C66A]/30 p-12 w-full h-full flex flex-col items-center justify-center">
             <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-[#F7C66A]/50" />
             <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-[#F7C66A]/50" />
             
             <h3 className="font-['PhotographSignature'] text-6xl md:text-8xl text-[#F7C66A] mb-4">Aymen Promotion</h3>
             <h2 className="text-white text-3xl md:text-5xl font-bold uppercase tracking-[0.2em] mb-2">{cat.title}</h2>
             <p className="text-white/60 text-xl tracking-widest uppercase">{cat.date}</p>
             
             <div className="mt-12 px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm uppercase tracking-widest group-hover:bg-[#F7C66A] group-hover:text-[#031B17] transition-all">
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
  const bookRef = useRef<any>(null);
  const [numPages, setNumPages] = useState<number>(cat.pages);
  const [isPdfLoaded, setIsPdfLoaded] = useState(false);

  const [pageSize, setPageSize] = useState<{ w: number; h: number }>({
    w: 800,
    h: Math.round(800 / LANDSCAPE_RATIO),
  });

  useEffect(() => {
    const compute = () => {
      const paddingW = 40;
      const paddingH = 100;

      const maxBookW = window.innerWidth - paddingW;
      const maxBookH = window.innerHeight - paddingH;

      let w = maxBookW;
      let h = w / LANDSCAPE_RATIO;

      if (h > maxBookH) {
         h = maxBookH;
         w = h * LANDSCAPE_RATIO;
      }
      
      w = clamp(w, 300, 1600);
      h = Math.round(w / LANDSCAPE_RATIO);

      setPageSize({ w, h });
    };

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsPdfLoaded(true);
  }

  const pagesArray = Array.from({ length: numPages }, (_, i) => i + 1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!bookRef.current) return;
      if (e.key === "ArrowRight") bookRef.current.pageFlip().flipNext();
      if (e.key === "ArrowLeft") bookRef.current.pageFlip().flipPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
    >
      <button onClick={onClose} className="absolute top-6 right-6 z-50 p-2 text-white/70 hover:text-white transition bg-black/50 rounded-full">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="relative w-full h-full flex flex-col items-center justify-center">
        
        {/* Flèche Gauche */}
        <button 
          onClick={() => bookRef.current?.pageFlip().flipPrev()}
          className="hidden md:flex absolute left-10 top-1/2 -translate-y-1/2 z-50 w-14 h-14 bg-white/10 hover:bg-[#F7C66A] text-white hover:text-black rounded-full items-center justify-center transition-all backdrop-blur-md shadow-xl border border-white/20"
        >
          <i className="fa-solid fa-chevron-left text-2xl"></i>
        </button>

        {/* Flèche Droite */}
        <button 
          onClick={() => bookRef.current?.pageFlip().flipNext()}
          className="hidden md:flex absolute right-10 top-1/2 -translate-y-1/2 z-50 w-14 h-14 bg-white/10 hover:bg-[#F7C66A] text-white hover:text-black rounded-full items-center justify-center transition-all backdrop-blur-md shadow-xl border border-white/20"
        >
          <i className="fa-solid fa-chevron-right text-2xl"></i>
        </button>

        {cat.pdfUrl ? (
          <Document
            file={cat.pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="text-white flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-[#F7C66A] border-t-transparent rounded-full animate-spin mb-4" />
                Chargement du Catalogue...
              </div>
            }
            error={
              <div className="text-white text-center p-8 bg-red-900/20 rounded-lg border border-red-500/30">
                <p className="text-xl font-bold mb-2">Impossible de charger le PDF.</p>
                <p className="text-sm opacity-70 mb-4">Vérifiez que le fichier existe bien à l'adresse : {cat.pdfUrl}</p>
                <button onClick={onClose} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition">Fermer</button>
              </div>
            }
            className="flex justify-center items-center"
          >
            {isPdfLoaded && (
              // @ts-ignore
              <HTMLFlipBook
                width={pageSize.w}
                height={pageSize.h}
                size="fixed"
                minWidth={300}
                maxWidth={1600}
                minHeight={200}
                maxHeight={1200}
                maxShadowOpacity={0.8} 
                showCover={true}
                mobileScrollSupport={true}
                className="shadow-2xl bg-transparent" 
                ref={bookRef}
                flippingTime={600} // Accéléré de 1000ms à 600ms pour plus de fluidité
                usePortrait={false} // Désactivé pour afficher deux pages (meilleur rendu catalogue)
                startPage={0}
                drawShadow={true}
                autoSize={true}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={30}
                showPageCorners={true}
                disableFlipByClick={false}
              >
                {pagesArray.map((pageNum) => (
                  <Page key={pageNum} number={pageNum} noPadding>
                    <div className="absolute inset-0 overflow-hidden bg-white flex items-center justify-center">
                      <PdfPage
                        pageNumber={pageNum}
                        width={pageSize.w}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </div>
                  </Page>
                ))}
              </HTMLFlipBook>
            )}
          </Document>
        ) : null}

        <p className="mt-6 text-white/50 text-sm hidden md:block">
          Utilisez les flèches du clavier ou cliquez sur les coins pour tourner les pages
        </p>
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
