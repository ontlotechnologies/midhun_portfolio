import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import IndependentWorksSection from './IndependentWorksSection';
import MoviesSection from './MoviesSection';
import ShortFilmsSection from './ShortFilmsSection';
import TvProgramsSection from './TvProgramsSection';
import WebSeriesSection from './WebSeriesSection';

export default function MediaShowcase({ mediaWorks }) {
  const [activeVideo, setActiveVideo] = useState(null); // { id, mediaType, url }
  const [activeLightboxImage, setActiveLightboxImage] = useState(null); // url
  
  // Audio Player State for Independent works
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef(null);

  // Helper to extract YouTube ID
  const getYoutubeId = (url) => {
    if (!url) return '';
    const regExp = /^(?:.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=))([^#&?]{11}).*/;
    const match = url.match(regExp);
    return (match && match[1] && match[1].length === 11) ? match[1] : '';
  };

  // Get absolute API url for uploaded static files
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

  // Filter categories
  const shortFilms = mediaWorks.filter(w => w.type === 'short_film');
  const webSeries = mediaWorks.filter(w => w.type === 'web_series');
  const tvPrograms = mediaWorks.filter(w => w.type === 'tv_program');
  const movies = mediaWorks.filter(w => w.type === 'movie');
  const independentWorks = mediaWorks.filter(w => w.type === 'independent_work');

  const handlePlayVideo = (work) => {
    setActiveVideo({
      id: work._id,
      mediaType: work.mediaType,
      url: work.videoUrl
    });
  };

  // Audio Playback Handler
  const handleAudioPlayToggle = (work) => {
    if (playingAudioId === work._id) {
      audioRef.current.pause();
      setPlayingAudioId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingAudioId(work._id);
      audioRef.current = new Audio();
      
      const src = work.audioUrl ? getAssetUrl(work.audioUrl) : getAssetUrl(work.videoUrl);
      audioRef.current.src = src;

      audioRef.current.play();
      
      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setAudioProgress(progress || 0);
        }
      };

      audioRef.current.onended = () => {
        setPlayingAudioId(null);
        setAudioProgress(0);
      };
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="w-full bg-neutral-950 text-white font-sans overflow-hidden">
      
      {/* Lightbox Modal for Large Movie Poster */}
      <AnimatePresence>
        {activeLightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightboxImage(null)}
            className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            <button className="absolute top-6 right-6 text-white hover:text-gold-500 transition-colors cursor-pointer">
              <X size={24} />
            </button>
            <motion.img 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              src={activeLightboxImage}
              className="max-h-[90vh] max-w-full object-contain rounded border border-white/10 shadow-2xl"
              alt="Movie Poster Spotlight"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Fullscreen Lightbox Player */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black/98 flex items-center justify-center p-4 md:p-8"
          >
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-gold-500 transition-colors z-[1000] cursor-pointer"
            >
              <X size={24} />
            </button>
            
            <div className="w-full max-w-5xl aspect-video bg-neutral-900 rounded border border-white/5 overflow-hidden shadow-2xl relative">
              {activeVideo.mediaType === 'youtube' ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeId(activeVideo.url)}?autoplay=1&rel=0`}
                  title="Cinematic Playback"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full absolute inset-0 border-0"
                ></iframe>
              ) : (
                <video 
                  src={getAssetUrl(activeVideo.url)}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                ></video>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render Subcomponents */}
      <ShortFilmsSection 
        shortFilms={shortFilms} 
        onPlayVideo={handlePlayVideo} 
      />

      <WebSeriesSection 
        webSeries={webSeries} 
        onPlayVideo={handlePlayVideo} 
      />

      <TvProgramsSection 
        tvPrograms={tvPrograms} 
        onPlayVideo={handlePlayVideo} 
      />

      <MoviesSection 
        movies={movies} 
        onPlayVideo={handlePlayVideo} 
        onZoomImage={setActiveLightboxImage} 
      />

      <IndependentWorksSection 
        independentWorks={independentWorks}
        onPlayVideo={handlePlayVideo}
        playingAudioId={playingAudioId}
        audioProgress={audioProgress}
        onAudioPlayToggle={handleAudioPlayToggle}
      />

    </div>
  );
}
