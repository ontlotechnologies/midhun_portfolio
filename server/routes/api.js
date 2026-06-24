const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Song, Blog, GalleryItem, TimelineEvent, ContactMessage, Admin, MediaWork } = require('../models/Schemas');

// JWT Secret Key (in prod should be loaded from .env)
const JWT_SECRET = process.env.JWT_SECRET || 'MIDHUN_SAJI_RAM_SECRET_KEY_123';

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

// Multer File Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit for video/audio
});

// File upload endpoint (requires auth)
router.post('/upload', authMiddleware, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // Return relative URL (e.g. /uploads/filename.ext)
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, fileUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
});

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

    const songs = await Song.find().sort({ releaseDate: -1 });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch songs', error: error.message });
  }
});

// Create song
router.post('/songs', authMiddleware, async (req, res) => {
  try {

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

    const items = await GalleryItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch gallery items', error: error.message });
  }
});

// Create gallery item
router.post('/gallery', authMiddleware, async (req, res) => {
  try {

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

    const items = await TimelineEvent.find().sort({ year: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch timeline', error: error.message });
  }
});

// Create timeline event
router.post('/timeline', authMiddleware, async (req, res) => {
  try {

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

    const item = await TimelineEvent.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Timeline event not found' });
    res.json({ success: true, message: 'Timeline event deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete timeline event', error: error.message });
  }
});


/* =========================================================================
   MEDIA WORKS ROUTES
   ========================================================================= */

// Get all media works
router.get('/media-works', async (req, res) => {
  try {
    const type = req.query.type;
    const query = type ? { type } : {};
    const works = await MediaWork.find(query).sort({ releaseYear: -1, createdAt: -1 });
    res.json(works);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch media works', error: error.message });
  }
});

// Get a single media work
router.get('/media-works/:id', async (req, res) => {
  try {
    const work = await MediaWork.findById(req.params.id);
    if (!work) return res.status(404).json({ success: false, message: 'Media work not found' });
    res.json(work);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch media work', error: error.message });
  }
});

// Create a media work (Admin only)
router.post('/media-works', authMiddleware, async (req, res) => {
  try {
    const work = new MediaWork(req.body);
    await work.save();
    res.status(201).json({ success: true, data: work });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create media work', error: error.message });
  }
});

// Update a media work (Admin only)
router.put('/media-works/:id', authMiddleware, async (req, res) => {
  try {
    const work = await MediaWork.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!work) return res.status(404).json({ success: false, message: 'Media work not found' });
    res.json({ success: true, data: work });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update media work', error: error.message });
  }
});

// Delete a media work (Admin only)
router.delete('/media-works/:id', authMiddleware, async (req, res) => {
  try {
    const work = await MediaWork.findByIdAndDelete(req.params.id);
    if (!work) return res.status(404).json({ success: false, message: 'Media work not found' });
    res.json({ success: true, message: 'Media work deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete media work', error: error.message });
  }
});


/* =========================================================================
   MESSAGES / CONTACT INQUIRIES ROUTES
   ========================================================================= */

// Submit a contact form
router.post('/messages', async (req, res) => {
  try {

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

    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages', error: error.message });
  }
});

// Mark message as read (Admin only)
router.put('/messages/:id', authMiddleware, async (req, res) => {
  try {

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

    const songCount = await Song.countDocuments();
    const blogCount = await Blog.countDocuments();
    const galleryCount = await GalleryItem.countDocuments();
    const timelineCount = await TimelineEvent.countDocuments();
    const mediaWorkCount = await MediaWork.countDocuments();
    const messageCount = await ContactMessage.countDocuments();
    const unreadMessageCount = await ContactMessage.countDocuments({ status: 'unread' });

    res.json({
      success: true,
      stats: {
        songs: songCount,
        blogs: blogCount,
        galleryItems: galleryCount,
        timelineEvents: timelineCount,
        mediaWorks: mediaWorkCount,
        totalMessages: messageCount,
        unreadMessages: unreadMessageCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load stats', error: error.message });
  }
});

module.exports = router;
