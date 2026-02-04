import React, { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { motion, AnimatePresence } from "framer-motion";
import { Document, Page as PdfPage, pdfjs } from "react-pdf";
import Header from "../components/Header";
import Footer from "../components/Footer";

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs";

interface Magazine {
  id: string;
  title: string;
  date: string;
  coverColor: string;
  pages: number;
  pdfUrl?: string;
}

const MAGAZINES: Magazine[] = [
  {
    id: "nov-2025",
    title: "L'Art de Vivre",
    date: "Novembre 2025",
    coverColor: "from-[#031B17] to-[#0A2E25]",
    pages: 24,
    pdfUrl: "/assets/magazines/aymag-03.pdf",
  },
  {
    id: "aout-2025",
    title: "Spécial Été",
    date: "Août 2025",
    coverColor: "from-[#C2A15C] to-[#E1BB7F]",
    pages: 13,
    pdfUrl: "/assets/magazines/aymag-02.pdf",
  },
  {
    id: "mai-2025",
    title: "Architecture & Design",
    date: "Mai 2025",
    coverColor: "from-[#5A8E86] to-[#6A9E96]",
    pages: 20,
    pdfUrl: "/assets/magazines/aymag-01.pdf",
  },
];

const A4_RATIO = 1.41421356237;

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

const MagazineCard = ({ mag, onClick }: { mag: Magazine; onClick: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group cursor-pointer flex flex-col gap-4"
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] w-full perspective-1000">
        <div
          className={`
            absolute inset-0 rounded-r-lg rounded-l-sm shadow-2xl transition-transform duration-500 ease-out 
            group-hover:-translate-y-2 group-hover:rotate-y-[-12deg] group-hover:shadow-[20px_20px_40px_rgba(0,0,0,0.4)]
            bg-white overflow-hidden
          `}
        >
          {mag.pdfUrl ? (
            <div className="h-full w-full overflow-hidden relative">
              <Document
                file={mag.pdfUrl}
                loading={
                  <div className={`h-full w-full bg-gradient-to-br ${mag.coverColor} flex items-center justify-center`}>
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                }
                error={
                  <div className={`h-full w-full bg-gradient-to-br ${mag.coverColor} flex items-center justify-center p-4 text-center text-white`}>
                    <span className="text-sm font-bold">{mag.title}</span>
                  </div>
                }
                className="h-full w-full"
              >
                <div className="h-full w-full flex items-center justify-center">
                  <PdfPage
                    pageNumber={1}
                    width={320}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </div>
              </Document>
            </div>
          ) : (
            <div className={`h-full w-full bg-gradient-to-br ${mag.coverColor} flex flex-col items-center justify-center p-6 text-center border-l-4 border-white/10`}>
              <div className="mb-auto w-full border-b border-white/20 pb-4">
                <h3 className="font-['PhotographSignature'] text-4xl text-white">AyMAG</h3>
              </div>
              <div className="my-auto">
                <h4 className="text-2xl font-bold uppercase tracking-widest text-white mb-2">{mag.title}</h4>
                <p className="text-xs uppercase tracking-wider text-white/70">{mag.date}</p>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-10" />
        </div>

        <div className="absolute right-0 top-0 h-full w-2 bg-white rounded-r-sm shadow opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[1px] translate-z-[-2px]" />
      </div>

      <div className="text-center">
        <h3 className="text-lg font-bold text-white group-hover:text-[#F7C66A] transition-colors">{mag.date}</h3>
        <p className="text-sm text-white/60">{mag.title}</p>
      </div>
    </motion.div>
  );
};

const ReaderModal = ({ mag, onClose }: { mag: Magazine; onClose: () => void }) => {
  const bookRef = useRef<any>(null);
  const [numPages, setNumPages] = useState<number>(mag.pages);
  const [isPdfLoaded, setIsPdfLoaded] = useState(false);

  // Taille responsive d’UNE page (A4), le flipbook gère le spread
  const [pageSize, setPageSize] = useState<{ w: number; h: number }>({
    w: 420,
    h: Math.round(420 * A4_RATIO),
  });

  useEffect(() => {
    const compute = () => {
      const paddingW = 100;
      const paddingH = 170;

      const maxBookW = window.innerWidth - paddingW;
      const maxBookH = window.innerHeight - paddingH;

      // largeur d'une page si on veut pouvoir afficher 2 pages côte à côte
      const maxPageWFromWidth = Math.floor(maxBookW / 2);

      // contrainte hauteur A4 => w = h / ratio
      const maxPageWFromHeight = Math.floor(maxBookH / A4_RATIO);

      const w = clamp(Math.min(maxPageWFromWidth, maxPageWFromHeight), 320, 700);
      const h = Math.round(w * A4_RATIO);

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-10"
    >
      <button onClick={onClose} className="absolute top-6 right-6 z-50 p-2 text-white/70 hover:text-white transition">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="relative w-full max-w-6xl h-full flex flex-col items-center justify-center">
        {mag.pdfUrl ? (
          <Document
            file={mag.pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="text-white flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-[#F7C66A] border-t-transparent rounded-full animate-spin mb-4" />
                Chargement du PDF...
              </div>
            }
            error={
              <div className="text-white text-center">
                <p>Impossible de charger le PDF.</p>
                <p className="text-sm opacity-70">Vérifiez que le fichier existe bien.</p>
              </div>
            }
            className="flex justify-center"
          >
            {isPdfLoaded && (
              // @ts-ignore
              <HTMLFlipBook
                width={pageSize.w}
                height={pageSize.h}
                size="fixed"
                maxShadowOpacity={0.5}
                showCover={true}  // mets false si tu ne veux PAS la page blanche à gauche sur la couverture
                mobileScrollSupport={true}
                className="shadow-2xl"
                ref={bookRef}
              >
                {pagesArray.map((pageNum) => (
                  <Page key={pageNum} number={pageNum} noPadding>
                    {/* Conteneur strictement à la taille de la page */}
                    <div className="absolute inset-0 overflow-hidden">
                      {/* Le PdfPage doit occuper 100% du conteneur via CSS (globals.css) */}
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

export default function AymagPage() {
  const [selectedMag, setSelectedMag] = useState<Magazine | null>(null);

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

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <span className="font-['PhotographSignature'] text-6xl text-[#F7C66A] block mb-2">Le Magazine</span>
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest">AyMAG</h1>
            <p className="mt-6 max-w-2xl mx-auto text-white/70 leading-relaxed">
              Plongez dans l'univers de l'immobilier de luxe, découvrez nos dernières réalisations, les tendances design et l'art de vivre selon Aymen Promotion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
            {MAGAZINES.map((mag) => (
              <MagazineCard key={mag.id} mag={mag} onClick={() => setSelectedMag(mag)} />
            ))}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedMag && <ReaderModal mag={selectedMag} onClose={() => setSelectedMag(null)} />}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
