import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Quote } from 'lucide-react';

export default function LegacyHero({ onPlayClick, onExploreClick, content }) {
  const c = content || {};
  
  return (
    
    <section id="home" className="relative min-h-[95vh] lg:min-h-screen flex items-center justify-center pt-28 pb-16 lg:pt-20 lg:pb-10 overflow-hidden bg-white">
      
      {/* Background Image layer */}
      <div className="absolute inset-0 z-0">
        <img
          src={c.heroImage || "/midhunhero1.png"}
          alt="Midhun Saji Ram & Saji Ram Legacy Banner"
          className="w-full h-full object-cover object-[center_35%] filter brightness-95"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />      </div>

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-20 py-4">
        
        {/* Left Side: Story Description */}
        <div className="lg:col-span-5 flex flex-col justify-center text-left relative z-20">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center space-x-2 mb-2.5"
          >
            <span className="h-[1.5px] w-6 bg-gold-500"></span>
            <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-gold-400 font-bold">
              {c.subtitle || 'The Sound. The Story. The Legacy.'}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-white text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.05] mb-4 font-normal"
          >
            {c.titleLine1 || 'A Legacy'}<br />
            {c.titleLine2 || 'He Gave.'}<br />
            <span className="text-gold-gradient font-serif italic font-medium block mt-1">{c.titleLine3 || 'A Voice I Carry.'}</span>
          </motion.h1>

          {/* Cursive divider line */}
          <div className="h-[1px] w-12 bg-gold-500/60 mb-4"></div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-cream-200 text-sm md:text-base max-w-sm mb-6 leading-relaxed font-light"
          >
            {c.description || 'From the melodies he created to the ones I dream today, this is our journey of music, memories and meaning.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3.5"
          >
            {/* Play button with circle wrapper envelope */}
            <button
              onClick={onPlayClick}
              className="px-6 py-3 bg-white text-black hover:bg-gold-500 hover:text-black font-semibold text-[10px] uppercase tracking-widest rounded-full transition-all duration-300 flex items-center justify-center space-x-3 cursor-pointer shadow-sm"
            >
              <div className="w-5 h-5 rounded-full border border-black/10 flex items-center justify-center flex-shrink-0 group-hover:border-black/20">
                <Play size={8} fill="currentColor" className="ml-0.5" />
              </div>
              <span>Listen Now</span>
            </button>
            
            <button
              onClick={onExploreClick}
              className="px-6 py-3 border border-white text-white hover:border-gold-500 hover:bg-gold-500/5 hover:text-gold-400 font-semibold text-[10px] uppercase tracking-widest rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer"
            >
              <span>Explore My Works</span>
            </button>
          </motion.div>
        </div>

        {/* Right Side: Quote Block Overlay floating over background */}
        <div className="lg:col-span-7 relative flex justify-start lg:justify-end items-center h-full min-h-[160px] lg:min-h-0">
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-transparent border-none p-0 max-w-[280px] z-30 relative text-left lg:mr-16"
          >
            <Quote size={18} className="text-gold-500 mb-2 opacity-80" fill="currentColor" />
            
            <p className="font-serif text-white text-sm md:text-base leading-relaxed italic font-light drop-shadow-md select-none">
              {c.quote || '"He wrote the melodies that touched millions. I carry them forward."'}
            </p>
            
            <span className="font-script text-gold-400 text-lg md:text-xl block mt-2 text-right tracking-wide select-none drop-shadow-sm">
              {c.signature || 'Midhun Saji Ram'}
            </span>
          </motion.div>

        </div>
        

      </div>
      
    </section>
  );
}
