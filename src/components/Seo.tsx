import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const DEFAULT_TITLE = "Aymen Promotion Immobilière";
const DEFAULT_DESCRIPTION = "Découvrez les résidences haut standing d’Aymen Promotion Immobilière au sein des communes huppées d’Alger. Promoteur immobilier Algérie.";
const DEFAULT_IMAGE = "https://aymenpromotion-dz.com/logo.png";
const DEFAULT_KEYWORDS = "immobilier Alger, promoteur immobilier, appartement Alger, résidence haut standing, logement de luxe";
const SITE_URL = "https://aymenpromotion-dz.com";

export interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  keywords?: string;
  appendTitleSuffix?: boolean;
}

export default function Seo({
  title,
  description,
  image,
  type = "website",
  keywords,
  appendTitleSuffix = true,
}: SeoProps) {
  const location = useLocation();
  const canonicalBase = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? SITE_URL
    : window.location.origin;
  const canonicalUrl = `${canonicalBase}${location.pathname}${location.search}`;
  const pageTitle = title
    ? appendTitleSuffix
      ? `${title} | Aymen Promotion Immobilière`
      : title
    : DEFAULT_TITLE;
  const pageDescription = description || DEFAULT_DESCRIPTION;
  const pageImage = image || DEFAULT_IMAGE;
  const pageKeywords = keywords || DEFAULT_KEYWORDS;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": type === "article" ? "BlogPosting" : "WebPage",
    url: canonicalUrl,
    name: pageTitle,
    description: pageDescription,
    image: pageImage,
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.group("SEO metadata");
      console.log({
        title: pageTitle,
        description: pageDescription,
        canonical: canonicalUrl,
        type,
        image: pageImage,
        keywords: pageKeywords,
      });
      console.groupEnd();
    }
  }, [pageTitle, pageDescription, canonicalUrl, pageImage, pageKeywords, type]);

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="fr" href={canonicalUrl} />
      <link rel="alternate" hrefLang="fr-DZ" href={canonicalUrl} />
      <meta name="robots" content="index, follow" />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:alt" content={pageTitle} />
      <meta property="og:site_name" content="Aymen Promotion Immobilière" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      <meta name="twitter:image:alt" content={pageTitle} />
      <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
    </Helmet>
  );
}
