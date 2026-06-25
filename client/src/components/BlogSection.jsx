import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Clock, ArrowRight, Eye } from 'lucide-react';

export default function BlogSection({ blogs, loading, onBlogClick }) {

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
                onClick={() => onBlogClick && onBlogClick(blog)}
                className="bg-white border border-cream-300 rounded overflow-hidden flex flex-col justify-between group shadow-sm cursor-pointer"
              >
              {/* Blog Cover Image */}
              <div className="aspect-[16/10] overflow-hidden bg-neutral-100 border-b border-cream-300/40 relative">
                <img 
                  src={blog.coverUrl} 
                  alt={blog.title} 
                  className="w-full h-full object-cover filter brightness-95 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
                />

              </div>

              {/* Blog Text Content */}
              <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between text-left">
                <div>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[8px] sm:text-[9px] text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2 font-mono font-semibold">
                    <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="hidden xs:inline">&bull;</span>
                    <span className="flex items-center"><Clock size={9} className="mr-0.5" /> {blog.readingTime}</span>
                    <span className="hidden xs:inline">&bull;</span>
                    <span className="flex items-center text-slate-500"><Eye size={9} className="mr-0.5 text-gold-500" /> {blog.views || 0}</span>
                  </div>

                  <h3 className="font-serif text-charcoal-900 group-hover:text-gold-600 font-bold text-xs sm:text-sm leading-snug mb-2 sm:mb-3 transition-colors duration-300 line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <p className="hidden sm:block text-[11px] text-gray-600 font-light leading-relaxed mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); onBlogClick && onBlogClick(blog); }}
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

    </section>
  );
}
