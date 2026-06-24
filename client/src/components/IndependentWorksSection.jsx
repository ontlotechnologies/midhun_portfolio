import React from 'react';
import { Play, Pause, Radio } from 'lucide-react';

export default function IndependentWorksSection({ 
  independentWorks, 
  onPlayVideo, 
  playingAudioId, 
  audioProgress, 
  onAudioPlayToggle,
  loading
}) {
  
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
              Independent Works
            </h2>
            <div className="h-[1.5px] w-16 bg-gold-500 mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
            {/* Card 1: Audio Skeleton */}
            <div className="bg-cream-100/60 border border-cream-300/60 rounded p-3 text-left flex flex-col justify-between shadow-sm">
              <div className="flex flex-col h-full justify-between w-full">
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-cream-200 border border-cream-300/40 rounded-full shrink-0" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-2.5 bg-cream-200 rounded w-16" />
                      <div className="h-3.5 bg-cream-200 rounded w-24" />
                      <div className="h-2 bg-cream-200 rounded w-20" />
                    </div>
                  </div>
                  <div className="space-y-1.5 mb-4">
                    <div className="h-2.5 bg-cream-200 rounded w-full" />
                    <div className="h-2.5 bg-cream-200 rounded w-5/6" />
                  </div>
                </div>

                {/* Retro cassette deck box mockup */}
                <div className="w-full bg-neutral-900 border border-white/5 rounded-sm p-2.5 flex flex-col justify-center mt-auto">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-4.5 h-4.5 rounded-full border border-gray-700 bg-neutral-800" />
                      <div className="w-4.5 h-4.5 rounded-full border border-gray-700 bg-neutral-800" />
                    </div>
                    <div className="h-2.5 bg-neutral-800 rounded w-20" />
                    <div className="bg-neutral-800 w-6 h-6 rounded" />
                  </div>
                  <div className="w-full bg-neutral-800 h-1 rounded-full" />
                </div>
              </div>
            </div>

            {/* Card 2: Video Skeleton */}
            <div className="bg-cream-100/60 border border-cream-300/60 rounded p-3 text-left flex flex-col justify-between shadow-sm">
              <div className="flex flex-col h-full justify-between w-full">
                <div>
                  <div className="relative aspect-video w-full rounded overflow-hidden bg-cream-200 border border-cream-300/40 shadow-sm mb-3" />
                  <div className="min-w-0 text-left mb-2 space-y-2">
                    <div className="h-2.5 bg-cream-200 rounded w-16" />
                    <div className="h-3.5 bg-cream-200 rounded w-28" />
                    <div className="h-2 bg-cream-200 rounded w-20" />
                  </div>
                  <div className="space-y-1.5 mb-4">
                    <div className="h-2.5 bg-cream-200 rounded w-full" />
                    <div className="h-2.5 bg-cream-200 rounded w-5/6" />
                  </div>
                </div>
                <div className="w-full h-8 bg-cream-200 border border-cream-300/60 rounded mt-auto" />
              </div>
            </div>

            {/* Card 3: Audio Skeleton */}
            <div className="bg-cream-100/60 border border-cream-300/60 rounded p-3 text-left flex flex-col justify-between shadow-sm">
              <div className="flex flex-col h-full justify-between w-full">
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-cream-200 border border-cream-300/40 rounded-full shrink-0" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-2.5 bg-cream-200 rounded w-16" />
                      <div className="h-3.5 bg-cream-200 rounded w-24" />
                      <div className="h-2 bg-cream-200 rounded w-20" />
                    </div>
                  </div>
                  <div className="space-y-1.5 mb-4">
                    <div className="h-2.5 bg-cream-200 rounded w-full" />
                    <div className="h-2.5 bg-cream-200 rounded w-5/6" />
                  </div>
                </div>

                <div className="w-full bg-neutral-900 border border-white/5 rounded-sm p-2.5 flex flex-col justify-center mt-auto">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-4.5 h-4.5 rounded-full border border-gray-700 bg-neutral-800" />
                      <div className="w-4.5 h-4.5 rounded-full border border-gray-700 bg-neutral-800" />
                    </div>
                    <div className="h-2.5 bg-neutral-800 rounded w-20" />
                    <div className="bg-neutral-800 w-6 h-6 rounded" />
                  </div>
                  <div className="w-full bg-neutral-800 h-1 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (independentWorks.length === 0) {
    return (
      <section className="border-b border-cream-300/60 py-10 bg-white text-charcoal-900">
        <div className="max-w-7xl mx-auto px-6 text-left">
          <div className="text-left mb-8">
            <span className="text-[9px] uppercase tracking-[0.3em] text-gold-600 font-bold block mb-1">
              My Works
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-charcoal-900">
              Independent Works
            </h2>
            <div className="h-[1.5px] w-16 bg-gold-500 mt-3"></div>
          </div>
          <p className="text-xs text-gray-500 font-light">No independent works compositions uploaded yet.</p>
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
            Independent Works
          </h2>
          <div className="h-[1.5px] w-16 bg-gold-500 mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {independentWorks.map((work) => {
            const isAudio = !!work.audioUrl || 
                             /\.(mp3|wav|ogg|aac|m4a|flac)(?:\?|$)/i.test(work.videoUrl || '') || 
                             work.videoUrl?.includes('SoundHelix');
            const isPlaying = playingAudioId === work._id;

            return (
              <div 
                key={work._id}
                className="bg-cream-100/60 border border-cream-300/60 rounded p-3 text-left flex flex-col justify-between group hover:border-gold-500/10 transition-all duration-300 shadow-sm relative overflow-hidden"
              >
                {isAudio ? (
                  /* AUDIO LAYOUT */
                  <div className="flex flex-col h-full justify-between w-full">
                    <div>
                      {/* Audio Header with Small Cover art & Title */}
                      <div className="flex items-center space-x-3 mb-3">
                        <div 
                          className="w-12 h-12 bg-cream-200 border border-cream-300/40 rounded-full overflow-hidden shrink-0 relative animate-spin-slow"
                          style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
                        >
                          <img 
                            src={getAssetUrl(work.coverUrl)} 
                            className="w-full h-full object-cover filter brightness-95" 
                            alt="" 
                          />
                          {/* Inner center circle of vinyl/disc */}
                          <div className="absolute inset-0 m-auto w-3.5 h-3.5 bg-white border border-cream-300 rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                          </div>
                        </div>
                        <div className="min-w-0 text-left">
                          <span className="text-[8px] uppercase tracking-widest text-gold-600 font-bold font-mono">
                            Independent Audio
                          </span>
                          <h4 className="font-serif text-xs font-black text-charcoal-900 leading-tight mt-0.5 truncate">{work.title}</h4>
                          <p className="text-[9px] text-gray-500 mt-1 font-semibold">Composer &bull; {work.releaseYear}</p>
                        </div>
                      </div>

                      <p className="text-[10px] text-gray-600 font-light leading-relaxed mb-4 line-clamp-3">
                        {work.description}
                      </p>
                    </div>

                    {/* RETRO CASSETTE PLAYER DECK */}
                    <div className="w-full bg-neutral-950 border border-white/10 rounded-sm p-2.5 flex flex-col justify-center text-white mt-auto">
                      <div className="flex items-center justify-between mb-2 px-1">
                        {/* Left Tape Cassette Wheels */}
                        <div className="flex items-center space-x-1.5">
                          <div 
                            className="relative w-4.5 h-4.5 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center animate-spin" 
                            style={{ animationDuration: '6s', animationPlayState: isPlaying ? 'running' : 'paused' }}
                          >
                            <div className="w-1 h-1 bg-gold-500 rounded-full"></div>
                          </div>
                          <span className="text-[7.5px] font-mono text-gray-600">A</span>
                          <div 
                            className="relative w-4.5 h-4.5 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center animate-spin" 
                            style={{ animationDuration: '6s', animationPlayState: isPlaying ? 'running' : 'paused' }}
                          >
                            <div className="w-1 h-1 bg-gold-500 rounded-full"></div>
                          </div>
                        </div>

                        {/* Center Tape Title */}
                        <div className="text-[8px] font-mono text-gold-500/80 uppercase tracking-widest animate-pulse" style={{ animationDuration: '2s' }}>
                          {isPlaying ? 'PLAYING RECORD' : 'TAPE DECK IDLE'}
                        </div>

                        {/* Play Button */}
                        <button 
                          onClick={() => onAudioPlayToggle(work)}
                          className="bg-gold-500 text-black hover:bg-gold-400 w-6 h-6 rounded flex items-center justify-center transition-colors cursor-pointer shrink-0 border-0"
                        >
                          {isPlaying ? <Pause size={10} fill="currentColor" /> : <Play size={10} fill="currentColor" className="ml-[0.5px]" />}
                        </button>
                      </div>

                      {/* Progress slider bar */}
                      <div className="w-full bg-neutral-900 h-1 rounded-full overflow-hidden relative">
                        <div 
                          className="h-full bg-gold-500 transition-all duration-100" 
                          style={{ width: `${isPlaying ? audioProgress : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* VIDEO LAYOUT */
                  <div className="flex flex-col h-full justify-between w-full">
                    <div>
                      {/* Widescreen Video Thumbnail */}
                      <div className="relative aspect-video w-full rounded overflow-hidden border border-cream-300/40 shadow-sm mb-3 group/video">
                        <img 
                          src={getAssetUrl(work.coverUrl)} 
                          alt={work.title}
                          className="w-full h-full object-cover filter brightness-95 group-hover/video:scale-102 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover/video:bg-black/40 transition-colors flex items-center justify-center">
                          <button 
                            onClick={() => onPlayVideo(work)}
                            className="w-10 h-10 bg-gold-500 text-black hover:bg-gold-400 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover/video:scale-100 transition-all duration-300 cursor-pointer"
                          >
                            <Play size={14} fill="currentColor" className="ml-0.5" />
                          </button>
                        </div>
                      </div>

                      <div className="min-w-0 text-left mb-2">
                        <span className="text-[8px] uppercase tracking-widest text-gold-600 font-bold font-mono">
                          Independent Video
                        </span>
                        <h4 className="font-serif text-xs font-black text-charcoal-900 leading-tight mt-0.5 truncate">{work.title}</h4>
                        <p className="text-[9px] text-gray-500 mt-1 font-semibold">Composer &bull; {work.releaseYear}</p>
                      </div>

                      <p className="text-[10px] text-gray-600 font-light leading-relaxed mb-4 line-clamp-2">
                        {work.description}
                      </p>
                    </div>

                    <button 
                      onClick={() => onPlayVideo(work)}
                      className="w-full bg-cream-100 hover:bg-gold-500 text-charcoal-900 hover:text-charcoal-900 border border-cream-300/60 hover:border-gold-500 py-2 rounded-sm text-[9px] tracking-wider uppercase font-extrabold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
                    >
                      <Play size={11} fill="currentColor" /> Stream Visual Composition
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
