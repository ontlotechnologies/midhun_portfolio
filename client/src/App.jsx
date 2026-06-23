import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
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
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedWorkId, setSelectedWorkId] = useState(null);

  const API_URL = 'http://localhost:5000/api';

  // Path routing handler
  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0 });
  };

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
      try {
        // Fetch Songs
        const resSongs = await fetch(`${API_URL}/songs`);
        const songsData = await resSongs.json();
        setSongs(songsData);
        if (songsData.length > 0) {
          setCurrentSong(songsData[0]); // default first song
        }

        // Fetch Blogs
        const resBlogs = await fetch(`${API_URL}/blogs`);
        setBlogs(await resBlogs.json());

        // Fetch Gallery
        const resGallery = await fetch(`${API_URL}/gallery`);
        setGallery(await resGallery.json());

        // Fetch Timeline
        const resTimeline = await fetch(`${API_URL}/timeline`);
        setTimeline(await resTimeline.json());

      } catch (error) {
        console.warn('API connection failed. Booting client in Offline/Demo Mode with mock database.');
        loadMockFallback();
      }
    };

    fetchData();
  }, []);

  // Populates data immediately if backend is offline or slow
  const loadMockFallback = () => {
    const mockSongs = [
      {
        _id: 'song_1',
        title: 'Ennin Nenjil',
        category: 'Single',
        coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        spotifyUrl: 'https://spotify.com',
        youtubeUrl: 'https://youtube.com',
        releaseDate: '2024-05-15',
        description: 'A soulful romantic track capturing the essence of longing, blending acoustic guitars with modern orchestral arrangements.',
        isFeatured: true
      },
      {
        _id: 'song_2',
        title: 'Marayuthe',
        category: 'Single',
        coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        spotifyUrl: 'https://spotify.com',
        youtubeUrl: 'https://youtube.com',
        releaseDate: '2023-11-10',
        description: 'An emotional ballad speaking of memory and distance. Features a haunting flute prelude and heavy string sections.',
        isFeatured: true
      },
      {
        _id: 'song_3',
        title: 'Mazhayile',
        category: 'Single',
        coverUrl: 'https://images.unsplash.com/photo-1487180142328-0c4e37023af5?q=80&w=600&auto=format&fit=crop',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        spotifyUrl: 'https://spotify.com',
        youtubeUrl: 'https://youtube.com',
        releaseDate: '2024-04-12',
        description: 'A rain-themed classical-fusion song, dedicated to the memories of childhood and the rhythms of nature.',
        isFeatured: true
      },
      {
        _id: 'song_4',
        title: 'Kathirinte Pookkal',
        category: 'Single',
        coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        spotifyUrl: 'https://spotify.com',
        youtubeUrl: 'https://youtube.com',
        releaseDate: '2022-08-20',
        description: 'A fast-paced semi-classical composition focusing on dynamic rhythm loops and layered vocals.',
        isFeatured: false
      },
      {
        _id: 'song_5',
        title: 'Oru Mazha',
        category: 'Album',
        coverUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=600&auto=format&fit=crop',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        spotifyUrl: 'https://spotify.com',
        youtubeUrl: 'https://youtube.com',
        releaseDate: '2021-12-01',
        description: 'The award-winning debut music album featuring 8 tracks of pure melodic bliss and independent storytelling.',
        isFeatured: true
      }
    ];

    const mockBlogs = [
      {
        _id: 'blog_1',
        title: 'The Song That Still Carries His Name',
        slug: 'the-song-that-still-carries-his-name',
        excerpt: 'Some songs do not end when the final note fades. They echo across generations, bridging a father\'s genius with a son\'s voice.',
        content: '<p>Every time I sit at the harmonium, I feel his presence. My father, Saji Ram, wasn\'t just a composer; he was a painter of emotions through music. The melodies he created for classics like <em>Kireedam</em> defined an era of storytelling in Malayalam cinema.</p><p>Today, as I compose my own tracks, I try to capture that same honesty. "Ennin Nenjil" is directly inspired by a notebook of sketches he left behind. The main melody hook was written in his handwriting, on a yellowed piece of paper dated 1989. For me, singing this song is not just a performance—it is a spiritual conversation with the man who gave me my voice.</p>',
        coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1000&auto=format&fit=crop',
        category: 'Legacy',
        isPublished: true,
        readingTime: '4 mins',
        createdAt: new Date('2024-05-15')
      },
      {
        _id: 'blog_2',
        title: 'What I Learned Watching Music Being Created',
        slug: 'what-i-learned-watching-music-being-created',
        excerpt: 'Lessons from my earliest classroom—watching my father compose in quiet studios filled with analog tapes and raw passion.',
        content: '<p>In the nineties, recording studios were different. There were no undo buttons. Every musician had to perform in perfect harmony, in real time. I remember sitting in the corner of the studio, breathing in the smell of magnetic tapes, completely transfixed.</p><p>My father had a unique rule: "Never compose a song to impress musicians; compose it to comfort a broken heart." He taught me that complexity is cheap, but simplicity is sacred. That philosophy is the foundation of my work today. It is why I prioritize acoustic instruments and raw vocal takes over excessive digital correction.</p>',
        coverUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop',
        category: 'BTS',
        isPublished: true,
        readingTime: '3 mins',
        createdAt: new Date('2024-04-28')
      },
      {
        _id: 'blog_3',
        title: 'Finding My Own Voice',
        slug: 'finding-my-own-voice',
        excerpt: 'A personal journey of stepping out from a legendary shadow to discover my own musical language and creative expression.',
        content: '<p>For years, I was afraid of composition. Being Saji Ram\'s son meant that everything I wrote would be compared to a legend. It took me a long time to realize that legacy is not a cage; it is a springboard.</p><p>My breakthrough came with the album <em>Oru Mazha</em>. I decided to blend electronic synth pads with classical Carnatic ragas. It was a risk, and it sounded nothing like my father\'s work. But when I played the final master, a close friend of my father smiled and said: "Saji would have loved this. It has his spirit, but it is entirely yours." That was the day I found my own path.</p>',
        coverUrl: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=1000&auto=format&fit=crop',
        category: 'Reflection',
        isPublished: true,
        readingTime: '5 mins',
        createdAt: new Date('2024-04-10')
      },
      {
        _id: 'blog_4',
        title: 'The Silence Before a Song',
        slug: 'the-silence-before-a-song',
        excerpt: 'Where every melody is first born. Exploring the importance of stillness and meditation in the creative composition process.',
        content: '<p>We live in a loud world. But music doesn\'t begin with sound; it begins with silence. The most important note in any score is the pause. In classical composition, we call it the space between pulses.</p><p>Every morning, before I touch my keyboard or guitar, I spend an hour in complete silence. I listen to the wind, the hum of the house, and the rhythm of my own breathing. In that quietness, melodies present themselves. It\'s almost as if the music already exists, and my only job is to be silent enough to hear it.</p>',
        coverUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1000&auto=format&fit=crop',
        category: 'Reflection',
        isPublished: true,
        readingTime: '3 mins',
        createdAt: new Date('2024-03-20')
      }
    ];

    const mockGallery = [
      { _id: 'gal_1', title: 'Live Performance at Grand Arena', url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80', category: 'Concerts' },
      { _id: 'gal_2', title: 'Acoustic Session at Studio A', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80', category: 'Studio' },
      { _id: 'gal_3', title: 'Synthesizer and Composing setup', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80', category: 'Studio' },
      { _id: 'gal_4', title: 'Singing live at National Music Fest', url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80', category: 'Concerts' },
      { _id: 'gal_5', title: 'Writing session notes', url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80', category: 'Personal' },
      { _id: 'gal_6', title: 'Grand Piano close-up', url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80', category: 'Studio' },
      { _id: 'gal_7', title: 'Crowd at Concert', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80', category: 'Concerts' },
      { _id: 'gal_8', title: 'Electric Guitar tuning', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80', category: 'Concerts' },
      { _id: 'gal_9', title: 'Studio Mixing Board', url: 'https://images.unsplash.com/photo-1487180142328-0c4e37023af5?q=80', category: 'Studio' },
      { _id: 'gal_10', title: 'Outdoor Inspiration Session', url: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80', category: 'Personal' },
      { _id: 'gal_11', title: 'Harmonium Practice', url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80', category: 'Personal' },
      { _id: 'gal_12', title: 'Vocal recording booth', url: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80', category: 'Studio' },
      { _id: 'gal_13', title: 'Symphony orchestra violinists', url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80', category: 'Concerts' },
      { _id: 'gal_14', title: 'Sunset Melody Writing', url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80', category: 'Personal' },
      { _id: 'gal_15', title: 'Backstage warmups', url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80', category: 'Concerts' }
    ];

    const mockTimeline = [
      { year: '1998', title: 'Where it all began', description: 'Surrounded by music, instruments and endless curiosity.', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400' },
      { year: '2008', title: 'Learning. Observing. Absorbing.', description: 'Learning not just music, but emotion, discipline and silence.', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=400' },
      { year: '2016', title: 'Finding my voice', description: 'Stepping into studios, compositions and my own sound.', image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=400' },
      { year: '2023', title: 'Creating. Performing. Inspiring.', description: 'Continuing the legacy and building a new musical tomorrow.', image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=400' }
    ];

    setSongs(mockSongs);
    setCurrentSong(mockSongs[0]);
    setBlogs(mockBlogs);
    setGallery(mockGallery);
    setTimeline(mockTimeline);
  };

  // Auto-show player when a song is actively played
  useEffect(() => {
    if (currentSong && isPlaying) {
      setShowPlayer(true);
    }
  }, [currentSong, isPlaying]);

  return (
    <div className="bg-white min-h-screen text-charcoal-900 font-sans overflow-x-hidden selection:bg-gold-500 selection:text-black">
      
      {/* Luxury Brand Mouse Follower */}
      <CustomCursor />

      {/* Floating Translucent Navigation */}
      <Navbar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        currentPath={currentPath}
        navigate={navigate}
      />

      {/* Main Portfolio Content */}
      {(() => {
        switch (currentPath) {
          case '/about':
            return (
              <AboutPage 
                timelineData={timeline} 
                onStoryClick={() => navigate('/blog')}
                onExploreClick={() => navigate('/works')}
              />
            );
          case '/works':
            return (
              <WorksPage 
                songs={songs}
                currentSong={currentSong}
                isPlaying={isPlaying}
                onSongSelect={setCurrentSong}
                setIsPlaying={setIsPlaying}
                onWorkClick={(song) => {
                  setSelectedWorkId(song._id);
                  navigate('/work-detail');
                }}
              />
            );
          case '/work-detail':
            const detailedSong = songs.find(s => s._id === selectedWorkId) || songs[0];
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
              />
            );
          case '/blog':
            return <BlogPage blogs={blogs} />;
          case '/gallery':
            return <GalleryPage gallery={gallery} />;
          case '/contact':
            return <ContactPage />;
          case '/':
          default:
            return (
              <Home 
                songs={songs}
                blogs={blogs}
                gallery={gallery}
                timeline={timeline}
                currentSong={currentSong}
                isPlaying={isPlaying}
                onSongSelect={setCurrentSong}
                setIsPlaying={setIsPlaying}
                navigate={navigate}
                onWorkClick={(song) => {
                  setSelectedWorkId(song._id);
                  navigate('/work-detail');
                }}
              />
            );
        }
      })()}

      {/* Luxury Brand Editorial Footer */}
      <footer className="bg-obsidian-950 border-t border-white/5 py-12 text-gray-500 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <span className="font-serif text-gold-500 font-extrabold tracking-widest block text-sm uppercase">Midhun Saji Ram</span>
            <span className="text-[10px] tracking-widest text-gray-400 mt-1 block">MUSIC DIRECTOR | SINGER</span>
          </div>
          
          <div className="flex items-center space-x-1 font-light tracking-wide text-[11px]">
            <span>&copy; {new Date().getFullYear()} Midhun Saji Ram. All Rights Reserved.</span>
          </div>

          <div className="flex items-center space-x-1.5 text-[10px] uppercase tracking-widest text-gray-400 font-medium">
            <span>Designed with</span>
            <Sparkles size={10} className="text-gold-500 animate-pulse" />
            <span>Passion for Music</span>
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
