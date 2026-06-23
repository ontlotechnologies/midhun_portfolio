import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Quote } from 'lucide-react';

export default function LegacyHero({ onPlayClick, onExploreClick }) {
  return (
    
    <section id="home" className="relative min-h-[95vh] lg:min-h-screen flex items-center justify-center pt-20 pb-10 overflow-hidden bg-white">
      
      {/* Background Image layer */}
      <div className="absolute inset-0 z-0">
        <img
          src="/midhunHero.png"
          alt="Midhun Saji Ram & Saji Ram Legacy Banner"
          className="w-full h-full object-cover filter brightness-95"
        />
        {/* Light white overlay on the left side to guarantee text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/40 to-transparent lg:bg-gradient-to-r lg:from-white/95 lg:via-white/20 lg:to-transparent z-10" />
      </div>

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
            <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-gold-600 font-bold">
              The Sound. The Story. The Legacy.
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-charcoal-900 text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.05] mb-4 font-normal"
          >
            A Legacy<br />
            He Gave.<br />
            <span className="text-gold-gradient font-serif italic font-medium block mt-1">A Voice I Carry.</span>
          </motion.h1>

          {/* Cursive divider line */}
          <div className="h-[1px] w-12 bg-gold-500/60 mb-4"></div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-charcoal-800 text-sm md:text-base max-w-sm mb-6 leading-relaxed font-light"
          >
            From the melodies he created to the ones I dream today, this is our journey of music, memories and meaning.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            {/* Play button with circle wrapper envelope */}
            <button
              onClick={onPlayClick}
              className="px-5 py-3 bg-charcoal-900 hover:bg-gold-500 text-white hover:text-black font-semibold text-[10px] uppercase tracking-widest rounded-full transition-all duration-300 flex items-center space-x-3 cursor-pointer shadow-sm"
            >
              <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:border-black/20">
                <Play size={8} fill="currentColor" className="ml-0.5" />
              </div>
              <span>Listen Now</span>
            </button>
            
            <button
              onClick={onExploreClick}
              className="px-5 py-3 border border-charcoal-900/30 hover:border-gold-500 hover:bg-gold-500/5 text-charcoal-900 hover:text-gold-600 font-semibold text-[10px] uppercase tracking-widest rounded-full transition-all duration-300 flex items-center space-x-2 cursor-pointer"
            >
              <span>Explore My Works</span>
            </button>
          </motion.div>
        </div>

        {/* Right Side: Quote Block Overlay floating over background */}
        <div className="lg:col-span-7 relative flex justify-start lg:justify-end items-center h-full min-h-[140px] lg:min-h-0">
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-transparent border-none p-0 max-w-[240px] md:max-w-[280px] z-30 relative text-left lg:mr-16"
          >
            <Quote size={18} className="text-gold-500 mb-2 opacity-80" fill="currentColor" />
            
            <p className="font-serif text-white text-sm md:text-base leading-relaxed italic font-light drop-shadow-md select-none">
              "He wrote the melodies that touched millions. I carry them forward."
            </p>
            
            <span className="font-script text-gold-400 text-lg md:text-xl block mt-2 text-right tracking-wide select-none drop-shadow-sm">
              Midhun Saji Ram
            </span>
          </motion.div>

        </div>
        

      </div>
      
    </section>
  );
}
