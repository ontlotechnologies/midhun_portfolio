import { AnimatePresence, motion } from 'framer-motion';
import { Disc, Maximize2, Minimize2, Music, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FaSpotify, FaYoutube } from 'react-icons/fa';
import ShinyText from './ShinyText';

const getYoutubeId = (url) => {
  if (!url) return '';
  const regExp = /^(?:.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=))([^#&?]{11}).*/;
  const match = url.match(regExp);
  return (match && match[1] && match[1].length === 11) ? match[1] : '';
};

const isYoutube = (url) => {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
};

export default function AudioPlayer({ currentSong, songs, onSongSelect, isPlaying, setIsPlaying, isLoading, setIsLoading, onClose }) {
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  const [isYtReady, setIsYtReady] = useState(false);
  const ytPlayerRef = useRef(null);
  const ytInitializingRef = useRef(false);

  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const progressMobileRef = useRef(null);
  const animationRef = useRef(null);

  const handleNextRef = useRef(null);
  const isYoutubeAudioRef = useRef(isYoutube(currentSong?.audioUrl) || (!currentSong?.audioUrl && isYoutube(currentSong?.youtubeUrl)));
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const playRequestIdRef = useRef(0);

  const stopPlaybackAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const isYoutubeAudio = isYoutube(currentSong?.audioUrl) || (!currentSong?.audioUrl && isYoutube(currentSong?.youtubeUrl));
  const ytId = isYoutube(currentSong?.audioUrl)
    ? getYoutubeId(currentSong?.audioUrl)
    : (isYoutubeAudio ? getYoutubeId(currentSong?.youtubeUrl) : '');

  // Monitor screen resize for responsive triggers
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setViewportWidth(width);
      setIsMobile(width < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dynamic initialization of YouTube Iframe Player
  const initYtPlayer = () => {
    if (ytPlayerRef.current || ytInitializingRef.current) return;
    ytInitializingRef.current = true;

    let playerDiv = document.getElementById('youtube-audio-player-element');
    if (!playerDiv) {
      playerDiv = document.createElement('div');
      playerDiv.id = 'youtube-audio-player-element';
      playerDiv.style.position = 'absolute';
      playerDiv.style.width = '0px';
      playerDiv.style.height = '0px';
      playerDiv.style.opacity = '0';
      playerDiv.style.pointerEvents = 'none';
      document.body.appendChild(playerDiv);
    }

    try {
      const player = new window.YT.Player('youtube-audio-player-element', {
        height: '0',
        width: '0',
        videoId: ytId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          enablejsapi: 1,
          origin: window.location.origin
        },
        events: {
          onReady: (event) => {
            setIsYtReady(true);
            event.target.setVolume(isMuted ? 0 : volume * 100);
            if (isYoutubeAudioRef.current) {
              if (isPlayingRef.current) {
                event.target.playVideo();
              } else {
                setIsLoading(false);
              }
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              if (isYoutubeAudioRef.current) {
                setIsLoading(false);
                setIsPlaying(true);
              }
              animationRef.current = requestAnimationFrame(whilePlaying);
            } else if (event.data === window.YT.PlayerState.BUFFERING) {
              if (isYoutubeAudioRef.current) {
                setIsLoading(true);
              }
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              if (isYoutubeAudioRef.current) {
                setIsPlaying(false);
                setIsLoading(false);
              }
              stopPlaybackAnimation();
            } else if (event.data === window.YT.PlayerState.ENDED) {
              if (isYoutubeAudioRef.current) {
                setIsPlaying(false);
                setIsLoading(false);
                if (handleNextRef.current) {
                  handleNextRef.current();
                }
              }
              stopPlaybackAnimation();
            } else if (event.data === window.YT.PlayerState.CUED) {
              if (isYoutubeAudioRef.current) {
                setIsLoading(false);
              }
            }
          },
          onError: (err) => {
            console.error('YouTube Player Error:', err);
            if (isYoutubeAudioRef.current) {
              setIsLoading(false);
              setIsPlaying(false);
            }
          }
        }
      });
      ytPlayerRef.current = player;
    } catch (e) {
      console.error('Error creating YouTube player:', e);
      ytInitializingRef.current = false;
    }
  };

  useEffect(() => {
    if (isYoutubeAudio) {
      if (!window.YT || !window.YT.Player) {
        // Prevent duplicate script tag insertion
        if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
          const tag = document.createElement('script');
          tag.src = "https://www.youtube.com/iframe_api";
          const firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        const previousReady = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          if (previousReady) previousReady();
          initYtPlayer();
        };
      } else {
        initYtPlayer();
      }
    }
  }, [isYoutubeAudio]);

  useEffect(() => {
    return () => {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === 'function') {
        try {
          ytPlayerRef.current.destroy();
        } catch (e) {
          console.error('Error destroying YouTube player on unmount:', e);
        }
        ytPlayerRef.current = null;
      }
      ytInitializingRef.current = false;
      const el = document.getElementById('youtube-audio-player-element');
      if (el) el.remove();
    };
  }, []);

  // Sync and control YouTube playback
  const lastYtIdRef = useRef('');

  useEffect(() => {
    if (isYoutubeAudio) {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      if (ytPlayerRef.current && isYtReady) {
        if (lastYtIdRef.current !== ytId) {
          lastYtIdRef.current = ytId;
          if (isPlaying) {
            setIsLoading(true);
            ytPlayerRef.current.loadVideoById({ videoId: ytId });
          } else {
            setIsLoading(false);
            ytPlayerRef.current.cueVideoById({ videoId: ytId });
          }
        } else {
          if (isPlaying) {
            ytPlayerRef.current.playVideo();
          } else {
            ytPlayerRef.current.pauseVideo();
          }
        }
      }
    } else {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
        ytPlayerRef.current.pauseVideo();
      }
      lastYtIdRef.current = '';
    }
  }, [currentSong, ytId, isPlaying, isYoutubeAudio, isYtReady]);

  // Initialize persistent HTML5 Audio element and listeners once on mount
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onAudioEnded = () => {
      if (handleNextRef.current) {
        handleNextRef.current();
      }
    };

    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => setIsLoading(false);
    const onCanPlay = () => setIsLoading(false);
    const onPause = () => setIsLoading(false);
    const onError = () => setIsLoading(false);

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onAudioEnded);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);

    return () => {
      stopPlaybackAnimation();
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onAudioEnded);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
    };
  }, []);

  // Sync and control Native HTML5 Audio playback
  useEffect(() => {
    if (currentSong && !isYoutubeAudio) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
        ytPlayerRef.current.pauseVideo();
      }

      // Check if source changed before setting src and loading
      const normalizedCurrentSrc = audioRef.current.src ? new URL(audioRef.current.src, window.location.href).href : '';
      const normalizedTargetSrc = currentSong.audioUrl ? new URL(currentSong.audioUrl, window.location.href).href : '';
      const isNewSource = normalizedCurrentSrc !== normalizedTargetSrc;

      if (isNewSource) {
        stopPlaybackAnimation();
        audioRef.current.pause();
        audioRef.current.src = currentSong.audioUrl;
        audioRef.current.load();
        if (isPlaying) {
          setIsLoading(true);
        } else {
          setIsLoading(false);
        }
      }

      if (isPlaying) {
        playRequestIdRef.current += 1;
        const currentRequestId = playRequestIdRef.current;

        audioRef.current.play()
          .then(() => {
            if (currentRequestId === playRequestIdRef.current) {
              setIsLoading(false);
              animationRef.current = requestAnimationFrame(whilePlaying);
            }
          })
          .catch(err => {
            console.log('Audio playback failed or interrupted:', err);
            if (currentRequestId === playRequestIdRef.current) {
              if (err.name !== 'AbortError') {
                setIsPlaying(false);
              }
              setIsLoading(false);
            }
          });
      } else {
        audioRef.current.pause();
        stopPlaybackAnimation();
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopPlaybackAnimation();
    }
  }, [currentSong, isPlaying, isYoutubeAudio]);

  // Sync volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    if (ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === 'function') {
      ytPlayerRef.current.setVolume(isMuted ? 0 : volume * 100);
    }
  }, [volume, isMuted, isYoutubeAudio]);

  const whilePlaying = () => {
    if (isYoutubeAudioRef.current) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
        const current = ytPlayerRef.current.getCurrentTime();
        const dur = ytPlayerRef.current.getDuration();
        setCurrentTime(current);
        if (dur) setDuration(dur);
      }
    } else {
      if (!audioRef.current) return;
      setCurrentTime(audioRef.current.currentTime);
    }
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const handlePlayPause = () => {
    if (!currentSong && songs && songs.length > 0) {
      if (typeof onSongSelect === 'function') {
        onSongSelect(songs[0]);
      }
      setIsPlaying(true);
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeekOffset = (clientX, progressElement) => {
    if (!duration || !progressElement) return;
    const rect = progressElement.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / width));
    const seekTime = percentage * duration;

    if (isYoutubeAudio) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
        ytPlayerRef.current.seekTo(seekTime, true);
        setCurrentTime(seekTime);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
      }
    }
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

  useEffect(() => {
    handleNextRef.current = handleNext;
  });

  useEffect(() => {
    isYoutubeAudioRef.current = isYoutubeAudio;
  });

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Skip player render if no songs exist
  if (!songs || songs.length === 0) return null;

  const displaySong = currentSong || songs[0];
  const openWidth = Math.min(viewportWidth * 0.95, 1024);
  const openHeight = isExpanded ? (isMobile ? 'auto' : 220) : 80;
  const openBottom = isMobile ? 16 : 24;
  const minimizedSize = 48;
  const minimizedRight = 24;

  return (
    <motion.div
      layout
      initial={{
        y: 18,
        opacity: 0,
        scale: 0.98,
        width: openWidth,
        height: 64,
        x: -openWidth / 2,
        bottom: openBottom,
        borderRadius: 28
      }}
      animate={{
        y: 0,
        opacity: 1,
        scale: 1,
        width: isMinimized ? minimizedSize : openWidth,
        height: isMinimized ? minimizedSize : openHeight,
        x: isMinimized
          ? (viewportWidth / 2) - minimizedRight - minimizedSize
          : -openWidth / 2,
        bottom: isMinimized ? 24 : openBottom,
        borderRadius: isMinimized ? 24 : 32
      }}
      exit={{
        y: 18,
        opacity: 0,
        scale: 0.98,
        height: isMinimized ? minimizedSize : 64
      }}
      transition={{
        type: 'spring',
        stiffness: 210,
        damping: 28,
        mass: 0.75
      }}
      className={`fixed left-1/2 z-45 glass-audio-player overflow-hidden font-outfit ${isMinimized
        ? 'cursor-pointer flex items-center justify-center group'
        : ''
      }`}
      style={{
        transformOrigin: isMinimized ? 'center center' : 'center bottom'
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
            transition={{ duration: 0.12, ease: 'easeOut' }}
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
            transition={{ duration: 0.12, ease: 'easeOut' }}
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
                    transition={{ duration: 0.2, ease: 'easeOut' }}
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
                          <ShinyText text={displaySong.title} color="#f3eccf" shineColor="#ffffff" speed={3} />
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
                      <ShinyText text={displaySong.title} color="#f3eccf" shineColor="#ffffff" speed={3} />
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
                      title={isLoading ? "Buffering..." : (isPlaying ? "Pause" : "Play Preview")}
                    >
                      <div className="absolute inset-0 rounded-full border border-black/10 scale-90"></div>
                      {isLoading ? (
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                      ) : isPlaying ? (
                        <Pause size={17} fill="black" />
                      ) : (
                        <Play size={17} fill="black" className="ml-0.5" />
                      )}
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
                    title={isLoading ? "Buffering..." : (isPlaying ? "Pause" : "Play")}
                  >
                    {isLoading ? (
                      <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    ) : isPlaying ? (
                      <Pause size={14} fill="black" />
                    ) : (
                      <Play size={14} fill="black" className="ml-0.5" />
                    )}
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
