import React from "react";
import { Link } from "react-router-dom";
import { useBlogs } from "../../hooks/useBlogs";
import config from "../../config";

const STRAPI_URL = config.STRAPI_URL;

const Sidebar: React.FC = () => {
  const { blogs, loading } = useBlogs();

  // Extract unique categories
  const categories = Array.from(new Set(blogs.map((b) => b.attributes.category))).slice(0, 5);

  // Get last 3 articles
  const recentArticles = blogs.slice(0, 3);

  return (
    <div className="w-full md:sticky md:top-20 space-y-8">
      
      {/* Categories Card */}
      <div className="bg-[#1F3A35]/80 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
        <div className="flex flex-col gap-3">
          {/* Tous */}
          <Link
            to="/blog?category=Tous"
            className="w-full border border-[#F7C66A]/50 rounded-lg py-3 px-6 flex items-center gap-3 text-white font-bold text-xs uppercase tracking-widest hover:bg-[#F7C66A] hover:text-[#031B17] hover:border-[#F7C66A] transition-all group"
          >
             <span className="text-[#F7C66A] group-hover:text-[#031B17] transition-colors">→</span>
             TOUS NOS ARTICLES
          </Link>

          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/blog?category=${cat}`}
              className="w-full border border-[#F7C66A]/50 rounded-lg py-3 px-6 flex items-center gap-3 text-white font-bold text-xs uppercase tracking-widest hover:bg-[#F7C66A] hover:text-[#031B17] hover:border-[#F7C66A] transition-all group"
            >
               <span className="text-[#F7C66A] group-hover:text-[#031B17] transition-colors">→</span>
               {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Articles Card */}
      <div className="bg-[#1F3A35]/80 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
        <h5 className="text-[#F7C66A] text-xs font-bold uppercase tracking-widest mb-6">
          ARTICLES RÉCENTS
        </h5>
        <div className="flex flex-col gap-6">
          {loading ? (
             <div className="text-white/50 text-sm">Chargement...</div>
          ) : (
             recentArticles.map((article) => {
                const imageUrl =
                  article.attributes.mignature_image?.data?.attributes?.formats?.thumbnail?.url ||
                  article.attributes.mignature_image?.data?.attributes?.formats?.small?.url ||
                  article.attributes.mignature_image?.data?.attributes?.url ||
                  "";
                const fullImageUrl = imageUrl.startsWith("http")
                  ? imageUrl
                  : `${STRAPI_URL}${imageUrl}`;

                return (
                  <Link key={article.id} to={`/blog/${article.attributes.slug}`} className="block group">
                    <div className="w-full h-32 bg-white/5 rounded-lg overflow-hidden border border-white/5 group-hover:border-[#F7C66A]/50 transition-colors mb-3">
                      {imageUrl && (
                        <img 
                          src={fullImageUrl} 
                          alt={article.attributes.titre}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      )}
                    </div>
                    <h6 className="text-white text-sm font-bold leading-snug group-hover:text-[#F7C66A] transition-colors line-clamp-2">
                      {article.attributes.titre}
                    </h6>
                  </Link>
                );
             })
          )}
        </div>
      </div>

    </div>
  );
};

export default Sidebar;
