import React from 'react';
import { motion } from 'framer-motion';
import { Award, Music, Users, Heart, ArrowRight } from 'lucide-react';

const iconMap = {
  Music: <Music className="text-gold-500 group-hover:scale-110 transition-transform duration-300" size={16} />,
  Award: <Award className="text-gold-500 group-hover:scale-110 transition-transform duration-300" size={16} />,
  Users: <Users className="text-gold-500 group-hover:scale-110 transition-transform duration-300" size={16} />,
  Heart: <Heart className="text-gold-500 group-hover:scale-110 transition-transform duration-300" size={16} />
};

export default function AboutSection({ onActionClick, content }) {
  const c = content || {};
  
  const defaultStats = [
    { icon: iconMap.Music, value: '50+', label: 'Songs Composed' },
    { icon: iconMap.Award, value: '30+', label: 'Live Performances' },
    { icon: iconMap.Users, value: '20+', label: 'Collaborations' },
    { icon: iconMap.Heart, value: 'Millions', label: 'Listeners' }
  ];

  // Use dynamic stats if available, map iconName to actual icon components
  const stats = c.stats 
    ? c.stats.map(s => ({
        icon: iconMap[s.iconName] || iconMap.Music,
        value: s.value,
        label: s.label
      }))
    : defaultStats;

  const titleLines = (c.title || 'My music is a bridge\nbetween yesterday and tomorrow.').split('\n');

  return (
    <section id="about" className="relative py-20 bg-white overflow-hidden">
      
      {/* Background radial highlight */}
      <div className="absolute left-[-200px] top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.015)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Narrative and Stats (lg:col-span-7) */}
          <div className="lg:col-span-7 text-left flex flex-col justify-center">
            
            {/* Section Header */}
            <div className="mb-6">
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold-600 font-extrabold block mb-2">
                {c.subtitle || 'About Me'}
              </span>
              <h2 className="font-serif text-charcoal-900 text-3.5xl md:text-5xl tracking-tight leading-[1.1] font-light">
                {titleLines.map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < titleLines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h2>
              <div className="h-[1.5px] w-12 bg-gold-500 mt-4.5"></div>
            </div>

            {/* Editorial Narrative */}
            <div className="space-y-4 mb-8">
              <p className="text-charcoal-800 text-sm md:text-[14.5px] font-light leading-relaxed">
                {c.paragraph1 || "I come from a musical lineage that shaped my ears, my heart, and my understanding of sound. As a music director, I search for the emotion behind every scene, every lyric, and every silence."}
              </p>
              <p className="text-gray-500 text-xs md:text-[12.5px] font-light leading-relaxed">
                {c.paragraph2 || "As a singer, I give that emotion a voice. My music is rooted in melody, honesty, and feeling."}
              </p>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-2 gap-3.5 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  whileHover={{ y: -3 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    delay: index * 0.05
                  }}
                  className="flex items-center gap-3.5 bg-cream-100/30 hover:bg-white border border-cream-300/50 hover:border-gold-500/20 p-4 rounded transition-all duration-300 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full border border-cream-300/60 bg-white/80 group-hover:bg-gold-500/5 flex items-center justify-center flex-shrink-0 text-charcoal-900 group-hover:border-gold-500/20 transition-all duration-300 shadow-sm">
                    {stat.icon}
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-charcoal-900 leading-none">{stat.value}</h3>
                    <h4 className="text-[9px] uppercase tracking-wider font-semibold text-gray-400 mt-1">{stat.label}</h4>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Editorial Button */}
            <div>
              <button
                onClick={onActionClick}
                className="inline-flex items-center space-x-2.5 text-[10px] uppercase tracking-widest text-charcoal-900 font-extrabold hover:text-gold-500 group transition-colors border-b border-charcoal-900/10 hover:border-gold-500 pb-1.5 cursor-pointer"
              >
                <span>Know More About Me</span>
                <ArrowRight size={12} className="transform transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>
            </div>

          </div>

          {/* Right Column: Layered Asymmetrical Image Frame (lg:col-span-5) */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0 flex items-center justify-center">
            
            <div className="relative w-full max-w-sm sm:max-w-md pr-8 pb-8">
              
              {/* Decorative outline offset back-frame */}
              <div className="absolute right-2 bottom-2 left-6 top-6 border border-gold-500/20 rounded z-0 pointer-events-none" />

              {/* Vertical tracking text along the left side */}
              <div className="absolute left-[-28px] top-1/2 -translate-y-1/2 origin-center -rotate-90 select-none text-[8.5px] uppercase tracking-[0.45em] font-bold text-gold-500/30 hidden sm:block">
                MIDHUN SAJI RAM
              </div>

              {/* Portrait Image Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full aspect-[3/4] rounded-sm overflow-hidden border border-cream-300 bg-neutral-100 shadow-md group"
              >
                <img
                  src={c.portraitImage || "/midhunBG.jpeg"}
                  alt="Midhun Saji Ram composing in studio"
                  className="w-full h-full object-cover filter brightness-[0.96] contrast-[1.01] transition-transform duration-700 hover:scale-103"
                />

               
              </motion.div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
