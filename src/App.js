import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import HomePage from "./pages/HomePage";
import IntroHero from "./components/IntroHero";
import StickyContactBar from "./components/StickyContactBar";
import CookieBanner from "./components/CookieBanner";

// Lazy loading the other routes to reduce initial bundle size
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectDetailsPage = lazy(() => import("./pages/ProjectDetailsPage"));
const LocalityPage = lazy(() => import("./pages/LocalityPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const CareersPage = lazy(() => import("./pages/CareersPage"));
const AymagPage = lazy(() => import("./pages/AymagPage"));
const CataloguePage = lazy(() => import("./pages/CataloguePage"));
const BatimatechPortalPage = lazy(() => import("./pages/BatimatechPortalPage"));
const ConcoursBatitecPage = lazy(() => import("./pages/ConcoursBatitecPage"));
const ConcoursBatitecApplyPage = lazy(() => import("./pages/ConcoursBatitecApplyPage"));
const ConcoursBatitecEnoncePage = lazy(() => import("./pages/ConcoursBatitecEnoncePage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const TerrainPage = lazy(() => import("./pages/TerrainPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));

// Loading component for lazy routes
const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center bg-[#031B17]">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

function HomeRoute() {
  // On verifie si l'intro a deja ete vue dans la session
  const [introDone, setIntroDone] = useState(() => {
    return sessionStorage.getItem("introSeen") === "true";
  });

  // Bloque le scroll tant que l'intro n'est pas terminee
  useEffect(() => {
    if (!introDone) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      sessionStorage.setItem("introSeen", "true");
    }
  }, [introDone]);

  return (
    <>
      <div className="ambient-bg" aria-hidden />
      
      {/* Contenu principal */}
      <div className="relative z-10">
        <div className="relative z-0">
          <HomePage />
        </div>
      </div>

      {/* Intro au-dessus */}
      {!introDone && <IntroHero onDone={() => setIntroDone(true)} />}
    </>
  );
}

function App() {
  // Ajuste la variable --vh pour les vues mobiles
  useEffect(() => {
    const set = () => {
      const vh = (window.visualViewport?.height ?? window.innerHeight) * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    set();
    window.visualViewport?.addEventListener("resize", set);
    window.addEventListener("resize", set);
    return () => {
      window.visualViewport?.removeEventListener("resize", set);
      window.removeEventListener("resize", set);
    };
  }, []);

  useEffect(() => {
    // Ne pas charger HubSpot en local pour éviter de polluer les analytics et les erreurs
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return;
    }
    
    // Retarder le chargement du script HubSpot
    const timer = setTimeout(() => {
      const src = "https://js-na1.hs-scripts.com/39983056.js";
      if (document.querySelector(`script[src="${src}"]`)) return;
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.defer = true;
      s.crossOrigin = "anonymous";
      document.body.appendChild(s);
    }, 5000); // Retard de 5 secondes

    return () => clearTimeout(timer);
  }, []);

  // Script global pour désactiver spécifiquement le widget de chat HubSpot
  useEffect(() => {
    window.hsConversationsSettings = {
      loadImmediately: false
    };
  }, []);

  return (
    <BrowserRouter>
      {/* Retrait de min-h-screen qui peut parfois causer des conflits de hauteur */}
      <div className="relative text-white">
        <StickyContactBar />
        <CookieBanner />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/projets" element={<ProjectsPage />} />
            <Route path="/projet/:slug" element={<ProjectDetailsPage />} />
            <Route path="/localite/:slug" element={<LocalityPage />} />
            <Route path="/a-propos" element={<AboutPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/carriere" element={<CareersPage />} />
            <Route path="/aymag" element={<AymagPage />} />
            <Route path="/catalogue" element={<CataloguePage />} />
            <Route path="/portail-batimatech" element={<BatimatechPortalPage />} />
            <Route path="/concours-batitec" element={<ConcoursBatitecPage />} />
            <Route path="/concours-batitec/:category" element={<ConcoursBatitecApplyPage />} />
            <Route path="/concours-batitec/:category/enonce" element={<ConcoursBatitecEnoncePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terrain" element={<TerrainPage />} />
            <Route path="/cgu" element={<TermsPage />} />
            <Route path="/confidentialite" element={<PrivacyPage />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
