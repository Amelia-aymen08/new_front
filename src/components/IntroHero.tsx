import React, { useEffect, useRef, useState } from "react";

type IntroHeroProps = {
  onDone: () => void;
};

export default function IntroHero({ onDone }: IntroHeroProps) {
  const [isEnding, setIsEnding] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState("/videos/loader.mp4");

  useEffect(() => {
    const updateVideoSrc = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setVideoSrc("/videos/loader_mobile.mp4");
      } else if (width >= 768 && width < 1024) {
        setVideoSrc("/videos/loader_tablette.mp4");
      } else {
        setVideoSrc("/videos/loader.mp4");
      }
    };

    updateVideoSrc();
    window.addEventListener("resize", updateVideoSrc);
    return () => window.removeEventListener("resize", updateVideoSrc);
  }, []);

  const handleEnd = () => {
    if (isEnding) return;
    setIsEnding(true);
    // Attendre la fin de l'animation de sortie (800ms) avant de démonter
    setTimeout(onDone, 800);
  };

  useEffect(() => {
    // Si la vidéo refuse de jouer (autoplay bloqué), on termine l'intro
    const vid = videoRef.current;
    if (vid) {
      // Recharger la vidéo si la source change
      vid.load();
      vid.play().catch((err) => {
        console.warn("Autoplay blocked or error:", err);
        // onDone(); // Ne pas terminer immédiatement si l'autoplay échoue, laisser l'utilisateur interagir ou attendre le timeout
      });
    }

    // Fallback de sécurité : 8s max
    const timer = setTimeout(() => {
      if (!isEnding) {
        setIsEnding(true);
        setTimeout(onDone, 800);
      }
    }, 8000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoSrc]); // Ajouter videoSrc comme dépendance pour rejouer si la source change

  return (
    <div
      className={[
        "fixed inset-0 z-[9999] overflow-hidden bg-black",
        isEnding ? "animate-introCurtainUp" : "",
      ].join(" ")}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="h-full w-full object-cover"
        onEnded={handleEnd}
        onError={(e) => {
            console.error("Video error:", e);
            // On error, we should probably finish to avoid being stuck
            handleEnd();
        }}
        draggable={false}
      />
    </div>
  );
}
