import React, { useEffect, useRef, useState } from "react";

type IntroHeroProps = {
  onDone: () => void;
};

export default function IntroHero({ onDone }: IntroHeroProps) {
  const [isEnding, setIsEnding] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
      vid.play().catch((err) => {
        console.warn("Autoplay blocked or error:", err);
        onDone();
      });
    }

    // Fallback de sécurité : 8s max
    const timer = setTimeout(() => {
      // On ne peut pas appeler handleEnd directement ici sans le mettre dans les dépendances
      // Mais on peut copier la logique ou utiliser une ref pour éviter les dépendances circulaires
      // Pour faire simple ici, on déclenche directement la fin
      if (!isEnding) {
          setIsEnding(true);
          setTimeout(onDone, 800);
      }
    }, 8000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={[
        "fixed inset-0 z-[9999] overflow-hidden bg-black",
        isEnding ? "animate-introCurtainUp" : "",
      ].join(" ")}
    >
      <video
        ref={videoRef}
        src="/videos/loader.mp4"
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
