import React, { useState } from 'react';
import { ArrowLeft, Play, Pause, Music, Mic, PenTool, Sliders, Home as HomeIcon, Share2 } from 'lucide-react';
import { FaSpotify, FaYoutube } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function WorkDetailPage({ song, onBackClick, onPlayClick, currentSong, isPlaying }) {
  if (!song) return null;

  const isCurrent = currentSong && currentSong._id === song._id;
  const isCurrentPlaying = isCurrent && isPlaying;
  const [copied, setCopied] = useState(false);

  // Credits matching Midhun Saji Ram's editorial styling
  const credits = {
    composer: 'Midhun Saji Ram',
    singer: song.title === 'Ennin Nenjil' ? 'Midhun Saji Ram & Chitra' : 'Midhun Saji Ram',
    lyrics: 'Saji Ram (Archival Notebooks)',
    keyboards: 'Midhun Saji Ram',
    mixed: 'Studio A, Kochi',
    mastered: 'Kochi Digital Labs'
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-charcoal-900 animate-fade-in flex flex-col pt-24 pb-16">
      
      <div className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col justify-center">
        
        {/* Back trigger */}
        <button 
          onClick={onBackClick}
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gold-500 hover:text-charcoal-900 font-bold mb-8 transition-colors duration-300 group cursor-pointer w-fit"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
          <span>Back to Compositions</span>
        </button>

        {/* 3-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Column 1: Artwork and Media controls (Sleeve, Waveform and Stream Links) */}
          <div className="lg:col-span-5 flex flex-col space-y-4 animate-fade-in">
            
            {/* Artwork Image Container (No outer card padding/wrapper to match mockup) */}
            <div className="aspect-square w-full bg-stone-900 border border-cream-300 rounded overflow-hidden relative shadow-sm group">
              <img 
                src={song.coverUrl} 
                alt={song.title} 
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>

            {/* Spotify / YouTube streaming links */}
            <div className="flex gap-3">
              {song.spotifyUrl ? (
                <a
                  href={song.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded border border-cream-300 bg-white hover:border-emerald-500/30 hover:bg-emerald-50/50 text-charcoal-900 hover:text-emerald-700 text-[9px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 shadow-sm cursor-pointer"
                >
                  <FaSpotify size={14} className="text-emerald-500" />
                  Listen on Spotify
                </a>
              ) : (
                <div className="flex-1 py-3 px-4 rounded border border-cream-300 opacity-40 text-gray-400 text-[9px] font-bold tracking-widest uppercase flex items-center justify-center gap-2">
                  Spotify N/A
                </div>
              )}

              {song.youtubeUrl ? (
                <a
                  href={song.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded border border-cream-300 bg-white hover:border-red-500/30 hover:bg-red-50/50 text-charcoal-900 hover:text-red-600 text-[9px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 shadow-sm cursor-pointer"
                >
                  <FaYoutube size={14} className="text-red-500" />
                  Watch on YouTube
                </a>
              ) : (
                <div className="flex-1 py-3 px-4 rounded border border-cream-300 opacity-40 text-gray-400 text-[9px] font-bold tracking-widest uppercase flex items-center justify-center gap-2">
                  YouTube N/A
                </div>
              )}
            </div>

          </div>

          {/* Column 2: Header, Description & Production Credits */}
          <div className="lg:col-span-7 flex flex-col justify-start">
            <div className="mb-3">
              <span className="px-3 py-1 bg-gold-500/10 text-gold-600 text-[9px] font-bold tracking-widest uppercase rounded inline-block border border-gold-500/20">
                {song.category || 'Single'}
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4.5xl font-bold tracking-tight text-charcoal-900 leading-tight mb-2">
              {song.title}
            </h1>
            <div className="h-[1.5px] w-16 bg-gold-500 mt-1 mb-4"></div>
            
            <p className="text-charcoal-800 text-xs md:text-sm font-light leading-relaxed max-w-xl mb-6">
              {song.description || 'A timeless composition capturing deep melodies and emotional states, blending acoustic layers with atmospheric synths.'}
            </p>

            {/* Play track preview block */}
            <div className="bg-white border border-cream-300 p-4 rounded flex items-center justify-between shadow-sm mb-6">
              <button
                onClick={() => onPlayClick(song)}
                className="w-11 h-11 rounded bg-gold-500 hover:bg-gold-600 text-white flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer flex-shrink-0"
              >
                {isCurrentPlaying ? (
                  <Pause size={16} fill="currentColor" />
                ) : (
                  <Play size={16} fill="currentColor" className="ml-0.5" />
                )}
              </button>

              <div className="flex-1 px-4">
                <span className="text-[9px] uppercase tracking-widest text-gold-600 font-bold block mb-1">
                  {isCurrentPlaying ? 'Now Playing Preview' : 'Play Track Preview'}
                </span>
                {/* Visualizer soundwave */}
                <div className="flex items-center space-x-1.5 h-6">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const heights = [8, 14, 20, 12, 16, 24, 18, 12, 6, 10, 14, 20, 24, 18, 14, 10, 14, 20, 16, 10];
                    const h = heights[i % heights.length];
                    return (
                      <span 
                        key={i} 
                        className={`w-[2px] rounded-t-sm transition-all duration-500 ${
                          isCurrentPlaying 
                            ? 'bg-gold-500 animate-[bounceBar_1.2s_infinite]' 
                            : 'bg-cream-400'
                        }`}
                        style={{ 
                          height: `${h}px`,
                          animationDelay: `${i * 0.05}s`
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              <span className="text-[10px] text-gray-500 font-bold font-sans self-end mb-0.5">
                03:45
              </span>
            </div>

            {/* Credits List */}
            <div className="border-t border-cream-300 pt-6 mt-6">
              <div className="flex flex-col space-y-4 text-xs">
                
                {/* COMPOSER */}
                <div className="flex items-center justify-between border-b border-cream-300/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Music size={13} className="text-gold-500" />
                    <span className="text-gray-500 uppercase tracking-widest font-semibold text-[9px]">Composer</span>
                  </div>
                  <span className="text-charcoal-900 font-bold text-right">{credits.composer}</span>
                </div>

                {/* VOCALS */}
                <div className="flex items-center justify-between border-b border-cream-300/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Mic size={13} className="text-gold-500" />
                    <span className="text-gray-500 uppercase tracking-widest font-semibold text-[9px]">Vocals</span>
                  </div>
                  <span className="text-charcoal-900 font-bold text-right">{credits.singer}</span>
                </div>

                {/* LYRICS */}
                <div className="flex items-center justify-between border-b border-cream-300/60 pb-3">
                  <div className="flex items-center gap-2">
                    <PenTool size={13} className="text-gold-500" />
                    <span className="text-gray-500 uppercase tracking-widest font-semibold text-[9px]">Lyrics</span>
                  </div>
                  <span className="text-charcoal-900 font-bold text-right">{credits.lyrics}</span>
                </div>

                {/* ARRANGEMENTS */}
                <div className="flex items-center justify-between border-b border-cream-300/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders size={13} className="text-gold-500" />
                    <span className="text-gray-500 uppercase tracking-widest font-semibold text-[9px]">Arrangements</span>
                  </div>
                  <span className="text-charcoal-900 font-bold text-right">{credits.keyboards}</span>
                </div>

                {/* RECORDING STUDIO */}
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <HomeIcon size={13} className="text-gold-500" />
                    <span className="text-gray-500 uppercase tracking-widest font-semibold text-[9px]">Recording Studio</span>
                  </div>
                  <span className="text-charcoal-900 font-bold text-right">{credits.mixed}</span>
                </div>

              </div>
            </div>

          </div>



        </div>

        {/* Bottom Section: Quote, Waveform and Share Trigger */}
        <div className="mt-12 pt-8 border-t border-cream-300 w-full">
          <div className="bg-white border border-cream-300 rounded p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Music Quote */}
            <div className="flex items-start gap-4 flex-1">
              <div className="w-10 h-10 rounded bg-gold-500/10 flex items-center justify-center text-gold-600 flex-shrink-0">
                <Music size={18} />
              </div>
              <div>
                <p className="font-serif text-sm md:text-base text-charcoal-800 italic leading-relaxed">
                  "Every composition is a chapter from my journey within."
                </p>
                <span className="font-script text-xl text-gold-600 block mt-1">
                  — Midhun Saji Ram
                </span>
              </div>
            </div>

            {/* Center Soundwave Graphic */}
            <div className="hidden lg:flex items-center justify-center flex-1 h-12 w-full px-6">
              <svg className="w-full h-8 text-cream-400" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0 20 H30 L35 10 L40 30 L45 20 H60 L65 5 L70 35 L75 15 L80 25 L85 20 H110 L115 8 L120 32 L125 12 L130 28 L135 20 H150 L155 10 L160 30 L165 20 H200"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-50"
                />
                {isCurrentPlaying && (
                  <path
                    d="M0 20 H30 L35 10 L40 30 L45 20 H60 L65 5 L70 35 L75 15 L80 25 L85 20 H110 L115 8 L120 32 L125 12 L130 28 L135 20 H150 L155 10 L160 30 L165 20 H200"
                    stroke="#2563eb"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-pulse"
                    strokeDasharray="200"
                    strokeDashoffset="0"
                  />
                )}
              </svg>
            </div>

            {/* Share Trigger */}
            <div className="flex flex-col items-center md:items-end justify-center gap-2 flex-shrink-0">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                Love this track? Share it
              </span>
              <button
                onClick={handleShare}
                className="py-2.5 px-6 bg-gold-500 hover:bg-gold-600 text-white font-bold text-[10px] tracking-widest uppercase rounded transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md cursor-pointer"
              >
                <Share2 size={12} />
                <span>{copied ? 'Copied!' : 'Share Track'}</span>
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
