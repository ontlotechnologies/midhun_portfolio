import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Maximize2, Minimize2, Disc, ExternalLink, X, Music } from 'lucide-react';
import { FaSpotify, FaYoutube } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function AudioPlayer({ currentSong, songs, onSongSelect, isPlaying, setIsPlaying, onClose }) {
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const progressMobileRef = useRef(null);
  const animationRef = useRef(null);

  // Monitor screen resize for responsive triggers
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize or change active song
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    if (currentSong) {
      audioRef.current.src = currentSong.audioUrl;
      audioRef.current.load();
      
      // Auto play on select
      if (isPlaying) {
        audioRef.current.play()
          .then(() => {
            animationRef.current = requestAnimationFrame(whilePlaying);
          })
          .catch(err => console.log('Audio autoplay blocked:', err));
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentSong]);

  // Sync play/pause controls
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.play()
        .then(() => {
          animationRef.current = requestAnimationFrame(whilePlaying);
        })
        .catch(err => console.log('Play failed:', err));
    } else {
      audioRef.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  }, [isPlaying]);

  // Handle HTML audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onAudioEnded = () => {
      handleNext();
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onAudioEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onAudioEnded);
    };
  }, [currentSong]);

  // Sync volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const whilePlaying = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const handlePlayPause = () => {
    if (!currentSong && songs && songs.length > 0) {
      onSongSelect(songs[0]);
      setIsPlaying(true);
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeekOffset = (clientX, progressElement) => {
    if (!audioRef.current || !duration || !progressElement) return;
    const rect = progressElement.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / width));
    const seekTime = percentage * duration;
    
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleSeek = (e) => {
    handleSeekOffset(e.clientX, progressRef.current);
  };

  const handleSeekMobile = (e) => {
    handleSeekOffset(e.clientX, progressMobileRef.current);
  };

  const handleNext = () => {
    if (!songs || songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s._id === currentSong?._id);
    const nextIndex = (currentIndex + 1) % songs.length;
    onSongSelect(songs[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (!songs || songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s._id === currentSong?._id);
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = songs.length - 1;
    onSongSelect(songs[prevIndex]);
    setIsPlaying(true);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Skip player render if no songs exist
  if (!songs || songs.length === 0) return null;

  const displaySong = currentSong || songs[0];

  return (
    <motion.div 
      layout
      initial={{ y: 150 }}
      animate={{ y: 0 }}
      exit={{ y: 150 }}
      transition={{ 
        layout: { type: 'spring', damping: 26, stiffness: 170 },
        y: { type: 'spring', damping: 26, stiffness: 170 }
      }}
      className={`fixed z-45 bg-[#0a0f1d]/60 backdrop-blur-[32px] saturate-[1.5] border border-white/10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden font-outfit ${
        isMinimized 
          ? 'bottom-6 right-6 cursor-pointer flex items-center justify-center group'
          : 'bottom-4 md:bottom-6 left-0 right-0 mx-auto'
      }`}
      style={{
        width: isMinimized ? 48 : '95%',
        height: isMinimized ? 48 : (isExpanded ? (isMobile ? 'auto' : 220) : 80),
        borderRadius: isMinimized ? 24 : 32,
        maxWidth: isMinimized ? 48 : 1024
      }}
      onClick={() => {
        if (isMinimized) setIsMinimized(false);
      }}
    >
      <AnimatePresence mode="wait">
        {isMinimized ? (
          <motion.div 
            key="icon"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center text-gold-500 w-full h-full relative"
          >
            <Music size={18} className="group-hover:scale-110 transition-transform duration-300" />
            {isPlaying && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-gold-500 rounded-full animate-pulse border border-charcoal-900" />
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full flex flex-col relative"
          >
      
      {/* Click-to-seek Progress Bar at the top edge for Mobile, and aesthetic visualizer for Desktop */}
      <div 
        ref={progressMobileRef}
        onClick={handleSeekMobile}
        className="absolute top-0 left-0 w-full h-[3px] bg-white/10 hover:h-[4px] cursor-pointer z-50 group transition-all"
      >
        <div 
          className="h-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-100"
          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
        ></div>
        {isPlaying && (
          <div 
            className="absolute top-0 h-full bg-white/20 w-12 animate-pulse pointer-events-none"
            style={{ left: `calc(${duration ? (currentTime / duration) * 100 : 0}% - 24px)` }}
          />
        )}
      </div>

      <div className="w-full mx-auto px-6 h-full flex flex-col justify-center py-2">
        
        {/* Expanded Details Layout */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-center pt-4 pb-4 border-b border-white/5 md:border-b-0"
            >
              {/* Left Column: Vinyl Sleeve & Disc */}
              <div className="flex items-center space-x-6 justify-start">
                <div className="relative w-20 h-20 flex-shrink-0">
                  {/* Spinning Vinyl Record */}
                  <motion.div
                    animate={{ 
                      x: isExpanded ? 34 : 0,
                      rotate: isPlaying ? 360 : 0
                    }}
                    transition={{
                      x: { type: 'spring', damping: 20, stiffness: 100 },
                      rotate: isPlaying ? { repeat: Infinity, duration: 10, ease: 'linear' } : { duration: 0.5 }
                    }}
                    className="absolute top-1 left-1 w-18 h-18 rounded-full shadow-2xl flex items-center justify-center z-0"
                    style={{
                      background: 'repeating-radial-gradient(circle, #0e0e0e, #0e0e0e 2px, #1a1a1a 4px, #2a2a2a 5px, #0e0e0e 6px)',
                      boxShadow: '0 6px 18px rgba(0,0,0,0.5), inset 0 0 10px rgba(255,255,255,0.1)'
                    }}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none"></div>
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-black flex-shrink-0 relative">
                      <img 
                        src={displaySong.coverUrl} 
                        alt={displaySong.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#111] border border-gold-500/30"></div>
                    </div>
                  </motion.div>

                  {/* Cardboard Outer Sleeve */}
                  <div className="absolute inset-y-0 left-0 w-20 h-20 bg-[#18243c]/10 border border-gold-500/15 rounded-lg overflow-hidden shadow-xl z-10">
                    <img 
                      src={displaySong.coverUrl} 
                      alt={displaySong.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10"></div>
                  </div>
                </div>

                <div className="pl-5 z-20 text-left">
                  <span className="text-[9px] tracking-[0.25em] font-bold text-gold-500/80 uppercase block mb-0.5">
                    {displaySong.category}
                  </span>
                  <h4 className="text-lg font-bold text-gold-100 leading-tight">
                    {displaySong.title}
                  </h4>
                  <p className="text-[8.5px] tracking-widest text-gray-400 mt-1 uppercase font-bold">
                    Midhun Saji Ram
                  </p>
                </div>
              </div>
              
              {/* Middle Column: Song Insights (Hidden on Mobile for screen space) */}
              <div className="hidden md:flex text-left px-5 flex-col justify-center border-l border-white/5 h-16">
                <span className="text-[8px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Creative Insights</span>
                <p className="text-xs text-gray-300 italic leading-relaxed max-w-md font-light line-clamp-2">
                  "{displaySong.description || 'A timeless melody carrying forward the legacy of sound.'}"
                </p>
              </div>
              
              {/* Right Column: Streaming Pills Badge */}
              <div className="flex flex-col items-start md:items-end space-y-2 justify-center md:border-l border-white/5 h-auto md:h-16 pr-2">
                <span className="text-[8px] uppercase tracking-widest text-gray-500 font-bold block">LISTEN ON STREAMING CHANNELS</span>
                <div className="flex space-x-2">
                  {displaySong.spotifyUrl && (
                    <a 
                      href={displaySong.spotifyUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 hover:text-green-300 rounded-full text-[9px] uppercase font-bold tracking-widest transition-all duration-300"
                    >
                      <FaSpotify size={12} />
                      <span>Spotify</span>
                    </a>
                  )}
                  {displaySong.youtubeUrl && (
                    <a 
                      href={displaySong.youtubeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 rounded-full text-[9px] uppercase font-bold tracking-widest transition-all duration-300"
                    >
                      <FaYoutube size={12} />
                      <span>YouTube</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player Controls Bar */}
        <div className="flex items-center justify-between">
          
          {/* Cover & Title */}
          <div className="flex items-center space-x-3 w-auto md:w-1/4 max-w-[60%] md:max-w-none">
            <div className="relative group flex-shrink-0">
              <img 
                src={displaySong.coverUrl} 
                alt={displaySong.title} 
                className={`w-11 h-11 rounded-lg object-cover border border-gold-500/20 transition-transform duration-500 ${isPlaying ? 'animate-[spin_16s_linear_infinite]' : ''}`}
              />
              <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Disc size={15} className="text-gold-500" />
              </div>
            </div>
            
            <div className="overflow-hidden text-left ml-3.5">
              <h4 className="text-sm font-semibold truncate text-gold-100">
                {displaySong.title}
              </h4>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest truncate mt-0.5 font-bold">
                {displaySong.category}
              </p>
            </div>
          </div>

          {/* Center Playback Controls & Progress (Desktop only) */}
          <div className="hidden md:flex flex-col items-center w-2/4">
            {/* Buttons */}
            <div className="flex items-center space-x-6 mb-1.5">
              <button 
                onClick={handlePrev} 
                className="text-gray-400 hover:text-gold-500 transition-colors p-1 hover:-translate-x-0.5 duration-200"
                title="Previous Track"
              >
                <SkipBack size={18} />
              </button>
              
              <button 
                onClick={handlePlayPause}
                className="w-10 h-10 rounded-full bg-gold-500 hover:bg-gold-400 text-black flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.35)] hover:scale-105 relative cursor-pointer group"
                title={isPlaying ? "Pause" : "Play Preview"}
              >
                <div className="absolute inset-0 rounded-full border border-black/10 scale-90"></div>
                {isPlaying ? <Pause size={17} fill="black" /> : <Play size={17} fill="black" className="ml-0.5" />}
              </button>
              
              <button 
                onClick={handleNext} 
                className="text-gray-400 hover:text-gold-500 transition-colors p-1 hover:translate-x-0.5 duration-200"
                title="Next Track"
              >
                <SkipForward size={18} />
              </button>
            </div>

            {/* Time & Timeline */}
            <div className="flex items-center space-x-3 w-full max-w-lg">
              <span className="text-[10px] text-gray-400 font-mono">{formatTime(currentTime)}</span>
              
              {/* Progress track */}
              <div 
                ref={progressRef}
                onClick={handleSeek}
                className="h-1 bg-neutral-800 rounded-full cursor-pointer relative flex-1 group"
              >
                <div 
                  className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full absolute top-0 left-0"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                ></div>
                <div 
                  className="w-2.5 h-2.5 bg-gold-200 rounded-full absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `calc(${duration ? (currentTime / duration) * 100 : 0}% - 5px)` }}
                ></div>
              </div>
              
              <span className="text-[10px] text-gray-400 font-mono">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Volume / Extras */}
          <div className="flex items-center justify-end space-x-2.5 md:space-x-4 w-auto md:w-1/4 text-gray-400">
            {/* Mobile Play Button */}
            <button 
              onClick={handlePlayPause}
              className="md:hidden w-8 h-8 rounded-full bg-gold-500 text-black flex items-center justify-center transition-all duration-300 shadow-sm mr-2 flex-shrink-0"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={14} fill="black" /> : <Play size={14} fill="black" className="ml-0.5" />}
            </button>

            {/* Volume controls (Desktop only) */}
            <div className="hidden sm:flex items-center space-x-2.5 group/vol">
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className="text-gray-400 hover:text-gold-500 transition-colors p-1"
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="w-16 h-1 bg-neutral-800 accent-gold-500 rounded-full cursor-pointer opacity-40 group-hover/vol:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(to right, var(--color-gold-500) ${(isMuted ? 0 : volume) * 100}%, #262626 ${(isMuted ? 0 : volume) * 100}%)`
                }}
              />
            </div>

            {/* Expand / Minimize Toggle */}
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-7 h-7 rounded-full border border-white/10 hover:border-gold-500/30 hover:bg-gold-500/10 text-gray-400 hover:text-gold-500 flex items-center justify-center transition-all duration-300 flex-shrink-0"
              title={isExpanded ? "Collapse Player" : "Show Details"}
            >
              {isExpanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            </button>

            {/* Minimize to Icon Button */}
            <button 
              onClick={() => { setIsExpanded(false); setIsMinimized(true); }}
              className="w-7 h-7 rounded-full border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 text-gray-400 hover:text-red-400 flex items-center justify-center transition-all duration-300 flex-shrink-0"
              title="Minimize Player"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
