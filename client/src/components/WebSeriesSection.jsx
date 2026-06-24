import React from 'react';
import { motion } from 'framer-motion';
import { Play, Video } from 'lucide-react';

export default function WebSeriesSection({ webSeries, onPlayVideo, loading }) {
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
              Web Series
            </h2>
            <div className="h-[1.5px] w-16 bg-gold-500 mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="bg-cream-100/60 border border-cream-300/60 rounded p-2 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] bg-cream-200 rounded mb-2.5 border border-cream-300/40" />
                <div className="text-left px-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="h-4 bg-cream-200 rounded w-2/3" />
                    <div className="h-3 bg-cream-200 rounded w-8" />
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <div className="h-2.5 bg-cream-200 rounded w-full" />
                    <div className="h-2.5 bg-cream-200 rounded w-5/6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (webSeries.length === 0) {
    return (
      <section className="border-b border-cream-300/60 py-10 bg-white text-charcoal-900">
        <div className="max-w-7xl mx-auto px-6 text-left">
          <div className="text-left mb-8">
            <span className="text-[9px] uppercase tracking-[0.3em] text-gold-600 font-bold block mb-1">
              My Works
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-charcoal-900">
              Web Series
            </h2>
            <div className="h-[1.5px] w-16 bg-gold-500 mt-3"></div>
          </div>
          <p className="text-xs text-gray-500 font-light">No web series compositions uploaded yet.</p>
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
            Web Series
          </h2>
          <div className="h-[1.5px] w-16 bg-gold-500 mt-3"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {webSeries.map((series, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              key={series._id}
              className="bg-cream-100/60 border border-cream-300/60 rounded p-2 flex flex-col justify-between group hover:border-gold-500/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="relative aspect-[16/10] bg-cream-200 rounded overflow-hidden mb-2.5 border border-cream-300/40">
                <img 
                  src={getAssetUrl(series.coverUrl)} 
                  alt={series.title} 
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 filter brightness-95 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button 
                    onClick={() => onPlayVideo(series)}
                    className="w-10 h-10 rounded-full bg-gold-500 text-black flex items-center justify-center cursor-pointer shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-all duration-300"
                  >
                    <Play size={14} fill="currentColor" className="ml-0.5" />
                  </button>
                </div>
              </div>
              
              <div className="text-left px-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-serif text-sm font-bold text-charcoal-900 leading-tight truncate">{series.title}</h4>
                  <span className="text-[8px] font-bold text-gold-600 font-mono tracking-widest">{series.releaseYear}</span>
                </div>
                <p className="text-[10px] text-gray-600 font-light mt-1.5 line-clamp-2 leading-relaxed">
                  {series.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
