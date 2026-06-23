const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { Song, Blog, GalleryItem, TimelineEvent, ContactMessage, Admin } = require('../models/Schemas');
const MockDb = require('../mockData');

// JWT Secret Key (in prod should be loaded from .env)
const JWT_SECRET = process.env.JWT_SECRET || 'MIDHUN_SAJI_RAM_SECRET_KEY_123';

// Fallback check
const useMock = () => mongoose.connection.readyState !== 1;

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

/* =========================================================================
   AUTH ROUTES
   ========================================================================= */

// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username and password' });
    }

    if (useMock()) {
      const isMatch = MockDb.verifyAdmin(username, password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials (Demo Mode)' });
      }
      const token = jwt.sign({ id: 'demo_admin', username: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ success: true, token, admin: { id: 'demo_admin', username: 'admin' } });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, admin: { id: admin._id, username: admin.username } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
});

// Admin Verify Token
router.get('/admin/verify', authMiddleware, (req, res) => {
  res.json({ success: true, admin: req.admin });
});


/* =========================================================================
   SONGS ROUTES
   ========================================================================= */

// Get all songs
router.get('/songs', async (req, res) => {
  try {
    if (useMock()) {
      return res.json(MockDb.getSongs());
    }
    const songs = await Song.find().sort({ releaseDate: -1 });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch songs', error: error.message });
  }
});

// Create song
router.post('/songs', authMiddleware, async (req, res) => {
  try {
    if (useMock()) {
      const song = MockDb.createSong(req.body);
      return res.status(201).json({ success: true, data: song });
    }
    const song = new Song(req.body);
    await song.save();
    res.status(201).json({ success: true, data: song });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create song', error: error.message });
  }
});

// Update song
router.put('/songs/:id', authMiddleware, async (req, res) => {
  try {
    if (useMock()) {
      const song = MockDb.updateSong(req.params.id, req.body);
      if (!song) return res.status(404).json({ success: false, message: 'Song not found' });
      return res.json({ success: true, data: song });
    }
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });
    res.json({ success: true, data: song });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update song', error: error.message });
  }
});

// Delete song
router.delete('/songs/:id', authMiddleware, async (req, res) => {
  try {
    if (useMock()) {
      const deleted = MockDb.deleteSong(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Song not found' });
      return res.json({ success: true, message: 'Song deleted successfully' });
    }
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });
    res.json({ success: true, message: 'Song deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete song', error: error.message });
  }
});


/* =========================================================================
   BLOGS ROUTES
   ========================================================================= */

// Get all blogs
router.get('/blogs', async (req, res) => {
  try {
    if (useMock()) {
      return res.json(MockDb.getBlogs(req.query.all === 'true'));
    }
    const query = req.query.all === 'true' ? {} : { isPublished: true };
    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch blogs', error: error.message });
  }
});

// Get blog by slug
router.get('/blogs/:slug', async (req, res) => {
  try {
    if (useMock()) {
      const blog = MockDb.getBlogBySlug(req.params.slug);
      if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found' });
      return res.json(blog);
    }
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch blog post', error: error.message });
  }
});

// Create blog
router.post('/blogs', authMiddleware, async (req, res) => {
  try {
    if (useMock()) {
      const blog = MockDb.createBlog(req.body);
      return res.status(201).json({ success: true, data: blog });
    }
    const { title } = req.body;
    let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Ensure unique slug
    let existing = await Blog.findOne({ slug });
    let count = 1;
    while (existing) {
      slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${count}`;
      existing = await Blog.findOne({ slug });
      count++;
    }

    const blog = new Blog({ ...req.body, slug });
    await blog.save();
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create blog post', error: error.message });
  }
});

// Update blog
router.put('/blogs/:id', authMiddleware, async (req, res) => {
  try {
    if (useMock()) {
      const blog = MockDb.updateBlog(req.params.id, req.body);
      if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found' });
      return res.json({ success: true, data: blog });
    }
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found' });
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update blog post', error: error.message });
  }
});

// Delete blog
router.delete('/blogs/:id', authMiddleware, async (req, res) => {
  try {
    if (useMock()) {
      const deleted = MockDb.deleteBlog(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Blog post not found' });
      return res.json({ success: true, message: 'Blog post deleted successfully' });
    }
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found' });
    res.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete blog post', error: error.message });
  }
});


/* =========================================================================
   GALLERY ROUTES
   ========================================================================= */

// Get gallery items
router.get('/gallery', async (req, res) => {
  try {
    if (useMock()) {
      return res.json(MockDb.getGallery());
    }
    const items = await GalleryItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch gallery items', error: error.message });
  }
});

// Create gallery item
router.post('/gallery', authMiddleware, async (req, res) => {
  try {
    if (useMock()) {
      const item = MockDb.createGalleryItem(req.body);
      return res.status(201).json({ success: true, data: item });
    }
    const item = new GalleryItem(req.body);
    await item.save();
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create gallery item', error: error.message });
  }
});

// Delete gallery item
router.delete('/gallery/:id', authMiddleware, async (req, res) => {
  try {
    if (useMock()) {
      const deleted = MockDb.deleteGalleryItem(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Gallery item not found' });
      return res.json({ success: true, message: 'Gallery item deleted' });
    }
    const item = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete gallery item', error: error.message });
  }
});


/* =========================================================================
   TIMELINE ROUTES
   ========================================================================= */

// Get timeline items
router.get('/timeline', async (req, res) => {
  try {
    if (useMock()) {
      return res.json(MockDb.getTimeline());
    }
    const items = await TimelineEvent.find().sort({ year: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch timeline', error: error.message });
  }
});

// Create timeline event
router.post('/timeline', authMiddleware, async (req, res) => {
  try {
    if (useMock()) {
      const item = MockDb.createTimelineEvent(req.body);
      return res.status(201).json({ success: true, data: item });
    }
    const item = new TimelineEvent(req.body);
    await item.save();
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create timeline event', error: error.message });
  }
});

// Delete timeline event
router.delete('/timeline/:id', authMiddleware, async (req, res) => {
  try {
    if (useMock()) {
      const deleted = MockDb.deleteTimelineEvent(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Timeline event not found' });
      return res.json({ success: true, message: 'Timeline event deleted' });
    }
    const item = await TimelineEvent.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Timeline event not found' });
    res.json({ success: true, message: 'Timeline event deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete timeline event', error: error.message });
  }
});


/* =========================================================================
   MESSAGES / CONTACT INQUIRIES ROUTES
   ========================================================================= */

// Submit a contact form
router.post('/messages', async (req, res) => {
  try {
    if (useMock()) {
      const msg = MockDb.createMessage(req.body);
      return res.status(201).json({ success: true, message: 'Message sent successfully! (Demo Mode)' });
    }
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }
    const newMessage = new ContactMessage(req.body);
    await newMessage.save();
    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to submit message', error: error.message });
  }
});

// Get all messages (Admin only)
router.get('/messages', authMiddleware, async (req, res) => {
  try {
    if (useMock()) {
      return res.json(MockDb.getMessages());
    }
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages', error: error.message });
  }
});

// Mark message as read (Admin only)
router.put('/messages/:id', authMiddleware, async (req, res) => {
  try {
    if (useMock()) {
      const msg = MockDb.markMessageRead(req.params.id);
      if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
      return res.json({ success: true, data: msg });
    }
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id, 
      { status: 'read' }, 
      { new: true }
    );
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update message', error: error.message });
  }
});

// Delete message (Admin only)
router.delete('/messages/:id', authMiddleware, async (req, res) => {
  try {
    if (useMock()) {
      const deleted = MockDb.deleteMessage(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Message not found' });
      return res.json({ success: true, message: 'Message deleted' });
    }
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete message', error: error.message });
  }
});

/* =========================================================================
   SYSTEM STATS ROUTE (Admin Dashboard Summary)
   ========================================================================= */

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    if (useMock()) {
      return res.json({
        success: true,
        stats: MockDb.getStats()
      });
    }
    const songCount = await Song.countDocuments();
    const blogCount = await Blog.countDocuments();
    const galleryCount = await GalleryItem.countDocuments();
    const timelineCount = await TimelineEvent.countDocuments();
    const messageCount = await ContactMessage.countDocuments();
    const unreadMessageCount = await ContactMessage.countDocuments({ status: 'unread' });

    res.json({
      success: true,
      stats: {
        songs: songCount,
        blogs: blogCount,
        galleryItems: galleryCount,
        timelineEvents: timelineCount,
        totalMessages: messageCount,
        unreadMessages: unreadMessageCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load stats', error: error.message });
  }
});

module.exports = router;
