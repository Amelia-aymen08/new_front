import React, { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

type Category = "hotel" | "villa";

function getCategoryLabel(category: Category) {
  return category === "hotel" ? "Hôtel" : "Villa";
}

function getDownloads(category: Category) {
  if (category === "hotel") {
    return {
      pdf: "/assets/concours-batitec/ennonce-hotel.pdf",
      autocad: "/assets/concours-batitec/ennonce-hotel.dwg",
    };
  }
  return {
    pdf: "/assets/concours-batitec/ennonce-villa.pdf",
    autocad: "/assets/concours-batitec/ennonce-villa.dwg",
  };
}

export default function ConcoursBatitecEnoncePage() {
  const navigate = useNavigate();
  const params = useParams();
  const category = (params.category || "").toLowerCase() as Category;
  const isValidCategory = useMemo(() => category === "hotel" || category === "villa", [category]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!isValidCategory) navigate("/concours-batitec", { replace: true });
  }, [isValidCategory, navigate]);

  if (!isValidCategory) return null;
  const downloads = getDownloads(category);

  return (
    <div className="relative min-h-screen bg-[#031B17] font-['Montserrat'] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(21,105,83,0.3),transparent_70%)]" />
        <div className="absolute top-[40%] right-[-10%] w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(225,187,127,0.10),transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{ backgroundImage: 'url("/texture.png")', backgroundSize: "1200px", backgroundRepeat: "repeat" }}
        />
      </div>

      <Header className="absolute top-0 left-0 z-40 w-full" />

      <section className="relative z-10 pt-28 md:pt-32 pb-20">
        <div className="mx-auto max-w-5xl px-4 md:px-10">
          <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-white/55 mb-2">Concours — {getCategoryLabel(category)}</div>
              <h1 className="text-2xl md:text-4xl font-bold uppercase tracking-wide text-[#F7C66A]">
                 Concours d’Architecture
              </h1>
            </div>
            <Link
              to="/concours-batitec"
              className="inline-flex items-center gap-3 rounded-full border border-white/15 px-5 py-2 text-xs font-bold uppercase tracking-widest text-white/80 hover:border-[#F7C66A] hover:text-[#F7C66A] transition-colors w-fit"
            >
              <i className="fa-solid fa-arrow-left" />
              Catégories
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 overflow-hidden rounded-3xl border border-white/10 bg-[#0C2A24]/75 backdrop-blur-md shadow-2xl">
              <div className="relative h-56 md:h-72">
                <img
                  src={category === "hotel" ? "/sections/b1.jpg" : "/sections/b2.jpg"}
                  alt={getCategoryLabel(category)}
                  className="h-full w-full object-cover opacity-70"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#031B17] via-[#031B17]/20 to-transparent" />
              </div>
              <div className="p-6">
                <div className="text-xs uppercase tracking-[0.22em] text-white/55 mb-2">Téléchargement</div>
                <div className="space-y-3">
                  <a
                    href={downloads.pdf}
                    download
                    className="inline-flex items-center justify-center gap-3 w-full rounded-full bg-[#F7C66A] px-8 py-3 text-xs font-bold uppercase tracking-widest text-[#031B17] hover:bg-white transition-colors"
                  >
                    Télécharger l'énoncé (PDF)
                    <i className="fa-solid fa-download" />
                  </a>
                  <a
                    href={downloads.autocad}
                    download
                    className="inline-flex items-center justify-center gap-3 w-full rounded-full border border-[#F7C66A]/60 bg-transparent px-8 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#F7C66A] hover:text-[#031B17] transition-colors"
                  >
                    Télécharger le fichier AutoCAD
                    <i className="fa-solid fa-download" />
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 rounded-3xl border border-white/10 bg-[#0C2A24]/75 backdrop-blur-md shadow-2xl p-6 md:p-10">
              <div className="mb-6 rounded-2xl border border-[#F7C66A]/25 bg-[#031B17]/35 px-5 py-4 text-sm text-white/80">
                Veuillez envoyer vos participation à l'adresse :{" "}
                <a href="mailto:concours@aymenpromotion.com" className="text-[#F7C66A] hover:text-white transition-colors">
                  concours@aymenpromotion.com
                </a>{" "}
                avant le dernier délai fixé le : <span className="text-[#F7C66A] font-bold">20-05-2026</span>
              </div>
              {category === "hotel" ? (
                <div className="space-y-6">
                  <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wide text-white">
                    Objet du concours
                  </h2>
                  <div className="text-white/75 leading-relaxed space-y-4">
                    <p>
                      Le concours porte sur la conception de l’enveloppe volumétrique et du traitement de façade d’un hôtel.
                      Les participants sont invités à proposer une vision architecturale forte, innovante et contextuelle, mettant en valeur :
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>L’identité visuelle de l’hôtel</li>
                      <li>L’expression volumétrique globale</li>
                      <li>Le traitement des façades (matériaux, rythmes, textures, percements…)</li>
                      <li>L’intégration dans son environnement</li>
                    </ul>
                    <p>
                      Les participants devront développer une démarche conceptuelle claire (genèse du projet), mettant en évidence le processus de transformation depuis l’idée initiale jusqu’à la proposition finale. Le projet devra intégrer des considérations esthétiques, climatiques et d’usage.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wide text-white">
                    Objet du concours
                  </h2>
                  <div className="text-white/75 leading-relaxed space-y-4">
                    <p>
                      Dans le cadre de la valorisation de la créativité architecturale des jeunes concepteurs, nous lançons un concours d’architecture destiné aux étudiants, portant sur la conception d’une villa collective.
                    </p>
                    <p className="font-bold text-white">OBJET DU CONCOURS</p>
                    <p>
                      Le concours consiste à concevoir une villa résidentielle de type immeuble (villa collective) sur un terrain donné, en développant une approche architecturale cohérente alliant :
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Organisation fonctionnelle optimale</li>
                      <li>Expression volumétrique contemporaine</li>
                      <li>Qualité des façades et des espaces extérieurs</li>
                      <li>Intégration au contexte urbain</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
