import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useBlogs } from "../hooks/useBlogs";
import config from "../config";

const STRAPI_URL = config.STRAPI_URL;

export default function NewsSection() {
  const { blogs, loading, error } = useBlogs();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const carouselRef = useRef(null);

  // Récupérer les 6 derniers articles (triés par date)
  const latestBlogs = React.useMemo(() => {
    if (!blogs || blogs.length === 0) return [];
    
    return [...blogs]
      .sort((a, b) => {
        const dateA = new Date(a.attributes.date).getTime();
        const dateB = new Date(b.attributes.date).getTime();
        return dateB - dateA;
      })
      .slice(0, 6);
  }, [blogs]);

  const totalSlides = Math.ceil(latestBlogs.length / visibleCount);

  const nextSlide = () => {
    if (currentIndex < totalSlides - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(totalSlides - 1);
    }
  };

  // Ajuster le nombre d'articles visibles selon la taille d'écran
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <section className="py-12 text-center text-white">
        <div className="inline-block w-8 h-8 border-4 border-[#F7C66A] border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  if (error || latestBlogs.length === 0) {
    return null;
  }

  return (
    <section className="py-12 text-center text-white pb-0 overflow-hidden">
      <div>
        {/* Titre */}
        <div className="mb-12">
          <h3 className="font-['PhotographSignature'] text-5xl text-[#F7C66A] mb-2">
            Actualités
          </h3>
          <h2 className="text-3xl font-bold uppercase tracking-wider">
            D'AYMEN PROMOTION
          </h2>
        </div>

        {/* Carousel News */}
        <div className="relative mx-auto max-w-[95%] md:max-w-7xl px-4">
          {/* Flèches de navigation globales - Centrées sur les images */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F7C66A] text-[#031B17] flex items-center justify-center hover:bg-white transition-all shadow-xl"
            aria-label="Article précédent"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F7C66A] text-[#031B17] flex items-center justify-center hover:bg-white transition-all shadow-xl"
            aria-label="Article suivant"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>

          {/* Carousel container */}
          <div className="overflow-hidden">
            <div 
              ref={carouselRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {/* Grouper les articles par slide */}
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div 
                  key={slideIndex} 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full flex-shrink-0"
                >
                  {latestBlogs
                    .slice(slideIndex * visibleCount, (slideIndex + 1) * visibleCount)
                    .map((item) => {
                      const imageUrl =
                        item.attributes.mignature_image?.data?.attributes?.formats?.medium?.url ||
                        item.attributes.mignature_image?.data?.attributes?.url ||
                        "";
                      const fullImageUrl = imageUrl.startsWith("http")
                        ? imageUrl
                        : `${STRAPI_URL}${imageUrl}`;

                      return (
                        <div key={item.id} className="group relative flex flex-col text-left">
                          {/* Image Card */}
                          <div className="relative mb-4">
                            {/* Conteneur d'image avec fond vert */}
                            <div className="relative overflow-hidden rounded-2xl bg-[#052620] aspect-[4/3] flex items-center justify-center">
                              <Link to={`/blog/${item.attributes.slug}`} className="block w-full h-full flex items-center justify-center">
                                <img
                                  src={fullImageUrl || "/sections/b1.jpg"}
                                  alt={item.attributes.titre}
                                  className="w-full h-full object-contain p-4 transition duration-500 group-hover:scale-105"
                                  onError={(e) => {
                                    e.currentTarget.src = "/sections/b1.jpg";
                                  }}
                                />
                              </Link>
                              
                              {/* Date Badge - Positionné en bas à droite */}
                              <div className="absolute bottom-3 right-3 flex flex-col items-center rounded-lg bg-white/90 backdrop-blur-sm px-3 py-2 text-black shadow-lg z-10">
                                <span className="text-[10px] font-bold uppercase text-gray-600">
                                  {new Date(item.attributes.date).toLocaleDateString("fr-FR", { month: "short" }).toUpperCase().replace('.', '')}
                                </span>
                                <span className="text-lg font-bold leading-none">
                                  {new Date(item.attributes.date).getDate().toString().padStart(2, '0')}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Texte - Aligné à gauche */}
                          <h4 className="font-['PhotographSignature'] text-2xl md:text-3xl text-[#F7C66A] mb-2 line-clamp-1">
                            {item.attributes.titre}
                          </h4>
                          <p className="text-xs md:text-sm text-white/80 leading-relaxed max-w-[95%] mb-4 line-clamp-2">
                            {item.attributes.description || "Immobilier pour un Patrimoine Durable avec Aymen Promotion"}
                          </p>
                          
                          <Link 
                            to={`/blog/${item.attributes.slug}`}
                            className="text-[10px] font-bold uppercase tracking-widest text-[#F7C66A] hover:text-white transition-colors flex items-center gap-2 w-fit group"
                          >
                            <span className="text-lg leading-none transform group-hover:translate-x-1 transition-transform">▸</span> 
                            <span>LIRE L'ARTICLE</span>
                          </Link>
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
          
          {/* Pagination Dots */}
          {totalSlides > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentIndex 
                      ? "w-8 bg-[#F7C66A]" 
                      : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Aller à la slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}