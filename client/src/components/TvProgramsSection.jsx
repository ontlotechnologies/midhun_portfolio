import React from 'react';
import { Play, Tv } from 'lucide-react';

export default function TvProgramsSection({ tvPrograms, onPlayVideo, loading }) {
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
              TV Programs
            </h2>
            <div className="h-[1.5px] w-16 bg-gold-500 mt-3" />
          </div>

          <div className="border border-cream-300/60 rounded bg-cream-50/20 divide-y divide-cream-300/60 animate-pulse">
            {[1, 2, 3].map((idx) => (
              <div 
                key={idx}
                className="flex flex-col md:flex-row md:items-center justify-between p-4.5 gap-4"
              >
                <div className="flex items-start space-x-4 min-w-0 text-left flex-1">
                  <div className="w-12 h-6 bg-cream-200 border border-cream-300/60 rounded shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-4 bg-cream-200 rounded w-1/3" />
                    <div className="h-3 bg-cream-200 rounded w-2/3" />
                  </div>
                </div>

                <div className="flex items-center space-x-4 self-end md:self-auto shrink-0">
                  <div className="w-12 h-8 bg-cream-200 rounded hidden md:block" />
                  <div className="w-28 h-8 bg-cream-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (tvPrograms.length === 0) {
    return (
      <section className="border-b border-cream-300/60 py-10 bg-white text-charcoal-900">
        <div className="max-w-7xl mx-auto px-6 text-left">
          <div className="text-left mb-8">
            <span className="text-[9px] uppercase tracking-[0.3em] text-gold-600 font-bold block mb-1">
              My Works
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-charcoal-900">
              TV Programs
            </h2>
            <div className="h-[1.5px] w-16 bg-gold-500 mt-3"></div>
          </div>
          <p className="text-xs text-gray-500 font-light">No TV program compositions uploaded yet.</p>
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
            TV Programs
          </h2>
          <div className="h-[1.5px] w-16 bg-gold-500 mt-3"></div>
        </div>

        <div className="border border-cream-300/60 rounded bg-cream-50/20 divide-y divide-cream-300/60">
          {tvPrograms.map((show) => (
            <div 
              key={show._id}
              className="flex flex-col md:flex-row md:items-center justify-between p-4.5 gap-4 hover:bg-cream-100/40 transition-colors group animate-fade-in"
            >
              {/* Left info column */}
              <div className="flex items-start space-x-4 min-w-0 text-left">
                <span className="text-[11px] font-mono text-gold-600 bg-cream-100 border border-cream-300/60 px-2 py-0.5 rounded tracking-widest shrink-0 mt-0.5">
                  {show.releaseYear}
                </span>
                <div className="min-w-0">
                  <h4 className="font-serif text-sm font-bold text-charcoal-900 group-hover:text-gold-600 transition-colors leading-none">
                    {show.title}
                  </h4>
                  <p className="text-xs text-gray-500 font-light mt-2 line-clamp-1 leading-none">
                    {show.description}
                  </p>
                </div>
              </div>

              {/* Right Action column */}
              <div className="flex items-center space-x-4 self-end md:self-auto">
                {/* Small preview avatar revealed on desktop hover */}
                {show.coverUrl && (
                  <img 
                    src={getAssetUrl(show.coverUrl)} 
                    alt="" 
                    className="w-12 h-8 object-cover rounded border border-cream-300/60 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hidden md:block" 
                  />
                )}
                <button 
                  onClick={() => onPlayVideo(show)}
                  className="bg-cream-100 hover:bg-gold-500 text-charcoal-900 hover:text-charcoal-900 border border-cream-300/60 hover:border-gold-500 text-[10px] tracking-widest uppercase font-bold px-3 py-1.5 rounded transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <Play size={10} fill="currentColor" /> Play Program
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
