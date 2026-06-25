/* eslint-disable react/prop-types, no-unused-vars, react/no-unescaped-entities */
import React, { useState, useEffect } from 'react';
import {
  LogIn, LogOut, Disc, FileText, Image, Calendar, Mail, BarChart3,
  Plus, Trash2, CheckCircle2, Lock, Settings, Play, Pause,
  Users, Award, Video, Film, MessageSquare, Search, Bell, ChevronDown, Heart, Sparkles, Save, ChevronRight, X, Edit, Tv, Clapperboard, Music,
  Menu, Upload, Clock, Volume2, VolumeX, ChevronUp, Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';

const FormField = ({ label, children }) => (
  <div className="flex flex-col space-y-1 text-left w-full">
    <span className="text-[9.5px] font-bold uppercase tracking-widest text-obsidian-500">{label}</span>
    {children}
  </div>
);

const Input = ({ className = '', ...props }) => (
  <input
    {...props}
    className={`bg-obsidian-950 border border-obsidian-700/60 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20 rounded-lg px-3 py-1.5 text-[11.5px] text-obsidian-100 placeholder-slate-500 transition-all outline-none w-full ${className}`}
  />
);

const Textarea = ({ className = '', ...props }) => (
  <textarea
    {...props}
    className={`bg-obsidian-950 border border-obsidian-700/60 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20 rounded-lg px-3 py-1.5 text-[11.5px] text-obsidian-100 placeholder-slate-500 transition-all outline-none resize-none font-sans w-full ${className}`}
  />
);

const Select = ({ className = '', ...props }) => (
  <select
    {...props}
    className={`bg-obsidian-950 border border-obsidian-700/60 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20 rounded-lg px-3 py-1.5 text-[11.5px] text-obsidian-100 transition-all outline-none cursor-pointer w-full ${className}`}
  />
);

const getPreviewUrl = (value) => {
  if (!value) return '';
  if (value instanceof File) {
    return URL.createObjectURL(value);
  }
  return value;
};

const FileUpload = ({ accept, onChange, label, value }) => (
  <label className="flex items-center gap-3 border border-dashed border-obsidian-700 hover:border-gold-500/50 bg-obsidian-950 hover:bg-gold-500/5 px-4 py-3 rounded-lg cursor-pointer transition-all min-w-0 w-full select-none">
    <Upload size={14} className="text-gold-500 shrink-0" />
    <div className="flex-1 min-w-0 text-left">
      <span className="text-[11px] font-semibold text-obsidian-100 block truncate">{label}</span>
      <span className="text-[9px] text-slate-500 block truncate">
        {value
          ? (typeof value === 'string' ? value.split('/').pop() : value.name)
          : 'Click to select asset'}
      </span>
    </div>
    <input type="file" accept={accept} onChange={onChange} className="hidden" />
  </label>
);

const getTabWorkType = (tab) => {
  switch (tab) {
    case 'short-films': return 'short_film';
    case 'web-series': return 'web_series';
    case 'tv-programs': return 'tv_program';
    case 'feature-films': return 'movie';
    case 'independent-works': return 'independent_work';
    default: return 'short_film';
  }
};

const getTabLabel = (tab) => {
  switch (tab) {
    case 'short-films': return 'Short Films';
    case 'web-series': return 'Web Series';
    case 'tv-programs': return 'TV Programs';
    case 'feature-films': return 'Feature Films';
    case 'independent-works': return 'Independent Works';
    default: return 'Cinematic Works';
  }
};

const getTabSingularLabel = (tab) => {
  switch (tab) {
    case 'short-films': return 'Short Film';
    case 'web-series': return 'Web Series';
    case 'tv-programs': return 'TV Program';
    case 'feature-films': return 'Feature Film';
    case 'independent-works': return 'Independent Work';
    default: return 'Cinematic Release';
  }
};

const getYoutubeId = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
};

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Dashboard navigation tab
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [blogPreviewMode, setBlogPreviewMode] = useState(false);

  // Content view toggles (list vs add)
  const [songsViewMode, setSongsViewMode] = useState('list');
  const [mediaViewMode, setMediaViewMode] = useState('list');
  const [galleryViewMode, setGalleryViewMode] = useState('list');
  const [timelineViewMode, setTimelineViewMode] = useState('list');
  const [blogViewMode, setBlogViewMode] = useState('list');

  // Interactive audio instance
  const [audio] = useState(() => {
    const a = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    a.loop = true;
    return a;
  });

  // Stats State
  const [stats, setStats] = useState({
    songs: 0,
    blogs: 0,
    galleryItems: 0,
    timelineEvents: 0,
    mediaWorks: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalVisits: 0,
    dailyVisits: [],
    weeklyVisits: []
  });



  const [streamPeriod, setStreamPeriod] = useState('This Week');

  // DB Lists State
  const [songs, setSongs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [messages, setMessages] = useState([]);
  const [mediaWorks, setMediaWorks] = useState([]);

  // Create Form States
  const [songForm, setSongForm] = useState({ title: '', category: 'Single', coverUrl: '', audioUrl: '', spotifyUrl: '', youtubeUrl: '', description: '', isFeatured: false });
  const [blogForm, setBlogForm] = useState({ title: '', category: 'Reflection', coverUrl: '', excerpt: '', content: '', readingTime: '4 mins', isPublished: true });
  const [galleryForm, setGalleryForm] = useState({ title: '', url: '', type: 'image', category: 'Concerts', isFeatured: false });
  const [timelineForm, setTimelineForm] = useState({ year: '', title: '', description: '', image: '' });
  const [editingTimelineId, setEditingTimelineId] = useState(null);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [mediaWorkForm, setMediaWorkForm] = useState({
    title: '',
    type: 'short_film',
    coverUrl: '',
    videoUrl: '',
    audioUrl: '',
    mediaType: 'youtube',
    releaseYear: '',
    description: '',
    isFeatured: false
  });

  const [independentSubtype, setIndependentSubtype] = useState('video');

  // Site Content Editor State
  const [siteContent, setSiteContent] = useState({});
  const [activeContentSection, setActiveContentSection] = useState('hero');
  const [contentSaving, setContentSaving] = useState(false);
  const [contentSaveSuccess, setContentSaveSuccess] = useState('');

  // Editable forms for each site content section
  const [heroForm, setHeroForm] = useState({
    subtitle: '', titleLine1: '', titleLine2: '', titleLine3: '',
    description: '', quote: '', signature: '', heroImage: ''
  });
  const [aboutForm, setAboutForm] = useState({
    subtitle: '', title: '', paragraph1: '', paragraph2: '',
    portraitImage: '', stats: []
  });
  const [legacyForm, setLegacyForm] = useState({
    subtitle: '', title: '', paragraph1: '', paragraph2: '',
    mainImage: '', polaroidImage: '', polaroidCaption: '', cursiveText: ''
  });
  const [footerForm, setFooterForm] = useState({
    brandName: '', brandTagline: '', description: '',
    bookingEmail: '', location: '',
    spotifyUrl: '', youtubeUrl: '', instagramUrl: ''
  });
  const [faqsForm, setFaqsForm] = useState({
    subtitle: '', title: '', items: []
  });
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

  // Player Preview States inside Dashboard Sidebar
  const [sidebarPlaying, setSidebarPlaying] = useState(false);
  const [sidebarProgress, setSidebarProgress] = useState(38);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      loadData();
      loadSiteContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    if (sidebarPlaying) {
      audio.play().catch(err => console.log('Playback deferred:', err));
    } else {
      audio.pause();
    }
  }, [sidebarPlaying, audio]);

  useEffect(() => {
    const updateProgress = () => {
      setAudioCurrentTime(audio.currentTime);
      if (audio.duration) {
        setAudioDuration(audio.duration);
        setSidebarProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    audio.addEventListener('timeupdate', updateProgress);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.pause();
    };
  }, [audio]);

  // Auto-extract song YouTube thumbnail
  useEffect(() => {
    if (songForm.youtubeUrl) {
      const ytId = getYoutubeId(songForm.youtubeUrl);
      if (ytId) {
        const isCoverEmptyOrYt = !songForm.coverUrl || (typeof songForm.coverUrl === 'string' && songForm.coverUrl.includes('img.youtube.com'));
        if (isCoverEmptyOrYt) {
          const newCoverUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
          if (songForm.coverUrl !== newCoverUrl) {
            setSongForm(prev => ({ ...prev, coverUrl: newCoverUrl }));
          }
        }
      }
    } else {
      const isCoverYt = typeof songForm.coverUrl === 'string' && songForm.coverUrl.includes('img.youtube.com');
      if (isCoverYt) {
        setSongForm(prev => ({ ...prev, coverUrl: '' }));
      }
    }
  }, [songForm.youtubeUrl]);

  // Auto-extract media work YouTube thumbnail
  useEffect(() => {
    if (mediaWorkForm.mediaType === 'youtube' && mediaWorkForm.videoUrl) {
      const ytId = getYoutubeId(mediaWorkForm.videoUrl);
      if (ytId) {
        const isCoverEmptyOrYt = !mediaWorkForm.coverUrl || (typeof mediaWorkForm.coverUrl === 'string' && mediaWorkForm.coverUrl.includes('img.youtube.com'));
        if (isCoverEmptyOrYt) {
          const newCoverUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
          if (mediaWorkForm.coverUrl !== newCoverUrl) {
            setMediaWorkForm(prev => ({ ...prev, coverUrl: newCoverUrl }));
          }
        }
      }
    } else if (mediaWorkForm.mediaType === 'youtube' && !mediaWorkForm.videoUrl) {
      const isCoverYt = typeof mediaWorkForm.coverUrl === 'string' && mediaWorkForm.coverUrl.includes('img.youtube.com');
      if (isCoverYt) {
        setMediaWorkForm(prev => ({ ...prev, coverUrl: '' }));
      }
    }
  }, [mediaWorkForm.videoUrl, mediaWorkForm.mediaType]);

  const handleTabSelect = (tabId) => {
    setActiveTab(tabId);
    setIsSidebarOpen(false);
    if (tabId === 'songs') setSongsViewMode('list');
    if (['media-works', 'short-films', 'web-series', 'tv-programs', 'feature-films', 'independent-works'].includes(tabId)) {
      setMediaViewMode('list');
      setMediaWorkForm(prev => ({
        ...prev,
        type: getTabWorkType(tabId)
      }));
    }
    if (tabId === 'gallery') setGalleryViewMode('list');
    if (tabId === 'timeline') setTimelineViewMode('list');
    if (tabId === 'blog') setBlogViewMode('list');
  };

  const handleMetricClick = (tabId) => {
    setActiveTab(tabId);
    setIsSidebarOpen(false);
    if (tabId === 'songs') setSongsViewMode('list');
    if (['media-works', 'short-films', 'web-series', 'tv-programs', 'feature-films', 'independent-works'].includes(tabId)) {
      setMediaViewMode('list');
      setMediaWorkForm(prev => ({
        ...prev,
        type: getTabWorkType(tabId)
      }));
    }
    if (tabId === 'gallery') setGalleryViewMode('list');
    if (tabId === 'timeline') setTimelineViewMode('list');
    if (tabId === 'blog') setBlogViewMode('list');
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };



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
          mediaWorks: data.stats.mediaWorks || 0,
          totalMessages: data.stats.totalMessages,
          unreadMessages: data.stats.unreadMessages,
          totalVisits: data.stats.totalVisits || 0,
          dailyVisits: data.stats.dailyVisits || [],
          weeklyVisits: data.stats.weeklyVisits || []
        });
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
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

      const resMedia = await fetch(`${API_URL}/media-works`);
      setMediaWorks(await resMedia.json());

      const resMessages = await fetch(`${API_URL}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resMessages.ok) {
        setMessages(await resMessages.json());
      }

      // Automatically sync stats in real-time
      loadStats();
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const getStreamPlaysData = () => {
    const isWeek = streamPeriod === 'This Week';
    const sourceData = isWeek ? stats.dailyVisits : stats.weeklyVisits;
    const numPoints = 5;

    // Fallback if no analytics loaded yet
    if (!sourceData || sourceData.length === 0) {
      const emptyCoords = Array.from({ length: numPoints }, (_, idx) => ({
        x: idx * 125,
        y: 170,
        val: 0
      }));
      return {
        linePath: `M 0 170 C 62.5 170, 62.5 170, 125 170 C 187.5 170, 187.5 170, 250 170 C 312.5 170, 312.5 170, 375 170 C 437.5 170, 437.5 170, 500 170`,
        glowPath: `M 0 170 C 62.5 170, 62.5 170, 125 170 C 187.5 170, 187.5 170, 250 170 C 312.5 170, 312.5 170, 375 170 C 437.5 170, 437.5 170, 500 170 L 500 200 L 0 200 Z`,
        total: "0",
        peak: "0",
        peakDay: isWeek ? "Today" : "This Week",
        days: isWeek ? ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"] : ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
        coords: emptyCoords
      };
    }

    const rawValues = sourceData.map(item => item.count);
    const labels = sourceData.map(item => item.date);

    const maxVal = Math.max(...rawValues);
    const minVal = Math.min(...rawValues);
    const range = maxVal - minVal || 1;

    // Map to coordinates (x: 0-500, y: 50-170)
    const coords = rawValues.map((val, idx) => {
      const x = idx * 125;
      const percent = range === 0 ? 0.5 : (val - minVal) / range;
      const y = 170 - (percent * 110); // leave 50-170 space
      return { x, y, val };
    });

    // Generate smooth bezier curve
    let linePath = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const cpX = prev.x + (curr.x - prev.x) / 2;
      linePath += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    const glowPath = `${linePath} L 500 200 L 0 200 Z`;

    // Find index of peak
    const peakIdx = rawValues.indexOf(maxVal);
    const peakDay = labels[peakIdx];

    const totalPlays = rawValues.reduce((a, b) => a + b, 0);

    const formatPlays = (num) => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
      return num.toString();
    };

    return {
      linePath,
      glowPath,
      total: totalPlays.toLocaleString(),
      peak: maxVal.toLocaleString(),
      peakDay,
      days: labels,
      coords
    };
  };

  const loadSiteContent = async () => {
    try {
      const res = await fetch(`${API_URL}/site-content`);
      const data = await res.json();
      if (data.success && data.content) {
        setSiteContent(data.content);
        // Populate forms with loaded content
        if (data.content.hero) {
          setHeroForm(prev => ({ ...prev, ...data.content.hero }));
        }
        if (data.content.about) {
          setAboutForm(prev => ({ ...prev, ...data.content.about }));
        }
        if (data.content.father_legacy) {
          setLegacyForm(prev => ({ ...prev, ...data.content.father_legacy }));
        }
        if (data.content.footer) {
          setFooterForm(prev => ({ ...prev, ...data.content.footer }));
        }
        if (data.content.faqs) {
          setFaqsForm(prev => ({ ...prev, ...data.content.faqs }));
        }
      }
    } catch (err) {
      console.error('Failed to load site content:', err);
    }
  };

  const saveSiteContentSection = async (section, formData) => {
    setContentSaving(true);
    setContentSaveSuccess('');
    try {
      const updatedData = { ...formData };
      if (section === 'hero' && updatedData.heroImage) {
        updatedData.heroImage = await uploadIfNeeded(updatedData.heroImage);
      } else if (section === 'about' && updatedData.portraitImage) {
        updatedData.portraitImage = await uploadIfNeeded(updatedData.portraitImage);
      } else if (section === 'father_legacy') {
        if (updatedData.mainImage) {
          updatedData.mainImage = await uploadIfNeeded(updatedData.mainImage);
        }
        if (updatedData.polaroidImage) {
          updatedData.polaroidImage = await uploadIfNeeded(updatedData.polaroidImage);
        }
      }

      const res = await fetch(`${API_URL}/site-content/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ data: updatedData })
      });
      const data = await res.json();
      if (data.success) {
        setContentSaveSuccess(section);
        confetti({ particleCount: 40, colors: ['#b89033', '#cca647', '#ffffff'], spread: 40 });
        loadSiteContent();
        setTimeout(() => setContentSaveSuccess(''), 3000);
      } else {
        alert(data.message || 'Failed to save section.');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to save section.');
    } finally {
      setContentSaving(false);
    }
  };

  const handleSiteContentImageUpload = async (e, section, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (section === 'hero') setHeroForm(prev => ({ ...prev, [field]: file }));
    if (section === 'about') setAboutForm(prev => ({ ...prev, [field]: file }));
    if (section === 'father_legacy') setLegacyForm(prev => ({ ...prev, [field]: file }));
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
        confetti({ particleCount: 80, spread: 50, colors: ['#b89033', '#cca647', '#ffffff'] });
      } else {
        setLoginError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setLoginError('Could not connect to the Express server. Please check that the server is running.');
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
    setContentSaving(true);
    try {
      let coverUrl = await uploadIfNeeded(songForm.coverUrl);
      const audioUrl = await uploadIfNeeded(songForm.audioUrl);

      if (!coverUrl && songForm.youtubeUrl) {
        const ytId = getYoutubeId(songForm.youtubeUrl);
        if (ytId) {
          coverUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
        }
      }

      const songData = { ...songForm, coverUrl, audioUrl };

      const res = await fetch(`${API_URL}/songs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(songData)
      });
      if (res.ok) {
        setSongForm({ title: '', category: 'Single', coverUrl: '', audioUrl: '', spotifyUrl: '', youtubeUrl: '', description: '', isFeatured: false });
        setSongsViewMode('list');
        loadData();
        confetti({ particleCount: 50, colors: ['#b89033', '#cca647', '#ffffff'] });
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to add song.');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to connect to the server.');
    } finally {
      setContentSaving(false);
    }
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
        const data = await res.json();
        alert(data.message || 'Failed to delete song.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to the server.');
    }
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (field === 'mediaCover') {
      setMediaWorkForm(prev => ({ ...prev, coverUrl: file }));
    } else if (field === 'mediaVideo') {
      setMediaWorkForm(prev => ({ ...prev, videoUrl: file }));
    } else if (field === 'mediaAudio') {
      setMediaWorkForm(prev => ({ ...prev, audioUrl: file }));
    } else if (field === 'songCover') {
      setSongForm(prev => ({ ...prev, coverUrl: file }));
    } else if (field === 'songAudio') {
      setSongForm(prev => ({ ...prev, audioUrl: file }));
    } else if (field === 'blogCover') {
      setBlogForm(prev => ({ ...prev, coverUrl: file }));
    } else if (field === 'galleryUrl') {
      setGalleryForm(prev => ({ ...prev, url: file }));
    } else if (field === 'timelineImage') {
      setTimelineForm(prev => ({ ...prev, image: file }));
    }
  };

  const uploadIfNeeded = async (fileOrUrl) => {
    if (!fileOrUrl || typeof fileOrUrl === 'string') return fileOrUrl;

    const formData = new FormData();
    formData.append('file', fileOrUrl);

    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();
    if (data.success) {
      return data.fileUrl;
    } else {
      throw new Error(data.message || 'File upload failed');
    }
  };

  const handleAddMediaWork = async (e) => {
    e.preventDefault();
    setContentSaving(true);
    try {
      const coverUrl = await uploadIfNeeded(mediaWorkForm.coverUrl);
      const videoUrl = await uploadIfNeeded(mediaWorkForm.videoUrl);
      const audioUrl = await uploadIfNeeded(mediaWorkForm.audioUrl);

      const sanitizedForm = { ...mediaWorkForm, coverUrl, videoUrl, audioUrl };
      if (sanitizedForm.type === 'independent_work') {
        if (independentSubtype === 'audio') {
          sanitizedForm.videoUrl = '';
          sanitizedForm.mediaType = 'upload';
        } else {
          sanitizedForm.audioUrl = '';
        }
      }

      const res = await fetch(`${API_URL}/media-works`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(sanitizedForm)
      });
      if (res.ok) {
        setMediaWorkForm({
          title: '',
          type: getTabWorkType(activeTab),
          coverUrl: '',
          videoUrl: '',
          audioUrl: '',
          mediaType: 'youtube',
          releaseYear: '',
          description: '',
          isFeatured: false
        });
        setIndependentSubtype('video');
        setMediaViewMode('list');
        loadData();
        loadStats();
        confetti({ particleCount: 50, colors: ['#b89033', '#cca647', '#ffffff'] });
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to add media work.');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to connect to the server.');
    } finally {
      setContentSaving(false);
    }
  };

  const handleDeleteMediaWork = async (id) => {
    if (!window.confirm('Are you sure you want to delete this media work?')) return;
    try {
      const res = await fetch(`${API_URL}/media-works/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        loadData();
        loadStats();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete media work.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to the server.');
    }
  };


  const handleAddBlog = async (e) => {
    e.preventDefault();
    setContentSaving(true);
    try {
      const coverUrl = await uploadIfNeeded(blogForm.coverUrl);
      const blogData = { ...blogForm, coverUrl };

      const isEditing = !!editingBlogId;
      const url = isEditing ? `${API_URL}/blogs/${editingBlogId}` : `${API_URL}/blogs`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(blogData)
      });
      if (res.ok) {
        setBlogForm({ title: '', category: 'Reflection', coverUrl: '', excerpt: '', content: '', readingTime: '4 mins', isPublished: true });
        setEditingBlogId(null);
        setBlogViewMode('list');
        loadData();
        confetti({ particleCount: 50, colors: ['#b89033', '#cca647', '#ffffff'] });
      } else {
        const data = await res.json();
        alert(data.message || `Failed to ${isEditing ? 'update' : 'add'} blog post.`);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to connect to the server.');
    } finally {
      setContentSaving(false);
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlogId(blog._id);
    setBlogForm({
      title: blog.title || '',
      category: blog.category || 'Reflection',
      coverUrl: blog.coverUrl || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      readingTime: blog.readingTime || '3 mins',
      isPublished: blog.isPublished !== undefined ? blog.isPublished : true
    });
    setBlogPreviewMode(false);
    setBlogViewMode('add');
  };

  const handlePreviewBlog = (blog) => {
    setEditingBlogId(blog._id);
    setBlogForm({
      title: blog.title || '',
      category: blog.category || 'Reflection',
      coverUrl: blog.coverUrl || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      readingTime: blog.readingTime || '3 mins',
      isPublished: blog.isPublished !== undefined ? blog.isPublished : true
    });
    setBlogPreviewMode(true);
    setBlogViewMode('add');
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
        const data = await res.json();
        alert(data.message || 'Failed to delete blog post.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to the server.');
    }
  };

  const handleAddGalleryItem = async (e) => {
    e.preventDefault();
    setContentSaving(true);
    try {
      if (!galleryForm.url) {
        alert('Please upload an image file or enter an image URL.');
        setContentSaving(false);
        return;
      }
      
      const url = await uploadIfNeeded(galleryForm.url);
      
      // Auto-generate title from filename or category + date
      let generatedTitle = '';
      if (galleryForm.url && typeof galleryForm.url === 'object' && galleryForm.url.name) {
        const nameWithoutExt = galleryForm.url.name.substring(0, galleryForm.url.name.lastIndexOf('.')) || galleryForm.url.name;
        generatedTitle = nameWithoutExt.replace(/[-_]/g, ' ');
      } else {
        generatedTitle = `${galleryForm.category} Photo - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      }
      
      // Capitalize first letter of each word
      generatedTitle = generatedTitle.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

      const galleryData = { ...galleryForm, title: generatedTitle, url };

      const res = await fetch(`${API_URL}/gallery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(galleryData)
      });
      if (res.ok) {
        setGalleryForm({ title: '', url: '', type: 'image', category: 'Concerts', isFeatured: false });
        setGalleryViewMode('list');
        loadData();
        confetti({ particleCount: 50, colors: ['#b89033', '#cca647', '#ffffff'] });
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to add gallery item.');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to connect to the server.');
    } finally {
      setContentSaving(false);
    }
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
        const data = await res.json();
        alert(data.message || 'Failed to delete gallery item.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to the server.');
    }
  };

  const handleAddTimeline = async (e) => {
    e.preventDefault();
    const isEditing = !!editingTimelineId;
    const url = isEditing ? `${API_URL}/timeline/${editingTimelineId}` : `${API_URL}/timeline`;
    const method = isEditing ? 'PUT' : 'POST';
    try {
      setContentSaving(true);
      const imageUrl = await uploadIfNeeded(timelineForm.image);
      const timelineData = { ...timelineForm, image: imageUrl };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(timelineData)
      });
      if (res.ok) {
        setTimelineForm({ year: '', title: '', description: '', image: '' });
        setEditingTimelineId(null);
        setTimelineViewMode('list');
        loadData();
        confetti({ particleCount: 50, colors: ['#b89033', '#cca647', '#ffffff'] });
      } else {
        const data = await res.json();
        alert(data.message || `Failed to ${isEditing ? 'update' : 'add'} timeline event.`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to the server.');
    } finally {
      setContentSaving(false);
    }
  };

  const handleStartEditTimeline = (evt) => {
    setEditingTimelineId(evt._id);
    setTimelineForm({
      year: evt.year || '',
      title: evt.title || '',
      description: evt.description || '',
      image: evt.image || ''
    });
    setTimelineViewMode('add');
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
        const data = await res.json();
        alert(data.message || 'Failed to delete timeline event.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to the server.');
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
        const data = await res.json();
        alert(data.message || 'Failed to update message.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to the server.');
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
        const data = await res.json();
        alert(data.message || 'Failed to delete message.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to the server.');
    }
  };

  /* =========================================================================
     LOGIN SCREEN RENDER
     ========================================================================= */

  const formatTime = (time) => {
    if (isNaN(time) || !isFinite(time)) return '00:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };



  /* =========================================================================
     LOGIN SCREEN RENDER
     ========================================================================= */

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex flex-col justify-center items-center px-6 relative overflow-hidden font-sans">
        {/* Animated Radial Background Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.06)_0%,transparent_75%)] pointer-events-none" />

        {/* Floating gradient circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full filter blur-[100px] pointer-events-none animate-pulse duration-[8s]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-[100px] pointer-events-none animate-pulse duration-[6s]" />

        <div className="w-full max-w-md bg-obsidian-900/60 backdrop-blur-xl border border-obsidian-700/40 p-8 rounded-2xl text-left shadow-2xl relative z-10">
          <div className="absolute top-[-26px] left-1/2 transform -translate-x-1/2 w-12 h-12 bg-obsidian-900 border border-gold-500/20 flex items-center justify-center text-gold-500 rounded-xl shadow-xl">
            <Lock size={18} />
          </div>

          <div className="text-center mt-2 mb-8 select-none">
            <span className="font-serif text-gold-gradient text-xl tracking-[0.2em] font-extrabold block">MIDHUN SAJI RAM</span>
            <span className="text-[8px] text-slate-500 uppercase tracking-widest mt-1.5 block font-bold font-mono">Administrative SaaS Portal</span>
            <div className="h-[1px] w-8 bg-gold-500/30 mx-auto mt-3.5"></div>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 text-xs rounded-lg mb-6 leading-relaxed flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0 text-red-500">⚠️</span>
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <FormField label="Username">
              <Input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </FormField>

            <FormField label="Password">
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </FormField>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gold-500 hover:bg-gold-600 disabled:bg-gold-500/50 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-gold-500/10 active:scale-[0.98] cursor-pointer mt-6"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <LogIn size={13} />
                  <span>Access Dashboard</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* =========================================================================
     MAIN SaaS DASHBOARD RENDER
     ========================================================================= */

  const streamData = getStreamPlaysData();

  return (
    <div className="min-h-screen bg-obsidian-950 text-obsidian-200 flex overflow-hidden font-sans">

      {/* Backdrop overlay on mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* 1. LEFT SIDEBAR PANEL (Desktop sticky, Mobile sliding drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 w-60 bg-obsidian-900 border-r border-obsidian-700/40 flex flex-col justify-between p-5 z-40 transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen shrink-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >

        <div className="space-y-6 text-left">
          {/* Logo Branding */}
          <div className="flex flex-col select-none border-b border-obsidian-700/40 pb-4">
            <span className="font-serif text-base tracking-[0.1em] font-extrabold text-gold-gradient">
              Midhun Saji Ram
            </span>
            <span className="text-[8px] tracking-[0.25em] text-slate-400 uppercase font-bold mt-1 font-mono">
              Artist Dashboard
            </span>
          </div>

          {/* Structured & Grouped Sidebar Navigation */}
          <div className="space-y-4">

            {/* OVERVIEW */}
            <div className="space-y-1">
              <span className="text-[8.5px] font-black uppercase tracking-widest text-slate-500 px-3 font-mono block select-none">
                Overview
              </span>
              <button
                onClick={() => handleTabSelect('dashboard')}
                className={`w-full px-3 py-2 rounded-lg text-xs uppercase tracking-wider font-bold flex items-center space-x-3 transition-all cursor-pointer ${activeTab === 'dashboard'
                    ? 'bg-gold-500/10 text-gold-500 border-l-2 border-gold-500 pl-2 rounded-l-none'
                    : 'hover:bg-obsidian-850 text-obsidian-500 hover:text-obsidian-100'
                  }`}
              >
                <BarChart3 size={14} />
                <span>Dashboard</span>
              </button>
            </div>

            {/* PORTFOLIO CONTENT */}
            <div className="space-y-1">
              <span className="text-[8.5px] font-black uppercase tracking-widest text-slate-500 px-3 font-mono block select-none">
                Portfolio Content
              </span>
              {[
                { id: 'songs', label: 'Music & Songs', icon: <Music size={14} /> },
                { id: 'short-films', label: 'Short Films', icon: <Video size={14} /> },
                { id: 'web-series', label: 'Web Series', icon: <Film size={14} /> },
                { id: 'tv-programs', label: 'TV Programs', icon: <Tv size={14} /> },
                { id: 'feature-films', label: 'Feature Films', icon: <Clapperboard size={14} /> },
                { id: 'independent-works', label: 'Independent Works', icon: <Sparkles size={14} /> },
                { id: 'gallery', label: 'Media Gallery', icon: <Image size={14} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelect(tab.id)}
                  className={`w-full px-3 py-2 rounded-lg text-xs uppercase tracking-wider font-bold flex items-center space-x-3 transition-all cursor-pointer ${activeTab === tab.id
                      ? 'bg-gold-500/10 text-gold-500 border-l-2 border-gold-500 pl-2 rounded-l-none'
                      : 'hover:bg-obsidian-850 text-obsidian-500 hover:text-obsidian-100'
                    }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* BRAND & JOURNEY */}
            <div className="space-y-1">
              <span className="text-[8.5px] font-black uppercase tracking-widest text-slate-500 px-3 font-mono block select-none">
                Brand & Journey
              </span>
              {[
                { id: 'timeline', label: 'Journey Roadmap', icon: <Calendar size={14} /> },
                { id: 'blog', label: 'Blog', icon: <FileText size={14} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelect(tab.id)}
                  className={`w-full px-3 py-2 rounded-lg text-xs uppercase tracking-wider font-bold flex items-center space-x-3 transition-all cursor-pointer ${activeTab === tab.id
                      ? 'bg-gold-500/10 text-gold-500 border-l-2 border-gold-500 pl-2 rounded-l-none'
                      : 'hover:bg-obsidian-850 text-obsidian-500 hover:text-obsidian-100'
                    }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* SYSTEM SETTINGS */}
            <div className="space-y-1">
              <span className="text-[8.5px] font-black uppercase tracking-widest text-slate-500 px-3 font-mono block select-none">
                System Settings
              </span>
              {[
                { id: 'enquiries', label: 'Booking Inbox', icon: <Mail size={14} />, badge: stats.unreadMessages },
                { id: 'site-content', label: 'Page Configurator', icon: <Settings size={14} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelect(tab.id)}
                  className={`w-full px-3 py-2 rounded-lg text-xs uppercase tracking-wider font-bold flex items-center justify-between transition-all cursor-pointer ${activeTab === tab.id
                      ? 'bg-gold-500/10 text-gold-500 border-l-2 border-gold-500 pl-2 rounded-l-none'
                      : 'hover:bg-obsidian-850 text-obsidian-500 hover:text-obsidian-100'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    {tab.icon}
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge > 0 && (
                    <span className="bg-gold-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Sidebar bottom persistent track player panel */}


      </aside>

      {/* 2. MAIN CORE CONTENT WRAPPER */}
      <main className="flex-1 bg-obsidian-950 flex flex-col h-screen overflow-hidden relative">

        {/* Top Control Bar */}
        <header className="h-14 border-b border-obsidian-700/30 px-6 flex items-center justify-between bg-obsidian-900/40 backdrop-blur-md z-20 shrink-0">
          <div className="flex items-center space-x-3">
            {/* Hamburger menu trigger */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 text-slate-400 hover:text-white lg:hidden rounded-lg hover:bg-obsidian-800 transition-colors cursor-pointer"
            >
              <Menu size={18} />
            </button>
            <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase font-mono hidden sm:inline-block">
              SYSTEM / {activeTab.replace('-', ' ')}
            </span>
          </div>

          {/* Right account & log out details */}
          <div className="flex items-center space-x-5">
            <button
              onClick={() => handleTabSelect('enquiries')}
              className="text-slate-400 hover:text-gold-500 transition-colors relative p-1.5 rounded-lg hover:bg-obsidian-800 cursor-pointer"
            >
              <Bell size={15} />
              {stats.unreadMessages > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-gold-500 rounded-full animate-ping" />
              )}
            </button>

            <div className="flex items-center space-x-2.5 border-l border-obsidian-700/40 pl-5 text-left select-none">
              <div className="w-7 h-7 rounded-lg border border-gold-500/20 overflow-hidden bg-obsidian-800">
                <img
                  src="data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;100&quot; height=&quot;100&quot; viewBox=&quot;0 0 100 100&quot;><rect width=&quot;100%&quot; height=&quot;100%&quot; fill=&quot;%23b89033&quot;/><text x=&quot;50%&quot; y=&quot;55%&quot; dominant-baseline=&quot;middle&quot; text-anchor=&quot;middle&quot; font-family=&quot;serif&quot; font-size=&quot;40&quot; font-weight=&quot;bold&quot; fill=&quot;%23ffffff&quot;>M</text></svg>"
                  alt="Admin Portrait"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <h5 className="text-[11px] font-bold text-obsidian-100 flex items-center">
                  <span>Midhun Saji Ram</span>
                  <ChevronDown size={11} className="ml-1 text-slate-500" />
                </h5>
                <p className="text-[8px] text-slate-500 uppercase tracking-wider font-semibold font-mono">Owner</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg border border-red-500/20 transition-all cursor-pointer"
              title="Log Out"
            >
              <LogOut size={13} />
            </button>
          </div>
        </header>

        {/* Scrollable Workspace Panel */}
        <div className="flex-1 p-6 overflow-y-auto min-w-0">

          {/* TAB 1: DASHBOARD ANALYTICS OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in text-left">

              {/* Heading */}
              <div>
                <h2 className="font-serif text-xl font-bold tracking-tight text-obsidian-100 flex items-center space-x-2">
                  <span>Welcome back, Midhun!</span>
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Here is a quick overview of your database metrics and stream stats.</p>
              </div>

              {/* Metric Counters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Songs', value: stats.songs, change: 'Manage compositions database', target: 'songs', bg: 'from-blue-600/10 to-transparent' },
                  { label: 'My Works', value: stats.mediaWorks, change: 'Manage cinematic works', target: 'media-works', bg: 'from-cyan-600/10 to-transparent' },
                  { label: 'Journey Milestones', value: stats.timelineEvents, change: 'View achievement roadmap', target: 'timeline', bg: 'from-purple-600/10 to-transparent' },
                  { label: 'Booking Inbox', value: stats.totalMessages, change: `${stats.unreadMessages} unread enquiry message(s)`, target: 'enquiries', alert: stats.unreadMessages > 0, bg: 'from-amber-600/10 to-transparent' }
                ].map((m, i) => (
                  <div
                    key={i}
                    onClick={() => handleMetricClick(m.target)}
                    className={`bg-obsidian-900 border border-obsidian-700/50 p-5 rounded-xl shadow-md cursor-pointer hover:border-gold-500/40  active:translate-y-0 transition-all bg-gradient-to-br ${m.bg}`}
                  >
                    <span className="text-[9.5px] uppercase tracking-widest text-slate-400 font-black block mb-2">{m.label}</span>
                    <div className="text-2xl font-bold text-obsidian-100 tracking-tight leading-none font-serif">{m.value}</div>
                    <span className={`text-[9.5px] mt-3.5 block font-bold uppercase tracking-wider ${m.alert ? 'text-gold-500 animate-pulse' : 'text-slate-500'}`}>
                      {m.change}
                    </span>
                  </div>
                ))}
              </div>

              {/* Center Dashboard Split panels */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

                {/* Plays Overview Graph Chart (using raw SVG paths for gorgeous curves) */}
                <div className="lg:col-span-8 bg-obsidian-900 border border-obsidian-700/50 p-6 rounded-xl shadow-md flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col text-left">
                      <h3 className="text-xs uppercase tracking-widest text-obsidian-100 font-black font-mono">Visitor Traffic Analytics</h3>
                      <span className="text-[9.5px] text-slate-400 font-medium mt-0.5">Total Site Visits: <strong className="text-blue-400 font-mono">{streamData.total}</strong></span>
                    </div>
                    <select
                      value={streamPeriod}
                      onChange={e => setStreamPeriod(e.target.value)}
                      className="bg-obsidian-950 border border-obsidian-700 text-[8.5px] uppercase tracking-widest px-2.5 py-1 text-slate-400 rounded-lg focus:outline-none cursor-pointer font-bold"
                    >
                      <option>This Week</option>
                      <option>This Month</option>
                    </select>
                  </div>
                  {/* Graphical line SVG */}
                  <div className="relative h-48 w-full mt-4 flex items-end">
                    <svg viewBox="0 0 500 200" className="w-full h-full text-gold-500 overflow-visible">
                      <defs>
                        <linearGradient id="curveGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-gold-500)" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="var(--color-gold-500)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(184,144,51,0.06)" strokeDasharray="3 3" />
                      <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(184,144,51,0.06)" strokeDasharray="3 3" />
                      <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(184,144,51,0.06)" strokeDasharray="3 3" />

                      {/* Glow Fill */}
                      <path d={streamData.glowPath} fill="url(#curveGlow)" />
                      {/* Main curve */}
                      <path d={streamData.linePath} fill="none" stroke="var(--color-gold-500)" strokeWidth="2.5" />

                      {/* Interactive dots */}
                      {streamData.coords.map((c, idx) => (
                        <circle
                          key={idx}
                          cx={c.x}
                          cy={c.y}
                          r={idx === streamData.coords.length - 1 ? "5" : "3.5"}
                          fill={idx === streamData.coords.length - 1 ? "var(--color-gold-500)" : "#090d16"}
                          stroke="var(--color-gold-500)"
                          strokeWidth="2"
                          className={idx === streamData.coords.length - 1 ? "animate-pulse" : ""}
                        />
                      ))}
                    </svg>

                    {/* Tooltip marker at peak */}
                    {streamData.coords.length > 0 && (
                      <div
                        className="absolute bg-obsidian-950 border border-obsidian-750 text-obsidian-100 px-2.5 py-1.5 rounded-lg shadow-xl pointer-events-none flex flex-col text-left transition-all duration-300"
                        style={{
                          top: '15%',
                          left: '42%'
                        }}
                      >
                        <span className="text-[7.5px] uppercase tracking-wider text-slate-500 font-bold">{streamData.peakDay} Peak</span>
                        <span className="text-[10px] font-bold text-obsidian-100 font-mono">{streamData.peak} Page Views</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-slate-500 mt-2 font-mono uppercase tracking-wider select-none">
                    {streamData.days.map((d, idx) => (
                      <span key={idx}>{d}</span>
                    ))}
                  </div>
                </div>

                {/* Blog Views analytics card */}
                <div className="lg:col-span-4 bg-obsidian-900 border border-obsidian-700/50 p-6 rounded-xl shadow-md flex flex-col justify-between text-left">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-obsidian-100 font-black font-mono">Popular Articles</h3>
                    <p className="text-[9.5px] text-slate-400 mt-0.5 mb-4">Top stories ranked by view metrics</p>
                    
                    <div className="space-y-3.5 max-h-[170px] overflow-y-auto pr-1">
                      {blogs.length === 0 ? (
                        <p className="text-slate-500 italic text-[10.5px]">No blog posts published yet.</p>
                      ) : (
                        blogs
                          .slice()
                          .sort((a, b) => (b.views || 0) - (a.views || 0))
                          .slice(0, 4)
                          .map((blog, idx) => (
                            <div key={blog._id} className="flex justify-between items-center text-[10.5px]">
                              <div className="flex items-center space-x-2 min-w-0">
                                <span className="w-4 h-4 bg-gold-500/10 text-gold-500 font-bold font-mono text-[8px] flex items-center justify-center rounded">
                                  {idx + 1}
                                </span>
                                <span className="text-slate-300 font-medium truncate max-w-[130px]">{blog.title}</span>
                              </div>
                              <span className="font-mono text-white font-semibold shrink-0">
                                {blog.views || 0} <span className="text-slate-500 text-[8.5px]">views</span>
                              </span>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t border-obsidian-800 pt-3 mt-4 flex justify-between items-center text-[10.5px]">
                    <span className="text-slate-400 uppercase tracking-widest text-[8.5px] font-bold">Total Blog Views</span>
                    <span className="font-mono font-bold text-gold-500 text-sm">
                      {blogs.reduce((acc, curr) => acc + (curr.views || 0), 0)}
                    </span>
                  </div>
                </div>

              </div>

              {/* Bottom split list panels */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Recent Added Table */}
                <div className="lg:col-span-7 bg-obsidian-900 border border-obsidian-700/50 p-5 rounded-xl shadow-md text-left flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-obsidian-100 font-black font-mono mb-4">Recent Added Content</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[11px] text-left">
                        <thead>
                          <tr className="text-slate-500 border-b border-obsidian-750 uppercase tracking-wider text-[8px] font-bold">
                            <th className="pb-2">Type</th>
                            <th className="pb-2">Title</th>
                            <th className="pb-2">Date Added</th>
                            <th className="pb-2">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-obsidian-750 text-obsidian-300">
                          {[
                            { type: 'Song', title: 'Ennin Nenjil (Acoustic)', date: 'June 10, 2026' },
                            { type: 'Album', title: 'Letters Unheard', date: 'June 08, 2026' },
                            { type: 'Gallery', title: 'Live in Cochin', date: 'June 07, 2026' },
                            { type: 'Blog', title: 'Story Behind Ennin Nenjil', date: 'June 05, 2026' }
                          ].map((row, idx) => (
                            <tr key={idx} className="hover:bg-obsidian-850/50 transition-colors">
                              <td className="py-2.5 font-bold text-gold-500 uppercase tracking-widest text-[8.5px] font-mono">{row.type}</td>
                              <td className="py-2.5 font-semibold text-obsidian-100 truncate max-w-[150px]">{row.title}</td>
                              <td className="py-2.5 text-slate-400 font-mono">{row.date}</td>
                              <td className="py-2.5">
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[8px] uppercase font-bold tracking-wider rounded-md font-mono">
                                  Live
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Recent Enquiries List */}
                <div className="lg:col-span-5 bg-obsidian-900 border border-obsidian-700/50 p-5 rounded-xl shadow-md text-left flex flex-col justify-between">
                  <h3 className="text-xs uppercase tracking-widest text-obsidian-100 font-black font-mono mb-4">Recent Enquiries</h3>

                  <div className="space-y-3">
                    {messages.slice(0, 3).map((msg) => (
                      <div key={msg._id} className="flex justify-between items-start space-x-3 bg-obsidian-950 p-3 border border-obsidian-700/40 rounded-lg">
                        <div className="flex items-start space-x-3 text-left min-w-0">
                          <div className="w-8 h-8 rounded-full bg-obsidian-800 overflow-hidden shrink-0 border border-gold-500/20 flex items-center justify-center text-xs font-bold text-gold-500">
                            {msg.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-bold text-[11px] text-obsidian-100 leading-tight truncate">{msg.name}</h5>
                            <p className="text-[9px] text-gold-500 uppercase tracking-wider font-semibold mt-1 truncate">{msg.subject}</p>
                          </div>
                        </div>
                        <span className="text-[7.5px] text-slate-500 font-mono shrink-0">Inbox</span>
                      </div>
                    ))}
                    {messages.length === 0 && (
                      <p className="text-xs text-slate-500 italic py-4">No recent bookings in mail.</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleTabSelect('enquiries')}
                    className="w-full text-center text-[8.5px] uppercase tracking-widest text-gold-500 hover:text-gold-600 mt-4.5 font-black flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Open Bookings Mailbox</span>
                    <ChevronRight size={10} />
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: SONGS / WORKS PORTFOLIO MANAGEMENT */}
          {activeTab === 'songs' && (
            <div className="space-y-6 animate-fade-in text-left">

              {/* Spacious Subheader Toggles */}
              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center border-b border-obsidian-700/30 pb-4 gap-4">
                <div>
                  <h2 className="text-lg font-bold text-obsidian-100 font-serif uppercase tracking-wider">Songs</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Manage and preview all compositions visible on your homepage Works panel.</p>
                </div>
                <div className="flex bg-obsidian-950 border border-obsidian-700/50 p-1 rounded-lg select-none">
                  <button
                    onClick={() => setSongsViewMode('list')}
                    className={`px-4 py-1.5 text-[9.5px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer ${songsViewMode === 'list'
                        ? 'bg-gold-500 text-white shadow-md'
                        : 'text-obsidian-500 hover:text-obsidian-100'
                      }`}
                  >
                    View Registry ({songs.length})
                  </button>
                  <button
                    onClick={() => setSongsViewMode('add')}
                    className={`px-4 py-1.5 text-[9.5px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer ${songsViewMode === 'add'
                        ? 'bg-gold-500 text-white shadow-md'
                        : 'text-obsidian-500 hover:text-obsidian-100'
                      }`}
                  >
                    Add New Song
                  </button>
                </div>
              </div>

              {songsViewMode === 'list' ? (
                <div className="bg-obsidian-900 border border-obsidian-700/50 p-6 rounded-xl space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-1">
                    {songs.map((song) => (
                      <div key={song._id} className="bg-obsidian-950 p-4 border border-obsidian-700/40 rounded-xl flex items-center justify-between hover:border-gold-500/25 transition-colors gap-4">
                        <div className="flex items-center space-x-4 text-left min-w-0">
                          <img src={song.coverUrl || 'data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;300&quot; height=&quot;300&quot; viewBox=&quot;0 0 300 300&quot;><rect width=&quot;100%&quot; height=&quot;100%&quot; fill=&quot;%230d0d0d&quot;/><circle cx=&quot;150&quot; cy=&quot;150&quot; r=&quot;80&quot; fill=&quot;none&quot; stroke=&quot;%23cca647&quot; stroke-width=&quot;1.5&quot;/><circle cx=&quot;150&quot; cy=&quot;150&quot; r=&quot;6&quot; fill=&quot;%23cca647&quot;/><text x=&quot;50%&quot; y=&quot;85%&quot; dominant-baseline=&quot;middle&quot; text-anchor=&quot;middle&quot; font-family=&quot;sans-serif&quot; font-size=&quot;11&quot; font-weight=&quot;bold&quot; letter-spacing=&quot;3&quot; fill=&quot;%23cca647&quot;>COMPOSITION</text></svg>'} className="w-12 h-12 object-cover rounded-lg border border-obsidian-750 shrink-0 shadow-md" alt="" />
                          <div className="min-w-0">
                            <h5 className="font-serif text-sm font-bold text-obsidian-100 truncate">{song.title}</h5>
                            <div className="flex items-center space-x-2 text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-1.5 font-mono">
                              <span className="text-gold-500 bg-gold-500/5 border border-gold-500/10 px-2 py-0.5 rounded-md">{song.category}</span>
                              {song.isFeatured && (
                                <span className="bg-blue-600/10 text-blue-400 border border-blue-600/20 px-2 py-0.5 rounded-md font-black">Featured on Slider</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteSong(song._id)}
                          className="text-slate-400 hover:text-red-550 p-2.5 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Delete Release"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {songs.length === 0 && (
                      <p className="text-xs text-slate-500 italic py-10 col-span-full text-center">No compositions recorded in registry database.</p>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAddSong} className="bg-obsidian-900 border border-obsidian-700/50 p-4 sm:p-5 rounded-xl space-y-3.5 w-full">
                  <div className="border-b border-obsidian-700/50 pb-3">
                    <h3 className="text-xs uppercase tracking-widest text-gold-500 font-black flex items-center space-x-2">
                      <Plus size={14} /> <span>Create New Composition Release</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Song Release Title">
                      <Input
                        type="text"
                        required
                        placeholder="e.g. Ennin Nenjil (Acoustic)"
                        value={songForm.title}
                        onChange={(e) => setSongForm({ ...songForm, title: e.target.value })}
                      />
                    </FormField>

                    <FormField label="Music Category">
                      <Select
                        value={songForm.category}
                        onChange={(e) => setSongForm({ ...songForm, category: e.target.value })}
                      >
                        <option value="Single">Single Release</option>
                        <option value="Album">Album Track</option>
                        <option value="Film Score">Film Score Composition</option>
                      </Select>
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Cover Artwork Image File">
                      <div className="flex gap-3 items-start">
                        {songForm.coverUrl && (
                          <div className="w-14 h-14 rounded-lg overflow-hidden border border-obsidian-750 shrink-0 shadow-md">
                            <img
                              src={getPreviewUrl(songForm.coverUrl)}
                              className="w-full h-full object-cover"
                              alt="Cover Preview"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <FileUpload
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'songCover')}
                            label="Upload cover picture"
                            value={songForm.coverUrl}
                          />
                          <Input
                            type="text"
                            placeholder="Or enter Image URL"
                            value={songForm.coverUrl}
                            onChange={(e) => setSongForm({ ...songForm, coverUrl: e.target.value })}
                            className="mt-1.5 bg-obsidian-950/70 border border-obsidian-850 px-3 py-2 text-[10.5px] text-obsidian-100 rounded-lg focus:outline-none"
                          />
                        </div>
                      </div>
                    </FormField>

                    <FormField label="Audio Track Preview File (.mp3)">
                      <FileUpload
                        accept="audio/*"
                        onChange={(e) => handleFileUpload(e, 'songAudio')}
                        label="Upload audio track"
                        value={songForm.audioUrl}
                      />
                      <Input
                        type="text"
                        placeholder="Or enter Audio URL"
                        value={songForm.audioUrl}
                        onChange={(e) => setSongForm({ ...songForm, audioUrl: e.target.value })}
                        className="mt-1.5 bg-obsidian-950/70 border border-obsidian-850 px-3 py-2 text-[10.5px] text-obsidian-100 rounded-lg focus:outline-none"
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Spotify Track Link">
                      <Input
                        type="text"
                        placeholder="https://open.spotify.com/track/..."
                        value={songForm.spotifyUrl}
                        onChange={(e) => setSongForm({ ...songForm, spotifyUrl: e.target.value })}
                      />
                    </FormField>

                    <FormField label="YouTube Streaming Link">
                      <Input
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={songForm.youtubeUrl || ''}
                        onChange={(e) => setSongForm({ ...songForm, youtubeUrl: e.target.value })}
                      />
                    </FormField>
                  </div>
                  <FormField label="Composition Description Notes">
                    <Textarea
                      placeholder="Notes about style, production credits, orchestration..."
                      rows={2}
                      value={songForm.description}
                      onChange={(e) => setSongForm({ ...songForm, description: e.target.value })}
                    />
                  </FormField>

                  <div className="flex items-center space-x-2.5 py-1 text-left">
                    <input
                      type="checkbox"
                      id="isFeaturedDashboard"
                      checked={songForm.isFeatured}
                      onChange={(e) => setSongForm({ ...songForm, isFeatured: e.target.checked })}
                      className="w-4 h-4 accent-gold-500 rounded-lg bg-obsidian-950 border border-obsidian-700 cursor-pointer"
                    />
                    <label htmlFor="isFeaturedDashboard" className="text-[10.5px] uppercase tracking-widest text-slate-400 cursor-pointer font-bold">
                      Feature release prominently on homepage slider
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setSongsViewMode('list')}
                      className="px-4 py-2 bg-obsidian-950 border border-obsidian-700 text-obsidian-500 hover:text-obsidian-100 text-[10.5px] font-bold uppercase tracking-widest rounded-lg cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={contentSaving}
                      className="px-5 py-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-bold text-[10.5px] uppercase tracking-widest rounded-lg cursor-pointer transition-all active:scale-[0.98] flex items-center space-x-1"
                    >
                      {contentSaving && <span className="animate-spin mr-1">⌛</span>}
                      <span>{contentSaving ? 'Uploading...' : 'Save Release'}</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

          {/* TAB: MEDIA & CINEMATIC WORKS CMS */}
          {['media-works', 'short-films', 'web-series', 'tv-programs', 'feature-films', 'independent-works'].includes(activeTab) && (() => {
            const filteredWorks = mediaWorks.filter(w => {
              if (activeTab === 'media-works') return true;
              return w.type === getTabWorkType(activeTab);
            });
            return (
              <div className="space-y-6 animate-fade-in text-left">

                {/* Subheader Toggles */}
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center border-b border-obsidian-700/30 pb-4 gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-obsidian-100 font-serif uppercase tracking-wider">{getTabLabel(activeTab)}</h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">Manage posters, video/audio assets, and release details for {getTabLabel(activeTab)} visible on the portfolio site.</p>
                  </div>
                  <div className="flex bg-obsidian-950 border border-obsidian-700/50 p-1 rounded-lg select-none">
                    <button
                      onClick={() => setMediaViewMode('list')}
                      className={`px-4 py-1.5 text-[9.5px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer ${mediaViewMode === 'list'
                          ? 'bg-gold-500 text-white shadow-md'
                          : 'text-obsidian-500 hover:text-obsidian-100'
                        }`}
                    >
                      View Releases ({filteredWorks.length})
                    </button>
                    <button
                      onClick={() => {
                        setMediaViewMode('add');
                        setMediaWorkForm({
                          title: '',
                          type: getTabWorkType(activeTab),
                          coverUrl: '',
                          videoUrl: '',
                          audioUrl: '',
                          mediaType: 'youtube',
                          releaseYear: '',
                          description: '',
                          isFeatured: false
                        });
                      }}
                      className={`px-4 py-1.5 text-[9.5px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer ${mediaViewMode === 'add'
                          ? 'bg-gold-500 text-white shadow-md'
                          : 'text-obsidian-500 hover:text-obsidian-100'
                        }`}
                    >
                      Add {getTabSingularLabel(activeTab)}
                    </button>
                  </div>
                </div>

                {mediaViewMode === 'list' ? (
                  <div className="bg-obsidian-900 border border-obsidian-700/50 p-6 rounded-xl space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-1">
                      {filteredWorks.map((work) => (
                        <div key={work._id} className="bg-obsidian-950 border border-obsidian-700/40 p-4 rounded-xl flex items-center justify-between gap-4 hover:border-gold-500/25 transition-colors">
                          <div className="flex items-center gap-4 min-w-0">
                            {work.coverUrl ? (
                              <img
                                src={work.coverUrl.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${work.coverUrl}` : work.coverUrl}
                                className="w-10 h-14 object-cover rounded-lg border border-obsidian-750 shrink-0 shadow"
                                alt=""
                              />
                            ) : (
                              <div className="w-10 h-14 bg-obsidian-900 border border-obsidian-850 rounded-lg flex items-center justify-center shrink-0 text-slate-500 text-[8px] font-black uppercase tracking-wider text-center p-1 font-mono">
                                No Cover
                              </div>
                            )}
                            <div className="min-w-0 text-left">
                              <h5 className="font-serif text-sm font-bold text-obsidian-100 truncate leading-snug">{work.title}</h5>
                              <div className="flex items-center space-x-2 text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-1.5 font-mono">
                                <span className="text-gold-500 bg-gold-500/5 border border-gold-500/10 px-2 py-0.5 rounded-md">
                                  {work.type === 'independent_work'
                                    ? `indie (${(!!work.audioUrl || /\.(mp3|wav)(?:\?|$)/i.test(work.videoUrl || '')) ? 'audio' : 'video'})`
                                    : work.type.replace('_', ' ')}
                                </span>
                                <span>&bull;</span>
                                <span>{work.releaseYear}</span>
                                {work.isFeatured && (
                                  <span className="text-blue-400 bg-blue-600/5 border border-blue-600/10 px-1.5 py-0.5 rounded-md font-black">Featured</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteMediaWork(work._id)}
                            className="text-slate-400 hover:text-red-500 p-2.5 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      {filteredWorks.length === 0 && (
                        <p className="text-xs text-slate-500 italic py-10 col-span-full text-center">No {getTabSingularLabel(activeTab).toLowerCase()} releases uploaded yet.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleAddMediaWork} className="bg-obsidian-900 border border-obsidian-700/50 p-4 sm:p-5 rounded-xl space-y-3.5 w-full">
                    <div className="border-b border-obsidian-700/50 pb-3">
                      <h3 className="text-xs uppercase tracking-widest text-gold-500 font-black flex items-center space-x-2">
                        <Plus size={14} /> <span>Create {getTabSingularLabel(activeTab)}</span>
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className={activeTab === 'media-works' ? "sm:col-span-2" : "sm:col-span-3"}>
                        <FormField label="Project Release Title">
                          <Input
                            type="text"
                            required
                            placeholder="e.g. Echoes of Silence"
                            value={mediaWorkForm.title}
                            onChange={(e) => setMediaWorkForm({ ...mediaWorkForm, title: e.target.value })}
                          />
                        </FormField>
                      </div>

                      {activeTab === 'media-works' && (
                        <FormField label="Work Category">
                          <Select
                            value={mediaWorkForm.type}
                            onChange={(e) => setMediaWorkForm({ ...mediaWorkForm, type: e.target.value })}
                          >
                            <option value="short_film">Short Film</option>
                            <option value="web_series">Web Series</option>
                            <option value="tv_program">TV Program</option>
                            <option value="movie">Feature Film</option>
                            <option value="independent_work">Independent Work</option>
                          </Select>
                        </FormField>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Release Year">
                        <Input
                          type="text"
                          required
                          placeholder="e.g. 2026"
                          value={mediaWorkForm.releaseYear}
                          onChange={(e) => setMediaWorkForm({ ...mediaWorkForm, releaseYear: e.target.value })}
                        />
                      </FormField>

                      {mediaWorkForm.type === 'independent_work' ? (
                        <FormField label="Independent Subtype">
                          <Select
                            value={independentSubtype}
                            onChange={(e) => setIndependentSubtype(e.target.value)}
                          >
                            <option value="video">Video Release</option>
                            <option value="audio">Audio Soundtrack</option>
                          </Select>
                        </FormField>
                      ) : (
                        <FormField label="Resource Hosting Type">
                          <Select
                            value={mediaWorkForm.mediaType}
                            onChange={(e) => setMediaWorkForm({ ...mediaWorkForm, mediaType: e.target.value })}
                          >
                            <option value="youtube">YouTube Video Link</option>
                            <option value="upload">User Uploaded Video/Audio File</option>
                            <option value="image_only">Poster Image Showcase Only</option>
                          </Select>
                        </FormField>
                      )}
                    </div>

                    {mediaWorkForm.type === 'independent_work' && independentSubtype === 'video' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="hidden sm:block"></div>
                        <FormField label="Video Host Resource">
                          <Select
                            value={mediaWorkForm.mediaType}
                            onChange={(e) => setMediaWorkForm({ ...mediaWorkForm, mediaType: e.target.value })}
                          >
                            <option value="youtube">YouTube Embed Link</option>
                            <option value="upload">Custom Media Upload</option>
                          </Select>
                        </FormField>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Cover Artwork Poster Artwork">
                        <div className="flex gap-3 items-start">
                          {mediaWorkForm.coverUrl && (
                            <div className="w-14 h-20 rounded-lg overflow-hidden border border-obsidian-750 shrink-0 shadow-md">
                              <img
                                src={getPreviewUrl(mediaWorkForm.coverUrl)}
                                className="w-full h-full object-cover"
                                alt="Cover Preview"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <FileUpload
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'mediaCover')}
                              label="Upload Poster Cover"
                              value={mediaWorkForm.coverUrl}
                            />
                            <Input
                              type="text"
                              placeholder="Or enter Image URL"
                              value={mediaWorkForm.coverUrl}
                              onChange={(e) => setMediaWorkForm({ ...mediaWorkForm, coverUrl: e.target.value })}
                              className="mt-1.5 bg-obsidian-950/70 border border-obsidian-850 px-3 py-2 text-[10.5px] text-obsidian-100 rounded-lg focus:outline-none"
                            />
                          </div>
                        </div>
                      </FormField>

                      {mediaWorkForm.mediaType !== 'image_only' && (
                        <>
                          {!(mediaWorkForm.type === 'independent_work' && independentSubtype === 'audio') ? (
                            <FormField label={mediaWorkForm.mediaType === 'youtube' ? 'YouTube Video URL' : 'Upload Video File'}>
                              <FileUpload
                                accept="video/*"
                                onChange={(e) => handleFileUpload(e, 'mediaVideo')}
                                label="Upload Video Clip"
                                value={mediaWorkForm.videoUrl}
                              />
                              <Input
                                type="text"
                                placeholder={mediaWorkForm.mediaType === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'Or enter video file URL'}
                                value={mediaWorkForm.videoUrl}
                                onChange={(e) => setMediaWorkForm({ ...mediaWorkForm, videoUrl: e.target.value })}
                                className="mt-1.5 bg-obsidian-950/70 border border-obsidian-850 px-3 py-2 text-[10.5px] text-obsidian-100 rounded-lg focus:outline-none"
                              />
                            </FormField>
                          ) : (
                            <FormField label="Soundtrack Upload (.mp3)">
                              <FileUpload
                                accept="audio/*"
                                onChange={(e) => handleFileUpload(e, 'mediaAudio')}
                                label="Upload Audio Soundtrack"
                                value={mediaWorkForm.audioUrl}
                              />
                              <Input
                                type="text"
                                placeholder="Or enter Audio URL"
                                value={mediaWorkForm.audioUrl}
                                onChange={(e) => setMediaWorkForm({ ...mediaWorkForm, audioUrl: e.target.value })}
                                className="mt-1.5 bg-obsidian-950/70 border border-obsidian-850 px-3 py-2 text-[10.5px] text-obsidian-100 rounded-lg focus:outline-none"
                              />
                            </FormField>
                          )}
                        </>
                      )}
                    </div>

                    <FormField label="Project Description details">
                      <Textarea
                        rows={2}
                        placeholder="Synopsis description, key crew members, roles composed..."
                        value={mediaWorkForm.description}
                        onChange={(e) => setMediaWorkForm({ ...mediaWorkForm, description: e.target.value })}
                      />
                    </FormField>

                    <div className="flex items-center space-x-2.5 py-1 text-left">
                      <input
                        type="checkbox"
                        id="mediaFeatured"
                        checked={mediaWorkForm.isFeatured}
                        onChange={(e) => setMediaWorkForm({ ...mediaWorkForm, isFeatured: e.target.checked })}
                        className="w-4 h-4 accent-gold-500 rounded-lg bg-obsidian-950 border border-obsidian-700 cursor-pointer"
                      />
                      <label htmlFor="mediaFeatured" className="text-[10.5px] uppercase tracking-widest text-slate-400 cursor-pointer font-bold">
                        Feature prominently on homepage releases section
                      </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setMediaViewMode('list')}
                        className="px-4 py-2 bg-obsidian-950 border border-obsidian-700 text-obsidian-500 hover:text-obsidian-100 text-[10.5px] font-bold uppercase tracking-widest rounded-lg cursor-pointer transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={contentSaving}
                        className="px-5 py-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-bold text-[10.5px] uppercase tracking-widest rounded-lg cursor-pointer transition-all active:scale-[0.98] flex items-center space-x-1"
                      >
                        {contentSaving && <span className="animate-spin mr-1">⌛</span>}
                        <span>{contentSaving ? 'Uploading...' : 'Save Release'}</span>
                      </button>
                    </div>
                  </form>
                )}

              </div>
            );
          })()}

          {/* TAB 3: MEDIA GALLERY CMS */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 animate-fade-in text-left">

              {/* Subheader Toggles */}
              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center border-b border-obsidian-700/30 pb-4 gap-4">
                <div>
                  <h2 className="text-lg font-bold text-obsidian-100 font-serif uppercase tracking-wider">Photo Gallery</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Manage live performance shoots and behind-the-scenes photography assets.</p>
                </div>
                <div className="flex bg-obsidian-950 border border-obsidian-700/50 p-1 rounded-lg select-none">
                  <button
                    onClick={() => setGalleryViewMode('list')}
                    className={`px-4 py-1.5 text-[9.5px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer ${galleryViewMode === 'list'
                        ? 'bg-gold-500 text-white shadow-md'
                        : 'text-obsidian-500 hover:text-obsidian-100'
                      }`}
                  >
                    View Photos ({gallery.length})
                  </button>
                  <button
                    onClick={() => setGalleryViewMode('add')}
                    className={`px-4 py-1.5 text-[9.5px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer ${galleryViewMode === 'add'
                        ? 'bg-gold-500 text-white shadow-md'
                        : 'text-obsidian-500 hover:text-obsidian-100'
                      }`}
                  >
                    Upload Photo
                  </button>
                </div>
              </div>

              {galleryViewMode === 'list' ? (
                <div className="bg-obsidian-900 border border-obsidian-700/50 p-6 rounded-xl space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[560px] overflow-y-auto pr-1">
                    {gallery.map((item) => (
                      <div key={item._id} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-obsidian-950 border border-obsidian-750/50 group shadow-md hover:border-gold-500/25 transition-all">
                        <img src={item.url || 'data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;400&quot; height=&quot;300&quot; viewBox=&quot;0 0 400 300&quot;><rect width=&quot;100%&quot; height=&quot;100%&quot; fill=&quot;%230d0d0d&quot;/><rect width=&quot;100%&quot; height=&quot;100%&quot; fill=&quot;none&quot; stroke=&quot;%23cca647&quot; stroke-width=&quot;1&quot;/><text x=&quot;50%&quot; y=&quot;50%&quot; dominant-baseline=&quot;middle&quot; text-anchor=&quot;middle&quot; font-family=&quot;sans-serif&quot; font-size=&quot;12&quot; fill=&quot;%23cca647&quot;>GALLERY EXHIBIT</text></svg>'} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3.5 text-left">
                          <span className="text-[8px] uppercase tracking-widest font-black font-mono text-gold-500 bg-gold-500/10 border border-gold-500/10 px-2 py-0.5 rounded-md w-max">
                            {item.category}
                          </span>
                          <div className="flex items-center justify-between gap-2 mt-auto w-full">
                            <span className="text-[11px] font-bold text-obsidian-100 truncate max-w-[120px]">{item.title}</span>
                            <button
                              onClick={() => handleDeleteGallery(item._id)}
                              className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer"
                              title="Delete Photo"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {gallery.length === 0 && (
                      <p className="text-xs text-slate-500 italic py-10 col-span-full text-center">No images uploaded to visual gallery registry.</p>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAddGalleryItem} className="bg-obsidian-900 border border-obsidian-700/50 p-4 sm:p-5 rounded-xl space-y-3.5 w-full">
                  <div className="border-b border-obsidian-700/50 pb-3">
                    <h3 className="text-xs uppercase tracking-widest text-gold-500 font-black flex items-center space-x-2">
                      <Plus size={14} /> <span>Upload Concert / Studio Photo Asset</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <FormField label="Gallery Category">
                      <Select
                        value={galleryForm.category}
                        onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                      >
                        <option value="Concerts">Live Performances</option>
                        <option value="Studio">Studio Recording Sessions</option>
                        <option value="Personal">Behind the Scenes Moments</option>
                      </Select>
                    </FormField>
                  </div>

                  <FormField label="Upload File / Image URL">
                    <FileUpload
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'galleryUrl')}
                      label="Upload Photo File"
                      value={galleryForm.url}
                    />
                    <Input
                      type="text"
                      placeholder="Or enter Image URL"
                      value={galleryForm.url}
                      onChange={(e) => setGalleryForm({ ...galleryForm, url: e.target.value })}
                      className="mt-1.5 bg-obsidian-950/70 border border-obsidian-850 px-3 py-2 text-[10px] text-obsidian-100 rounded-lg focus:outline-none"
                    />
                  </FormField>

                  <div className="flex justify-end space-x-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setGalleryViewMode('list')}
                      className="px-4 py-2 bg-obsidian-950 border border-obsidian-700 text-obsidian-500 hover:text-obsidian-100 text-[10.5px] font-bold uppercase tracking-widest rounded-lg cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={contentSaving}
                      className="px-5 py-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-bold text-[10.5px] uppercase tracking-widest rounded-lg cursor-pointer transition-all active:scale-[0.98] flex items-center space-x-1"
                    >
                      {contentSaving && <span className="animate-spin mr-1">⌛</span>}
                      <span>{contentSaving ? 'Uploading...' : 'Upload Picture'}</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

          {/* TAB 4: TIMELINE EVENTS MANAGEMENT */}
          {activeTab === 'timeline' && (
            <div className="space-y-6 animate-fade-in text-left">

              {/* Subheader Toggles */}
              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center border-b border-obsidian-700/30 pb-4 gap-4">
                <div>
                  <h2 className="text-lg font-bold text-obsidian-100 font-serif uppercase tracking-wider">Journey Roadmap</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Manage chronological timeline points, milestones, and awards shown on Journey details panel.</p>
                </div>
                <div className="flex bg-obsidian-950 border border-obsidian-700/50 p-1 rounded-lg select-none">
                  <button
                    onClick={() => setTimelineViewMode('list')}
                    className={`px-4 py-1.5 text-[9.5px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer ${timelineViewMode === 'list'
                        ? 'bg-gold-500 text-white shadow-md'
                        : 'text-obsidian-500 hover:text-obsidian-100'
                      }`}
                  >
                    View Milestones ({timeline.length})
                  </button>
                  <button
                    onClick={() => {
                      setTimelineViewMode('add');
                      setEditingTimelineId(null);
                      setTimelineForm({ year: '', title: '', description: '', image: '' });
                    }}
                    className={`px-4 py-1.5 text-[9.5px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer ${timelineViewMode === 'add'
                        ? 'bg-gold-500 text-white shadow-md'
                        : 'text-obsidian-500 hover:text-obsidian-100'
                      }`}
                  >
                    Add Milestone
                  </button>
                </div>
              </div>

              {timelineViewMode === 'list' ? (
                <div className="bg-obsidian-900 border border-obsidian-700/50 p-6 rounded-xl space-y-4">
                  <div className="relative pl-6 border-l border-obsidian-700/60 ml-2.5 space-y-5 max-h-[520px] overflow-y-auto py-2">
                    {timeline.map((evt) => (
                      <div key={evt._id} className="relative group text-left">
                        {/* Timeline circle node */}
                        <div className="absolute -left-[32.5px] top-2.5 w-3 h-3 rounded-full bg-gold-500 border-2 border-obsidian-900 shadow group-hover:scale-125 transition-transform" />

                        <div className="bg-obsidian-950 p-4.5 border border-obsidian-700/40 rounded-xl flex items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            {evt.image && (
                              <img
                                src={evt.image}
                                className="w-12 h-12 rounded-lg object-cover border border-obsidian-750 shrink-0 mt-0.5 animate-fade-in"
                                alt=""
                              />
                            )}
                            <div>
                              <div className="flex items-center space-x-2.5 font-mono">
                                <span className="text-xs font-black text-gold-500 tracking-widest">{evt.year}</span>
                                <span className="text-slate-600 text-[10px]">&bull;</span>
                                <span className="text-xs font-bold text-obsidian-100 uppercase tracking-wider">{evt.title}</span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed font-light">{evt.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 shrink-0 select-none">
                            <button
                              onClick={() => handleStartEditTimeline(evt)}
                              className="text-slate-400 hover:text-gold-500 p-2.5 hover:bg-gold-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Edit Milestone"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteTimeline(evt._id)}
                              className="text-slate-400 hover:text-red-500 p-2.5 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Delete Milestone"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {timeline.length === 0 && (
                      <p className="text-xs text-slate-500 italic py-6 pl-2">No journey timeline milestones recorded yet.</p>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAddTimeline} className="bg-obsidian-900 border border-obsidian-700/50 p-4 sm:p-5 rounded-xl space-y-3.5 w-full">
                  <div className="border-b border-obsidian-700/50 pb-3">
                    <h3 className="text-xs uppercase tracking-widest text-gold-500 font-black flex items-center space-x-2">
                      <Plus size={14} /> <span>{editingTimelineId ? 'Edit Journey Milestone Point' : 'Create Journey Milestone Point'}</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Left Column: Details */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <FormField label="Milestone Year">
                          <Input
                            type="text"
                            required
                            placeholder="e.g. 2026"
                            value={timelineForm.year}
                            onChange={(e) => setTimelineForm({ ...timelineForm, year: e.target.value })}
                          />
                        </FormField>
                        <div className="col-span-2">
                          <FormField label="Milestone Header Name">
                            <Input
                              type="text"
                              required
                              placeholder="e.g. Winner at Golden Award Music Festival"
                              value={timelineForm.title}
                              onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })}
                            />
                          </FormField>
                        </div>
                      </div>

                      <FormField label="Milestone Description Narrative">
                        <Textarea
                          required
                          placeholder="Detail information about what this milestone includes..."
                          rows={4}
                          value={timelineForm.description}
                          onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })}
                          className="h-[105px]"
                        />
                      </FormField>
                    </div>

                    {/* Right Column: Image and Preview */}
                    <div className="space-y-3.5 flex flex-col justify-between">
                      <FormField label="Milestone Image Artwork">
                        <FileUpload
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'timelineImage')}
                          label="Upload Milestone Image"
                          value={timelineForm.image}
                        />
                        <Input
                          type="text"
                          placeholder="Or enter Image URL"
                          value={timelineForm.image}
                          onChange={(e) => setTimelineForm({ ...timelineForm, image: e.target.value })}
                          className="mt-1.5 bg-obsidian-950/70 border border-obsidian-850 px-3 py-2 text-[10.5px] text-obsidian-100 rounded-lg focus:outline-none"
                        />
                      </FormField>
                      
                      <div className="flex-1 flex flex-col justify-center items-center border border-dashed border-obsidian-800 rounded-lg bg-obsidian-950 p-2 min-h-[90px] mt-2.5">
                        {timelineForm.image ? (
                          <img 
                            src={getPreviewUrl(timelineForm.image)} 
                            className="w-24 h-24 object-cover rounded-lg animate-fade-in border border-obsidian-750" 
                            alt="Milestone Preview" 
                          />
                        ) : (
                          <span className="text-[10px] text-slate-500 italic font-mono uppercase tracking-widest text-center">No image selected</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setTimelineViewMode('list');
                        setEditingTimelineId(null);
                        setTimelineForm({ year: '', title: '', description: '', image: '' });
                      }}
                      className="px-4 py-2 bg-obsidian-950 border border-obsidian-700 text-obsidian-500 hover:text-obsidian-100 text-[10.5px] font-bold uppercase tracking-widest rounded-lg cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={contentSaving}
                      className="px-5 py-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[10.5px] uppercase tracking-widest rounded-lg cursor-pointer transition-all active:scale-[0.98] flex items-center space-x-1.5"
                    >
                      {contentSaving && <span className="animate-spin mr-1">⌛</span>}
                      <span>{contentSaving ? 'Saving...' : (editingTimelineId ? 'Save Changes' : 'Save Milestone')}</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

          {/* TAB 5: BLOG Reflections PUBLISHING CMS */}
          {activeTab === 'blog' && (
            <div className="space-y-6 animate-fade-in text-left">

              {/* Subheader Toggles */}
              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center border-b border-obsidian-700/30 pb-4 gap-4">
                <div>
                  <h2 className="text-lg font-bold text-obsidian-100 font-serif uppercase tracking-wider">Blog</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Create and format stories, behind-the-scenes diaries, and reflections behind compositions.</p>
                </div>
                <div className="flex bg-obsidian-950 border border-obsidian-700/50 p-1 rounded-lg select-none">
                  <button
                    onClick={() => setBlogViewMode('list')}
                    className={`px-4 py-1.5 text-[9.5px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer ${blogViewMode === 'list'
                        ? 'bg-gold-500 text-white shadow-md'
                        : 'text-obsidian-500 hover:text-obsidian-100'
                      }`}
                  >
                    All Blogs ({blogs.length})
                  </button>
                  <button
                    onClick={() => setBlogViewMode('add')}
                    className={`px-4 py-1.5 text-[9.5px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer ${blogViewMode === 'add'
                        ? 'bg-gold-500 text-white shadow-md'
                        : 'text-obsidian-500 hover:text-obsidian-100'
                      }`}
                  >
                    Write Blog
                  </button>
                </div>
              </div>

              {blogViewMode === 'list' ? (
                <div className="bg-obsidian-900 border border-obsidian-700/50 p-6 rounded-xl space-y-4">
                  <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
                    {blogs.map((blog) => (
                      <div key={blog._id} className="bg-obsidian-950 p-4 border border-obsidian-700/40 rounded-xl flex items-center justify-between gap-4 hover:border-gold-500/25 transition-colors">
                        <div className="text-left min-w-0">
                          <h5 className="font-serif text-sm font-bold text-obsidian-100 truncate leading-snug">{blog.title}</h5>
                          <div className="flex items-center space-x-2.5 text-[8.5px] uppercase tracking-wider text-slate-500 font-bold mt-1.5 font-mono">
                            <span className="flex items-center gap-1"><Clock size={10} /> {blog.readingTime}</span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1 text-slate-400 font-mono">
                              <Eye size={10} className="text-gold-500" /> {blog.views || 0} views
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handlePreviewBlog(blog)}
                            className="text-slate-400 hover:text-gold-500 p-2 hover:bg-gold-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Preview Article"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditBlog(blog)}
                            className="text-slate-400 hover:text-blue-500 p-2 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Edit Article"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBlog(blog._id)}
                            className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete Article"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {blogs.length === 0 && (
                      <p className="text-xs text-slate-500 italic py-10 text-center">No blog stories published yet.</p>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAddBlog} className="bg-obsidian-900 border border-obsidian-700/50 p-4 sm:p-5 rounded-xl space-y-3.5 w-full">
                  <div className="border-b border-obsidian-700/50 pb-3 flex justify-between items-center">
                    <h3 className="text-xs uppercase tracking-widest text-gold-500 font-black flex items-center space-x-2">
                      <Plus size={14} /> <span>Compose Reflection Article</span>
                    </h3>
                    <div className="flex bg-obsidian-950 border border-obsidian-750 p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setBlogPreviewMode(false)}
                        className={`px-3 py-1 text-[8.5px] font-black uppercase tracking-widest rounded-md ${!blogPreviewMode ? 'text-gold-500 bg-gold-500/10' : 'text-obsidian-500 hover:text-obsidian-100'}`}
                      >
                        Write
                      </button>
                      <button
                        type="button"
                        onClick={() => setBlogPreviewMode(true)}
                        className={`px-3 py-1 text-[8.5px] font-black uppercase tracking-widest rounded-md ${blogPreviewMode ? 'text-gold-500 bg-gold-500/10' : 'text-obsidian-500 hover:text-obsidian-100'}`}
                      >
                        Preview
                      </button>
                    </div>
                  </div>

                  {blogPreviewMode ? (
                    <div className="bg-obsidian-950 border border-obsidian-700/60 rounded-xl p-5 min-h-[360px] text-left">
                      {blogForm.coverUrl && (
                        <img src={getPreviewUrl(blogForm.coverUrl)} className="w-full h-44 object-cover rounded-lg mb-4 border border-obsidian-750 shadow-md" alt="" />
                      )}
                      <div className="flex items-center gap-2 mb-2 font-mono">
                        <span className="text-[9px] text-slate-500 font-bold flex items-center gap-1"><Clock size={10} /> {blogForm.readingTime}</span>
                      </div>
                      <h2 className="font-serif text-lg font-bold text-obsidian-100 mb-2 leading-tight">{blogForm.title || 'Untitled Article'}</h2>
                      <p className="text-[10.5px] text-slate-400 italic mb-4 font-light">{blogForm.excerpt || 'No summary excerpt provided.'}</p>
                      <div
                        className="text-xs text-slate-300 space-y-3.5 leading-relaxed border-t border-obsidian-700/40 pt-4"
                        dangerouslySetInnerHTML={{ __html: blogForm.content || '<p className="text-slate-500 italic">No content written yet.</p>' }}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <FormField label="Article Headline Title">
                        <Input
                          type="text"
                          required
                          placeholder="e.g. Behind the Score of Letters Unheard"
                          value={blogForm.title}
                          onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                        />
                      </FormField>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField label="Banner Cover Photo URL">
                          <Input
                            type="text"
                            placeholder="https://images.cloudinary.com/..."
                            value={blogForm.coverUrl}
                            onChange={(e) => setBlogForm({ ...blogForm, coverUrl: e.target.value })}
                          />
                        </FormField>
                        <FormField label="Reading Time Estimate">
                          <Input
                            type="text"
                            placeholder="e.g. 5 mins"
                            value={blogForm.readingTime}
                            onChange={(e) => setBlogForm({ ...blogForm, readingTime: e.target.value })}
                          />
                        </FormField>
                      </div>

                      <FormField label="Short Summary/Excerpt">
                        <Input
                          type="text"
                          required
                          placeholder="Excerpt preview shown on the list page..."
                          value={blogForm.excerpt}
                          onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                        />
                      </FormField>

                      <FormField label="Article Content (Supports HTML, e.g. <p>, <em>, <strong>)">
                        <Textarea
                          required
                          placeholder="Type story content body..."
                          rows={6}
                          value={blogForm.content}
                          onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                          className="font-mono text-[11px] leading-relaxed"
                        />
                      </FormField>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setBlogViewMode('list');
                        setEditingBlogId(null);
                        setBlogForm({ title: '', category: 'Reflection', coverUrl: '', excerpt: '', content: '', readingTime: '4 mins', isPublished: true });
                      }}
                      className="px-4 py-2 bg-obsidian-950 border border-obsidian-700 text-obsidian-500 hover:text-obsidian-100 text-[10.5px] font-bold uppercase tracking-widest rounded-lg cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={contentSaving}
                      className="px-5 py-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-bold text-[10.5px] uppercase tracking-widest rounded-lg cursor-pointer transition-all active:scale-[0.98] flex items-center space-x-1"
                    >
                      {contentSaving && <span className="animate-spin mr-1">⌛</span>}
                      <span>{contentSaving ? 'Saving...' : (editingBlogId ? 'Save Changes' : 'Publish Story')}</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

          {/* TAB 6: BOOKING INBOX MESSAGES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-5 animate-fade-in text-left">
              <div>
                <h3 className="font-serif text-lg font-bold text-obsidian-100 flex items-center gap-2">
                  <Mail size={16} className="text-gold-500" />
                  <span>Booking & Inquiry Mailbox</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Manage messages from clients, concert organizers, and collaborations.</p>
              </div>

              {messages.length === 0 ? (
                <div className="bg-obsidian-900 border border-obsidian-700/50 p-12 rounded-xl text-center shadow">
                  <span className="text-4xl">✉️</span>
                  <p className="text-xs text-slate-500 italic mt-3">Mailbox is empty. No messages received yet.</p>
                </div>
              ) : (
                <div className="space-y-3.5 max-w-4xl">
                  {messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`p-5 rounded-xl border transition-all ${msg.status === 'unread'
                          ? 'bg-gold-500/5 border-gold-500/30 shadow-[0_4px_20px_rgba(37,99,235,0.04)]'
                          : 'bg-obsidian-900 border-obsidian-700/50 hover:border-obsidian-750'
                        }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                        <div className="text-left">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-xs text-obsidian-100">{msg.name}</span>
                            <span className="text-slate-500 text-[10px] font-mono">&lt;{msg.email}&gt;</span>
                            {msg.status === 'unread' && (
                              <span className="bg-gold-500 text-white text-[7.5px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full animate-pulse">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-[9px] text-gold-500 uppercase tracking-widest mt-1.5 font-black font-mono">
                            Subject: {msg.subject || 'General Inquiry'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] select-none">
                          {msg.status === 'unread' && (
                            <button
                              onClick={() => handleMarkMessageRead(msg._id)}
                              className="text-gold-500 hover:text-gold-600 font-bold uppercase tracking-widest text-[8.5px] flex items-center space-x-1.5 p-1.5 hover:bg-gold-500/10 rounded-lg cursor-pointer"
                            >
                              <CheckCircle2 size={12} />
                              <span>Mark Read</span>
                            </button>
                          )}
                          <a
                            href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Inquiry'}&body=Hi ${msg.name},`}
                            className="bg-gold-500/10 text-gold-500 border border-gold-500/25 hover:bg-gold-500 hover:text-white px-2.5 py-1 text-[9px] uppercase font-bold tracking-widest rounded-lg flex items-center gap-1 transition-all"
                          >
                            <MessageSquare size={10} />
                            <span>Reply</span>
                          </a>
                          <button
                            onClick={() => handleDeleteMessage(msg._id)}
                            className="text-slate-500 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete enquiry message"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-light mt-4 border-t border-obsidian-700/50 pt-4 text-left whitespace-pre-wrap">
                        {msg.message}
                      </p>

                      {msg.phone && (
                        <div className="text-[9.5px] text-slate-500 mt-3 font-mono flex items-center space-x-1">
                          <span>Phone:</span>
                          <span className="text-slate-300 font-semibold">{msg.phone}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'site-content' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-obsidian-700/40 pb-4">
                <div>
                  <h2 className="font-serif text-xl font-bold tracking-tight text-obsidian-100 flex items-center space-x-2">
                    <Settings size={18} className="text-gold-500" />
                    <span>Page Content Editor</span>
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Configure biography narratives, FAQs, and contact credentials shown on your landing website.</p>
                </div>

                {/* Dropdown page selector on right-top */}
                <div className="relative min-w-[220px]">
                  <select
                    value={activeContentSection}
                    onChange={e => setActiveContentSection(e.target.value)}
                    className="w-full bg-obsidian-950 border border-obsidian-700/60 text-obsidian-100 px-4 py-2.5 rounded-lg text-[10px] uppercase tracking-widest font-black focus:outline-none focus:border-gold-500 cursor-pointer shadow-md appearance-none pr-10"
                  >
                    {[
                      { id: 'hero', label: 'Hero Cover' },
                      { id: 'about', label: 'About Story' },
                      { id: 'father_legacy', label: "Father's Legacy" },
                      { id: 'footer', label: 'Footer Links' },
                      { id: 'faqs', label: 'FAQs Config' }
                    ].map(tab => (
                      <option key={tab.id} value={tab.id} className="bg-obsidian-950 text-obsidian-100">
                        {tab.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gold-500">
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>

              {/* Settings sheets */}
              <div className="w-full">

                {/* ===== HERO SECTION EDITOR ===== */}
                {activeContentSection === 'hero' && (
                  <div className="bg-obsidian-900 border border-obsidian-700/50 p-4 sm:p-5 rounded-xl space-y-3 shadow">
                    <div className="flex items-center justify-between border-b border-obsidian-700/40 pb-3">
                      <h3 className="text-xs uppercase tracking-widest text-gold-500 font-black">Hero Header Cover settings</h3>
                      {contentSaveSuccess === 'hero' && <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8.5px] uppercase tracking-widest font-black px-2 py-0.5 rounded font-mono animate-pulse">✓ Saved Settings</span>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Subtitle Banner Tagline">
                        <Input type="text" value={heroForm.subtitle} onChange={e => setHeroForm({ ...heroForm, subtitle: e.target.value })} placeholder="The Sound. The Story." />
                      </FormField>
                      <FormField label="Signature Name">
                        <Input type="text" value={heroForm.signature} onChange={e => setHeroForm({ ...heroForm, signature: e.target.value })} placeholder="Midhun Saji Ram" />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField label="Title Line 1">
                        <Input type="text" value={heroForm.titleLine1} onChange={e => setHeroForm({ ...heroForm, titleLine1: e.target.value })} placeholder="A Legacy" />
                      </FormField>
                      <FormField label="Title Line 2">
                        <Input type="text" value={heroForm.titleLine2} onChange={e => setHeroForm({ ...heroForm, titleLine2: e.target.value })} placeholder="He Gave." />
                      </FormField>
                      <FormField label="Title Line 3 (Italic highlight)">
                        <Input type="text" value={heroForm.titleLine3} onChange={e => setHeroForm({ ...heroForm, titleLine3: e.target.value })} placeholder="A Voice I Carry." />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Main Brief Narrative">
                        <Textarea rows={2} value={heroForm.description} onChange={e => setHeroForm({ ...heroForm, description: e.target.value })} placeholder="From the melodies Saji Ram created..." />
                      </FormField>

                      <FormField label="Prominent Quote Text">
                        <Textarea rows={2} value={heroForm.quote} onChange={e => setHeroForm({ ...heroForm, quote: e.target.value })} placeholder='"He wrote the scores..."' />
                      </FormField>
                    </div>

                    <FormField label="Hero Wallpaper Image">
                      <FileUpload accept="image/*" onChange={e => handleSiteContentImageUpload(e, 'hero', 'heroImage')} label="Upload Cover Photo" value={heroForm.heroImage} />
                      <Input type="text" value={heroForm.heroImage} onChange={e => setHeroForm({ ...heroForm, heroImage: e.target.value })} placeholder="Or Enter Image URL" className="mt-1.5 bg-obsidian-950/70 border border-obsidian-850 px-3 py-2 text-[10px] text-obsidian-100 rounded-lg focus:outline-none" />
                    </FormField>

                    <div className="flex justify-end pt-2">
                      <button onClick={() => saveSiteContentSection('hero', heroForm)} disabled={contentSaving} className="px-5 py-2.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-all flex items-center space-x-2 cursor-pointer shadow-lg active:scale-98 shadow-gold-500/10">
                        <Save size={13} />
                        <span>{contentSaving ? 'Saving...' : 'Save Settings'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ===== ABOUT SECTION EDITOR ===== */}
                {activeContentSection === 'about' && (
                  <div className="bg-obsidian-900 border border-obsidian-700/50 p-4 sm:p-5 rounded-xl space-y-3 shadow">
                    <div className="flex items-center justify-between border-b border-obsidian-700/40 pb-3">
                      <h3 className="text-xs uppercase tracking-widest text-gold-500 font-black">Biography Narrative Details</h3>
                      {contentSaveSuccess === 'about' && <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8.5px] uppercase tracking-widest font-black px-2 py-0.5 rounded font-mono animate-pulse">✓ Saved Settings</span>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Subtitle Section label">
                        <Input type="text" value={aboutForm.subtitle} onChange={e => setAboutForm({ ...aboutForm, subtitle: e.target.value })} placeholder="Biography Story" />
                      </FormField>
                      <FormField label="Headline statement (use \n for line breaks)">
                        <Input type="text" value={aboutForm.title} onChange={e => setAboutForm({ ...aboutForm, title: e.target.value })} placeholder="Melodies bridging cinematic scores..." />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Biographical Narrative Paragraph 1">
                        <Textarea rows={3} value={aboutForm.paragraph1} onChange={e => setAboutForm({ ...aboutForm, paragraph1: e.target.value })} />
                      </FormField>

                      <FormField label="Secondary Paragraph 2">
                        <Textarea rows={3} value={aboutForm.paragraph2} onChange={e => setAboutForm({ ...aboutForm, paragraph2: e.target.value })} />
                      </FormField>
                    </div>

                    <FormField label="Portrait Studio Cover Image">
                      <FileUpload accept="image/*" onChange={e => handleSiteContentImageUpload(e, 'about', 'portraitImage')} label="Upload portrait image file" value={aboutForm.portraitImage} />
                      <Input type="text" value={aboutForm.portraitImage} onChange={e => setAboutForm({ ...aboutForm, portraitImage: e.target.value })} placeholder="Or Enter Image URL" className="mt-1.5 bg-obsidian-950/70 border border-obsidian-850 px-3 py-2 text-[10px] text-obsidian-100 rounded-lg focus:outline-none" />
                    </FormField>

                    {/* Stats Editor */}
                    <div className="space-y-2 text-left">
                      <label className="block text-[9.5px] uppercase tracking-widest text-slate-400 font-bold">Achievements counters</label>
                      <div className="grid grid-cols-1 gap-2.5">
                        {(aboutForm.stats || []).map((stat, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-obsidian-950 border border-obsidian-700/40 p-3.5 rounded-lg">
                            <Select value={stat.iconName} onChange={e => { const newStats = [...aboutForm.stats]; newStats[idx].iconName = e.target.value; setAboutForm({ ...aboutForm, stats: newStats }); }}>
                              <option value="Music">Music Disc Icon</option>
                              <option value="Award">Achievement Award</option>
                              <option value="Users">Artists Collaborated</option>
                              <option value="Heart">Aesthetic Heart</option>
                            </Select>
                            <Input type="text" value={stat.value} onChange={e => { const newStats = [...aboutForm.stats]; newStats[idx].value = e.target.value; setAboutForm({ ...aboutForm, stats: newStats }); }} placeholder="Value (e.g. 50+)" className="sm:w-24 shrink-0" />
                            <Input type="text" value={stat.label} onChange={e => { const newStats = [...aboutForm.stats]; newStats[idx].label = e.target.value; setAboutForm({ ...aboutForm, stats: newStats }); }} placeholder="Stat Name Label (e.g. Songs Composed)" />
                            <button onClick={() => { const newStats = aboutForm.stats.filter((_, i) => i !== idx); setAboutForm({ ...aboutForm, stats: newStats }); }} className="text-slate-455 hover:text-red-550 p-2 hover:bg-red-550/10 rounded transition-colors cursor-pointer shrink-0"><Trash2 size={13} /></button>
                          </div>
                        ))}
                        <button onClick={() => setAboutForm({ ...aboutForm, stats: [...(aboutForm.stats || []), { iconName: 'Music', value: '', label: '' }] })} className="text-gold-500 hover:text-gold-600 text-[9px] uppercase tracking-widest font-black flex items-center space-x-1 cursor-pointer py-1.5 w-max select-none">
                          <Plus size={12} /><span>Add Counter Stat</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button onClick={() => saveSiteContentSection('about', aboutForm)} disabled={contentSaving} className="px-5 py-2.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-all flex items-center space-x-2 cursor-pointer shadow-lg active:scale-98 shadow-gold-500/10">
                        <Save size={13} />
                        <span>{contentSaving ? 'Saving...' : 'Save Settings'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ===== FATHER'S LEGACY EDITOR ===== */}
                {activeContentSection === 'father_legacy' && (
                  <div className="bg-obsidian-900 border border-obsidian-700/50 p-4 sm:p-5 rounded-xl space-y-3 shadow">
                    <div className="flex items-center justify-between border-b border-obsidian-700/40 pb-3">
                      <h3 className="text-xs uppercase tracking-widest text-gold-500 font-black">Father's Musical Legacy Settings</h3>
                      {contentSaveSuccess === 'father_legacy' && <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8.5px] uppercase tracking-widest font-black px-2 py-0.5 rounded font-mono animate-pulse">✓ Saved Settings</span>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Subtitle Banner Header">
                        <Input type="text" value={legacyForm.subtitle} onChange={e => setLegacyForm({ ...legacyForm, subtitle: e.target.value })} placeholder="Saji Ram legacy" />
                      </FormField>
                      <FormField label="Headline statement (use \n for line breaks)">
                        <Input type="text" value={legacyForm.title} onChange={e => setLegacyForm({ ...legacyForm, title: e.target.value })} placeholder="Before I found my voice..." />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Biographical Description Paragraph 1">
                        <Textarea rows={3} value={legacyForm.paragraph1} onChange={e => setLegacyForm({ ...legacyForm, paragraph1: e.target.value })} />
                      </FormField>

                      <FormField label="Secondary Description Paragraph 2">
                        <Textarea rows={3} value={legacyForm.paragraph2} onChange={e => setLegacyForm({ ...legacyForm, paragraph2: e.target.value })} />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Main Legacy Background Photo">
                        <FileUpload accept="image/*" onChange={e => handleSiteContentImageUpload(e, 'father_legacy', 'mainImage')} label="Upload Main Photo" value={legacyForm.mainImage} />
                        <Input type="text" value={legacyForm.mainImage} onChange={e => setLegacyForm({ ...legacyForm, mainImage: e.target.value })} placeholder="Or Enter Image URL" className="mt-1.5 bg-obsidian-950/70 border border-obsidian-850 px-3 py-2 text-[10px] text-obsidian-100 rounded-lg focus:outline-none" />
                      </FormField>
                      <FormField label="Polaroid Visual Image">
                        <FileUpload accept="image/*" onChange={e => handleSiteContentImageUpload(e, 'father_legacy', 'polaroidImage')} label="Upload Polaroid Photo" value={legacyForm.polaroidImage} />
                        <Input type="text" value={legacyForm.polaroidImage} onChange={e => setLegacyForm({ ...legacyForm, polaroidImage: e.target.value })} placeholder="Or Enter Image URL" className="mt-1.5 bg-obsidian-950/70 border border-obsidian-850 px-3 py-2 text-[10px] text-obsidian-100 rounded-lg focus:outline-none" />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Polaroid Caption text">
                        <Input type="text" value={legacyForm.polaroidCaption} onChange={e => setLegacyForm({ ...legacyForm, polaroidCaption: e.target.value })} placeholder="e.g. Saji Ram" />
                      </FormField>
                      <FormField label="Cursive Script signature line">
                        <Input type="text" value={legacyForm.cursiveText} onChange={e => setLegacyForm({ ...legacyForm, cursiveText: e.target.value })} placeholder="e.g. A legacy that lives on..." />
                      </FormField>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button onClick={() => saveSiteContentSection('father_legacy', legacyForm)} disabled={contentSaving} className="px-5 py-2.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-all flex items-center space-x-2 cursor-pointer shadow-lg active:scale-98 shadow-gold-500/10">
                        <Save size={13} />
                        <span>{contentSaving ? 'Saving...' : 'Save Settings'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ===== FOOTER EDITOR ===== */}
                {activeContentSection === 'footer' && (
                  <div className="bg-obsidian-900 border border-obsidian-700/50 p-4 sm:p-5 rounded-xl space-y-3 shadow">
                    <div className="flex items-center justify-between border-b border-obsidian-700/40 pb-3">
                      <h3 className="text-xs uppercase tracking-widest text-gold-500 font-black">Footer Info & Contact channels</h3>
                      {contentSaveSuccess === 'footer' && <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8.5px] uppercase tracking-widest font-black px-2 py-0.5 rounded font-mono animate-pulse">✓ Saved Settings</span>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Brand Header Name">
                        <Input type="text" value={footerForm.brandName} onChange={e => setFooterForm({ ...footerForm, brandName: e.target.value })} placeholder="Midhun Saji Ram" />
                      </FormField>
                      <FormField label="Brand Tagline text label">
                        <Input type="text" value={footerForm.brandTagline} onChange={e => setFooterForm({ ...footerForm, brandTagline: e.target.value })} placeholder="Music Director & Composer" />
                      </FormField>
                    </div>

                    <FormField label="Bottom Brand Description text">
                      <Textarea rows={2} value={footerForm.description} onChange={e => setFooterForm({ ...footerForm, description: e.target.value })} />
                    </FormField>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Booking Inquiry Email">
                        <Input type="email" value={footerForm.bookingEmail} onChange={e => setFooterForm({ ...footerForm, bookingEmail: e.target.value })} placeholder="bookings@midhunsajiram.com" />
                      </FormField>
                      <FormField label="Artist Base Location">
                        <Input type="text" value={footerForm.location} onChange={e => setFooterForm({ ...footerForm, location: e.target.value })} placeholder="Kochi, Kerala, India" />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField label="Spotify Artist URL">
                        <Input type="text" value={footerForm.spotifyUrl} onChange={e => setFooterForm({ ...footerForm, spotifyUrl: e.target.value })} placeholder="https://spotify.com" />
                      </FormField>
                      <FormField label="YouTube Studio URL">
                        <Input type="text" value={footerForm.youtubeUrl} onChange={e => setFooterForm({ ...footerForm, youtubeUrl: e.target.value })} placeholder="https://youtube.com" />
                      </FormField>
                      <FormField label="Instagram Profile URL">
                        <Input type="text" value={footerForm.instagramUrl} onChange={e => setFooterForm({ ...footerForm, instagramUrl: e.target.value })} placeholder="https://instagram.com" />
                      </FormField>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button onClick={() => saveSiteContentSection('footer', footerForm)} disabled={contentSaving} className="px-5 py-2.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-all flex items-center space-x-2 cursor-pointer shadow-lg active:scale-98 shadow-gold-500/10">
                        <Save size={13} />
                        <span>{contentSaving ? 'Saving...' : 'Save Settings'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ===== FAQ MANAGER ===== */}
                {activeContentSection === 'faqs' && (
                  <div className="bg-obsidian-900 border border-obsidian-700/50 p-4 sm:p-5 rounded-xl space-y-3 shadow">
                    <div className="flex items-center justify-between border-b border-obsidian-700/40 pb-3">
                      <h3 className="text-xs uppercase tracking-widest text-gold-500 font-black">FAQ Accordion Listings</h3>
                      {contentSaveSuccess === 'faqs' && <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8.5px] uppercase tracking-widest font-black px-2 py-0.5 rounded font-mono animate-pulse">✓ Saved Settings</span>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Section subtitle mini header">
                        <Input type="text" value={faqsForm.subtitle} onChange={e => setFaqsForm({ ...faqsForm, subtitle: e.target.value })} placeholder="FAQs" />
                      </FormField>
                      <FormField label="Accordion segment title">
                        <Input type="text" value={faqsForm.title} onChange={e => setFaqsForm({ ...faqsForm, title: e.target.value })} placeholder="Frequently Asked Questions" />
                      </FormField>
                    </div>

                    {/* Existing FAQ Items */}
                    <div className="space-y-3.5 pt-2 text-left">
                      <label className="block text-[9.5px] uppercase tracking-widest text-slate-400 font-bold">Questions & Answers ({(faqsForm.items || []).length})</label>
                      {(faqsForm.items || []).map((item, idx) => (
                        <div key={idx} className="bg-obsidian-950 border border-obsidian-700/40 p-4 rounded-xl space-y-3 relative group">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 space-y-2.5">
                              <Input type="text" value={item.question} onChange={e => { const items = [...faqsForm.items]; items[idx].question = e.target.value; setFaqsForm({ ...faqsForm, items }); }} placeholder="Question Title Topic" />
                              <Textarea rows={2} value={item.answer} onChange={e => { const items = [...faqsForm.items]; items[idx].answer = e.target.value; setFaqsForm({ ...faqsForm, items }); }} placeholder="Answer description details" />
                            </div>
                            <div className="flex flex-col gap-1 shrink-0 select-none pt-2 font-mono">
                              {idx > 0 && (
                                <button onClick={() => { const items = [...faqsForm.items];[items[idx - 1], items[idx]] = [items[idx], items[idx - 1]]; setFaqsForm({ ...faqsForm, items }); }} className="text-slate-455 hover:text-gold-500 p-1.5 hover:bg-obsidian-850 rounded text-xs cursor-pointer" title="Move Up">▲</button>
                              )}
                              {idx < (faqsForm.items || []).length - 1 && (
                                <button onClick={() => { const items = [...faqsForm.items];[items[idx], items[idx + 1]] = [items[idx + 1], items[idx]]; setFaqsForm({ ...faqsForm, items }); }} className="text-slate-455 hover:text-gold-500 p-1.5 hover:bg-obsidian-850 rounded text-xs cursor-pointer" title="Move Down">▼</button>
                              )}
                              <button onClick={() => { const items = faqsForm.items.filter((_, i) => i !== idx); setFaqsForm({ ...faqsForm, items }); }} className="text-slate-500 hover:text-red-500 p-1.5 hover:bg-red-550/10 rounded transition-colors cursor-pointer" title="Delete FAQ"><Trash2 size={13} /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add New FAQ */}
                    <div className="bg-obsidian-950 border border-gold-500/20 p-4.5 rounded-xl space-y-3.5 mt-4">
                      <label className="block text-[9.5px] uppercase tracking-widest text-gold-500 font-black">Create a new FAQ Node</label>
                      <Input type="text" value={newFaqQuestion} onChange={e => setNewFaqQuestion(e.target.value)} placeholder="Enter new FAQ question..." />
                      <Textarea rows={2} value={newFaqAnswer} onChange={e => setNewFaqAnswer(e.target.value)} placeholder="Enter detailed FAQ answer narrative..." />
                      <button onClick={() => { if (newFaqQuestion.trim() && newFaqAnswer.trim()) { setFaqsForm({ ...faqsForm, items: [...(faqsForm.items || []), { question: newFaqQuestion, answer: newFaqAnswer }] }); setNewFaqQuestion(''); setNewFaqAnswer(''); } }} className="text-gold-500 hover:text-gold-600 text-[9px] uppercase tracking-widest font-black flex items-center space-x-1 cursor-pointer py-1 select-none">
                        <Plus size={12} /><span>Add Node</span>
                      </button>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button onClick={() => saveSiteContentSection('faqs', faqsForm)} disabled={contentSaving} className="px-5 py-2.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-all flex items-center space-x-2 cursor-pointer shadow-lg active:scale-98 shadow-gold-500/10">
                        <Save size={13} />
                        <span>{contentSaving ? 'Saving...' : 'Save Settings'}</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <footer className="h-10 border-t border-obsidian-750 px-6 flex items-center justify-between text-[9px] text-slate-500 bg-obsidian-900/10 shrink-0 select-none">
          <span>&copy; {new Date().getFullYear()} Midhun Saji Ram. All Rights Reserved.</span>

        </footer>

      </main>

    </div>
  );
}
