import React, { useEffect, useRef, useState } from "react";

type IntroHeroProps = {
  onDone: () => void;
};

export default function IntroHero({ onDone }: IntroHeroProps) {
  const [isEnding, setIsEnding] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
      handleEnd();
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleEnd = () => {
    if (isEnding) return;
    setIsEnding(true);
    // Attendre la fin de l'animation de sortie (800ms) avant de démonter
    setTimeout(onDone, 800);
  };

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
        muted
        playsInline
        className="h-full w-full object-cover"
        onEnded={handleEnd}
        draggable={false}
      />
    </div>
  );
}
