// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from "react";
import Hero from "../components/Hero";
import WipeStack, { Slide } from "../components/WipeStack";
import Header from "../components/Header";
import LifestyleSection from "../components/LifestyleSection";
import WhyChooseUsSection from "../components/WhyChooseUsSection";
import NewsSection from "../components/NewsSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

import { Link } from "react-router-dom";

// Exemple de sections wipe (tes images sont dans /sections/1.png, 2.png, 3.png)
function WipeImageSection({
  src,
  title,
  description,
  buttonText,
}: {
  src: string;
  title?: string;
  description?: string;
  buttonText?: string;
}) {
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
      <div className="absolute inset-0 flex items-center px-4 md:px-20">
        <div className="max-w-xl">
          {title && (
            <h2 className="mb-6 text-4xl font-bold text-gold-500 md:text-5xl uppercase tracking-wide">
              {title}
            </h2>
          )}
          {description && (
            <p className="mb-8 text-lg text-white/90 leading-relaxed">
              {description}
            </p>
          )}
          {buttonText && (
            <Link
              to="/projets"
              className="inline-block rounded-full border border-gold-500 px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-gold-500 hover:text-black"
            >
              {buttonText}
            </Link>
          )}
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
        key: "s1",
        element: (
          <WipeImageSection
            src={isMobile ? "/1-mobile.png" : "/sections/1.png"}
            title="PROJETS FINIS"
            description="Aymen Promotion développe des résidences haut standing à Alger avec plus de 20 projets livrés qui allient le confort, le design moderne et une finition de qualité!"
            buttonText="DECOUVRIR"
          />
        ),
      },
      {
        key: "s2",
        element: (
          <WipeImageSection
            src={isMobile ? "/2-mobile.png" : "/sections/2.png"}
            title="PROJETS EN COURS"
            description="Aymen Promotion développe des résidences haut standing à Alger avec plus de 20 projets en cours qui allient le confort, le design moderne et une finition de qualité!"
            buttonText="DECOUVRIR"
          />
        ),
      },
      {
        key: "s3",
        element: (
          <WipeImageSection
            src={isMobile ? "/3-mobile.png" : "/sections/3.png"}
            title="NOS INTÉRIEURS"
            description="Aymen Promotion développe des résidences haut standing à Alger avec plus de 20 projets l ivrés qui allient le confort, le design moderne et une finition de qualité!"
            buttonText="DECOUVRIR"
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
      </div>
    </main>
  );
}
