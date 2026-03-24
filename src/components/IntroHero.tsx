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
    const vid = videoRef.current;
    if (!vid) return;

    vid.muted = true;
    (vid as any).defaultMuted = true;
    vid.autoplay = true;
    vid.playsInline = true;
    vid.setAttribute("muted", "");
    vid.setAttribute("playsinline", "");
    vid.setAttribute("webkit-playsinline", "");

    const tryPlay = () => {
      vid.play().catch(() => {});
    };

    const onCanPlay = () => {
      tryPlay();
    };

    vid.addEventListener("canplay", onCanPlay);
    window.addEventListener("touchstart", tryPlay, { once: true, passive: true });
    window.addEventListener("click", tryPlay, { once: true, passive: true } as any);

    vid.load();
    tryPlay();

    // Fallback de sécurité : 8s max
    const timer = setTimeout(() => {
      if (!isEnding) {
        setIsEnding(true);
        setTimeout(onDone, 800);
      }
    }, 8000);

    return () => {
      clearTimeout(timer);
      vid.removeEventListener("canplay", onCanPlay);
    };
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
