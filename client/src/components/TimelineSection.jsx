import React from 'react';
import { motion } from 'framer-motion';

export default function TimelineSection({ timelineData, onActionClick }) {
  const defaultEvents = [
    { 
      year: '1998', 
      title: 'Where it all began', 
      description: 'Surrounded by music, instruments and endless curiosity.',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400'
    },
    { 
      year: '2008', 
      title: 'Learning. Observing. Absorbing.', 
      description: 'Learning not just music, but emotion, discipline and silence.',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=400'
    },
    { 
      year: '2016', 
      title: 'Finding my voice', 
      description: 'Stepping into studios, compositions and my own sound.',
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=400'
    },
    { 
      year: '2023', 
      title: 'Creating. Performing. Inspiring.', 
      description: 'Continuing the legacy and building a new musical tomorrow.',
      image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=400'
    }
  ];

  // Limit to exactly 4 events for a perfect grid layout matching the mockup design
  const events = (timelineData && timelineData.length > 0 ? timelineData : defaultEvents).slice(0, 4);

  // Music fallbacks for indexing if CMS timeline data is loaded dynamically
  const fallbacks = [
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400',
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=400',
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=400',
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=400'
  ];

  return (
    <section id="timeline" className="relative py-14 bg-white overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-4 text-left flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold-600 font-bold block mb-2">
              THE JOURNEY
            </span>
            <h2 className="font-serif text-3.5xl md:text-4xl font-bold tracking-tight text-charcoal-900 mb-2 leading-tight">
              From a Home Filled with Music to a World that Listens
            </h2>
            
            {/* Hand-drawn double squiggle underliner */}
            <svg className="w-16 h-3 text-gold-500/50 mb-6" viewBox="0 0 100 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2,6 C15,2 25,10 40,6 C55,2 65,10 80,6 C90,4 95,6 98,6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M5,9 C18,5 28,11 41,8 C54,5 64,11 77,8 C87,6 92,8 95,8" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.6" />
            </svg>
            
            <p className="text-charcoal-800 text-xs md:text-sm font-light leading-relaxed max-w-sm mb-6">
              Born into a home where music wasn't just heard — it was lived. From the first note I heard to the stages I dream today, every moment has been a part of a beautiful journey.
            </p>
            
            <div>
              <button
                onClick={onActionClick}
                className="px-6 py-3 bg-charcoal-900 hover:bg-gold-500 text-white hover:text-black font-semibold text-[10px] uppercase tracking-widest rounded-full transition-all duration-300 shadow-sm cursor-pointer inline-flex items-center gap-2 group"
              >
                <span>Read My Story</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
              </button>
            </div>
          </div>

          {/* Right Cards Static Grid Column */}
          <div className="lg:col-span-8 relative mt-6 lg:mt-0">
            <div className="relative w-full">
              
              {/* Horizontal Timeline Dotted Line (visible on desktop lg) */}
              <div className="hidden lg:block absolute left-8 right-8 h-[1px] border-t border-dashed border-gold-500/20 bottom-[14px] z-0" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 w-full">
                {events.map((event, index) => {
                  const eventImg = event.image || event.coverUrl || fallbacks[index % fallbacks.length];
                  const slideX = index % 2 === 0 ? -30 : 30;
                  const rotateVal = index % 2 === 0 ? -2 : 2;

                  return (
                    <motion.div
                      key={event._id || index}
                      initial={{ opacity: 0, x: slideX, y: 30, rotate: rotateVal }}
                      whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                      viewport={{ once: false, amount: 0.05 }}
                      whileHover={{ 
                        boxShadow: "0 15px 30px -10px rgba(37, 99, 235, 0.12)"
                      }}
                      whileTap={{}}
                      transition={{ 
                        type: "spring",
                        stiffness: 80,
                        damping: 15,
                        mass: 0.7,
                        delay: index * 0.06
                      }}
                      className="flex flex-col items-center group w-full cursor-pointer"
                    >
                      {/* Event Card Container */}
                      <div className="bg-white border border-cream-300 rounded overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] group-hover:border-gold-500/20 flex-1 flex flex-col w-full">
                        {/* Artwork with Vintage/Sepia filter */}
                        <div className="w-full aspect-[4/3] bg-neutral-100 overflow-hidden">
                          <img 
                            src={eventImg} 
                            alt={event.title} 
                            className="w-full h-full object-cover filter sepia-[0.35] brightness-[0.92] contrast-[1.05] group-hover:sepia-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
                          />
                        </div>

                        {/* Content text */}
                        <div className="p-4 flex-1 flex flex-col justify-start text-left">
                          <span className="font-sans text-[11px] font-bold text-gold-600 tracking-wider block mb-1">
                            {event.year}
                          </span>
                          <h3 className="font-sans text-charcoal-900 font-bold text-xs md:text-[13px] leading-snug mb-1.5 group-hover:text-gold-600 transition-colors duration-300">
                            {event.title}
                          </h3>
                          <p className="text-[10.5px] text-gray-500 font-light leading-relaxed">
                            {event.description}
                          </p>
                        </div>
                      </div>

                      {/* Vertical connector line (visible on desktop lg) */}
                      <div className="hidden lg:block h-6 w-[1px] border-l border-dashed border-gold-500/20 relative z-10 mt-3"></div>

                      {/* Circle node dot (visible on desktop lg) */}
                      <div className="hidden lg:flex w-2.5 h-2.5 rounded-full border border-gold-500 bg-white items-center justify-center relative z-20 group-hover:bg-gold-500 transition-colors duration-300 shadow-[0_0_8px_rgba(37, 99, 235, 0.2)]">
                        <div className="w-1 h-1 bg-gold-500 rounded-full group-hover:bg-white transition-colors duration-300" />
                      </div>

                    </motion.div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
