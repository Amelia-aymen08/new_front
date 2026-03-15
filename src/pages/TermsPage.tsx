import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TermsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#031B17] font-['Montserrat'] text-white">
      <Header className="absolute top-0 left-0 z-40 w-full" />
      
      <main className="container mx-auto px-6 py-32 md:py-40 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-[#F7C66A] mb-8 uppercase tracking-widest">
          Conditions Générales d'Utilisation
        </h1>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 space-y-6 text-gray-300 leading-relaxed font-light">
          <div className="p-4 bg-[#F7C66A]/10 border border-[#F7C66A] rounded-lg mb-8">
            <p className="text-[#F7C66A] font-bold text-sm text-center uppercase tracking-wider">
              Document en cours de validation juridique
            </p>
          </div>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Introduction</h2>
            <p>
              Bienvenue sur le site web d'Aymen Promotion Immobilière. En accédant à ce site, vous acceptez d'être lié par les présentes conditions générales d'utilisation, toutes les lois et réglementations applicables, et vous acceptez d'être responsable du respect des lois locales applicables.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Licence d'utilisation</h2>
            <p>
              Il est permis de télécharger temporairement une copie des documents (informations ou logiciels) sur le site web d'Aymen Promotion Immobilière pour une visualisation transitoire personnelle et non commerciale uniquement. Il s'agit de l'octroi d'une licence, et non d'un transfert de titre.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Clause de non-responsabilité</h2>
            <p>
              Les documents sur le site web d'Aymen Promotion Immobilière sont fournis "tels quels". Aymen Promotion Immobilière ne donne aucune garantie, expresse ou implicite, et rejette par la présente toutes les autres garanties, y compris, sans limitation, les garanties implicites ou conditions de qualité marchande, d'adéquation à un usage particulier, ou de non-violation de la propriété intellectuelle ou autre violation des droits.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Limitations</h2>
            <p>
              En aucun cas, Aymen Promotion Immobilière ou ses fournisseurs ne pourront être tenus responsables de tout dommage (y compris, sans limitation, les dommages pour perte de données ou de profit, ou en raison d'une interruption d'activité) découlant de l'utilisation ou de l'impossibilité d'utiliser les documents sur le site web d'Aymen Promotion Immobilière.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">5. Précision des documents</h2>
            <p>
              Les documents apparaissant sur le site web d'Aymen Promotion Immobilière pourraient inclure des erreurs techniques, typographiques ou photographiques. Aymen Promotion Immobilière ne garantit pas que l'un des documents sur son site web est exact, complet ou à jour.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">6. Liens</h2>
            <p>
              Aymen Promotion Immobilière n'a pas examiné tous les sites liés à son site web et n'est pas responsable du contenu de ces sites liés. L'inclusion de tout lien n'implique pas l'approbation par Aymen Promotion Immobilière du site. L'utilisation de tout site web lié est aux risques et périls de l'utilisateur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">7. Modifications</h2>
            <p>
              Aymen Promotion Immobilière peut réviser ces conditions d'utilisation de son site web à tout moment sans préavis. En utilisant ce site web, vous acceptez d'être lié par la version alors en vigueur de ces conditions d'utilisation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">8. Loi applicable</h2>
            <p>
              Ces termes et conditions sont régis et interprétés conformément aux lois de l'Algérie et vous vous soumettez irrévocablement à la juridiction exclusive des tribunaux de cet État ou de cet endroit.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
