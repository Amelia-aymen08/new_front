import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

// --- Mock Data ---

const POSTS = [
  {
    id: 1,
    title: "Batir un heritage Immobilier pour un Patrimoine...",
    image: "/blog.jpg",
    date: { day: "03", month: "Feb" },
    category: "Vos Voisins"
  },
  {
    id: 2,
    title: "Batir un heritage Immobilier pour un Patrimoine...",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    date: { day: "03", month: "Feb" },
    category: "Vos Voisins"
  },
  {
    id: 3,
    title: "Batir un heritage Immobilier pour un Patrimoine...",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800",
    date: { day: "03", month: "Feb" },
    category: "Vos Voisins"
  },
  {
    id: 4,
    title: "Batir un heritage Immobilier pour un Patrimoine...",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=800",
    date: { day: "03", month: "Feb" },
    category: "Vos Voisins"
  },
  {
    id: 5,
    title: "Batir un heritage Immobilier pour un Patrimoine...",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800",
    date: { day: "03", month: "Feb" },
    category: "Vos Voisins"
  },
  {
    id: 6,
    title: "Batir un heritage Immobilier pour un Patrimoine...",
    image: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&q=80&w=800",
    date: { day: "03", month: "Feb" },
    category: "Vos Voisins"
  }
];

const CATEGORIES = [
  "TOUS NOS ARTICLES",
  "TOUS NOS ARTICLES",
  "TOUS NOS ARTICLES",
  "TOUS NOS ARTICLES",
  "TOUS NOS ARTICLES",
  "TOUS NOS ARTICLES"
];

const RECENT_ARTICLES = [1, 2, 3];

export default function BlogPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#031B17] font-['Montserrat'] text-white overflow-hidden">
      {/* Background Texture & Lights */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(21,105,83,0.3),transparent_70%)]" />
        <div className="absolute top-[40%] right-[-10%] w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(225,187,127,0.1),transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{ 
          backgroundImage: 'url("/texture.png")', 
          backgroundSize: '1200px', 
          backgroundRepeat: 'repeat' 
        }} />
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
            SUR L'IMMOBILIER<br/>ALGÉRIEN
          </h1>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* LEFT COLUMN: BLOG GRID */}
          <div className="w-full lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {POSTS.map((post, idx) => (
                <motion.div
                  key={post.id}
                  className="bg-[#1F3A35]/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden group hover:border-[#F7C66A]/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    
                    {/* Category Overlay */}
                    <div className="absolute bottom-4 left-0 w-full text-center">
                       <span className="font-['PhotographSignature'] text-4xl text-white drop-shadow-md">
                         {post.category}
                       </span>
                       <p className="text-[8px] uppercase tracking-widest text-white/80">L'actualité de nos résidences</p>
                    </div>

                    {/* Date Badge */}
                    <div className="absolute top-4 right-4 bg-white text-[#031B17] rounded-lg p-2 text-center min-w-[50px] shadow-lg">
                      <span className="block text-xs uppercase font-bold text-gray-500">{post.date.month}</span>
                      <span className="block text-xl font-bold leading-none">{post.date.day}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-white mb-4 line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <Link to={`/blog/${post.id}`} className="inline-flex items-center text-[#F7C66A] text-xs font-bold uppercase tracking-wider hover:text-white transition-colors">
                      <span className="mr-1">+</span> LIRE L'ARTICLE
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View More Button */}
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <button className="bg-[#F7C66A] text-[#031B17] px-8 py-3 rounded-md font-bold text-sm uppercase tracking-wide hover:bg-white transition-colors shadow-lg">
                VOIR PLUS
              </button>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: SIDEBAR */}
          <motion.div 
            className="w-full lg:w-1/4 space-y-12"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            
            {/* Search */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="RECHERCHE" 
                className="w-full bg-transparent border border-[#F7C66A] rounded-lg py-3 px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:bg-white/5"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#F7C66A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              {CATEGORIES.map((cat, idx) => (
                <button 
                  key={idx}
                  className="w-full border border-white/20 rounded-lg py-3 text-xs uppercase text-gray-300 hover:border-[#F7C66A] hover:text-[#F7C66A] transition-all flex items-center justify-center group"
                >
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  {cat}
                </button>
              ))}
            </div>

            {/* Recent Articles */}
            <div>
              <h4 className="text-[#F7C66A] text-sm font-bold uppercase tracking-wider mb-6">
                ARTICLES RÉCENTS
              </h4>
              <div className="space-y-4">
                {RECENT_ARTICLES.map((_, idx) => (
                  <div key={idx} className="bg-gray-300/80 h-24 rounded-lg w-full animate-pulse"></div>
                ))}
              </div>
            </div>

          </motion.div>

        </div>

        {/* NEWSLETTER SECTION */}
        <motion.div 
          className="mt-24 relative rounded-3xl overflow-hidden shadow-2xl h-[500px]"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Background Image covering the whole section */}
          <div className="absolute inset-0">
             <img 
               src="/newsletter.png" 
               alt="Newsletter" 
               className="w-full h-full object-cover object-left"
             />
          </div>

          {/* Right Content Overlay - Hidden Visually but kept for Structure if needed or removed entirely */}
          <div className="absolute top-0 right-0 h-full w-full md:w-1/2 lg:w-[45%] p-8 md:p-12 flex flex-col justify-center text-[#031B17]">
             <div className="mb-6">
               <div className="flex items-center gap-2 mb-2">
                 <div className="text-3xl font-bold flex items-center">
                    <img src="/logo_black.png" alt="Aymen Promotion" className="h-12 mr-2" />
                 </div>
               </div>
               <p className="font-['PhotographSignature'] text-2xl text-gray-800 ml-2">Trappez à la Bonne Porte</p>
             </div>
             
             <h2 className="text-3xl md:text-4xl font-light mb-8 leading-tight">
               Restez au coeur de<br/>
               <span className="font-normal">l'actualité du haut</span><br/>
               <span className="font-normal">standing</span>
             </h2>

             <div className="relative w-full">
               <input 
                 type="email" 
                 placeholder="E-mail" 
                 className="w-full bg-transparent border border-gray-400 rounded-full py-4 pl-6 pr-14 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#031B17] transition-colors"
               />
               <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-600 hover:text-[#031B17] transition-colors">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                   <path d="M5 12h14M12 5l7 7-7 7" />
                 </svg>
               </button>
             </div>
          </div>
        </motion.div>

      </div>

      <Footer />
    </div>
  );
}
