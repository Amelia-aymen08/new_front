// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import WipeStack, { Slide } from "../components/WipeStack";
import Header from "../components/Header";

// Lazy load heavy sections of the home page
const LifestyleSection = lazy(() => import("../components/LifestyleSection"));
const WhyChooseUsSection = lazy(() => import("../components/WhyChooseUsSection"));
const NewsSection = lazy(() => import("../components/NewsSection"));
const ContactSection = lazy(() => import("../components/ContactSection"));
const Footer = lazy(() => import("../components/Footer"));

// Loading component for home page sections
const SectionLoader = () => (
  <div className="flex h-[200px] w-full items-center justify-center">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
  </div>
);

// Exemple de sections wipe (tes images sont dans /sections/1.png, 2.png, 3.png)
function WipeImageSection({
  src,
  title,
  description,
  buttonText,
  targetTab,
  isInterior
}: {
  src: string;
  title?: string;
  description?: string;
  buttonText?: string;
  targetTab?: string;
  isInterior?: boolean;
}) {
  const handleClick = (e: React.MouseEvent) => {
    if (isInterior) {
       e.preventDefault();
       const element = document.getElementById("interiors-carousel");
       if (element) {
         element.scrollIntoView({ behavior: "smooth" });
       }
    }
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "100vh" }}
    >
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Contenu Texte */}
      <div className="absolute inset-0 flex items-center pl-6 pr-24 md:px-20">
        <div className="max-w-xl pt-32 md:pt-0">
          {title && (
            <h2 className="mb-6 text-4xl font-bold text-gold-500 md:text-5xl uppercase tracking-wide leading-tight">
              {title}
            </h2>
          )}
          {description && (
            <p className="mb-12 text-base md:text-lg text-white/90 leading-relaxed font-light">
              {description}
            </p>
          )}
          {buttonText && (
            isInterior ? (
              <button
                onClick={handleClick}
                className="inline-block rounded-full border border-gold-500 px-8 py-3 text-base font-semibold uppercase tracking-widest text-white transition hover:bg-gold-500 hover:text-black cursor-pointer"
              >
                {buttonText}
              </button>
            ) : (
              <Link
                to="/projets"
                state={targetTab ? { tab: targetTab } : undefined}
                className="inline-block rounded-full border border-gold-500 px-8 py-3 text-base font-semibold uppercase tracking-widest text-white transition hover:bg-gold-500 hover:text-black"
              >
                {buttonText}
              </Link>
            )
          )}
        </div>
      </div>

      {/* Scroll Down Arrow (Mouse + Double Arrow) */}
      <div className="absolute bottom-[8%] md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 pointer-events-none opacity-85">
        {/* Mouse Icon */}
        <div className="w-[20px] h-[32px] md:w-[26px] md:h-[44px] border-[2px] md:border-[3px] border-white/80 rounded-[12px] md:rounded-[18px] flex justify-center pt-[5px] md:pt-[7px] mb-1 md:mb-2 bg-black/10 backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="w-[2px] h-[7px] md:w-[3px] md:h-[10px] bg-[#F7C66A] rounded-full animate-scroll-wheel"></div>
        </div>
        {/* Double Arrows */}
        <div className="flex flex-col items-center animate-bounce">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white drop-shadow-lg -mt-1 md:-mt-2 md:w-[50px] md:h-[50px]">
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="md:[stroke-width:2.2]"/>
            <path d="M6 14L12 20L18 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 md:[stroke-width:2.2]"/>
          </svg>
        </div>
      </div>
    </section>
  );
}

function useInView(
  options?: IntersectionObserverInit
): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.18, ...options }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return [ref, visible];
}

function FadeOnScroll({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-[900ms] ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const [showHeader, setShowHeader] = useState(true);
  const wipeRef = useRef<HTMLDivElement | null>(null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const inWipeRef = useRef(true);
  const [inWipe, setInWipe] = useState(true);
  const [topVisible, setTopVisible] = useState(true);

  useEffect(() => {
    const node = wipeRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0].isIntersecting;
        inWipeRef.current = isVisible;
        setInWipe(isVisible);
      },
      { threshold: 0.05 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const node = topSentinelRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        setTopVisible(entries[0].isIntersecting);
      },
      { threshold: 0.05 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    setShowHeader(inWipe || topVisible);
  }, [inWipe, topVisible]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const slides = useMemo<Slide[]>(
    () => [
      { key: "hero", element: <Hero /> },
      {
        key: "s2",
        element: (
          <WipeImageSection
            src={isMobile ? "/1-mobile.png" : "/sections/1.png"}
            title="PROJETS EN COURS"
            description="Découvrez nos résidences de haut standing en cours de réalisation. Entre architecture moderne et matériaux nobles, chaque projet offre des appartements d'exception conçus pour votre confort."
            buttonText="DECOUVRIR"
            targetTab="EN COURS"
          />
        ),
      },
      {
        key: "s1",
        element: (
          <WipeImageSection
            src={isMobile ? "/2-mobile.png" : "/sections/2.png"}
            title="PROJETS FINIS"
            description="Parcourez notre galerie de résidences déjà livrées. Ces résidences de luxe allient esthétique intemporelle et fonctionnalité, confirmant notre maîtrise de l'immobilier haut de gamme à travers chaque détail."
            buttonText="DECOUVRIR"
            targetTab="FINIS"
          />
        ),
      },
      {
        key: "s3",
        element: (
          <WipeImageSection
            src={isMobile ? "/3-mobile.png" : "/sections/3.png"}
            title="NOS INTÉRIEURS"
            description="Plongez dans l'élégance de nos intérieurs de luxe. Chaque espace est sublimé par des matériaux nobles et des finitions méticuleuses, créant une atmosphère raffinée."
            buttonText="DECOUVRIR"
            isInterior={true}
          />
        ),
      },
    ],
    [isMobile]
  );

  return (
    <main className="relative text-white bg-[#031B17]">
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

      <div className="relative" ref={wipeRef}>
        <div ref={topSentinelRef} className="absolute top-0 left-0 h-1 w-1" aria-hidden />
        <Header
          className={[
            "fixed top-0 left-0 z-40 w-full transition-opacity duration-300 ease-out",
            "bg-transparent backdrop-blur-0 shadow-none",
            showHeader ? "opacity-100" : "opacity-0 pointer-events-none",
          ].join(" ")}
        />
        <WipeStack slides={slides} />
      </div>
      
      {/* Nouvelles sections apres le scroll wipe */}
      <div className="relative z-10 bg-[#031B17] w-full overflow-x-hidden">
        <Suspense fallback={<SectionLoader />}>
          <FadeOnScroll delay={120}>
            <LifestyleSection />
          </FadeOnScroll>
          <FadeOnScroll delay={220}>
            <WhyChooseUsSection />
          </FadeOnScroll>
          <FadeOnScroll delay={320}>
            <NewsSection />
          </FadeOnScroll>
          <FadeOnScroll delay={420}>
            <ContactSection />
          </FadeOnScroll>
          <FadeOnScroll delay={520}>
            <Footer />
          </FadeOnScroll>
        </Suspense>
      </div>
    </main>
  );
}
