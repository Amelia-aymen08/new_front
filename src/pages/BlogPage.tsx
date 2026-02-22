import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useLocation } from "react-router-dom";
import { useBlogs } from "../hooks/useBlogs";
import Sidebar from "../components/blog/Sidebar";
import config from "../config";

const STRAPI_URL = config.STRAPI_URL;

export default function BlogPage() {
  const { blogs, loading, error } = useBlogs();
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [visibleCount, setVisibleCount] = useState(6); // Pagination start
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Extract unique categories from URL if present
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get("category");
    if (categoryParam) {
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory("Tous");
    }
  }, [location.search]);

  // Extract unique categories
  // const categories = ["Tous", ...Array.from(new Set(blogs.map((b) => b.attributes.category)))];

  const filteredBlogs = activeCategory === "Tous" 
    ? blogs 
    : blogs.filter(b => b.attributes.category === activeCategory);
    
  const visibleBlogs = filteredBlogs.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

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

      <div className="relative z-10 pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Hero Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-['PhotographSignature'] text-6xl md:text-8xl text-[#F7C66A] block mb-2">
            Le Blog
          </span>
          <h1 className="text-2xl md:text-4xl font-bold uppercase tracking-widest text-white">
            SUR L'IMMOBILIER<br />
            ALGÉRIEN
          </h1>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN: BLOG GRID */}
          <div className="w-full lg:w-[70%]">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block w-12 h-12 border-4 border-[#F7C66A] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-400">{error}</div>
            ) : (
              <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visibleBlogs.map((post, idx) => {
                  const imageUrl =
                    post.attributes.mignature_image?.data?.attributes?.formats?.medium?.url ||
                    post.attributes.mignature_image?.data?.attributes?.url ||
                    "";
                  const fullImageUrl = imageUrl.startsWith("http")
                    ? imageUrl
                    : `${STRAPI_URL}${imageUrl}`;

                  return (
                    <motion.div
                      key={post.id}
                      className="bg-[#2F453E] rounded-xl overflow-hidden group flex flex-col h-full shadow-lg"
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                    >
                      {/* Image Container */}
                      <div className="relative aspect-[16/9] w-full p-4 pb-0">
                         <div className="relative w-full h-full">
                           <div className="w-full h-full rounded-xl overflow-hidden">
                             <Link to={`/blog/${post.attributes.slug}`}>
                              {imageUrl ? (
                                <img
                                  src={fullImageUrl}
                                  alt={post.attributes.titre}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white/20">
                                  Aucune image
                                </div>
                              )}
                             </Link>
                           </div>
                            
                            {/* Date Badge */}
                            <div className="absolute bottom-0 right-0 translate-y-1/2 -translate-x-4 bg-white text-black rounded-xl w-14 h-14 flex flex-col items-center justify-center shadow-lg z-50">
                              <span className="text-[10px] font-bold uppercase leading-none mb-0.5">
                                {new Date(post.attributes.date).toLocaleDateString("fr-FR", { month: "short" }).replace('.', '')}
                              </span>
                              <span className="text-xl font-bold leading-none">
                                {new Date(post.attributes.date).getDate().toString().padStart(2, '0')}
                              </span>
                            </div>
                         </div>
                      </div>

                      {/* Content */}
                      <div className="px-6 pt-8 pb-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 leading-tight">
                          <Link to={`/blog/${post.attributes.slug}`}>
                            {post.attributes.titre}
                          </Link>
                        </h3>

                        <div className="mt-auto">
                           <Link
                            to={`/blog/${post.attributes.slug}`}
                            className="text-[#F7C66A] font-bold text-[10px] uppercase tracking-widest hover:text-white transition-colors"
                          >
                            + LIRE L'ARTICLE
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {visibleCount < filteredBlogs.length && (
                <div className="flex justify-center mt-12">
                  <button 
                    onClick={handleLoadMore}
                    className="bg-[#F7C66A] text-[#031B17] px-8 py-3 rounded-md font-bold text-sm uppercase tracking-wide hover:bg-white transition-colors shadow-lg"
                  >
                    Voir plus
                  </button>
                </div>
              )}
            </>
            )}
          </div>

          {/* RIGHT COLUMN: SIDEBAR */}
          <div className="w-full lg:w-[30%]">
            <Sidebar />
          </div>
        </div>

        {/* NEWSLETTER SECTION */}
        <motion.div 
          className="mt-24 relative rounded-3xl overflow-hidden shadow-2xl h-auto md:h-[500px]"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Full Background Image */}
          <div className="absolute inset-0">
             <img 
               src="/newsletter.png" 
               alt="Newsletter" 
               className="w-full h-full object-cover"
             />
          </div>

          {/* Content Overlay (Right Aligned) */}
          <div className="relative z-10 w-full h-full flex flex-col md:flex-row">
            {/* Left Spacer */}
            <div className="w-full md:w-1/2 h-64 md:h-full"></div>

            {/* Right Content Section */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-[#031B17]">
               <div className="mb-6 flex flex-col items-start">
                 <img src="/logo_black.png" alt="Aymen Promotion" className="h-16 mb-2" />
                 <p className="font-['PhotographSignature'] text-xl text-gray-800 ml-1">Frappez à la Bonne Porte</p>
               </div>
               
               <h2 className="text-3xl md:text-5xl font-light mb-10 leading-tight">
                 Restez au coeur de<br/>
                 <span className="font-normal">l'actualité du haut</span><br/>
                 <span className="font-normal">standing</span>
               </h2>

               <div className="relative w-full max-w-md border border-gray-400 rounded-full">
                 <input 
                   type="email" 
                   placeholder="E-mail" 
                   className="w-full bg-transparent border-none rounded-full py-4 pl-6 pr-14 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-0"
                 />
                 <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-600 hover:text-[#031B17] transition-colors">
                   <i className="fa-solid fa-arrow-right-long text-xl"></i>
                 </button>
               </div>
            </div>
          </div>
        </motion.div>

      </div>

      <Footer />
    </div>
  );
}
