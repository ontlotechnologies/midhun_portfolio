import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function FatherLegacy({ onStoryClick, content }) {
  const c = content || {};
  
  const titleLines = (c.title || "Before I found my voice,\nI heard his.").split('\n');

  return (
    <section className="relative py-14 bg-[#111a2e] overflow-hidden text-white border-t border-white/5">
      
      {/* Background radial glow */}
      <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Overlapping Collage aligned to reference */}
          <div className="lg:col-span-6 relative flex items-center justify-start min-h-[380px] md:min-h-[440px]">
            
            {/* Background frame (Older Saji Ram writing) */}
            <div className="relative w-[72%] aspect-[1.2/1] bg-[#111a2e] border border-white/10 p-2.5 shadow-2xl rounded z-10">
              <div className="w-full h-full overflow-hidden bg-black rounded">
                <img
                  src={c.mainImage || "https://images.unsplash.com/photo-1610964198883-01c0c61e08cb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG11c2ljJTIwYXJ0aXN0JTIwYWdlZHxlbnwwfHwwfHx8MA%3D%3D"}
                  alt="Saji Ram composing at desk"
                  className="w-full h-full object-cover filter grayscale contrast-[1.1] brightness-[0.88] opacity-90"
                />
              </div>
            </div>

            {/* Foreground Polaroid (Young Saji Ram portrait - overlapping top right) */}
            <div
              style={{ transform: 'rotate(3deg)' }}
              className="absolute top-4 right-10 w-[38%] aspect-[1/1.15] bg-[#fcf9f2] p-2.5 pb-5 shadow-[0_15px_35px_rgba(0,0,0,0.25)] rounded z-20 border border-neutral-300/30"
            >
              <div className="w-full h-[84%] overflow-hidden bg-neutral-800 rounded">
                <img
                  src={c.polaroidImage || "https://plus.unsplash.com/premium_photo-1726804910786-9e72710480d3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bXVzaWMlMjBhcnRpc3QlMjBhZ2VkfGVufDB8fDB8fHww"}
                  alt="Saji Ram portrait"
                  className="w-full h-full object-cover filter sepia-[0.15] brightness-[0.95] contrast-[1.05]"
                />
              </div>
              <div className="pt-2 text-center">
                <span className="font-serif text-[8px] text-neutral-800 font-extrabold uppercase tracking-widest block">{c.polaroidCaption || 'Saji Ram'}</span>
              </div>
            </div>

            {/* Cursive Signature text at the bottom right */}
            <div className="absolute bottom-6 right-20 z-30 transform -rotate-6 font-script text-3.5xl text-white/95 select-none drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]">
              {c.cursiveText || 'A legacy that lives on'}
            </div>

          </div>

          {/* Right Column: Narrative tribute */}
          <div className="lg:col-span-6 text-left flex flex-col justify-center">
            
            <div className="flex flex-col items-start mb-4">
              <span className="text-[10px] uppercase tracking-[0.38em] text-gold-400 font-bold block mb-1">
                {c.subtitle || "MY FATHER'S LEGACY"}
              </span>
              <h2 className="font-serif text-3.5xl md:text-4xl font-bold tracking-tight mb-2 leading-tight text-white mt-1">
                {titleLines.map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < titleLines.length - 1 && <><br /></>}
                  </React.Fragment>
                ))}
              </h2>
              {/* Squiggle or thin divider */}
              <div className="h-[1px] w-10 bg-gold-500/40 mt-1 mb-3"></div>
            </div>

            <p className="text-gray-300 text-sm font-light leading-relaxed mb-4">
              {c.paragraph1 || "My father, Saji Ram, was a celebrated music director whose melodies touched countless hearts. He was the creative force behind the famous track from Kireedam, a song that still carries his signature, his soul, and his timeless musical instinct."}
            </p>
            
            <p className="text-gray-400 text-xs font-light leading-relaxed mb-6">
              {c.paragraph2 || "Walking through recording sessions alongside him taught me the mechanics of composition and the honor of being a musician. His legacy is the foundation upon which I explore new musical frontiers."}
            </p>

            <div className="relative z-10">
              <button
                onClick={onStoryClick}
                className="group relative text-gold-400 hover:text-gold-300 font-semibold text-[10px] uppercase tracking-widest transition-colors duration-300 flex items-center gap-2 cursor-pointer pb-1.5"
              >
                <span>Read His Story</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold-500/60 group-hover:bg-gold-500 transition-colors duration-300"></span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Decorative Golden Audio Waveform Graph in bottom-right corner to match reference */}
      <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none z-0 flex items-end space-x-1.5 px-6 pb-2.5">
        {[15, 28, 20, 35, 48, 55, 72, 60, 45, 38, 52, 68, 80, 92, 98, 85, 70, 52, 40, 25, 18, 32, 45, 58, 72, 85, 68, 50, 32, 18].map((h, i) => (
          <div 
            key={i} 
            className="w-[1.5px] bg-gold-500 rounded-t-sm"
            style={{ 
              height: `${h * 0.72}px`, 
              opacity: 0.15 + (i % 4) * 0.15 
            }}
          />
        ))}
      </div>

    </section>
  );
}
