import React from 'react';
import { motion } from 'framer-motion';
import { Award, Music, Users, Heart, ArrowRight } from 'lucide-react';

const iconMap = {
  Music: <Music className="text-gold-600" size={15} />,
  Award: <Award className="text-gold-600" size={15} />,
  Users: <Users className="text-gold-600" size={15} />,
  Heart: <Heart className="text-gold-600" size={15} />
};

export default function AboutSection({ onActionClick, content }) {
  const c = content || {};
  
  const defaultStats = [
    { icon: <Music className="text-gold-600" size={15} />, value: '50+', label: 'Songs Composed' },
    { icon: <Award className="text-gold-600" size={15} />, value: '30+', label: 'Live Performances' },
    { icon: <Users className="text-gold-600" size={15} />, value: '20+', label: 'Collaborations' },
    { icon: <Heart className="text-gold-600" size={15} />, value: 'Millions', label: 'Listeners' }
  ];

  // Use dynamic stats if available, map iconName to actual icon components
  const stats = c.stats 
    ? c.stats.map(s => ({
        icon: iconMap[s.iconName] || <Music className="text-gold-600" size={15} />,
        value: s.value,
        label: s.label
      }))
    : defaultStats;

  const titleLines = (c.title || 'My music is a bridge\nbetween yesterday and tomorrow.').split('\n');

  return (
    <section id="about" className="relative py-14 bg-white overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="mb-10 text-left">
          <span className="text-[9px] uppercase tracking-[0.3em] text-gold-600 font-bold block mb-1">
            {c.subtitle || 'About Me'}
          </span>
          <h2 className="font-serif text-charcoal-900 text-3xl md:text-4xl tracking-tight leading-[1.1] font-normal">
            {titleLines.map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < titleLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <div className="h-[1.5px] w-12 bg-gold-500 mt-3"></div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Narrative */}
          <div className="lg:col-span-4 text-left">
            <p className="text-charcoal-800 text-sm font-light leading-relaxed mb-4">
              {c.paragraph1 || "I come from a musical lineage that shaped my ears, my heart, and my understanding of sound. As a music director, I search for the emotion behind every scene, every lyric, and every silence."}
            </p>
            <p className="text-charcoal-500 text-xs font-light leading-relaxed mb-6">
              {c.paragraph2 || "As a singer, I give that emotion a voice. My music is rooted in melody, honesty, and feeling."}
            </p>
            
            <button
              onClick={onActionClick}
              className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest text-charcoal-900 font-bold hover:text-gold-600 group transition-colors border-b border-charcoal-900/20 pb-1 cursor-pointer"
            >
              <span>Know More About Me</span>
              <ArrowRight size={12} className="transform transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
          </div>

          {/* Center Column: Portrait Image */}
          <div className="lg:col-span-4">
            <motion.div
              className="relative aspect-[4/3] max-w-md mx-auto rounded-sm overflow-hidden border border-cream-300 shadow-sm"
            >
              <img
                src={c.portraitImage || "/midhunBG.jpeg"}
                alt="Midhun Saji Ram composing in studio"
                className="w-full h-full object-cover filter brightness-95"
              />
            </motion.div>
          </div>

          {/* Right Column: Stats Grid */}
          <div className="lg:col-span-4 flex flex-col justify-center space-y-4.5 pl-0 lg:pl-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30, y: 15, scale: 0.97 }}
                whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.05 }}
                whileHover={{ x: 8 }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  delay: index * 0.08
                }}
                className="flex items-center space-x-3.5 text-left cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full border border-cream-300 flex items-center justify-center flex-shrink-0 text-charcoal-900 bg-cream-50/50">
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-charcoal-900 leading-none">{stat.value}</h3>
                  <h4 className="text-[9px] uppercase tracking-wider font-medium text-gray-500 mt-0.5">{stat.label}</h4>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
