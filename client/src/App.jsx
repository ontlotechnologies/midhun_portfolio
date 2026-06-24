import React, { useState, useEffect } from 'react';
import { AnimatePresence, useScroll, useSpring, useTransform, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import AudioPlayer from './components/AudioPlayer';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import WorksPage from './pages/WorksPage';
import BlogPage from './pages/BlogPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import WorkDetailPage from './pages/WorkDetailPage';
import CustomCursor from './components/CustomCursor';
import { Disc, Sparkles } from 'lucide-react';
import Lenis from 'lenis';
import { FaSpotify, FaYoutube, FaInstagram } from 'react-icons/fa';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [activeSection, setActiveSection] = useState('home');

  // Global Audio States
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Global Content States
  const [blogs, setBlogs] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [mediaWorks, setMediaWorks] = useState([]);
  const [worksCategory, setWorksCategory] = useState('audio');
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedWorkId, setSelectedWorkId] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Path routing handler
  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0 });
    }
  };

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    window.lenis = lenis;

    return () => {
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch all public content from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resSongs, resBlogs, resGallery, resTimeline, resMedia] = await Promise.all([
          fetch(`${API_URL}/songs`),
          fetch(`${API_URL}/blogs`),
          fetch(`${API_URL}/gallery`),
          fetch(`${API_URL}/timeline`),
          fetch(`${API_URL}/media-works`)
        ]);

        const [songsData, blogsData, galleryData, timelineData, mediaData] = await Promise.all([
          resSongs.json(),
          resBlogs.json(),
          resGallery.json(),
          resTimeline.json(),
          resMedia.json()
        ]);

        setSongs(songsData);
        if (songsData.length > 0) {
          setCurrentSong(songsData[0]); // default first song
        }
        setBlogs(blogsData);
        setGallery(galleryData);
        setTimeline(timelineData);
        setMediaWorks(mediaData);
      } catch (error) {
        console.error('API connection failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const { scrollYProgress } = useScroll();
  const pageScaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const pageProgressWidth = useTransform(pageScaleX, [0, 1], ["0%", "100%"]);
  const pageNoteOpacity = useTransform(pageScaleX, [0, 0.01], [0, 1]);

  return (
    <div className="bg-white min-h-screen text-charcoal-900 font-sans overflow-x-hidden selection:bg-gold-500 selection:text-white">
      
      {/* Scroll Progress Bar at the top of the page (visible on mobile/small screens) */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-cream-300/10 z-[9999] md:hidden pointer-events-none">
        <motion.div 
          className="relative h-full bg-black shadow-[0_0_8px_rgba(0,0,0,0.25),0_0_15px_rgba(0,0,0,0.15)]"
          style={{ width: pageProgressWidth }}
        >
          {/* Music Note Symbol at the end */}
          <motion.div 
            className="absolute right-[-6px] top-[-5px] text-black drop-shadow-[0_0_4px_rgba(0,0,0,0.3)] text-[10px] font-bold"
            style={{ opacity: pageNoteOpacity }}
          >
            🎵
          </motion.div>
        </motion.div>
      </div>

      {/* Luxury Brand Mouse Follower */}
      <CustomCursor />

      {/* Floating Translucent Navigation */}
      <Navbar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        currentPath={currentPath}
        navigate={navigate}
        onSelectCategory={setWorksCategory}
      />

      {/* Main Portfolio Content */}
      {(() => {
        switch (currentPath.split('?')[0]) {
          case '/about':
            return (
              <AboutPage 
                timelineData={timeline} 
                onStoryClick={() => navigate('/blog')}
                onExploreClick={() => navigate('/works')}
                loading={loading}
              />
            );
          case '/works':
            return (
              <WorksPage 
                songs={songs}
                mediaWorks={mediaWorks}
                worksCategory={worksCategory}
                setWorksCategory={setWorksCategory}
                currentSong={currentSong}
                isPlaying={isPlaying}
                onSongSelect={setCurrentSong}
                setIsPlaying={setIsPlaying}
                onWorkClick={(song) => {
                  setSelectedWorkId(song._id);
                  navigate(`/work-detail?id=${song._id}`);
                }}
                loading={loading}
              />
            );
          case '/work-detail':
            const queryParams = new URLSearchParams(window.location.search);
            const songId = queryParams.get('id') || selectedWorkId;
            const detailedSong = songs.find(s => s._id === songId) || songs[0];
            return (
              <WorkDetailPage 
                song={detailedSong} 
                onBackClick={() => navigate('/works')}
                onPlayClick={(song) => {
                  if (currentSong && currentSong._id === song._id) {
                    setIsPlaying(!isPlaying);
                  } else {
                    setCurrentSong(song);
                    setIsPlaying(true);
                  }
                }}
                currentSong={currentSong}
                isPlaying={isPlaying}
                loading={loading}
              />
            );
          case '/blog':
            return <BlogPage blogs={blogs} loading={loading} />;
          case '/gallery':
            return <GalleryPage gallery={gallery} loading={loading} />;
          case '/contact':
            return <ContactPage />;
          case '/':
          default:
            return (
              <Home 
                songs={songs}
                mediaWorks={mediaWorks}
                blogs={blogs}
                gallery={gallery}
                timeline={timeline}
                currentSong={currentSong}
                isPlaying={isPlaying}
                onSongSelect={setCurrentSong}
                setIsPlaying={setIsPlaying}
                navigate={navigate}
                onSelectCategory={setWorksCategory}
                onWorkClick={(song) => {
                  setSelectedWorkId(song._id);
                  navigate(`/work-detail?id=${song._id}`);
                }}
                loading={loading}
              />
            );
        }
      })()}

      {/* Luxury Brand Editorial Footer */}
      <footer className="bg-neutral-950 text-neutral-400 py-16 border-t border-white/5 relative z-10 font-outfit">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Brand Stack (Span 5) */}
          <div className="md:col-span-5 text-left space-y-5">
            <div>
              <span className="font-outfit text-white font-black tracking-[0.05em] text-base uppercase block leading-none">
                Midhun Saji Ram
              </span>
              <span className="text-[8px] tracking-[0.25em] text-gold-500 font-bold mt-1.5 uppercase block font-mono">
                Music Director & Composer
              </span>
            </div>
            
            <p className="text-neutral-500 leading-relaxed font-light text-[11px] max-w-xs">
              Bridging classical compositions and experimental soundscapes with contemporary cinematic storytelling.
            </p>

            {/* Social channels stack */}
            <div className="flex space-x-3 text-neutral-500 pt-2">
              {[
                { icon: <FaSpotify size={14} />, url: 'https://spotify.com' },
                { icon: <FaYoutube size={14} />, url: 'https://youtube.com' },
                { icon: <FaInstagram size={14} />, url: 'https://instagram.com' }
              ].map((item, index) => (
                <a 
                  key={index} 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-7 h-7 bg-white/5 border border-white/5 hover:border-gold-500 rounded flex items-center justify-center hover:text-white transition-all duration-300"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-1"></div>

          {/* Navigation Column (Span 3) */}
          <div className="md:col-span-3 text-left">
            <h4 className="text-[8.5px] uppercase tracking-[0.2em] text-white font-bold mb-4 font-mono">Navigation</h4>
            <ul className="space-y-2.5 text-[10px] tracking-wider uppercase font-bold text-neutral-400">
              <li>
                <button onClick={() => navigate('/')} className="hover:text-white transition-colors cursor-pointer text-left">Home</button>
              </li>
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-white transition-colors cursor-pointer text-left">About & Journey</button>
              </li>
              <li>
                <button onClick={() => navigate('/works')} className="hover:text-white transition-colors cursor-pointer text-left">Compositions</button>
              </li>
              <li>
                <button onClick={() => navigate('/blog')} className="hover:text-white transition-colors cursor-pointer text-left">Reflections</button>
              </li>
              <li>
                <button onClick={() => navigate('/gallery')} className="hover:text-white transition-colors cursor-pointer text-left">Visual Gallery</button>
              </li>
            </ul>
          </div>

          {/* Contact Details Column (Span 3) */}
          <div className="md:col-span-3 text-left">
            <h4 className="text-[8.5px] uppercase tracking-[0.2em] text-white font-bold mb-4 font-mono">Inquiries</h4>
            <p className="text-neutral-500 font-light leading-relaxed mb-2 text-[11px]">
              For scores, bookings, and collaborations:
            </p>
            <a href="mailto:bookings@midhunsajiram.com" className="text-white hover:text-gold-500 transition-colors text-[11px] font-bold block font-mono">
              bookings@midhunsajiram.com
            </a>
            <span className="text-neutral-500 text-[10px] mt-2 block font-mono">
              Kochi, Kerala, India
            </span>
          </div>

        </div>

        {/* Bottom copyright stamp */}
        <div className="max-w-6xl mx-auto px-6 border-t border-white/5 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[9px] text-neutral-500 font-mono tracking-wider">
          <div>
            <span>&copy; {new Date().getFullYear()} MIDHUN SAJI RAM. ALL RIGHTS RESERVED.</span>
          </div>
          
          <div className="flex items-center space-x-2 text-[8px] uppercase tracking-widest font-bold text-neutral-500">
            <span>TERMS</span>
            <span>&bull;</span>
            <span>PRIVACY</span>
            <span>&bull;</span>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-white transition-colors cursor-pointer"
            >
              BACK TO TOP &uarr;
            </button>
          </div>
        </div>
      </footer>

      {/* Global persistent audio player bar */}
      <AnimatePresence>
        {showPlayer && currentSong && (
          <AudioPlayer 
            currentSong={currentSong}
            songs={songs}
            onSongSelect={setCurrentSong}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            onClose={() => {
              setIsPlaying(false);
              setShowPlayer(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
