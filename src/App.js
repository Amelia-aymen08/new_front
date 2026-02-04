import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import LocalityPage from "./pages/LocalityPage";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import IntroHero from "./components/IntroHero";
import CareersPage from "./pages/CareersPage";
import AymagPage from "./pages/AymagPage";
import ContactPage from "./pages/ContactPage";
import StickyContactBar from "./components/StickyContactBar";

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

  return (
    <BrowserRouter>
      {/* Retrait de min-h-screen qui peut parfois causer des conflits de hauteur */}
      <div className="relative text-white">
        <StickyContactBar />
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/projets" element={<ProjectsPage />} />
          <Route path="/projet/:id" element={<ProjectDetailsPage />} />
          <Route path="/localite/:id" element={<LocalityPage />} />
          <Route path="/a-propos" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/carriere" element={<CareersPage />} />
          <Route path="/aymag" element={<AymagPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
