import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useBlogs } from "../hooks/useBlogs";
import config from "../config";

const STRAPI_URL = config.STRAPI_URL;

export default function NewsSection() {
  const { blogs, loading, error } = useBlogs();
  const [visibleCount, setVisibleCount] = useState(3);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const swipeRef = useRef<{
    pointerId: number | null;
    startX: number;
    startY: number;
    active: boolean;
    isDragging: boolean;
  }>({ pointerId: null, startX: 0, startY: 0, active: false, isDragging: false });

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

  const slidesData = React.useMemo(() => {
    const total = Math.ceil(latestBlogs.length / visibleCount);
    return Array.from({ length: total }).map((_, slideIndex) =>
      latestBlogs.slice(slideIndex * visibleCount, (slideIndex + 1) * visibleCount)
    );
  }, [latestBlogs, visibleCount]);

  const totalSlides = slidesData.length;
  const isLoopEnabled = totalSlides > 1;

  const loopSlidesData = React.useMemo(() => {
    if (!isLoopEnabled) return slidesData;
    return [slidesData[totalSlides - 1], ...slidesData, slidesData[0]];
  }, [isLoopEnabled, slidesData, totalSlides]);

  useEffect(() => {
    if (!isLoopEnabled) {
      setCarouselIndex(0);
      setIsTransitioning(true);
      return;
    }
    setIsTransitioning(false);
    setCarouselIndex(1);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsTransitioning(true));
    });
  }, [isLoopEnabled, visibleCount, latestBlogs.length]);

  const goToSlide = (slide: number) => {
    if (!isLoopEnabled) {
      setCarouselIndex(slide);
      return;
    }
    setIsTransitioning(true);
    setCarouselIndex(slide + 1);
  };

  const nextSlide = () => {
    if (!isLoopEnabled) return;
    setIsTransitioning(true);
    setCarouselIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (!isLoopEnabled) return;
    setIsTransitioning(true);
    setCarouselIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    if (!isLoopEnabled) return;
    if (carouselIndex === 0) {
      setIsTransitioning(false);
      setCarouselIndex(totalSlides);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsTransitioning(true));
      });
    }
    if (carouselIndex === totalSlides + 1) {
      setIsTransitioning(false);
      setCarouselIndex(1);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsTransitioning(true));
      });
    }
  };

  const activeDotIndex = isLoopEnabled ? (carouselIndex - 1 + totalSlides) % totalSlides : carouselIndex;

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
        <div className="mb-16 flex flex-col items-center justify-center relative pt-24 md:pt-32">
          <h3 className="font-['PhotographSignature'] text-6xl md:text-8xl text-[#F7C66A] absolute top-4 md:top-8 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
            Actualités
          </h3>
          <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-widest text-white mt-8 z-0">
            D'AYMEN PROMOTION
          </h2>
        </div>

        {/* Carousel News */}
        <div className="relative mx-auto max-w-[95%] md:max-w-7xl px-4">
          {/* Flèches de navigation globales - Légèrement remontées */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 md:-left-4 top-[45%] -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-[#031B17] flex items-center justify-center hover:bg-[#F7C66A] transition-all shadow-xl"
            aria-label="Article précédent"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 md:-right-4 top-[45%] -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-[#031B17] flex items-center justify-center hover:bg-[#F7C66A] transition-all shadow-xl"
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
              onTransitionEnd={handleTransitionEnd}
              className={`flex ${isTransitioning ? "transition-transform duration-500 ease-in-out" : ""}`}
              onPointerDown={(e) => {
                if (!isLoopEnabled) return;
                // Désactiver le drag sur desktop (souris) pour éviter les conflits de clic
                if (e.pointerType === "mouse") return;
                
                swipeRef.current = { 
                  pointerId: e.pointerId, 
                  startX: e.clientX, 
                  startY: e.clientY, 
                  active: true,
                  isDragging: false
                };
                try {
                  (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
                } catch {}
              }}
              onPointerMove={(e) => {
                if (!isLoopEnabled) return;
                if (!swipeRef.current.active) return;
                if (swipeRef.current.pointerId !== e.pointerId) return;
                
                // Si la souris bouge de plus de 5px, on considère que c'est un "drag" (swipe) et non un clic
                const dx = Math.abs(e.clientX - swipeRef.current.startX);
                const dy = Math.abs(e.clientY - swipeRef.current.startY);
                if (dx > 5 || dy > 5) {
                  swipeRef.current.isDragging = true;
                }
              }}
              onPointerUp={(e) => {
                if (!isLoopEnabled) return;
                if (!swipeRef.current.active) return;
                if (swipeRef.current.pointerId !== e.pointerId) return;
                
                const dx = e.clientX - swipeRef.current.startX;
                const dy = e.clientY - swipeRef.current.startY;
                
                // Si on a vraiment glissé (drag), on calcule le swipe
                if (swipeRef.current.isDragging) {
                  if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
                    if (dx > 0) prevSlide();
                    else nextSlide();
                  }
                }
                
                swipeRef.current.active = false;
                swipeRef.current.pointerId = null;
                // On garde isDragging vrai pendant un court instant pour onClickCapture
                setTimeout(() => {
                  swipeRef.current.isDragging = false;
                }, 50);
              }}
              onPointerCancel={() => {
                swipeRef.current.active = false;
                swipeRef.current.pointerId = null;
                swipeRef.current.isDragging = false;
              }}
              onClickCapture={(e) => {
                // On empêche le clic UNIQUEMENT si l'utilisateur a fait un "drag" (swipe).
                // S'il a juste cliqué (isDragging === false), on laisse le clic passer !
                if (swipeRef.current.isDragging) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              style={{ transform: `translateX(-${carouselIndex * 100}%)`, touchAction: 'pan-y' }}
            >
              {/* Grouper les articles par slide */}
              {loopSlidesData.map((slideBlogs, slideIndex) => (
                <div 
                  key={slideIndex} 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full flex-shrink-0"
                >
                  {slideBlogs.map((item) => {
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
                          <div className="relative mb-4 overflow-hidden rounded-2xl bg-white/5 aspect-[4/3]">
                            <Link to={`/blog/${item.attributes.slug}`} className="block w-full h-full">
                              <img
                                src={fullImageUrl || "/sections/b1.jpg"}
                                alt={item.attributes.titre}
                                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                                onError={(e) => {
                                  e.currentTarget.src = "/sections/b1.jpg";
                                }}
                              />
                            </Link>
                            
                            {/* Date Badge */}
                            <div className="absolute bottom-4 right-4 flex flex-col items-center rounded-lg bg-white px-3 py-2 text-black shadow-lg">
                              <span className="text-xs font-semibold uppercase text-gray-500">
                                {new Date(item.attributes.date).toLocaleDateString("fr-FR", { month: "short" }).replace('.', '').toUpperCase()}
                              </span>
                              <span className="text-xl font-bold leading-none">
                                {new Date(item.attributes.date).getDate().toString().padStart(2, '0')}
                              </span>
                            </div>
                          </div>

                          {/* Texte */}
                          <div className="mt-4">
                            <Link to={`/blog/${item.attributes.slug}`} className="block group-hover:opacity-80 transition-opacity">
                              <h4 className="text-xl font-bold text-[#F7C66A] mb-2 line-clamp-1">
                                {item.attributes.titre}
                              </h4>
                              <p className="text-sm text-white leading-snug w-full mb-0 line-clamp-2">
                                {item.attributes.description || "Immobilier pour un Patrimoine Durable avec Aymen Promotion"}
                              </p>
                            </Link>
                          </div>
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
                  onClick={() => goToSlide(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === activeDotIndex 
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
