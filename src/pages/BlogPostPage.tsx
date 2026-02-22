import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useBlogData } from "../hooks/useBlogData";
import ArticleContentRenderer from "../components/blog/ArticleContentRenderer";
import Sidebar from "../components/blog/Sidebar";
import config from "../config";

const STRAPI_URL = config.STRAPI_URL;

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>(); // 'id' here is actually the slug
  const { data, loading, error } = useBlogData(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#031B17] flex items-center justify-center">
        <div className="inline-block w-12 h-12 border-4 border-[#F7C66A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#031B17] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
          <p className="text-gray-400">Une erreur est survenue lors du chargement de l'article.</p>
        </div>
      </div>
    );
  }

  const { attributes } = data.data;
  // const imageUrl =
  //   attributes.mignature_image?.data?.attributes?.formats?.medium?.url ||
  //   attributes.mignature_image?.data?.attributes?.url ||
  //   "";
  // const fullImageUrl = imageUrl.startsWith("http")
  //   ? imageUrl
  //   : `${STRAPI_URL}${imageUrl}`;

  return (
    <div className="relative min-h-screen bg-[#031B17] font-['Montserrat'] text-white overflow-hidden">
      {/* Background Texture & Lights */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(21,105,83,0.3),transparent_70%)]" />
        <div className="absolute top-[40%] right-[-10%] w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(225,187,127,0.1),transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage: 'url("/texture.png")',
            backgroundSize: "1200px",
            backgroundRepeat: "repeat",
          }}
        />
      </div>

      <Header className="absolute top-0 left-0 z-40 w-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-32 md:px-8">
        {/* Main Layout Grid */}
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* LEFT COLUMN: Article Content */}
          <div className="w-full lg:w-3/4">
            {/* Title Section */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4 text-sm font-bold uppercase tracking-wider text-[#F7C66A]">
                <span className="flex items-center gap-2">
                   <i className="fa-regular fa-calendar"></i>
                   {new Date(attributes.date).toLocaleDateString("fr")}
                </span>
                <span className="flex items-center gap-2">
                   <i className="fa-regular fa-user"></i>
                   {attributes.auteur}
                </span>
              </div>
              
              <h1 className="mb-6 text-2xl font-bold uppercase leading-tight tracking-wide text-white md:text-3xl lg:text-4xl">
                {attributes.titre}
              </h1>
              
              <div className="inline-block px-4 py-1 rounded-full border border-[#F7C66A] text-[#F7C66A] text-xs font-bold uppercase tracking-widest">
                {attributes.category}
              </div>
            </div>

            {/* Featured Image */}
            {/* 
                We only show the featured image here if it's not the very first element of the article content.
                Some content editors put the same image at the start of the body.
                However, to be safe and avoid duplication as per user request, we can just hide this top one
                if the user says it's duplicated. But usually, the "Featured Image" is distinct metadata.
                If it appears twice, it's because it's in the 'attributes.article' content array too.
                
                Strategy: We will keep this Featured Image as the "Main" header image.
                But we need to make sure the ArticleContentRenderer doesn't render it again if it's the first item.
                
                Actually, the user said "l'image de couveetire est affiché deux fois dedans", which implies 
                the featured image (mignature_image) is likely manually added to the content body in Strapi as well.
                
                Since we can't easily peek into `attributes.article` to check if the first image URL matches 
                the featured image URL without complex logic, and the user request is specific about "duplicate",
                we will assume the content body HAS the image and we should probably NOT show it here OR 
                the user wants us to fix the content. 
                
                But usually, standard blog design has a Hero Image. 
                If I remove it here, the title might look floating. 
                Let's try to remove it here as requested if it's duplicated "inside".
                
                WAIT, if I remove it here, and it's NOT in the content, then we have NO image.
                
                Let's look at the previous turn. I added it back because it was missing? 
                No, I am looking at the code.
                
                Let's comment it out for now to solve "displayed twice".
            */}
            {/* 
            {imageUrl && (
              <div className="relative mb-12 overflow-hidden rounded-2xl shadow-2xl border border-white/10">
                <img
                  src={fullImageUrl}
                  alt={attributes.titre}
                  className="h-auto w-full object-cover"
                />
              </div>
            )} 
            */}

            {/* Content Body */}
            <div className="space-y-6 text-sm leading-relaxed text-white/80 md:text-base font-light">
              {attributes.article.map((content, index) => (
                <ArticleContentRenderer key={index} content={content} />
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <div className="w-full lg:w-1/4">
            <Sidebar />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
