import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import IndependentWorksSection from '../components/IndependentWorksSection';
import MoviesSection from '../components/MoviesSection';
import ShinyText from '../components/ShinyText';
import ShortFilmsSection from '../components/ShortFilmsSection';
import TvProgramsSection from '../components/TvProgramsSection';
import WebSeriesSection from '../components/WebSeriesSection';
import WorksShowcase from '../components/WorksShowcase';

export default function WorksPage({ 
  songs, 
  mediaWorks = [], 
  worksCategory = 'audio', 
  setWorksCategory,
  currentSong, 
  isPlaying, 
  onSongSelect, 
  setIsPlaying, 
  onWorkClick,
  loading,
  isAudioLoading
}) {
  const [activeVideo, setActiveVideo] = useState(null); // { id, mediaType, url }
  const [activeLightboxImage, setActiveLightboxImage] = useState(null); // url
  
  const scrollContainerRef = useRef(null);

  const handleCarouselScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 140;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Pagination & Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const [activeAudioFilter, setActiveAudioFilter] = useState('All');

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
  }

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
      // Pause global persistent audio player if active
      if (playingAudioId !== work._id) {
        if (setIsPlaying) {
          setIsPlaying(false);
        }
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

  // Stop independent audio if global player starts playing
  useEffect(() => {
    if (isPlaying && playingAudioId) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingAudioId(null);
    }
  }, [isPlaying]);

  // Reset page when category or audio filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [worksCategory, activeAudioFilter]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Filter lists
  const shortFilms = mediaWorks.filter(w => w.type === 'short_film');
  const webSeries = mediaWorks.filter(w => w.type === 'web_series');
  const tvPrograms = mediaWorks.filter(w => w.type === 'tv_program');
  const movies = mediaWorks.filter(w => w.type === 'movie');
  const independentWorks = mediaWorks.filter(w => w.type === 'independent_work');

  // Compute Active List based on chosen category & filters
  const filteredSongs = activeAudioFilter === 'All' 
    ? songs 
    : songs.filter(song => song.category.toLowerCase().includes(activeAudioFilter.toLowerCase()));

  let activeItems = [];
  switch (worksCategory) {
    case 'audio':
      activeItems = filteredSongs;
      break;
    case 'short_film':
      activeItems = shortFilms;
      break;
    case 'web_series':
      activeItems = webSeries;
      break;
    case 'tv_program':
      activeItems = tvPrograms;
      break;
    case 'movie':
      activeItems = movies;
      break;
    case 'independent_work':
      activeItems = independentWorks;
      break;
    default:
      activeItems = [];
  }

  const ITEMS_PER_PAGE = 6;
  const totalItems = activeItems.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = activeItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const categories = [
    { id: 'audio', label: 'Music & Songs' },
    { id: 'short_film', label: 'Short Films' },
    { id: 'web_series', label: 'Web Series' },
    { id: 'tv_program', label: 'TV Programs' },
    { id: 'movie', label: 'Feature Films' },
    { id: 'independent_work', label: 'Independent Works' }
  ];

  return (
    <div className="pt-20 animate-fade-in bg-white min-h-screen text-charcoal-900">
      
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

      {/* Editorial Category Selector */}
      <div className="max-w-7xl mx-auto px-6 py-6 border-b border-cream-300/40 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div className="text-left">
          <span className="text-[9px] uppercase tracking-[0.3em] text-gold-600 font-bold block mb-1">
            Browse Portfolio
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-black text-charcoal-900 leading-none">
            <ShinyText text="Creative Composition Works" speed={3} />
          </h1>
        </div>

        {/* Tab switchers (Carousel on mobile) */}
        <div className="relative w-full xl:w-auto flex items-center">
          {/* Left Scroll Arrow */}
          <button 
            onClick={() => handleCarouselScroll('left')}
            className="xl:hidden absolute left-1.5 z-10 w-6 h-6 bg-white/95 backdrop-blur border border-cream-300 rounded-full flex items-center justify-center shadow-sm text-charcoal-900 active:scale-90 cursor-pointer"
            aria-label="Scroll category tabs left"
          >
            <ChevronLeft size={13} strokeWidth={2.5} />
          </button>

          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-none items-center gap-1.5 bg-cream-100 p-1 pl-8 pr-8 xl:px-1 rounded border border-cream-300/40 w-full xl:w-auto self-stretch xl:self-auto max-w-full"
          >
            {categories.map((item) => (
              <button
                key={item.id}
                onClick={() => setWorksCategory(item.id)}
                className={`px-3.5 py-2 text-[10px] uppercase tracking-widest font-black rounded-sm transition-all duration-300 cursor-pointer shrink-0 ${
                  worksCategory === item.id 
                    ? 'bg-black text-white shadow-sm' 
                    : 'text-gray-500 hover:text-charcoal-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Scroll Arrow */}
          <button 
            onClick={() => handleCarouselScroll('right')}
            className="xl:hidden absolute right-1.5 z-10 w-6 h-6 bg-white/95 backdrop-blur border border-cream-300 rounded-full flex items-center justify-center shadow-sm text-charcoal-900 active:scale-90 cursor-pointer"
            aria-label="Scroll category tabs right"
          >
            <ChevronRight size={13} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Dynamic List Rendering */}
      <div id="works-section-start">
        {worksCategory === 'audio' && (
          <WorksShowcase 
            songs={paginatedItems}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onSongSelect={onSongSelect}
            setIsPlaying={setIsPlaying}
            onWorkClick={onWorkClick}
            activeFilter={activeAudioFilter}
            setActiveFilter={setActiveAudioFilter}
            loading={loading}
            isAudioLoading={isAudioLoading}
          />
        )}
        {worksCategory === 'short_film' && (
          <ShortFilmsSection 
            shortFilms={paginatedItems} 
            onPlayVideo={handlePlayVideo} 
            loading={loading}
          />
        )}
        {worksCategory === 'web_series' && (
          <WebSeriesSection 
            webSeries={paginatedItems} 
            onPlayVideo={handlePlayVideo} 
            loading={loading}
          />
        )}
        {worksCategory === 'tv_program' && (
          <TvProgramsSection 
            tvPrograms={paginatedItems} 
            onPlayVideo={handlePlayVideo} 
            loading={loading}
          />
        )}
        {worksCategory === 'movie' && (
          <MoviesSection 
            movies={paginatedItems} 
            onPlayVideo={handlePlayVideo} 
            onZoomImage={setActiveLightboxImage} 
            loading={loading}
          />
        )}
        {worksCategory === 'independent_work' && (
          <IndependentWorksSection 
            independentWorks={paginatedItems}
            onPlayVideo={handlePlayVideo}
            playingAudioId={playingAudioId}
            audioProgress={audioProgress}
            onAudioPlayToggle={handleAudioPlayToggle}
            loading={loading}
          />
        )}
      </div>

      {/* Elegant Pagination Bar */}
      {totalPages > 1 && (
        <div className="max-w-7xl mx-auto px-6 py-10 flex items-center justify-between border-t border-cream-200 mt-6 mb-12">
          {/* Prev Button */}
          <button
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(prev => prev - 1);
                const startEl = document.getElementById('works-section-start');
                if (startEl) startEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            disabled={currentPage === 1}
            className={`text-[9px] tracking-[0.25em] font-black uppercase transition-all duration-300 flex items-center gap-1 cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed ${
              currentPage === 1 ? 'text-gray-400' : 'text-charcoal-900 hover:text-gold-500'
            }`}
          >
            <ChevronLeft size={12} strokeWidth={3} /> Previous
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1.5">
            {Array.from({ length: totalPages }, (_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum);
                    const startEl = document.getElementById('works-section-start');
                    if (startEl) startEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-7.5 h-7.5 rounded text-[11px] font-black transition-all duration-300 flex items-center justify-center cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-black text-white shadow-sm'
                      : 'text-gray-500 hover:text-charcoal-900 hover:bg-cream-100 border border-transparent hover:border-cream-300'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage(prev => prev + 1);
                const startEl = document.getElementById('works-section-start');
                if (startEl) startEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            disabled={currentPage === totalPages}
            className={`text-[9px] tracking-[0.25em] font-black uppercase transition-all duration-300 flex items-center gap-1 cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed ${
              currentPage === totalPages ? 'text-gray-400' : 'text-charcoal-900 hover:text-gold-500'
            }`}
          >
            Next <ChevronRight size={12} strokeWidth={3} />
          </button>
        </div>
      )}

    </div>
  );
}
