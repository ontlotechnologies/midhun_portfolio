import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

export default function GallerySection({ galleryItems = [], onViewAllClick, infiniteScroll = false, loading }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [visibleCount, setVisibleCount] = useState(infiniteScroll ? 8 : galleryItems.length);

  const categories = ['All', 'Concerts', 'Studio', 'Personal'];

  // Asymmetric Bento Grid layout spans modulo mapping
  const getBentoClasses = (index) => {
    const layouts = [
      'col-span-2 row-span-2', // Large Square (2x2)
      'col-span-1 row-span-2', // Tall Vertical (1x2)
      'col-span-1 row-span-1', // Small Square (1x1)
      'col-span-1 row-span-1', // Small Square (1x1)
      'col-span-2 row-span-1', // Wide Horizontal (2x1)
      'col-span-1 row-span-2', // Tall Vertical (1x2)
      'col-span-2 row-span-2', // Large Square (2x2)
      'col-span-1 row-span-1', // Small Square (1x1)
      'col-span-1 row-span-1', // Small Square (1x1)
      'col-span-2 row-span-1', // Wide Horizontal (2x1)
    ];
    return layouts[index % layouts.length];
  };

  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category.toLowerCase() === activeCategory.toLowerCase());

  // Reset or adjust visible count on filters or prop changes
  useEffect(() => {
    if (infiniteScroll) {
      setVisibleCount(8);
    } else {
      setVisibleCount(galleryItems.length);
    }
  }, [activeCategory, galleryItems.length, infiniteScroll]);

  // Load more on intersection observer trigger
  useEffect(() => {
    if (!infiniteScroll || visibleCount >= filteredItems.length) return;

    const sentinel = document.getElementById('gallery-load-more-sentinel');
    if (!sentinel) return;

    const callback = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        // Load next batch of images
        setVisibleCount(prev => Math.min(prev + 4, filteredItems.length));
      }
    };

    const observer = new IntersectionObserver(callback, {
      root: null,
      rootMargin: '150px',
      threshold: 0.1
    });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [infiniteScroll, visibleCount, filteredItems.length]);

  if (loading) {
    const count = infiniteScroll ? 8 : 6;
    return (
      <section id="gallery" className="relative py-14 bg-white overflow-hidden animate-pulse">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div className="text-left mb-4 md:mb-0">
              <span className="text-[9px] uppercase tracking-[0.3em] text-gold-600 font-bold block mb-1">
                Gallery
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-charcoal-900">
                Moments in Melody
              </h2>
              <div className="h-[1.5px] w-16 bg-gold-500 mt-3" />
            </div>
            
            <div className="flex items-center space-x-2 border-b border-charcoal-900/10 pb-2">
              {categories.map((cat) => (
                <div key={cat} className="px-3 py-1.5 text-xs font-semibold text-gray-400 select-none">
                  {cat}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[140px] md:auto-rows-[190px] gap-4 grid-flow-row-dense">
            {Array.from({ length: count }).map((_, idx) => {
              const bentoSpanClass = getBentoClasses(idx);
              return (
                <div 
                  key={idx} 
                  className={`${bentoSpanClass} bg-cream-200 border border-cream-300 rounded-xl`} 
                />
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  const displayedItems = filteredItems.slice(0, visibleCount);

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedIdx((prev) => (prev + 1) % filteredItems.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedIdx((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <section id="gallery" className="relative py-14 bg-white overflow-hidden">
      
      {/* Background subtle radial glow */}
      <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.01)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div className="text-left mb-4 md:mb-0">
            <span className="text-[9px] uppercase tracking-[0.3em] text-gold-600 font-bold block mb-1">
              Gallery
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-charcoal-900">
              Moments in Melody
            </h2>
            <div className="h-[1.5px] w-16 bg-gold-500 mt-3"></div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center space-x-2 border-b border-charcoal-900/10 pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs uppercase tracking-widest transition-all duration-300 relative font-semibold cursor-pointer ${activeCategory === cat ? 'text-gold-600' : 'text-gray-500 hover:text-charcoal-900'}`}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div 
                    layoutId="galleryFilterUnderline"
                    className="absolute bottom-[-9px] left-0 w-full h-[2px] bg-gold-500" 
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid layout container */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[140px] md:auto-rows-[190px] gap-4 grid-flow-row-dense">
          <AnimatePresence mode="popLayout">
            {displayedItems.map((item, idx) => {
              const bentoSpanClass = getBentoClasses(idx);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 90, damping: 15 }}
                  key={item._id}
                  onClick={() => setSelectedIdx(idx)}
                  className={`${bentoSpanClass} relative rounded-xl overflow-hidden border border-cream-300 shadow-sm group cursor-pointer bg-white hover:border-gold-500/25 transition-all duration-300 hover:shadow-md`}
                >
                  {/* Image (no scale on card container, only scale inside element) */}
                  <img 
                    src={item.url} 
                    alt={item.title} 
                    className="w-full h-full object-cover filter brightness-[0.96] group-hover:brightness-100 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                  />

                  {/* Dark/Blur overlay on hover */}
                  <div className="absolute inset-0 bg-charcoal-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Frosted iPhone Glassmorphism Overlay (Bottom Slide) */}
                  <div className="absolute inset-x-3 bottom-3 p-3.5 rounded-xl glass-premium border border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[8px] text-gold-600 uppercase tracking-widest font-extrabold">
                        {item.category}
                      </span>
                      <ZoomIn className="text-gold-500" size={13} />
                    </div>
                    <h3 className="font-serif text-charcoal-900 font-bold text-xs leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {onViewAllClick && (
          <div className="text-center mt-10">
            <button
              onClick={onViewAllClick}
              className="px-8 py-3 bg-charcoal-900 hover:bg-gold-500 text-white hover:text-white font-semibold text-[10px] uppercase tracking-widest rounded-full transition-all duration-300 shadow-sm cursor-pointer inline-flex items-center gap-2 group"
            >
              <span>View All Gallery</span>
              <span className="group-hover:translate-x-1.5 transition-transform duration-300">&rarr;</span>
            </button>
          </div>
        )}

        {/* Load More Sentinel for Gallery Page */}
        {infiniteScroll && visibleCount < filteredItems.length && (
          <div id="gallery-load-more-sentinel" className="text-center py-10">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold-600 font-bold animate-pulse">
              Loading more moments...
            </span>
          </div>
        )}

      </div>

      {/* Cinematic Fullscreen Lightbox */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedIdx(null)}
          >
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors cursor-pointer"
              onClick={() => setSelectedIdx(null)}
            >
              <X size={28} />
            </button>

            {/* Previous Button */}
            <button 
              className="absolute left-6 text-gray-400 hover:text-white transition-colors bg-white/5 p-3 rounded hover:bg-white/10 cursor-pointer"
              onClick={handlePrev}
            >
              <ChevronLeft size={24} />
            </button>

            {/* Image Container */}
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-w-4xl max-h-[80vh] relative text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={filteredItems[selectedIdx].url} 
                alt={filteredItems[selectedIdx].title} 
                className="max-w-full max-h-[70vh] object-contain rounded border border-gold-500/20"
              />
              <div className="mt-4">
                <h3 className="font-serif text-gold-500 text-lg font-bold">
                  {filteredItems[selectedIdx].title}
                </h3>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1 font-bold">
                  {filteredItems[selectedIdx].category}
                </p>
              </div>
            </motion.div>

            {/* Next Button */}
            <button 
              className="absolute right-6 text-gray-400 hover:text-white transition-colors bg-white/5 p-3 rounded hover:bg-white/10 cursor-pointer"
              onClick={handleNext}
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
