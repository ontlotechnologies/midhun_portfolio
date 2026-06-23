import React from 'react';
import { motion } from 'framer-motion';
import { Award, Music, Users, Heart, ArrowRight } from 'lucide-react';

export default function AboutSection({ onActionClick }) {
  const stats = [
    { icon: <Music className="text-gold-600" size={15} />, value: '50+', label: 'Songs Composed' },
    { icon: <Award className="text-gold-600" size={15} />, value: '30+', label: 'Live Performances' },
    { icon: <Users className="text-gold-600" size={15} />, value: '20+', label: 'Collaborations' },
    { icon: <Heart className="text-gold-600" size={15} />, value: 'Millions', label: 'Listeners' }
  ];

  return (
    <section id="about" className="relative py-20 md:py-28 overflow-hidden min-h-[70vh] flex items-center">
      
      {/* Full Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/midhunBG.jpeg"
          alt="Midhun Saji Ram background"
          className="w-full h-full object-cover"
        />
        {/* Overlay for text readability — strong white on left fading to transparent on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/30 lg:from-white/95 lg:via-white/60 lg:to-transparent" />
        {/* Bottom fade for smooth section transition */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        
        {/* Content Layout — 2-column: text left, stats right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Header + Narrative */}
          <div className="lg:col-span-6 text-left">
            {/* Section Header */}
            <span className="text-[9px] uppercase tracking-[0.3em] text-gold-600 font-bold block mb-2">
              About Me
            </span>
            <h2 className="font-serif text-charcoal-900 text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] font-normal mb-3">
              My music is a bridge<br />
              between yesterday<br className="hidden sm:inline" /> and tomorrow.
            </h2>
            <div className="h-[1.5px] w-12 bg-gold-500 mb-6"></div>

            <p className="text-charcoal-800 text-sm font-light leading-relaxed mb-4 max-w-lg">
              I come from a musical lineage that shaped my ears, my heart, and my understanding of sound. As a music director, I search for the emotion behind every scene, every lyric, and every silence.
            </p>
            <p className="text-charcoal-500 text-xs font-light leading-relaxed mb-6 max-w-md">
              As a singer, I give that emotion a voice. My music is rooted in melody, honesty, and feeling.
            </p>
            
            <button
              onClick={onActionClick}
              className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest text-charcoal-900 font-bold hover:text-gold-600 group transition-colors border-b border-charcoal-900/20 pb-1 cursor-pointer"
            >
              <span>Know More About Me</span>
              <ArrowRight size={12} className="transform transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
          </div>

          {/* Right Column: Stats Grid — floating over the visible background */}
          <div className="lg:col-span-5 lg:col-start-8 flex flex-col justify-center space-y-5 pl-0 lg:pl-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center space-x-4 text-left bg-white/60 backdrop-blur-md rounded-xl px-5 py-3.5 border border-white/40 shadow-sm"
              >
                <div className="w-11 h-11 rounded-full border border-gold-500/20 flex items-center justify-center flex-shrink-0 text-charcoal-900 bg-white/80">
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-charcoal-900 leading-none">{stat.value}</h3>
                  <h4 className="text-[9px] uppercase tracking-wider font-medium text-gray-600 mt-0.5">{stat.label}</h4>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
