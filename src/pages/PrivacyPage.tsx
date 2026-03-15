import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#031B17] font-['Montserrat'] text-white">
      <Header className="absolute top-0 left-0 z-40 w-full" />
      
      <main className="container mx-auto px-6 py-32 md:py-40 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-[#F7C66A] mb-8 uppercase tracking-widest">
          Politique de Confidentialité
        </h1>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 space-y-6 text-gray-300 leading-relaxed font-light">
          <div className="p-4 bg-[#F7C66A]/10 border border-[#F7C66A] rounded-lg mb-8">
            <p className="text-[#F7C66A] font-bold text-sm text-center uppercase tracking-wider">
              Document en cours de validation juridique
            </p>
          </div>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Protection de votre vie privée</h2>
            <p>
              Votre vie privée est importante pour nous. La politique d'Aymen Promotion Immobilière est de respecter votre vie privée concernant toute information que nous pouvons collecter auprès de vous sur notre site web.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Collecte de données</h2>
            <p>
              Nous ne demandons des informations personnelles que lorsque nous en avons vraiment besoin pour vous fournir un service. Nous les collectons par des moyens justes et légaux, avec votre connaissance et votre consentement. Nous vous informons également pourquoi nous les collectons et comment elles seront utilisées.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Conservation des données</h2>
            <p>
              Nous ne conservons les informations collectées que le temps nécessaire pour vous fournir le service demandé. Les données que nous stockons, nous les protégerons par des moyens commercialement acceptables pour éviter la perte et le vol, ainsi que l'accès, la divulgation, la copie, l'utilisation ou la modification non autorisés.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Partage des données</h2>
            <p>
              Nous ne partageons aucune information d'identification personnelle publiquement ou avec des tiers, sauf si la loi l'exige.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">5. Liens externes</h2>
            <p>
              Notre site web peut contenir des liens vers des sites externes qui ne sont pas exploités par nous. Veuillez noter que nous n'avons aucun contrôle sur le contenu et les pratiques de ces sites et ne pouvons accepter la responsabilité de leurs politiques de confidentialité respectives.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">6. Vos droits</h2>
            <p>
              Vous êtes libre de refuser notre demande d'informations personnelles, étant entendu que nous ne pourrons peut-être pas vous fournir certains des services souhaités. Votre utilisation continue de notre site web sera considérée comme une acceptation de nos pratiques en matière de confidentialité et d'informations personnelles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">7. Contact</h2>
            <p>
              Si vous avez des questions sur la façon dont nous traitons les données des utilisateurs et les informations personnelles, n'hésitez pas à nous contacter.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
