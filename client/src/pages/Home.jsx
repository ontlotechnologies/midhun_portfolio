import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AboutSection from '../components/AboutSection';
import BlogSection from '../components/BlogSection';
import ContactForm from '../components/ContactForm';
import FaqRiderSection from '../components/FaqRiderSection';
import FatherLegacy from '../components/FatherLegacy';
import GallerySection from '../components/GallerySection';
import LegacyHero from '../components/LegacyHero';
import ScrollReveal from '../components/ScrollReveal';
import ShinyText from '../components/ShinyText';
import TimelineSection from '../components/TimelineSection';
import WorksShowcase from '../components/WorksShowcase';

import IndependentWorksSection from '../components/IndependentWorksSection';
import MoviesSection from '../components/MoviesSection';
import ShortFilmsSection from '../components/ShortFilmsSection';
import TvProgramsSection from '../components/TvProgramsSection';
import WebSeriesSection from '../components/WebSeriesSection';

export default function Home({ 
  songs, 
  mediaWorks = [],
  blogs, 
  gallery, 
  timeline, 
  currentSong, 
  isPlaying, 
  onSongSelect, 
  setIsPlaying,
  navigate,
  onSelectCategory,
  onWorkClick,
  loading,
  siteContent = {},
  isAudioLoading
}) {
  const [activeVideo, setActiveVideo] = useState(null); // { id, mediaType, url }
  const [activeLightboxImage, setActiveLightboxImage] = useState(null); // url
  const [activeCategory, setActiveCategory] = useState('audio');
  
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

  // Audio Player State for Independent works
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef(null);

  const handleListenNow = () => {
    if (songs && songs.length > 0) {
      if (isPlaying) {
        setIsPlaying(false);
      } else {
        onSongSelect(currentSong || songs[0]);
        setIsPlaying(true);
      }
    }
  };

  const handleExploreWorks = () => {
    navigate('/works');
  };

  const handleReadFatherStory = () => {
    navigate('/about');
  };

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

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Filter categories
  const shortFilms = mediaWorks.filter(w => w.type === 'short_film');
  const webSeries = mediaWorks.filter(w => w.type === 'web_series');
  const tvPrograms = mediaWorks.filter(w => w.type === 'tv_program');
  const movies = mediaWorks.filter(w => w.type === 'movie');
  const independentWorks = mediaWorks.filter(w => w.type === 'independent_work');

  const categories = [
    { id: 'audio', label: 'Music & Songs' },
    { id: 'short_film', label: 'Short Films' },
    { id: 'web_series', label: 'Web Series' },
    { id: 'tv_program', label: 'TV Programs' },
    { id: 'movie', label: 'Feature Films' },
    { id: 'independent_work', label: 'Independent Works' }
  ];

  // Display limits for Homepage (only load latest few)
  const displayedSongs = songs.slice(0, 5);
  const displayedShortFilms = shortFilms.slice(0, 3);
  const displayedWebSeries = webSeries.slice(0, 4);
  const displayedTvPrograms = tvPrograms.slice(0, 3);
  const displayedMovies = movies.slice(0, 5);
  const displayedIndependentWorks = independentWorks.slice(0, 3);

  return (
    <div className="animate-fade-in text-charcoal-900 bg-white">
      
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

      {/* 1. Hero Landing Story */}
      <LegacyHero 
        onPlayClick={handleListenNow} 
        onExploreClick={handleExploreWorks}
        content={siteContent.hero}
        isPlaying={isPlaying}
      />

      <hr className="border-t border-cream-300/60 mx-auto max-w-7xl" />

      {/* 2. Artist Editorial Intro */}
      <ScrollReveal>
        <AboutSection onActionClick={handleExploreWorks} content={siteContent.about} />
      </ScrollReveal>

      <hr className="border-t border-cream-300/60 mx-auto max-w-7xl" />

      {/* 3. Legacy Tribute Collage */}
      <ScrollReveal>
        <FatherLegacy 
          onStoryClick={handleReadFatherStory} 
          onImageClick={setActiveLightboxImage} 
          content={siteContent.father_legacy} 
        />
      </ScrollReveal>

      <hr className="border-t border-cream-300/60 mx-auto max-w-7xl" />

      {/* 4. Journey Timeline */}
      <ScrollReveal>
        <TimelineSection 
          timelineData={timeline} 
          onActionClick={() => navigate('/about')} 
          loading={loading}
        />
      </ScrollReveal>

      <hr className="border-t border-cream-300/60 mx-auto max-w-7xl" />

      {/* 5. Creative Portfolio Showcase */}
      <ScrollReveal>
        <div className="max-w-7xl mx-auto px-6 pt-14 pb-4 flex flex-col md:flex-row md:items-center justify-between border-b border-cream-300/40 gap-4">
          <div className="text-left">
            <span className="text-[9px] uppercase tracking-[0.3em] text-gold-600 font-bold block mb-1">
              Portfolio
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-black text-charcoal-900 leading-none">
              <ShinyText text="My Works" speed={3} />
            </h2>
            <div className="h-[1.5px] w-16 bg-gold-500 mt-3"></div>
          </div>

          {/* Tab Selector (Carousel on mobile) */}
          <div className="relative w-full md:w-auto flex items-center">
            {/* Left Scroll Arrow */}
            <button 
              onClick={() => handleCarouselScroll('left')}
              className="md:hidden absolute left-1.5 z-10 w-6 h-6 bg-white/95 backdrop-blur border border-cream-300 rounded-full flex items-center justify-center shadow-sm text-charcoal-900 active:scale-90 cursor-pointer"
              aria-label="Scroll category tabs left"
            >
              <ChevronLeft size={13} strokeWidth={2.5} />
            </button>

            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto scrollbar-none items-center gap-1.5 bg-cream-100 p-1 pl-8 pr-8 md:px-1 rounded border border-cream-300/40 w-full md:w-auto self-stretch md:self-auto max-w-full"
            >
              {categories.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveCategory(item.id)}
                  className={`px-3 py-1.5 text-[9.5px] uppercase tracking-widest font-black rounded-sm transition-all duration-300 cursor-pointer shrink-0 ${
                    activeCategory === item.id 
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
              className="md:hidden absolute right-1.5 z-10 w-6 h-6 bg-white/95 backdrop-blur border border-cream-300 rounded-full flex items-center justify-center shadow-sm text-charcoal-900 active:scale-90 cursor-pointer"
              aria-label="Scroll category tabs right"
            >
              <ChevronRight size={13} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Render Dynamic Works Category Section */}
      <div className="w-full">
        {activeCategory === 'audio' && (
          <ScrollReveal>
            <WorksShowcase 
              songs={displayedSongs}
              currentSong={currentSong}
              isPlaying={isPlaying}
              onSongSelect={onSongSelect}
              setIsPlaying={setIsPlaying}
              onWorkClick={onWorkClick}
              loading={loading}
              isAudioLoading={isAudioLoading}
            />
          </ScrollReveal>
        )}

        {activeCategory === 'short_film' && (
          <ScrollReveal>
            <ShortFilmsSection 
              shortFilms={displayedShortFilms} 
              onPlayVideo={handlePlayVideo} 
              loading={loading}
            />
          </ScrollReveal>
        )}

        {activeCategory === 'web_series' && (
          <ScrollReveal>
            <WebSeriesSection 
              webSeries={displayedWebSeries} 
              onPlayVideo={handlePlayVideo} 
              loading={loading}
            />
          </ScrollReveal>
        )}

        {activeCategory === 'tv_program' && (
          <ScrollReveal>
            <TvProgramsSection 
              tvPrograms={displayedTvPrograms} 
              onPlayVideo={handlePlayVideo} 
              loading={loading}
            />
          </ScrollReveal>
        )}

        {activeCategory === 'movie' && (
          <ScrollReveal>
            <MoviesSection 
              movies={displayedMovies} 
              onPlayVideo={handlePlayVideo} 
              onZoomImage={setActiveLightboxImage} 
              loading={loading}
            />
          </ScrollReveal>
        )}

        {activeCategory === 'independent_work' && (
          <ScrollReveal>
            <IndependentWorksSection 
              independentWorks={displayedIndependentWorks}
              onPlayVideo={handlePlayVideo}
              playingAudioId={playingAudioId}
              audioProgress={audioProgress}
              onAudioPlayToggle={handleAudioPlayToggle}
              loading={loading}
            />
          </ScrollReveal>
        )}
      </div>

      {/* View All Button */}
      <div className="max-w-7xl mx-auto px-6 pb-12 flex justify-center">
        <button
          onClick={() => {
            if (onSelectCategory) {
              onSelectCategory(activeCategory);
            }
            navigate('/works');
          }}
          className="px-6 py-2.5 bg-transparent border border-charcoal-900/10 hover:border-gold-500 text-[10px] tracking-widest uppercase font-black text-charcoal-900 hover:text-gold-600 transition-all duration-300 rounded cursor-pointer"
        >
          View All {categories.find(c => c.id === activeCategory)?.label}
        </button>
      </div>

      <hr className="border-t border-cream-300/60 mx-auto max-w-7xl" />

      {/* 6. Photo Masonry Gallery */}
      <ScrollReveal>
        <GallerySection 
          galleryItems={gallery.slice(0, 6)} 
          onViewAllClick={() => navigate('/gallery')}
          loading={loading}
        />
      </ScrollReveal>

      <hr className="border-t border-cream-300/60 mx-auto max-w-7xl" />

      {/* 7. Blog Stories */}
      <ScrollReveal>
        <BlogSection 
          blogs={blogs} 
          loading={loading} 
          onBlogClick={(blog) => navigate(`/blog-detail?id=${blog._id}`)} 
        />
      </ScrollReveal>

      <hr className="border-t border-cream-300/60 mx-auto max-w-7xl" />

      {/* 8. FAQ & Artist Rider Section */}
      <ScrollReveal>
        <FaqRiderSection content={siteContent.faqs} />
      </ScrollReveal>

      <hr className="border-t border-cream-300/60 mx-auto max-w-7xl" />

      {/* 9. Booking Contact Form */}
      <ScrollReveal>
        <ContactForm />
      </ScrollReveal>

    </div>
  );
}
