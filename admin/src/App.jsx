import React, { useState, useEffect } from 'react';
import { 
  LogIn, LogOut, Disc, FileText, Image, Calendar, Mail, BarChart3, 
  Plus, Trash2, CheckCircle2, Lock, Settings, Play, Pause, 
  Users, Award, Video, MessageSquare, Search, Bell, ChevronDown, Heart, Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Dashboard navigation tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Stats State
  const [stats, setStats] = useState({
    songs: 58,
    blogs: 16,
    galleryItems: 28,
    timelineEvents: 14,
    totalMessages: 46,
    unreadMessages: 12
  });

  // DB Lists State
  const [songs, setSongs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [messages, setMessages] = useState([]);

  // Create Form States
  const [songForm, setSongForm] = useState({ title: '', category: 'Single', coverUrl: '', audioUrl: '', spotifyUrl: '', description: '', isFeatured: false });
  const [blogForm, setBlogForm] = useState({ title: '', category: 'Reflection', coverUrl: '', excerpt: '', content: '', readingTime: '4 mins', isPublished: true });
  const [galleryForm, setGalleryForm] = useState({ title: '', url: '', type: 'image', category: 'Concerts', isFeatured: false });
  const [timelineForm, setTimelineForm] = useState({ year: '', title: '', description: '' });

  // Player Preview States inside Dashboard Sidebar
  const [sidebarPlaying, setSidebarPlaying] = useState(false);
  const [sidebarProgress, setSidebarProgress] = useState(38);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      loadData();
    }
  }, [isAuthenticated, activeTab]);

  const loadStats = async () => {
    try {
      const res = await fetch(`${API_URL}/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStats({
          songs: data.stats.songs,
          blogs: data.stats.blogs,
          galleryItems: data.stats.galleryItems,
          timelineEvents: data.stats.timelineEvents,
          totalMessages: data.stats.totalMessages,
          unreadMessages: data.stats.unreadMessages
        });
      }
    } catch (err) {
      // Offline Simulated Stats
      setStats({
        songs: songs.length || 58,
        blogs: blogs.length || 16,
        galleryItems: gallery.length || 28,
        timelineEvents: timeline.length || 14,
        totalMessages: messages.length || 46,
        unreadMessages: messages.filter(m => m.status === 'unread').length || 12
      });
    }
  };

  const loadData = async () => {
    try {
      const resSongs = await fetch(`${API_URL}/songs`);
      setSongs(await resSongs.json());

      const resBlogs = await fetch(`${API_URL}/blogs?all=true`);
      setBlogs(await resBlogs.json());

      const resGallery = await fetch(`${API_URL}/gallery`);
      setGallery(await resGallery.json());

      const resTimeline = await fetch(`${API_URL}/timeline`);
      setTimeline(await resTimeline.json());

      const resMessages = await fetch(`${API_URL}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resMessages.ok) {
        setMessages(await resMessages.json());
      }
    } catch (err) {
      console.warn('Running Admin Dashboard in simulated offline mode.');
      if (songs.length === 0) {
        setSongs([
          { _id: 'song_1', title: 'Ennin Nenjil', category: 'Single', coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', releaseDate: '2024-05-15', description: 'A soulful romantic track blending strings and guitars.', isFeatured: true },
          { _id: 'song_2', title: 'Marayuthe', category: 'Single', coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', releaseDate: '2023-11-10', description: 'Flute prelude cinematic composition.', isFeatured: true },
          { _id: 'song_3', title: 'Mathayile', category: 'Single', coverUrl: 'https://images.unsplash.com/photo-1487180142328-0c4e37023af5?q=80&w=400', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', releaseDate: '2024-04-12', description: 'Semi-classical fusion track.', isFeatured: true },
          { _id: 'song_4', title: 'Kathirinte Pookkal', category: 'Single', coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', releaseDate: '2022-08-20', description: 'Uplifting Carnatic rhythm composition.', isFeatured: false },
          { _id: 'song_5', title: 'Oru Mazha (Album)', category: 'Album', coverUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=400', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', releaseDate: '2021-12-01', description: 'Award winning independent debut album.', isFeatured: true }
        ]);
        setBlogs([
          { _id: 'blog_1', title: 'The Song That Still Carries His Name', category: 'Legacy', coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80', excerpt: 'Generational bonds of composition.', createdAt: '2024-05-15T00:00:00Z', isPublished: true, readingTime: '4 mins' },
          { _id: 'blog_2', title: 'What I Learned Watching Music Being Created', category: 'BTS', coverUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80', excerpt: 'Nostalgic studio reflections.', createdAt: '2024-04-28T00:00:00Z', isPublished: true, readingTime: '3 mins' }
        ]);
        setGallery([
          { _id: 'gal_1', title: 'Live Performance at Arena', url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80', category: 'Concerts' },
          { _id: 'gal_2', title: 'Studio Recording sessions', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80', category: 'Studio' },
          { _id: 'gal_3', title: 'Synthesizer keys setup', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80', category: 'Studio' }
        ]);
        setTimeline([
          { _id: 'time_1', year: '2012', title: 'Inheriting the Harmonious Foundation', description: 'Trained in classical compositions under Saji Ram.' },
          { _id: 'time_2', year: '2015', title: 'Vocal Stage Debut', description: 'First performance solo.' }
        ]);
        setMessages([
          { _id: 'msg_1', name: 'Arun Menon', email: 'arun@example.com', subject: 'Live Performance Booking', message: 'Hi Midhun, we would love to book you for our college cultural event in Cochin.', status: 'unread', createdAt: '2026-06-22T10:00:00Z' },
          { _id: 'msg_2', name: 'Neha George', email: 'neha@example.com', subject: 'Collaboration Request', message: 'Hello, looking to feature you as a vocalist in our indie track.', status: 'unread', createdAt: '2026-06-22T08:00:00Z' }
        ]);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        confetti({ particleCount: 80, spread: 50, colors: ['#d4af37', '#ffffff'] });
      } else {
        setLoginError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminToken', 'DEMO_ADMIN_KEY');
        setToken('DEMO_ADMIN_KEY');
        setIsAuthenticated(true);
        confetti({ particleCount: 80, spread: 50, colors: ['#d4af37', '#ffffff'] });
      } else {
        setLoginError('Could not reach Express server. Type admin / admin123 for Demo Mode access.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    setIsAuthenticated(false);
  };

  /* =========================================================================
     CRUD REQUEST HANDLERS
     ========================================================================= */

  const handleAddSong = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/songs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(songForm)
      });
      if (res.ok) {
        setSongForm({ title: '', category: 'Single', coverUrl: '', audioUrl: '', spotifyUrl: '', description: '', isFeatured: false });
        loadData();
        confetti({ particleCount: 50, colors: ['#d4af37'] });
      } else {
        simulateAddSong();
      }
    } catch (err) {
      simulateAddSong();
    }
  };

  const simulateAddSong = () => {
    const newSong = { _id: 'song_' + Date.now(), ...songForm, releaseDate: new Date() };
    setSongs([newSong, ...songs]);
    setSongForm({ title: '', category: 'Single', coverUrl: '', audioUrl: '', spotifyUrl: '', description: '', isFeatured: false });
    confetti({ particleCount: 30, colors: ['#d4af37'] });
  };

  const handleDeleteSong = async (id) => {
    if (!window.confirm('Are you sure you want to delete this composition?')) return;
    try {
      const res = await fetch(`${API_URL}/songs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        loadData();
      } else {
        setSongs(songs.filter(s => s._id !== id));
      }
    } catch (err) {
      setSongs(songs.filter(s => s._id !== id));
    }
  };

  const handleAddBlog = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(blogForm)
      });
      if (res.ok) {
        setBlogForm({ title: '', category: 'Reflection', coverUrl: '', excerpt: '', content: '', readingTime: '4 mins', isPublished: true });
        loadData();
      } else {
        simulateAddBlog();
      }
    } catch (err) {
      simulateAddBlog();
    }
  };

  const simulateAddBlog = () => {
    const newBlog = { _id: 'blog_' + Date.now(), ...blogForm, createdAt: new Date() };
    setBlogs([newBlog, ...blogs]);
    setBlogForm({ title: '', category: 'Reflection', coverUrl: '', excerpt: '', content: '', readingTime: '4 mins', isPublished: true });
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      const res = await fetch(`${API_URL}/blogs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        loadData();
      } else {
        setBlogs(blogs.filter(b => b._id !== id));
      }
    } catch (err) {
      setBlogs(blogs.filter(b => b._id !== id));
    }
  };

  const handleAddGalleryItem = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/gallery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(galleryForm)
      });
      if (res.ok) {
        setGalleryForm({ title: '', url: '', type: 'image', category: 'Concerts', isFeatured: false });
        loadData();
      } else {
        simulateAddGallery();
      }
    } catch (err) {
      simulateAddGallery();
    }
  };

  const simulateAddGallery = () => {
    const newItem = { _id: 'gal_' + Date.now(), ...galleryForm };
    setGallery([newItem, ...gallery]);
    setGalleryForm({ title: '', url: '', type: 'image', category: 'Concerts', isFeatured: false });
  };

  const handleDeleteGallery = async (id) => {
    try {
      const res = await fetch(`${API_URL}/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        loadData();
      } else {
        setGallery(gallery.filter(g => g._id !== id));
      }
    } catch (err) {
      setGallery(gallery.filter(g => g._id !== id));
    }
  };

  const handleAddTimeline = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/timeline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(timelineForm)
      });
      if (res.ok) {
        setTimelineForm({ year: '', title: '', description: '' });
        loadData();
      } else {
        simulateAddTimeline();
      }
    } catch (err) {
      simulateAddTimeline();
    }
  };

  const simulateAddTimeline = () => {
    const newEvent = { _id: 'time_' + Date.now(), ...timelineForm };
    setTimeline([...timeline, newEvent].sort((a,b) => a.year.localeCompare(b.year)));
    setTimelineForm({ year: '', title: '', description: '' });
  };

  const handleDeleteTimeline = async (id) => {
    try {
      const res = await fetch(`${API_URL}/timeline/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        loadData();
      } else {
        setTimeline(timeline.filter(t => t._id !== id));
      }
    } catch (err) {
      setTimeline(timeline.filter(t => t._id !== id));
    }
  };

  const handleMarkMessageRead = async (id) => {
    try {
      const res = await fetch(`${API_URL}/messages/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        loadData();
      } else {
        setMessages(messages.map(m => m._id === id ? { ...m, status: 'read' } : m));
      }
    } catch (err) {
      setMessages(messages.map(m => m._id === id ? { ...m, status: 'read' } : m));
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete enquiry record?')) return;
    try {
      const res = await fetch(`${API_URL}/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        loadData();
      } else {
        setMessages(messages.filter(m => m._id !== id));
      }
    } catch (err) {
      setMessages(messages.filter(m => m._id !== id));
    }
  };

  /* =========================================================================
     LOGIN SCREEN RENDER
     ========================================================================= */

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex flex-col justify-center items-center px-6">
        
        {/* Animated Gold Starry Backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.04)_0%,transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-md bg-obsidian-900 border border-gold-500/20 p-8 rounded-sm text-left shadow-2xl relative">
          <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 w-14 h-14 bg-obsidian-900 rounded-full border border-gold-500/25 flex items-center justify-center text-gold-500">
            <Lock size={20} />
          </div>

          <div className="text-center mt-3 mb-8">
            <span className="font-serif text-gold-gradient text-2xl tracking-[0.2em] font-black block">MIDHUN SAJI RAM</span>
            <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-1 block">Administrative Dashboard CMS</span>
            <div className="h-[1px] w-12 bg-gold-500/30 mx-auto mt-3"></div>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 text-xs rounded-sm mb-6 leading-relaxed">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="flex flex-col">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-1.5 font-medium">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-obsidian-950 border border-white/10 px-4 py-3 text-sm text-white rounded-sm focus:outline-none focus:border-gold-500/40 transition-colors"
                placeholder="Enter admin username"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-1.5 font-medium">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-obsidian-950 border border-white/10 px-4 py-3 text-sm text-white rounded-sm focus:outline-none focus:border-gold-500/40 transition-colors"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gold-500 hover:bg-gold-400 disabled:bg-gold-500/50 text-black font-semibold text-xs uppercase tracking-widest rounded-sm transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-gold-500/10 cursor-pointer"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <LogIn size={13} />
                  <span>Access CMS Portal</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[9.5px] text-gray-500 leading-relaxed">
              <strong>Dev Demo Account:</strong><br />
              User: <code className="text-gold-500 font-mono">admin</code> &bull; Password: <code className="text-gold-500 font-mono">admin123</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     MAIN PREMIUM DASHBOARD RENDER
     ========================================================================= */

  return (
    <div className="min-h-screen bg-obsidian-950 text-white flex">
      
      {/* 1. LEFT SIDEBAR MENU PANEL */}
      <aside className="w-64 bg-obsidian-900 border-r border-white/5 flex flex-col justify-between p-6">
        
        <div className="space-y-8 text-left">
          {/* Logo Branding */}
          <div className="flex flex-col">
            <span className="font-serif text-lg tracking-[0.15em] font-extrabold text-gold-gradient">
              Midhun Saji Ram
            </span>
            <span className="text-[9px] tracking-[0.35em] text-gray-400 uppercase font-light -mt-0.5">
              Music Director | Singer
            </span>
          </div>

          {/* Sidebar Tabs Navigation */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={15} /> },
              { id: 'songs', label: 'Songs & Works', icon: <Disc size={15} /> },
              { id: 'gallery', label: 'Media Gallery', icon: <Image size={15} /> },
              { id: 'timeline', label: 'Timeline Milestones', icon: <Calendar size={15} /> },
              { id: 'blog', label: 'Blog Reflections', icon: <FileText size={15} /> },
              { id: 'enquiries', label: `Booking Inbox (${stats.unreadMessages})`, icon: <Mail size={15} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full px-4 py-2.5 text-left text-xs uppercase tracking-widest font-semibold flex items-center space-x-3 transition-all rounded-sm ${activeTab === tab.id ? 'bg-gold-500 text-black font-black' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar bottom persistent track player panel */}
        <div className="bg-obsidian-950 p-4 border border-white/5 rounded-sm text-left">
          <div className="flex items-center space-x-3">
            <img 
              src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=150" 
              alt="Track Cover" 
              className={`w-10 h-10 object-cover rounded-sm border border-gold-500/20 ${sidebarPlaying ? 'animate-spin' : ''}`}
              style={{ animationDuration: '8s' }}
            />
            <div className="overflow-hidden flex-1">
              <h5 className="font-serif text-[11px] font-bold text-gold-200 truncate">Ennin Nenjil</h5>
              <p className="text-[8px] text-gray-500 uppercase tracking-widest truncate">Midhun Saji Ram</p>
            </div>
            <button 
              onClick={() => setSidebarPlaying(!sidebarPlaying)}
              className="w-7 h-7 rounded-full bg-gold-500 hover:bg-gold-400 text-black flex items-center justify-center transition-transform hover:scale-105"
            >
              {sidebarPlaying ? <Pause size={12} fill="black" /> : <Play size={12} fill="black" className="ml-0.5" />}
            </button>
          </div>
          {/* Seek progress */}
          <div className="mt-3 h-1 bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-gold-500 rounded-full" style={{ width: `${sidebarProgress}%` }}></div>
          </div>
          <div className="flex justify-between items-center text-[7px] text-gray-500 mt-1 font-mono">
            <span>01:45</span>
            <span>04:35</span>
          </div>
        </div>

      </aside>

      {/* 2. MAIN CORE CONTENT WRAPPER */}
      <main className="flex-1 bg-obsidian-950 flex flex-col min-h-screen">
        
        {/* Top Floating Control Bar */}
        <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between bg-obsidian-900/50 backdrop-blur-md">
          {/* Left search */}
          <div className="relative flex items-center w-64 text-gray-400 focus-within:text-gold-500">
            <Search size={14} className="absolute left-3 pointer-events-none" />
            <input 
              type="text"
              placeholder="Search database..."
              className="bg-obsidian-950 border border-white/5 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-gold-500/20 w-full"
            />
          </div>

          {/* Right account details */}
          <div className="flex items-center space-x-6">
            <button className="text-gray-400 hover:text-gold-500 transition-colors relative">
              <Bell size={16} />
              {stats.unreadMessages > 0 && (
                <span className="absolute top-[-3px] right-[-3px] w-2 h-2 bg-gold-500 rounded-full animate-pulse" />
              )}
            </button>

            <div className="flex items-center space-x-2 border-l border-white/5 pl-6 text-left">
              <div className="w-8 h-8 rounded-full border border-gold-500/30 overflow-hidden bg-neutral-800">
                <img 
                  src="https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=150" 
                  alt="Admin Portrait"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white flex items-center">
                  <span>Midhun Saji Ram</span>
                  <ChevronDown size={12} className="ml-1 text-gray-500" />
                </h5>
                <p className="text-[8px] text-gray-500 uppercase tracking-widest">Admin Owner</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-black rounded-sm border border-red-500/20 transition-all"
              title="Log Out"
            >
              <LogOut size={13} />
            </button>
          </div>
        </header>

        {/* Scrollable Workspace Panel */}
        <div className="flex-1 p-8 overflow-y-auto">
          
          {/* TAB 1: DASHBOARD ANALYTICS OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in text-left">
              
              {/* Heading */}
              <div>
                <h2 className="font-serif text-2xl font-bold tracking-tight text-white flex items-center space-x-2">
                  <span>Welcome back, Midhun!</span>
                  <span className="wave-hand animate-bounce">👋</span>
                </h2>
                <p className="text-xs text-gray-400 mt-1 font-light">Here's what's happening with your portfolio database today.</p>
              </div>

              {/* Metric Counters Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                  { label: 'Total Songs', value: stats.songs, change: '+12% from last month', up: true },
                  { label: 'Total Listeners', value: '124.8K', change: '+18% from last month', up: true },
                  { label: 'Total Plays', value: '1.24M', change: '+22% from last month', up: true },
                  { label: 'Achievements', value: stats.timelineEvents, change: '+8% from last month', up: true },
                  { label: 'Booking Enquiries', value: stats.totalMessages, change: '-5% from last month', up: false }
                ].map((m, i) => (
                  <div key={i} className="bg-obsidian-900 border border-white/5 p-5 rounded-sm shadow-md">
                    <span className="text-[9px] uppercase tracking-wider text-gray-500 block mb-2">{m.label}</span>
                    <div className="text-2xl font-serif font-black text-gold-gradient leading-none">{m.value}</div>
                    <span className={`text-[8px] mt-2 block font-medium ${m.up ? 'text-green-400' : 'text-red-400'}`}>{m.change}</span>
                  </div>
                ))}
              </div>

              {/* Center Dashboard Split panels */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Plays Overview Graph Chart (using raw SVG paths for gorgeous curves) */}
                <div className="lg:col-span-8 bg-obsidian-900 border border-white/5 p-6 rounded-sm shadow-md">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Plays Overview</h3>
                    <select className="bg-obsidian-950 border border-white/5 text-[9px] uppercase tracking-widest px-3 py-1 text-gray-400 focus:outline-none">
                      <option>This Month</option>
                      <option>Last Quarter</option>
                    </select>
                  </div>
                  {/* Graphical line SVG */}
                  <div className="relative h-60 w-full mt-4 flex items-end">
                    <svg viewBox="0 0 500 200" className="w-full h-full text-gold-500 overflow-visible">
                      <defs>
                        <linearGradient id="curveGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#d4af37" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.03)" />
                      <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.03)" />
                      <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.03)" />
                      
                      {/* Glow Fill */}
                      <path d="M 0 200 Q 80 120 150 150 T 300 80 T 450 100 L 500 110 L 500 200 Z" fill="url(#curveGlow)" />
                      {/* Main golden curve */}
                      <path d="M 0 200 Q 80 120 150 150 T 300 80 T 450 100 L 500 110" fill="none" stroke="#d4af37" strokeWidth="2.5" />
                      
                      {/* Chart dots */}
                      <circle cx="300" cy="80" r="4" fill="#000" stroke="#d4af37" strokeWidth="2.5" />
                    </svg>
                    
                    {/* Tooltip marker */}
                    <div className="absolute top-[35%] left-[60%] bg-gold-500 text-black px-2 py-1 text-[8px] font-bold rounded-sm shadow-md font-mono pointer-events-none">
                      May 28: 32,456 Plays
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-gray-500 mt-2 font-mono uppercase tracking-wider">
                    <span>May 12</span>
                    <span>May 19</span>
                    <span>May 26</span>
                    <span>Jun 02</span>
                    <span>Jun 09</span>
                  </div>
                </div>

                {/* Circular donut chart and Storage counts */}
                <div className="lg:col-span-4 bg-obsidian-900 border border-white/5 p-6 rounded-sm shadow-md flex flex-col justify-between">
                  <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-6">Storage Overview</h3>
                  
                  <div className="flex justify-center items-center relative py-6">
                    {/* SVG circle stroke offset donut */}
                    <svg className="w-36 h-36 transform -rotate-90">
                      <circle cx="72" cy="72" r="54" stroke="#121217" strokeWidth="12" fill="transparent" />
                      <circle 
                        cx="72" 
                        cy="72" 
                        r="54" 
                        stroke="#d4af37" 
                        strokeWidth="12" 
                        fill="transparent" 
                        strokeDasharray="339.29" 
                        strokeDashoffset="108.57" /* 68% filled */
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-2xl font-serif font-black text-white">68%</span>
                      <span className="text-[7.5px] uppercase tracking-widest text-gray-500">Used</span>
                    </div>
                  </div>

                  {/* List breakdown */}
                  <div className="space-y-2 mt-4 text-[10px]">
                    {[
                      { label: 'Images Assets', size: '12.4 GB', color: 'bg-gold-500' },
                      { label: 'Video Clips', size: '18.7 GB', color: 'bg-white' },
                      { label: 'Audio Tracks', size: '8.9 GB', color: 'bg-gold-700' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-gray-400">
                        <div className="flex items-center space-x-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                          <span>{item.label}</span>
                        </div>
                        <span className="font-mono text-white font-semibold">{item.size}</span>
                      </div>
                    ))}
                  </div>

                </div>

              </div>

              {/* Bottom split list panels */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Recent Added Table */}
                <div className="lg:col-span-7 bg-obsidian-900 border border-white/5 p-6 rounded-sm shadow-md text-left">
                  <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-6">Recent Added Content</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px] text-left">
                      <thead>
                        <tr className="text-gray-500 border-b border-white/5 uppercase tracking-wider text-[8.5px]">
                          <th className="pb-3">Type</th>
                          <th className="pb-3">Title</th>
                          <th className="pb-3">Date</th>
                          <th className="pb-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-gray-300 font-light">
                        {[
                          { type: 'Song', title: 'Ente Nenjil (Acoustic)', date: 'June 10, 2024' },
                          { type: 'Album', title: 'Letters Unheard', date: 'June 08, 2024' },
                          { type: 'Gallery', title: 'Live in Cochin', date: 'June 07, 2024' },
                          { type: 'Blog', title: 'The Story Behind Ennin Nenjil', date: 'June 05, 2024' }
                        ].map((row, idx) => (
                          <tr key={idx}>
                            <td className="py-3 font-semibold text-gold-500 uppercase tracking-widest text-[9px]">{row.type}</td>
                            <td className="py-3 font-semibold text-white">{row.title}</td>
                            <td className="py-3 text-gray-400">{row.date}</td>
                            <td className="py-3"><span className="bg-gold-500/10 text-gold-500 px-2 py-0.5 text-[8.5px] uppercase font-bold tracking-widest rounded-sm">Published</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Enquiries List */}
                <div className="lg:col-span-5 bg-obsidian-900 border border-white/5 p-6 rounded-sm shadow-md text-left flex flex-col justify-between">
                  <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-6">Recent Enquiries</h3>
                  
                  <div className="space-y-4">
                    {messages.slice(0, 3).map((msg) => (
                      <div key={msg._id} className="flex justify-between items-start space-x-3 bg-obsidian-950 p-3.5 border border-white/5 rounded-sm">
                        <div className="flex items-start space-x-3 text-left">
                          <div className="w-8 h-8 rounded-full bg-neutral-800 overflow-hidden mt-0.5 flex-shrink-0 border border-gold-500/20">
                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${msg.name}`} alt="" />
                          </div>
                          <div>
                            <h5 className="font-bold text-xs text-white leading-tight">{msg.name}</h5>
                            <p className="text-[9px] text-gold-500 uppercase tracking-wider font-semibold mt-1 truncate max-w-[150px]">{msg.subject}</p>
                          </div>
                        </div>
                        <span className="text-[8px] text-gray-500 font-mono">2m ago</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setActiveTab('enquiries')}
                    className="w-full text-center text-[9px] uppercase tracking-widest text-gold-500 hover:text-gold-400 mt-6 font-bold"
                  >
                    View All Enquiries Inbox &rarr;
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: SONGS / WORKS PORTFOLIO MANAGEMENT */}
          {activeTab === 'songs' && (
            <div className="space-y-8 animate-fade-in text-left">
              <form onSubmit={handleAddSong} className="bg-obsidian-900 border border-white/5 p-6 rounded-sm space-y-4">
                <h3 className="font-serif text-base font-bold text-gold-500 uppercase tracking-widest flex items-center space-x-2">
                  <Plus size={15} /> <span>Register New Music Composition Release</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Song Title"
                    value={songForm.title}
                    onChange={(e) => setSongForm({ ...songForm, title: e.target.value })}
                    className="bg-obsidian-950 border border-white/10 px-4 py-3 text-xs text-white rounded-sm focus:outline-none focus:border-gold-500/30"
                  />
                  <select
                    value={songForm.category}
                    onChange={(e) => setSongForm({ ...songForm, category: e.target.value })}
                    className="bg-obsidian-950 border border-white/10 px-4 py-3 text-xs text-white rounded-sm focus:outline-none"
                  >
                    <option value="Single">Single Release</option>
                    <option value="Album">Album Track</option>
                    <option value="Film Score">Film Composition</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Cover Image URL (e.g. Unsplash link)"
                    value={songForm.coverUrl}
                    onChange={(e) => setSongForm({ ...songForm, coverUrl: e.target.value })}
                    className="bg-obsidian-950 border border-white/10 px-4 py-3 text-xs text-white rounded-sm focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Audio Preview Stream URL (.mp3)"
                    value={songForm.audioUrl}
                    onChange={(e) => setSongForm({ ...songForm, audioUrl: e.target.value })}
                    className="bg-obsidian-950 border border-white/10 px-4 py-3 text-xs text-white rounded-sm focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Spotify Stream Link"
                    value={songForm.spotifyUrl}
                    onChange={(e) => setSongForm({ ...songForm, spotifyUrl: e.target.value })}
                    className="bg-obsidian-950 border border-white/10 px-4 py-3 text-xs text-white rounded-sm focus:outline-none"
                  />
                </div>

                <textarea
                  placeholder="Composition Description Notes..."
                  rows={2}
                  value={songForm.description}
                  onChange={(e) => setSongForm({ ...songForm, description: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 px-4 py-3 text-xs text-white rounded-sm focus:outline-none"
                ></textarea>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isFeaturedDashboard"
                    checked={songForm.isFeatured}
                    onChange={(e) => setSongForm({ ...songForm, isFeatured: e.target.checked })}
                    className="accent-gold-500"
                  />
                  <label htmlFor="isFeaturedDashboard" className="text-[10px] uppercase tracking-widest text-gray-400">Feature this release prominently on home slideshow</label>
                </div>

                <button type="submit" className="px-6 py-3 bg-gold-500 text-black font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-gold-400">
                  Publish Track Release
                </button>
              </form>

              {/* Table details list */}
              <div className="bg-obsidian-900 border border-white/5 p-6 rounded-sm">
                <h4 className="font-serif text-sm font-bold text-white mb-4">Compositions Registry</h4>
                <div className="space-y-3">
                  {songs.map((song) => (
                    <div key={song._id} className="bg-obsidian-950 p-4 border border-white/5 rounded-sm flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-left">
                        <img src={song.coverUrl} className="w-10 h-10 object-cover rounded-sm border border-white/10" alt="" />
                        <div>
                          <h5 className="font-serif text-xs font-bold text-gold-200">{song.title}</h5>
                          <p className="text-[9px] text-gray-500 uppercase tracking-widest">{song.category} {song.isFeatured ? '&bull; Featured' : ''}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteSong(song._id)} className="text-gray-500 hover:text-red-400 p-2 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MEDIA GALLERY CMS */}
          {activeTab === 'gallery' && (
            <div className="space-y-8 animate-fade-in text-left">
              <form onSubmit={handleAddGalleryItem} className="bg-obsidian-900 border border-white/5 p-6 rounded-sm space-y-4">
                <h3 className="font-serif text-base font-bold text-gold-500 uppercase tracking-widest flex items-center space-x-2">
                  <Plus size={15} /> <span>Upload Concert / Studio Photo Asset</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Asset Title (e.g. Arena Live Concert)"
                    value={galleryForm.title}
                    onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                    className="bg-obsidian-950 border border-white/10 px-4 py-3 text-xs text-white rounded-sm focus:outline-none col-span-2"
                  />
                  <select
                    value={galleryForm.category}
                    onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                    className="bg-obsidian-950 border border-white/10 px-4 py-3 text-xs text-white rounded-sm focus:outline-none"
                  >
                    <option value="Concerts">Concert Performance</option>
                    <option value="Studio">Studio Session</option>
                    <option value="Personal">Personal Moment</option>
                  </select>
                </div>

                <input
                  type="text"
                  required
                  placeholder="Asset URL (Unsplash link / CDN link)"
                  value={galleryForm.url}
                  onChange={(e) => setGalleryForm({ ...galleryForm, url: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 px-4 py-3 text-xs text-white rounded-sm focus:outline-none"
                />

                <button type="submit" className="px-6 py-3 bg-gold-500 text-black font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-gold-400">
                  Upload Media Asset
                </button>
              </form>

              {/* Grid visualizers */}
              <div className="bg-obsidian-900 border border-white/5 p-6 rounded-sm">
                <h4 className="font-serif text-sm font-bold text-white mb-6">Gallery Media Items</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {gallery.map((item) => (
                    <div key={item._id} className="relative aspect-[4/3] rounded-sm overflow-hidden bg-obsidian-950 border border-white/10 group">
                      <img src={item.url} className="w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={() => handleDeleteGallery(item._id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TIMELINE EVENTS MANAGEMENT */}
          {activeTab === 'timeline' && (
            <div className="space-y-8 animate-fade-in text-left">
              <form onSubmit={handleAddTimeline} className="bg-obsidian-900 border border-white/5 p-6 rounded-sm space-y-4">
                <h3 className="font-serif text-base font-bold text-gold-500 uppercase tracking-widest flex items-center space-x-2">
                  <Plus size={15} /> <span>Create Milestone / Achievement Journey Point</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Year (e.g. 2021)"
                    value={timelineForm.year}
                    onChange={(e) => setTimelineForm({ ...timelineForm, year: e.target.value })}
                    className="bg-obsidian-950 border border-white/10 px-4 py-3 text-xs text-white rounded-sm focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Milestone Event Heading"
                    value={timelineForm.title}
                    onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })}
                    className="bg-obsidian-950 border border-white/10 px-4 py-3 text-xs text-white rounded-sm focus:outline-none col-span-3"
                  />
                </div>

                <textarea
                  required
                  placeholder="Detail Narrative Description of Milestone..."
                  rows={2}
                  value={timelineForm.description}
                  onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 px-4 py-3 text-xs text-white rounded-sm focus:outline-none"
                ></textarea>

                <button type="submit" className="px-6 py-3 bg-gold-500 text-black font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-gold-400">
                  Publish Milestone Point
                </button>
              </form>

              {/* Archive list */}
              <div className="bg-obsidian-900 border border-white/5 p-6 rounded-sm">
                <h4 className="font-serif text-sm font-bold text-white mb-4">Journey Milestones List</h4>
                <div className="space-y-3">
                  {timeline.map((evt) => (
                    <div key={evt._id} className="bg-obsidian-950 p-4 border border-white/5 rounded-sm flex items-center justify-between">
                      <div className="text-left">
                        <span className="font-serif text-gold-500 font-extrabold text-xs pr-2">{evt.year}</span>
                        <span className="font-semibold text-xs text-white">{evt.title}</span>
                        <p className="text-[10px] text-gray-500 mt-1">{evt.description}</p>
                      </div>
                      <button onClick={() => handleDeleteTimeline(evt._id)} className="text-gray-500 hover:text-red-400 p-2 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BLOG PUBLISHING CMS */}
          {activeTab === 'blog' && (
            <div className="space-y-8 animate-fade-in text-left">
              <form onSubmit={handleAddBlog} className="bg-obsidian-900 border border-white/5 p-6 rounded-sm space-y-4">
                <h3 className="font-serif text-base font-bold text-gold-500 uppercase tracking-widest flex items-center space-x-2">
                  <Plus size={15} /> <span>Write Reflection Story / Article Behind the Music</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Article Headline Title"
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    className="bg-obsidian-950 border border-white/10 px-4 py-3 text-xs text-white rounded-sm focus:outline-none col-span-2"
                  />
                  <select
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    className="bg-obsidian-950 border border-white/10 px-4 py-3 text-xs text-white rounded-sm focus:outline-none"
                  >
                    <option value="Reflection">Reflection Note</option>
                    <option value="BTS">Behind the Scenes</option>
                    <option value="Legacy">Father's Legacy</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Banner Cover Image URL"
                    value={blogForm.coverUrl}
                    onChange={(e) => setBlogForm({ ...blogForm, coverUrl: e.target.value })}
                    className="bg-obsidian-950 border border-white/10 px-4 py-3 text-xs text-white rounded-sm focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Reading Time (e.g. 4 mins)"
                    value={blogForm.readingTime}
                    onChange={(e) => setBlogForm({ ...blogForm, readingTime: e.target.value })}
                    className="bg-obsidian-950 border border-white/10 px-4 py-3 text-xs text-white rounded-sm focus:outline-none"
                  />
                </div>

                <input
                  type="text"
                  required
                  placeholder="Short Excerpt Summary..."
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 px-4 py-3 text-xs text-white rounded-sm focus:outline-none"
                />

                <textarea
                  required
                  placeholder="Article Content Body (supports HTML elements like <p> and <em>)..."
                  rows={6}
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 px-4 py-3 text-xs text-white rounded-sm focus:outline-none font-mono"
                ></textarea>

                <button type="submit" className="px-6 py-3 bg-gold-500 text-black font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-gold-400">
                  Publish Story
                </button>
              </form>

              {/* Archive lists */}
              <div className="bg-obsidian-900 border border-white/5 p-6 rounded-sm">
                <h4 className="font-serif text-sm font-bold text-white mb-4">Reflections Stories List</h4>
                <div className="space-y-3">
                  {blogs.map((blog) => (
                    <div key={blog._id} className="bg-obsidian-950 p-4 border border-white/5 rounded-sm flex items-center justify-between">
                      <div className="text-left">
                        <h5 className="font-serif text-xs font-bold text-gold-200">{blog.title}</h5>
                        <p className="text-[8px] text-gray-500 uppercase tracking-widest mt-0.5">{blog.category} &bull; {blog.readingTime}</p>
                      </div>
                      <button onClick={() => handleDeleteBlog(blog._id)} className="text-gray-500 hover:text-red-400 p-2 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BOOKING INBOX MESSAGES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6 animate-fade-in text-left">
              <h3 className="font-serif text-lg font-bold text-white mb-2">Booking & Collaboration Inbox</h3>
              
              {messages.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No messages received yet.</p>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg._id} className={`p-5 rounded-sm border transition-all ${msg.status === 'unread' ? 'bg-gold-500/5 border-gold-500/20 shadow-md shadow-gold-500/5' : 'bg-obsidian-900 border-white/5'}`}>
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-3">
                        <div>
                          <h4 className="font-bold text-xs text-white flex items-center space-x-1.5">
                            <span>{msg.name}</span>
                            <span className="text-gray-500 font-normal">&lt;{msg.email}&gt;</span>
                          </h4>
                          <p className="text-[9px] text-gold-500 uppercase tracking-widest mt-1 font-semibold">Subject: {msg.subject || 'Inquiry'}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-2 sm:mt-0 text-[10px]">
                          {msg.status === 'unread' && (
                            <button 
                              onClick={() => handleMarkMessageRead(msg._id)}
                              className="text-gold-500 hover:text-gold-400 flex items-center space-x-1"
                            >
                              <CheckCircle2 size={12} />
                              <span>Mark Read</span>
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteMessage(msg._id)}
                            className="text-gray-500 hover:text-red-400 flex items-center space-x-1 pl-2 border-l border-white/10"
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed font-light mt-3 border-t border-white/5 pt-3">
                        {msg.message}
                      </p>
                      
                      {msg.phone && (
                        <p className="text-[10px] text-gray-500 mt-2">
                          Contact Phone: <span className="text-gray-400">{msg.phone}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <footer className="h-12 border-t border-white/5 px-8 flex items-center justify-between text-[10px] text-gray-500 bg-obsidian-900/10">
          <span>&copy; {new Date().getFullYear()} Midhun Saji Ram. All Rights Reserved.</span>
          {/* <div className="flex items-center space-x-1">
            <span>Designed with</span>
            <Heart size={9} className="text-gold-500 fill-gold-500 animate-pulse" />
            <span>Passion for Music</span>
          </div> */}
        </footer>

      </main>

    </div>
  );
}
