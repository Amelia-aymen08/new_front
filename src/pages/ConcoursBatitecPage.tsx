import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ConcoursBatitecPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

      <section className="relative z-10 pt-28 md:pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-4 md:px-10">
          <div className="text-center mb-10 md:mb-14">
            <span className="font-['PhotographSignature'] text-5xl md:text-7xl text-[#F7C66A] block mb-3">
              Batitec
            </span>
            <h1 className="text-2xl md:text-4xl font-bold uppercase tracking-wide">
                Concours d’Architecture
            </h1>
            <div className="mt-6 inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm text-white/85">
              Les candidatures ont été clôturées.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0C2A24]/75 backdrop-blur-md shadow-2xl"
            >
              <div className="absolute inset-0">
                <img
                  src="/sections/b1.jpg"
                  alt="Concours Hôtel"
                  className="h-full w-full object-cover opacity-25 group-hover:opacity-35 transition-opacity duration-500"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#031B17]/90 via-[#031B17]/55 to-[#031B17]/90" />
              </div>

              <div className="relative p-7 md:p-9">
                <div className="text-xs uppercase tracking-[0.22em] text-white/55 mb-2">Catégorie</div>
                <div className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-[#F7C66A]">
                  Hôtel
                </div>
                <p className="mt-4 text-sm text-white/70 leading-relaxed">
                  Concours de concept architectural – Hôtel.
                </p>

                <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-white/15 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white/70">
                  Candidatures clôturées
                </div>
              </div>
            </div>

            <div
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0C2A24]/75 backdrop-blur-md shadow-2xl"
            >
              <div className="absolute inset-0">
                <img
                  src="/sections/b2.jpg"
                  alt="Concours Villa"
                  className="h-full w-full object-cover opacity-25 group-hover:opacity-35 transition-opacity duration-500"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#031B17]/90 via-[#031B17]/55 to-[#031B17]/90" />
              </div>

              <div className="relative p-7 md:p-9">
                <div className="text-xs uppercase tracking-[0.22em] text-white/55 mb-2">Catégorie</div>
                <div className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-[#F7C66A]">
                  Villa
                </div>
                <p className="mt-4 text-sm text-white/70 leading-relaxed">
                  Conception d’une villa résidentielle (villa collective).
                </p>

                <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-white/15 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white/70">
                  Candidatures clôturées
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

