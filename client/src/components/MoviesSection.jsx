import React from 'react';
import { motion } from 'framer-motion';
import { Play, Film, Image as ImageIcon } from 'lucide-react';

export default function MoviesSection({ movies, onPlayVideo, onZoomImage, loading }) {
  const getAssetUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('/uploads')) {
      const BASE = import.meta.env.VITE_API_URL 
        ? import.meta.env.VITE_API_URL.replace('/api', '') 
        : 'http://localhost:5000';
      return `${BASE}${url}`;
    }
    return url;
  };

  if (loading) {
    return (
      <section className="border-b border-cream-300/60 py-10 bg-white text-charcoal-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-left mb-8">
            <span className="text-[9px] uppercase tracking-[0.3em] text-gold-600 font-bold block mb-1">
              My Works
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-charcoal-900 animate-pulse">
              Feature Films
            </h2>
            <div className="h-[1.5px] w-16 bg-gold-500 mt-3" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 animate-pulse">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="flex flex-col text-left">
                <div className="relative aspect-[2/3] bg-cream-200 rounded border border-cream-300/60 shadow-sm" />
                <div className="mt-2.5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="h-3.5 bg-cream-200 rounded w-2/3" />
                    <div className="h-3 bg-cream-200 rounded w-8" />
                  </div>
                  <div className="h-2.5 bg-cream-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (movies.length === 0) {
    return (
      <section className="border-b border-cream-300/60 py-10 bg-white text-charcoal-900">
        <div className="max-w-7xl mx-auto px-6 text-left">
          <div className="text-left mb-8">
            <span className="text-[9px] uppercase tracking-[0.3em] text-gold-600 font-bold block mb-1">
              My Works
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-charcoal-900">
              Feature Films
            </h2>
            <div className="h-[1.5px] w-16 bg-gold-500 mt-3"></div>
          </div>
          <p className="text-xs text-gray-500 font-light">No movie compositions uploaded yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-cream-300/60 py-10 bg-white text-charcoal-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-left mb-8">
          <span className="text-[9px] uppercase tracking-[0.3em] text-gold-600 font-bold block mb-1">
            My Works
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-charcoal-900">
            Feature Films
          </h2>
          <div className="h-[1.5px] w-16 bg-gold-500 mt-3"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {movies.map((movie, idx) => {
            const hasVideo = movie.mediaType !== 'image_only' && movie.videoUrl;
            
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                key={movie._id}
                className="flex flex-col text-left group"
              >
                {/* Poster Card (Aspect 2:3) */}
                <div className="relative aspect-[2/3] bg-cream-100 rounded overflow-hidden border border-cream-300/60 group-hover:border-gold-500/30 transition-all duration-500 shadow-sm">
                  <img 
                    src={getAssetUrl(movie.coverUrl)} 
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 filter brightness-95 group-hover:brightness-100"
                  />
                  
                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center">
                    {hasVideo ? (
                      <button 
                        onClick={() => onPlayVideo(movie)}
                        className="w-11 h-11 bg-gold-500 hover:bg-gold-400 text-black rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300 cursor-pointer"
                        title="Play Trailer"
                      >
                        <Play size={16} fill="currentColor" className="ml-0.5" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => onZoomImage(getAssetUrl(movie.coverUrl))}
                        className="w-11 h-11 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300 cursor-pointer"
                        title="View Poster"
                      >
                        <ImageIcon size={16} />
                      </button>
                    )}
                    <span className="text-[9px] uppercase tracking-widest text-gold-500 font-bold mt-3 block">
                      {hasVideo ? 'Play Trailer' : 'View Poster'}
                    </span>
                  </div>
                </div>

                {/* Movie info */}
                <div className="mt-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-serif text-xs font-bold text-charcoal-900 group-hover:text-gold-500 transition-colors leading-tight line-clamp-1 flex-1">
                      {movie.title}
                    </h4>
                    <span className="text-[9px] font-mono text-gray-500 font-bold shrink-0">{movie.releaseYear}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 line-clamp-1 leading-none mt-1">
                    {movie.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
