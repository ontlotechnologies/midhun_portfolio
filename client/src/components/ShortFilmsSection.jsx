import React, { useState, useEffect } from 'react';
import { Play, Film } from 'lucide-react';

export default function ShortFilmsSection({ shortFilms, onPlayVideo, loading }) {
  const [selectedShortFilm, setSelectedShortFilm] = useState(null);

  // Set default short film spotlight
  useEffect(() => {
    if (shortFilms && shortFilms.length > 0 && !selectedShortFilm) {
      setSelectedShortFilm(shortFilms[0]);
    }
  }, [shortFilms]);

  // Helper for absolute URL
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
              Short Films
            </h2>
            <div className="h-[1.5px] w-16 bg-gold-500 mt-3" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch animate-pulse">
            {/* Left Spotlight Widescreen Card */}
            <div className="lg:col-span-8 flex flex-col justify-between bg-cream-100/60 border border-cream-300/60 rounded overflow-hidden p-3 relative">
              <div className="relative aspect-video w-full rounded overflow-hidden bg-cream-200 border border-cream-300/60 shadow-inner" />
              <div className="text-left mt-4 space-y-2">
                <div className="h-3.5 bg-cream-200 rounded w-full" />
                <div className="h-3.5 bg-cream-200 rounded w-5/6" />
              </div>
            </div>

            {/* Right Stack: Thumbnails List */}
            <div className="lg:col-span-4 flex flex-col space-y-2 max-h-[480px]">
              {[1, 2, 3].map((idx) => (
                <div 
                  key={idx}
                  className="p-2 rounded border border-cream-300/60 bg-white flex items-center space-x-3 text-left"
                >
                  <div className="w-20 aspect-video rounded bg-cream-200 shrink-0 border border-cream-300/40" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-3 bg-cream-200 rounded w-3/4" />
                    <div className="h-2 bg-cream-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }



  if (shortFilms.length === 0) {
    return (
      <section className="border-b border-cream-300/60 py-10 bg-white text-charcoal-900">
        <div className="max-w-7xl mx-auto px-6 text-left">
          <div className="text-left mb-8">
            <span className="text-[9px] uppercase tracking-[0.3em] text-gold-600 font-bold block mb-1">
              My Works
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-charcoal-900">
              Short Films
            </h2>
            <div className="h-[1.5px] w-16 bg-gold-500 mt-3"></div>
          </div>
          <p className="text-xs text-gray-500 font-light">No short films compositions uploaded yet.</p>
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
            Short Films
          </h2>
          <div className="h-[1.5px] w-16 bg-gold-500 mt-3"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Spotlight: Main Widescreen Card */}
          {selectedShortFilm && (
            <div className="lg:col-span-8 flex flex-col justify-between bg-cream-100/60 border border-cream-300/60 rounded overflow-hidden p-3 relative group">
              <div className="relative aspect-video w-full rounded overflow-hidden border border-cream-300/60 shadow-inner">
                <img 
                  src={getAssetUrl(selectedShortFilm.coverUrl)} 
                  alt={selectedShortFilm.title}
                  className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-700 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
                
                {/* Centered Play Button */}
                <button 
                  onClick={() => onPlayVideo(selectedShortFilm)}
                  className="absolute inset-0 m-auto w-14 h-14 bg-gold-500 hover:bg-gold-400 text-black rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer"
                >
                  <Play size={20} fill="currentColor" className="ml-1" />
                </button>

                {/* Metadata overlays */}
                <div className="absolute bottom-3 left-4 text-left">
                  <span className="text-[9px] uppercase tracking-widest text-gold-500 font-bold bg-black/60 px-2 py-0.5 rounded border border-white/5 text-white">
                    Release Year: {selectedShortFilm.releaseYear}
                  </span>
                  <h4 className="font-serif text-xl md:text-2xl font-black mt-2 leading-none text-white tracking-tight">
                    {selectedShortFilm.title}
                  </h4>
                </div>
              </div>

              <div className="text-left mt-3">
                <p className="text-xs text-gray-600 font-light leading-relaxed">
                  {selectedShortFilm.description}
                </p>
              </div>
            </div>
          )}

          {/* Right Stack: Thumbnails List */}
          <div className="lg:col-span-4 flex flex-col space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {shortFilms.map((film) => (
              <div 
                key={film._id}
                onClick={() => setSelectedShortFilm(film)}
                className={`p-2 rounded border transition-all duration-300 flex items-center space-x-3 cursor-pointer text-left ${selectedShortFilm && selectedShortFilm._id === film._id ? 'bg-cream-100 border-gold-500/50' : 'bg-white hover:bg-cream-100/50 border-cream-300/60'}`}
              >
                <div className="w-20 aspect-video rounded overflow-hidden bg-cream-100 relative shrink-0 border border-cream-300/40">
                  <img 
                    src={getAssetUrl(film.coverUrl)} 
                    className="w-full h-full object-cover" 
                    alt="" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <Play size={10} className="text-white" fill="currentColor" />
                  </div>
                </div>
                <div className="min-w-0">
                  <h5 className="font-serif text-xs font-bold text-charcoal-900 truncate leading-none">{film.title}</h5>
                  <span className="text-[9px] text-gray-500 font-semibold tracking-wider uppercase mt-1 block">{film.releaseYear}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
