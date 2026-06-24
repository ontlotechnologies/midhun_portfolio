import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Clock, ArrowRight } from 'lucide-react';

export default function BlogSection({ blogs, loading }) {
  const [activeBlog, setActiveBlog] = useState(null);

  if (loading) {
    return (
      <section id="blog" className="relative py-14 bg-white overflow-hidden animate-pulse">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-left mb-10">
            <span className="text-[9px] uppercase tracking-[0.3em] text-gold-600 font-bold block mb-2">
              Notes From the Journey
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-charcoal-900">
              Stories. Reflections. Real Moments.
            </h2>
            <div className="h-[1.5px] w-16 bg-gold-500 mt-4" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="bg-white border border-cream-300 rounded overflow-hidden flex flex-col justify-between shadow-sm"
              >
                <div className="aspect-[16/10] bg-cream-200 border-b border-cream-300/40 relative" />
                <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between text-left space-y-4">
                  <div className="space-y-2">
                    <div className="h-2.5 bg-cream-200 rounded w-1/3" />
                    <div className="h-4 bg-cream-200 rounded w-5/6" />
                    <div className="h-4 bg-cream-200 rounded w-3/4" />
                  </div>
                  <div className="space-y-1.5 hidden sm:block">
                    <div className="h-3 bg-cream-200 rounded w-full" />
                    <div className="h-3 bg-cream-200 rounded w-5/6" />
                  </div>
                  <div className="h-3 bg-cream-200 rounded w-20 pt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="relative py-14 bg-white overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-left mb-10">
          <span className="text-[9px] uppercase tracking-[0.3em] text-gold-600 font-bold block mb-2">
            Notes From the Journey
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-charcoal-900">
            Stories. Reflections. Real Moments.
          </h2>
          <div className="h-[1.5px] w-16 bg-gold-500 mt-4"></div>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogs.map((blog, index) => {
            const slideX = index % 2 === 0 ? -60 : 60;
            const rotateVal = index % 2 === 0 ? -5 : 5;
            return (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, x: slideX, y: 40, rotate: rotateVal }}
                whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                whileHover={{ 
                  boxShadow: "0 25px 50px -12px rgba(37, 99, 235, 0.15)"
                }}
                whileTap={{}}
                transition={{ 
                  type: "spring",
                  stiffness: 70,
                  damping: 15,
                  mass: 0.8,
                  delay: (index % 4) * 0.08
                }}
                className="bg-white border border-cream-300 rounded overflow-hidden flex flex-col justify-between group shadow-sm cursor-pointer"
              >
              {/* Blog Cover Image */}
              <div className="aspect-[16/10] overflow-hidden bg-neutral-100 border-b border-cream-300/40 relative">
                <img 
                  src={blog.coverUrl} 
                  alt={blog.title} 
                  className="w-full h-full object-cover filter brightness-95 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
                />
                <span className="absolute top-2 left-2 bg-charcoal-900 border border-gold-500/20 text-gold-500 text-[7px] sm:text-[8px] uppercase tracking-widest px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-bold">
                  {blog.category}
                </span>
              </div>

              {/* Blog Text Content */}
              <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between text-left">
                <div>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[8px] sm:text-[9px] text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2 font-mono font-semibold">
                    <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="hidden xs:inline">&bull;</span>
                    <span className="flex items-center"><Clock size={9} className="mr-0.5" /> {blog.readingTime}</span>
                  </div>

                  <h3 className="font-serif text-charcoal-900 group-hover:text-gold-600 font-bold text-xs sm:text-sm leading-snug mb-2 sm:mb-3 transition-colors duration-300 line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <p className="hidden sm:block text-[11px] text-gray-600 font-light leading-relaxed mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>
                </div>

                <button
                  onClick={() => setActiveBlog(blog)}
                  className="inline-flex items-center space-x-1 sm:space-x-1.5 text-[8.5px] sm:text-[10px] uppercase tracking-widest text-charcoal-900 font-bold hover:text-gold-600 transition-colors cursor-pointer"
                >
                  <span>Read Article</span>
                  <ArrowRight size={10} className="sm:w-3 sm:h-3" />
                </button>
              </div>
            </motion.div>
          );
        })}
        </div>

      </div>

      {/* Full-Screen Reading Overlay */}
      <AnimatePresence>
        {activeBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal-900/95 overflow-y-auto pt-20 pb-12 px-6"
          >
            <div className="max-w-3xl mx-auto bg-cream-200 border border-cream-400 rounded-2xl overflow-hidden shadow-2xl relative">
              
              {/* Header Close button */}
              <button 
                onClick={() => setActiveBlog(null)}
                className="absolute top-4 right-4 bg-white/70 hover:bg-white text-charcoal-900 p-2 rounded-full border border-cream-300 z-10 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Cover Banner */}
              <div className="h-64 md:h-80 relative bg-neutral-200">
                <img 
                  src={activeBlog.coverUrl} 
                  alt={activeBlog.title} 
                  className="w-full h-full object-cover filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cream-200 via-transparent to-transparent"></div>
                
                {/* Meta overlays */}
                <div className="absolute bottom-6 left-6 right-6 text-left">
                  <span className="bg-gold-500 text-black text-[9px] uppercase tracking-[0.2em] px-2.5 py-0.5 font-bold rounded-full inline-block mb-3">
                    {activeBlog.category}
                  </span>
                  <h1 className="font-serif text-2xl md:text-4xl text-charcoal-900 font-extrabold tracking-tight mb-2 leading-tight">
                    {activeBlog.title}
                  </h1>
                  <div className="flex items-center space-x-3 text-[10px] text-gray-600 uppercase tracking-widest font-mono">
                    <span>{new Date(activeBlog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    <span>&bull;</span>
                    <span className="flex items-center"><Clock size={11} className="mr-1" /> {activeBlog.readingTime} read</span>
                  </div>
                </div>
              </div>

              {/* Narrative Content */}
              <div className="p-6 md:p-10 text-left prose prose-stone max-w-none">
                <p className="font-serif text-gold-900 text-sm md:text-base leading-relaxed italic border-l-2 border-gold-500 pl-4 mb-6">
                  {activeBlog.excerpt}
                </p>
                <div 
                  className="text-charcoal-900 font-light leading-loose text-sm md:text-base space-y-4"
                  dangerouslySetInnerHTML={{ __html: activeBlog.content }}
                />
              </div>

              {/* Footer Author Stamp */}
              <div className="border-t border-cream-300 p-6 bg-cream-300/40 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-10 h-10 rounded-full border border-gold-500/20 overflow-hidden bg-neutral-200">
                    <img 
                      src="https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=200" 
                      alt="Midhun Saji Ram" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="font-serif text-charcoal-900 font-bold text-xs">Midhun Saji Ram</h5>
                    <p className="text-[9px] text-gray-500 uppercase tracking-wider">Author & Artiste</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveBlog(null)}
                  className="text-xs uppercase tracking-widest border border-charcoal-900/20 hover:border-gold-500 text-charcoal-900 hover:text-gold-600 px-4 py-2 transition-all cursor-pointer"
                >
                  Close Story
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
