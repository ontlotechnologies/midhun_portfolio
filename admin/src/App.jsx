/* eslint-disable react/prop-types, no-unused-vars, react/no-unescaped-entities */
import confetti from 'canvas-confetti';
import {
  BarChart3,
  Bell,
  Calendar,
  ChevronDown,
  Clapperboard,
  FileText,
  Film,
  Image,
  Lock,
  LogIn, LogOut,
  Mail,
  Menu, Music,
  Settings,
  Sparkles,
  Tv,
  Video
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Import shared form components and helper utilities
import { FormField, Input } from './components/Common';
import { getTabWorkType, getYoutubeId } from './utils/helpers';

// Import dashboard components
import BlogSection from './components/BlogSection';
import DashboardSection from './components/DashboardSection';
import EnquiriesSection from './components/EnquiriesSection';
import GallerySection from './components/GallerySection';
import MediaWorksSection from './components/MediaWorksSection';
import SiteContentSection from './components/SiteContentSection';
import SongsSection from './components/SongsSection';
import TimelineSection from './components/TimelineSection';

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
  const [blogForm, setBlogForm] = useState({ title: '', category: 'Reflection', coverUrl: '', excerpt: '', content: '', isPublished: true });
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
        setBlogForm({ title: '', category: 'Reflection', coverUrl: '', excerpt: '', content: '', isPublished: true });
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
            <DashboardSection
              stats={stats}
              blogs={blogs}
              songs={songs}
              mediaWorks={mediaWorks}
              gallery={gallery}
              messages={messages}
              streamPeriod={streamPeriod}
              setStreamPeriod={setStreamPeriod}
              streamData={streamData}
              handleMetricClick={handleMetricClick}
              handleTabSelect={handleTabSelect}
            />
          )}

          {/* TAB 2: SONGS / WORKS PORTFOLIO MANAGEMENT */}
          {activeTab === 'songs' && (
            <SongsSection
              songsViewMode={songsViewMode}
              setSongsViewMode={setSongsViewMode}
              songs={songs}
              handleDeleteSong={handleDeleteSong}
              handleAddSong={handleAddSong}
              songForm={songForm}
              setSongForm={setSongForm}
              contentSaving={contentSaving}
              handleFileUpload={handleFileUpload}
            />
          )}

          {/* TAB: MEDIA & CINEMATIC WORKS CMS */}
          {['media-works', 'short-films', 'web-series', 'tv-programs', 'feature-films', 'independent-works'].includes(activeTab) && (
            <MediaWorksSection
              activeTab={activeTab}
              mediaWorks={mediaWorks}
              mediaViewMode={mediaViewMode}
              setMediaViewMode={setMediaViewMode}
              mediaWorkForm={mediaWorkForm}
              setMediaWorkForm={setMediaWorkForm}
              independentSubtype={independentSubtype}
              setIndependentSubtype={setIndependentSubtype}
              handleDeleteMediaWork={handleDeleteMediaWork}
              handleAddMediaWork={handleAddMediaWork}
              contentSaving={contentSaving}
              handleFileUpload={handleFileUpload}
              API_URL={API_URL}
            />
          )}

          {/* TAB 3: MEDIA GALLERY CMS */}
          {activeTab === 'gallery' && (
            <GallerySection
              gallery={gallery}
              galleryViewMode={galleryViewMode}
              setGalleryViewMode={setGalleryViewMode}
              galleryForm={galleryForm}
              setGalleryForm={setGalleryForm}
              handleDeleteGallery={handleDeleteGallery}
              handleAddGalleryItem={handleAddGalleryItem}
              contentSaving={contentSaving}
              handleFileUpload={handleFileUpload}
            />
          )}

          {/* TAB 4: TIMELINE EVENTS MANAGEMENT */}
          {activeTab === 'timeline' && (
            <TimelineSection
              timeline={timeline}
              timelineViewMode={timelineViewMode}
              setTimelineViewMode={setTimelineViewMode}
              timelineForm={timelineForm}
              setTimelineForm={setTimelineForm}
              editingTimelineId={editingTimelineId}
              setEditingTimelineId={setEditingTimelineId}
              handleDeleteTimeline={handleDeleteTimeline}
              handleAddTimeline={handleAddTimeline}
              handleStartEditTimeline={handleStartEditTimeline}
              contentSaving={contentSaving}
              handleFileUpload={handleFileUpload}
            />
          )}

          {/* TAB 5: BLOG Reflections PUBLISHING CMS */}
          {activeTab === 'blog' && (
            <BlogSection
              blogs={blogs}
              blogViewMode={blogViewMode}
              setBlogViewMode={setBlogViewMode}
              blogPreviewMode={blogPreviewMode}
              setBlogPreviewMode={setBlogPreviewMode}
              blogForm={blogForm}
              setBlogForm={setBlogForm}
              editingBlogId={editingBlogId}
              setEditingBlogId={setEditingBlogId}
              handlePreviewBlog={handlePreviewBlog}
              handleEditBlog={handleEditBlog}
              handleDeleteBlog={handleDeleteBlog}
              handleAddBlog={handleAddBlog}
              contentSaving={contentSaving}
              handleFileUpload={handleFileUpload}
            />
          )}

          {/* TAB 6: BOOKING INBOX MESSAGES */}
          {activeTab === 'enquiries' && (
            <EnquiriesSection
              messages={messages}
              handleMarkMessageRead={handleMarkMessageRead}
              handleDeleteMessage={handleDeleteMessage}
            />
          )}

          {/* TAB 7: SITE CONTENT CONFIGURATION */}
          {activeTab === 'site-content' && (
            <SiteContentSection
              activeContentSection={activeContentSection}
              setActiveContentSection={setActiveContentSection}
              contentSaveSuccess={contentSaveSuccess}
              contentSaving={contentSaving}
              heroForm={heroForm}
              setHeroForm={setHeroForm}
              aboutForm={aboutForm}
              setAboutForm={setAboutForm}
              legacyForm={legacyForm}
              setLegacyForm={setLegacyForm}
              footerForm={footerForm}
              setFooterForm={setFooterForm}
              faqsForm={faqsForm}
              setFaqsForm={setFaqsForm}
              newFaqQuestion={newFaqQuestion}
              setNewFaqQuestion={setNewFaqQuestion}
              newFaqAnswer={newFaqAnswer}
              setNewFaqAnswer={setNewFaqAnswer}
              handleSiteContentImageUpload={handleSiteContentImageUpload}
              saveSiteContentSection={saveSiteContentSection}
            />
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
