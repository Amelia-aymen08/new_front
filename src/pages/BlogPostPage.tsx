import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Mock data (could be moved to a shared file later)
const CATEGORIES = [
  "TOUS NOS ARTICLES",
  "TOUS NOS ARTICLES",
  "TOUS NOS ARTICLES",
  "TOUS NOS ARTICLES",
  "TOUS NOS ARTICLES",
  "TOUS NOS ARTICLES",
];

const RECENT_ARTICLES = [1, 2, 3];

export default function BlogPostPage() {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="relative min-h-screen bg-[#031B17] font-['Montserrat'] text-white overflow-hidden">
      {/* Background Texture & Lights */}
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

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-32 md:px-8">
        {/* Main Layout Grid */}
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* LEFT COLUMN: Article Content */}
          <div className="w-full lg:w-3/4">
            {/* Title Section */}
            <div className="mb-8">
              <h1 className="mb-4 text-2xl font-bold uppercase leading-tight tracking-wide text-white md:text-3xl lg:text-4xl">
                COMMENT RECONNAÎTRE UNE RÉSIDENCE HAUT STANDING À ALGER AVEC AYMEN
                PROMOTION
              </h1>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#F7C66A]">
                <span>ACHAT ET VENTE</span>
                <span>22/12/2025</span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative mb-12 overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="/blog.jpg" // Using a generic placeholder for now as per previous mock data
                alt="Résidence Haut Standing"
                className="h-auto w-full object-cover"
              />
              {/* Overlay Badge/Title on Image (as seen in screenshot "Comment reconnaitre une residence Haut Standing") */}
              <div className="absolute bottom-8 left-8">
                 <div className="font-['Montserrat'] text-[10px] uppercase tracking-[0.2em] text-white/90 mb-1">
                    COMMENT RECONNAÎTRE UNE RÉSIDENCE
                 </div>
                 <div className="font-['PhotographSignature'] text-5xl md:text-6xl text-white drop-shadow-lg">
                    Haut Standing
                 </div>
              </div>
              {/* Logo Overlay */}
              <div className="absolute bottom-6 right-6 bg-white/90 px-3 py-1.5 rounded shadow-sm">
                 <img src="/logo_black.png" alt="Aymen Promotion" className="h-4 w-auto" />
              </div>
            </div>

            {/* Content Body */}
            <div className="space-y-8 text-sm leading-relaxed text-white/80 md:text-base">
              <h2 className="text-lg font-bold uppercase tracking-wide text-white md:text-xl">
                COMMENT RECONNAÎTRE UNE RÉSIDENCE HAUT STANDING À ALGER AVEC AYMEN
                PROMOTION
              </h2>
              <p>
                Découvrez comment identifier une authentique résidence haut standing
                à Alger avec Aymen Promotion avec une architecture d'exception,
                qualité technique et rigueur d'exécution pour un investissement
                premium.
              </p>
              <p>
                Alger a de nombreux aspects et est en train de se doter de nouvelles
                résidences luxueuses et confortables, mais comment faire la
                différence entre de vraies résidences de luxe et des astuces
                commerciales ? Lors de votre première visite, vous remarquerez
                certains détails qui montrent à quel point un projet immobilier est
                exceptionnel. Chez{" "}
                <strong className="text-white underline decoration-[#F7C66A] decoration-2 underline-offset-4">
                  Aymen Promotion
                </strong>
                , nous vous invitons à apprécier ces signes distinctifs qui montrent
                comment des appartements deviennent des biens immobiliers
                exceptionnels dans la capitale et la ville la plus peuplée
                d'Algérie.
              </p>

              <h3 className="text-lg font-bold uppercase tracking-wide text-white md:text-xl">
                L'EXCELLENCE ARCHITECTURALE D'UNE RÉSIDENCE HAUT STANDING À ALGER
              </h3>
              <p>
                En se promenant dans un quartier, on peut facilement reconnaître le
                vrai haut standing parmi les résidences, par exemple les façades des
                projets{" "}
                <strong className="text-white underline decoration-[#F7C66A] decoration-2 underline-offset-4">
                  d'Aymen Promotion
                </strong>{" "}
                se distinguent par la sophistication des détails dans l'architecture
                et le choix exclusivement de matériaux de haut standing, nous
                privilégions dans tous nos projets l'isolation thermique par
                l'extérieur, un choix qui permet, en plus de l'esthétique et du
                confort thermique, des économies d'énergie importantes dans le
                temps.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <div className="w-full space-y-12 lg:w-1/4">
            {/* Search */}
            <div className="rounded-lg bg-[#052620] p-6 shadow-lg border border-white/5">
                <div className="relative">
                <input
                    type="text"
                    placeholder="RECHERCHE"
                    className="w-full rounded border border-[#F7C66A] bg-transparent px-4 py-3 text-xs uppercase tracking-wide text-white placeholder-white/50 focus:bg-white/5 focus:outline-none"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F7C66A]">
                    <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                    </svg>
                </button>
                </div>
            </div>

            {/* Categories */}
            <div className="rounded-lg bg-[#052620] p-6 shadow-lg border border-white/5 space-y-3">
              {CATEGORIES.map((cat, idx) => (
                <button
                  key={idx}
                  className="group flex w-full items-center justify-center rounded border border-white/20 py-3 text-[10px] font-bold uppercase tracking-widest text-white/70 transition-all hover:border-[#F7C66A] hover:text-[#F7C66A]"
                >
                  <span className="mr-2 opacity-0 transition-opacity group-hover:opacity-100">
                    →
                  </span>
                  {cat}
                </button>
              ))}
            </div>

            {/* Recent Articles */}
            <div className="rounded-lg bg-[#052620] p-6 shadow-lg border border-white/5">
              <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-[#F7C66A]">
                ARTICLES RÉCENTS
              </h4>
              <div className="space-y-4">
                {RECENT_ARTICLES.map((_, idx) => (
                  <div
                    key={idx}
                    className="h-24 w-full animate-pulse rounded bg-white/10"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
