import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

export default function GallerySection({ galleryItems = [] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const categories = ['All', 'Concerts', 'Studio', 'Personal'];

  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category.toLowerCase() === activeCategory.toLowerCase());

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

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
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1.5 text-xs uppercase tracking-widest transition-all duration-300 relative font-semibold ${activeCategory === cat ? 'text-gold-600' : 'text-gray-500 hover:text-charcoal-900'}`}
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

        {/* Gallery Grid (Displays 5 columns on large screen to match reference image horizontal strip) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          <AnimatePresence mode="popLayout">
            {paginatedItems.map((item, idx) => {
              const globalIdx = startIndex + idx;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  key={item._id}
                  onClick={() => setSelectedIdx(globalIdx)}
                  className="relative aspect-[3/4] rounded overflow-hidden border border-cream-300 shadow-sm cursor-pointer group hover:border-gold-500/30 transition-all duration-500"
                >
                  {/* Image */}
                  <img 
                    src={item.url} 
                    alt={item.title} 
                    className="w-full h-full object-cover filter brightness-95 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
                  />

                  {/* Dark Hover overlay */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <ZoomIn className="text-gold-500 mb-1" size={16} />
                    <h3 className="font-serif text-white font-bold text-xs tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-[8px] text-gold-500 uppercase tracking-widest mt-0.5 font-bold">
                      {item.category}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded border border-cream-300 text-charcoal-900 transition-all duration-300 cursor-pointer ${
                currentPage === 1
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:border-gold-500 hover:text-gold-600 bg-white hover:bg-cream-50'
              }`}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded border transition-all duration-300 cursor-pointer ${
                  currentPage === page
                    ? 'bg-gold-500 border-gold-500 text-white shadow-sm'
                    : 'border-cream-300 text-charcoal-900 bg-white hover:bg-cream-50 hover:border-gold-500'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded border border-cream-300 text-charcoal-900 transition-all duration-300 cursor-pointer ${
                currentPage === totalPages
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:border-gold-500 hover:text-gold-600 bg-white hover:bg-cream-50'
              }`}
            >
              <ChevronRight size={16} />
            </button>
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
