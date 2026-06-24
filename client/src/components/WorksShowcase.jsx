import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ExternalLink } from 'lucide-react';

export default function WorksShowcase({ 
  songs, 
  currentSong, 
  isPlaying, 
  onSongSelect, 
  setIsPlaying, 
  onWorkClick,
  activeFilter,
  setActiveFilter,
  loading
}) {
  const [localFilter, setLocalFilter] = useState('All');

  const filters = ['All', 'Single', 'Album'];

  const currentFilter = activeFilter !== undefined ? activeFilter : localFilter;
  const setFilter = setActiveFilter !== undefined ? setActiveFilter : setLocalFilter;

  const displaySongs = activeFilter !== undefined 
    ? songs 
    : (currentFilter === 'All' 
        ? songs 
        : songs.filter(song => song.category.toLowerCase().includes(currentFilter.toLowerCase()))
      );

  const handlePlayToggle = (e, song) => {
    e.stopPropagation(); // Stop event bubbling so it doesn't open the detail page
    if (currentSong && currentSong._id === song._id) {
      setIsPlaying(!isPlaying);
    } else {
      onSongSelect(song);
      setIsPlaying(true);
    }
  };

  return (
    <section id="works" className="relative py-14 bg-white overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div className="text-left mb-4 md:mb-0">
            <span className="text-[9px] uppercase tracking-[0.3em] text-gold-600 font-bold block mb-1">
              My Works
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-charcoal-900">
              Music I've Created
            </h2>
            <div className="h-[1.5px] w-16 bg-gold-500 mt-3"></div>
          </div>

          {/* Categories Filters */}
          <div className="flex items-center space-x-2 border-b border-charcoal-900/10 pb-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => !loading && setFilter(filter)}
                disabled={loading}
                className={`px-3 py-1.5 text-xs uppercase tracking-widest transition-all duration-300 relative font-semibold ${loading ? 'opacity-40 cursor-not-allowed' : ''} ${currentFilter === filter ? 'text-gold-600' : 'text-gray-500 hover:text-charcoal-900'}`}
              >
                {filter}s
                {currentFilter === filter && (
                  <motion.div 
                    layoutId="filterUnderline"
                    className="absolute bottom-[-9px] left-0 w-full h-[2px] bg-gold-500" 
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Songs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4.5">
          {loading ? (
            Array.from({ length: activeFilter !== undefined ? 6 : 5 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col bg-white border border-cream-300 rounded p-3 relative overflow-hidden animate-pulse shadow-sm"
              >
                {/* Cover Artwork Container */}
                <div className="relative aspect-[1/1] bg-cream-200 rounded mb-3 shadow-sm border border-cream-300/40" />

                {/* Title & Info */}
                <div className="text-left flex-1 flex flex-col justify-between space-y-3.5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="h-3.5 bg-cream-200 rounded w-2/3" />
                      <div className="w-5.5 h-5.5 rounded bg-cream-200 flex-shrink-0" />
                    </div>
                    <div className="h-2.5 bg-cream-200 rounded w-1/2" />
                  </div>

                  <div className="flex items-center justify-between border-t border-cream-300 pt-2.5 mt-2.5">
                    <div className="h-2.5 bg-cream-200 rounded w-4/5" />
                    <div className="w-3.5 h-2.5 bg-cream-200 rounded" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {displaySongs.map((song, index) => {
                const isCurrent = currentSong && currentSong._id === song._id;
                const isCurrentPlaying = isCurrent && isPlaying;
                const slideX = index % 2 === 0 ? -40 : 40;
                const rotateVal = index % 2 === 0 ? -3 : 3;

                return (
                  <motion.div
                    layout="position"
                    initial={{ opacity: 0, x: slideX, y: 30, rotate: rotateVal }}
                    whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    whileHover={{ 
                      boxShadow: "0 15px 30px -10px rgba(37, 99, 235, 0.12)"
                    }}
                    whileTap={{}}
                    exit={{ opacity: 0, x: slideX, rotate: rotateVal }}
                    transition={{ 
                      type: "spring",
                      stiffness: 80,
                      damping: 15,
                      mass: 0.7,
                      delay: (index % 5) * 0.06
                    }}
                    key={song._id}
                    onClick={() => onWorkClick && onWorkClick(song)}
                    className="shimmer-card flex flex-col bg-white border border-cream-300 rounded p-3 relative overflow-hidden group hover:border-gold-500/30 shadow-sm cursor-pointer"
                  >
                    {/* Cover Artwork Container */}
                    <div className="relative aspect-[1/1] bg-neutral-100 rounded overflow-hidden mb-3 shadow-sm border border-cream-300/40">
                      <img 
                        src={song.coverUrl} 
                        alt={song.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-100"
                      />
                    </div>

                    {/* Title & Info */}
                    <div className="text-left flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-serif text-charcoal-900 group-hover:text-gold-600 font-bold text-xs truncate transition-colors duration-300 flex-1">
                            {song.title}
                          </h3>
                          {/* Compact Play/Pause Music Icon Button next to title */}
                          <button
                            onClick={(e) => handlePlayToggle(e, song)}
                            className={`w-5.5 h-5.5 rounded flex items-center justify-center transition-all duration-300 flex-shrink-0 cursor-pointer border ${
                              isCurrentPlaying
                                ? 'bg-gold-500 border-gold-500 text-charcoal-900 shadow-sm'
                                : 'bg-cream-100 hover:bg-gold-500 border-charcoal-900/10 hover:border-gold-500 text-charcoal-900 hover:text-charcoal-900'
                            }`}
                            title={isCurrentPlaying ? "Pause preview" : "Play preview"}
                          >
                            {isCurrentPlaying ? (
                              <Pause size={9} fill="currentColor" />
                            ) : (
                              <Play size={9} fill="currentColor" className="ml-[0.5px]" />
                            )}
                          </button>
                        </div>
                        <p className="text-[8.5px] text-gray-500 uppercase tracking-widest mt-1.5 font-semibold">
                          {song.category} &bull; {new Date(song.releaseDate).getFullYear()}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-cream-300 pt-2.5 mt-2.5">
                        <p className="text-[9.5px] text-gray-500 line-clamp-1 flex-1 pr-2 leading-none">
                          {song.description}
                        </p>
                        
                        {song.spotifyUrl && (
                          <a 
                            href={song.spotifyUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-gray-400 hover:text-gold-600 transition-colors"
                            title="Open Streaming Link"
                          >
                            <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
