const mongoose = require('mongoose');

// Song Schema
const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'Single' }, // e.g. Single, Album, Film Composition, Performance
  coverUrl: { type: String, default: '' },
  audioUrl: { type: String, default: '' },
  spotifyUrl: { type: String, default: '' },
  youtubeUrl: { type: String, default: '' },
  releaseDate: { type: Date, default: Date.now },
  description: { type: String, default: '' },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

// Blog Schema
const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  coverUrl: { type: String, default: '' },
  category: { type: String, default: 'Reflection' }, // e.g., Reflection, BTS, Legacy
  isPublished: { type: Boolean, default: true },
  readingTime: { type: String, default: '3 mins' }
}, { timestamps: true });

// Gallery Schema
const GallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ['image', 'video'], default: 'image' },
  category: { type: String, default: 'Concerts' }, // e.g., Concerts, Studio, Personal
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

// Timeline Schema
const TimelineSchema = new mongoose.Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: '' }
}, { timestamps: true });

// Message Schema
const MessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  subject: { type: String, default: '' },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read'], default: 'unread' }
}, { timestamps: true });

// Admin Schema
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
}, { timestamps: true });

module.exports = {
  Song: mongoose.model('Song', SongSchema),
  Blog: mongoose.model('Blog', BlogSchema),
  GalleryItem: mongoose.model('GalleryItem', GallerySchema),
  TimelineEvent: mongoose.model('TimelineEvent', TimelineSchema),
  ContactMessage: mongoose.model('ContactMessage', MessageSchema),
  Admin: mongoose.model('Admin', AdminSchema)
};
