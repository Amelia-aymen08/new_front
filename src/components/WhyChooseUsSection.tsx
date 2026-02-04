import React from "react";

const stats = [
  {
    id: 1,
    value: (
      <div className="flex items-center justify-center">
        <svg width="192" height="82" viewBox="0 0 192 82" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48 h-auto text-white">
          <path d="M85.6592 0C102.291 2.12314e-05 115.301 15.468 115.78 39.0752C115.056 38.9887 114.302 38.9453 113.52 38.9453C111.692 38.9453 109.85 39.198 108.048 39.6738C103.618 21.9783 90.8391 6.42676 76.9033 6.42676C66.4893 6.42676 60.6133 13.9614 60.6133 29.3643C60.6134 51.324 75.6921 74.8952 92.6846 75.5586C93.1208 77.1914 93.8564 78.6584 94.8477 79.9199C91.6684 81.2788 88.2476 81.9999 84.6611 82C67.82 82 54.5215 65.9333 54.5215 41.5547C54.5216 17.1763 68.1512 0 85.6592 0ZM25.5977 0C37.0135 0.00019534 45.7656 7.86944 45.7656 19.8369C45.7655 36.5663 28.0372 53.9661 9.41895 70.9189H44.7666L48.5371 60.2812H48.9805L46.209 81.001L46.0977 81.1133C40.5573 80.8898 34.465 80.8896 28.7012 80.8896H0V80.3379C18.0632 60.1696 34.3535 40.5563 34.3535 23.8232C34.3534 12.2992 26.8155 6.42676 18.7266 6.42676C11.1928 6.4268 5.54034 11.1929 1.77344 18.0635L1.21875 17.7275C5.32098 8.30861 14.1817 0 25.5977 0ZM113.902 43.3359C121.039 43.3361 124.756 47.7234 124.756 54.9326V77.3066L129.662 76.7119V77.0107C128.026 78.5716 124.309 80.4316 121.486 80.4316C119.032 80.4316 117.546 79.0945 117.546 76.8633L117.539 76.8594V75.4463C115.236 78.4202 111.295 80.4277 107.132 80.4277C101.631 80.4276 96.8008 77.0069 96.8008 70.7637C96.801 64.5205 102.079 60.1338 110.629 60.1338C112.337 60.1338 115.088 60.2819 117.395 60.5811V56.4932C117.395 50.7689 113.678 47.499 108.325 47.499C104.385 47.4991 101.188 49.2839 98.8848 51.4395L98.6611 51.291C101.711 47.0556 107.432 43.3359 113.902 43.3359ZM181.84 43.3281C184.666 43.3281 187.788 43.9234 190.239 44.666L190.387 44.9648L188.901 55.4473H188.603L187.712 49.7236C184.738 47.4924 180.204 45.6358 176.264 45.6357C171.805 45.6357 169.573 47.6435 169.573 50.6895C169.573 59.9822 191.724 55.3001 191.724 68.5293C191.723 75.5908 185.329 80.4248 176.635 80.4248C172.841 80.4248 169.257 79.4341 166.75 78.501V79.6064L166.603 79.6816H149.729V79.459C153.892 78.4173 154.264 77.75 154.264 75.4434V55.668C154.264 50.9098 150.994 47.9356 146.607 47.9355C143.781 47.9355 141.33 49.2731 139.397 51.5801V78.2656L144.304 77.8945L144.38 78.042V79.6025L144.304 79.6787H126.907V79.4551C131.59 78.4133 132.037 77.7463 132.037 75.4395L132.033 75.4463V47.3477H126.904V46.9766L140.955 43.3359V43.4834C139.47 45.192 139.246 47.4996 139.246 50.6934H139.395C141.849 46.4578 146.308 43.332 151.661 43.332C157.757 43.3321 161.621 47.348 161.621 54.1104V78.2686L165.443 77.9834C165.432 77.9787 165.421 77.9744 165.41 77.9697L165.334 77.6738L166.819 66.9678L166.822 66.9717H167.122L168.013 72.6963C171.358 75.4466 176.859 78.1211 181.765 78.1211C186 78.121 188.379 76.3363 188.379 72.9912C188.378 62.8806 166.228 68.1607 166.228 55.2236C166.228 48.1623 172.547 43.3282 181.84 43.3281ZM106.98 61.5469C102.893 61.547 100.662 63.4788 100.662 66.6758C100.662 71.9531 107.129 76.416 112.11 76.416V76.4121C114.118 76.4121 115.975 75.8178 117.388 75.0752V66.0811C114.414 63.702 110.326 61.5469 106.98 61.5469Z" fill="currentColor"/>
        </svg>
      </div>
    ),
    label: "D'EXPERIENCE",
  },
  {
    id: 2,
    value: (
      <div className="flex items-center justify-center">
        <img src="/+30.png" alt="+30" className="w-32 h-auto" />
      </div>
    ),
    label: "RÉSIDENCES HAUT STANDING",
  },
  {
    id: 3,
    value: (
      <div className="flex items-center justify-center">
        <img src="/+15.png" alt="+15" className="w-28 h-auto" />
      </div>
    ),
    label: "COMMUNES PRESTIGIEUSES",
  },
  {
    id: 4,
    value: (
      <div className="flex items-center justify-center">
        <img src="/+1500.png" alt="+1500" className="w-40 h-auto" />
      </div>
    ),
    label: "APPARTEMENTS LIVRÉS",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-24 text-center text-white">
      <div className="mb-10">
        <h3 className="font-['PhotographSignature'] text-5xl text-[#F7C66A]">Pourquoi</h3>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold uppercase tracking-wider">NOUS CHOISIR ?</h2>
      </div>

      {/* Cards Section */}
      <div className="mx-auto mb-20 grid max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-3">
        {[
          {
            id: 1,
            title: "AMÉNAGEMENT",
            description: "Transformez votre espace de vie avec notre service d'aménagement intérieur...",
            icon: "/choose.svg"
          },
          {
            id: 2,
            title: "GESTION DE COPROPRIÉTÉ",
            description: "Notre service de gestion assure une sécurité 24h/24, l'entretien des espaces collectifs...",
            icon: "/management.svg"
          },
          {
            id: 3,
            title: "LOCAUX COMMERCIAUX",
            description: "Boostez votre activité avec nos locaux commerciaux en location dans des zones stratégiques...",
            icon: "/commercial.svg"
          }
        ].map((card) => (
          <div
            key={card.id}
            className="relative rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/20 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-black/20 before:to-transparent before:content-['']"
            style={{ boxShadow: "inset 0 -12px 16px rgba(0,0,0,0.20), 0 10px 22px rgba(0,0,0,0.22)" }}
          >
            <div className="relative z-10 flex items-center gap-6 px-8 py-8">
              <div className="flex h-14 w-14 items-center justify-center">
                <img src={card.icon} alt="" className="h-14 w-14" />
              </div>
              <div className="w-[2px] h-14 bg-white/25 rounded" />
              <div className="flex-1 text-left">
                <div className="text-lg font-bold uppercase tracking-wider text-[#F7C66A]">{card.title}</div>
                <div className="mt-2 text-sm leading-relaxed text-white/85">
                  {card.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-y-12 gap-x-8 md:grid-cols-4 md:gap-8">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center justify-start">
              <div className="mb-3 flex h-24 w-full items-center justify-center">
                {stat.value}
              </div>
              <div className="text-base md:text-lg tracking-[0.2em] uppercase text-white w-full leading-relaxed font-light">
              {stat.label}
            </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
