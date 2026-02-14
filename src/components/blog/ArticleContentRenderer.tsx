import React from "react";
import { ArticleContent } from "../../types/blog";
import config from "../../config";

const STRAPI_URL = config.STRAPI_URL;

const DynamicHeading: React.FC<{ content: ArticleContent }> = ({ content }) => {
  const level = content.level || 2;
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const headingStyles: { [key: number]: string } = {
    1: "text-3xl md:text-4xl font-bold text-[#F7C66A] mt-8 mb-4 uppercase tracking-wide",
    2: "text-2xl md:text-3xl font-bold text-[#F7C66A] mt-8 mb-4 uppercase tracking-wide",
    3: "text-xl md:text-2xl font-semibold text-white mt-6 mb-3",
    4: "text-lg md:text-xl font-semibold text-white mt-6 mb-3",
    5: "text-base md:text-lg font-medium text-white mt-4 mb-2",
    6: "text-sm md:text-base font-medium text-white mt-4 mb-2",
  };

  return (
    <Tag className={`${headingStyles[level] || headingStyles[2]}`}>
      {content.children?.map((child, idx) => {
        if (child.type === "text") {
          return child.text;
        }
        return null;
      })}
    </Tag>
  );
};

const ArticleContentRenderer: React.FC<{ content: ArticleContent }> = ({
  content,
}) => {
  switch (content.type) {
    case "paragraph":
      return (
        <p className="mt-4 text-sm md:text-base text-justify leading-relaxed text-white/80 font-light">
          {content.children?.map((child, idx) => {
            if (child.type === "link") {
              return (
                <a
                  key={idx}
                  href={child.url}
                  className="text-[#F7C66A] underline decoration-1 underline-offset-2 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {child.children?.map((linkChild, linkIdx) =>
                    linkChild.type === "text" ? linkChild.text : null
                  )}
                </a>
              );
            } else if (child.type === "text") {
              return child.bold ? (
                <strong key={idx} className="font-bold text-white">
                  {child.text}
                </strong>
              ) : (
                <span key={idx}>{child.text}</span>
              );
            }
            return null;
          })}
        </p>
      );
    case "heading":
      return <DynamicHeading content={content} />;
    case "image":
      const imageUrl =
        content.image?.formats?.medium?.url ||
        content.image?.formats?.small?.url ||
        content.image?.url ||
        "";
      
      if (!imageUrl) return null;

      const fullImageUrl = imageUrl.startsWith("http")
        ? imageUrl
        : `${STRAPI_URL}${imageUrl}`;

      return (
        <div className="my-8 rounded-xl overflow-hidden shadow-lg border border-white/10">
          <img
            src={fullImageUrl}
            alt={content.image?.alternativeText || "Blog Image"}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      );
    case "code":
      // Assuming "code" block is used for raw HTML or Embeds like YouTube in user's logic
      return (
        <div className="w-full aspect-video mt-8 mb-8 rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black/50">
          {content.children?.map((child, idx) => {
            if (child.type === "text" && child.text) {
              const url = child.text;

              // Check if the URL is a YouTube link and extract the video ID
              const youtubeRegex =
                /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
              const match = url.match(youtubeRegex);
              if (match && match[1]) {
                const videoId = match[1];
                const embedUrl = `https://www.youtube.com/embed/${videoId}`;

                return (
                  <iframe
                    key={videoId}
                    className="w-full h-full"
                    src={embedUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                );
              }
            }
            return null;
          })}
        </div>
      );
    default:
      return null;
  }
};

export default ArticleContentRenderer;
