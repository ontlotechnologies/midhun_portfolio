const bcrypt = require('bcryptjs');

// Pre-hash password 'admin123'
const salt = bcrypt.genSaltSync(10);
const passwordHash = bcrypt.hashSync('admin123', salt);

// Mock DB Storage
let dataStore = {
  admin: {
    username: 'admin',
    passwordHash: passwordHash
  },
  songs: [
    {
      _id: 'song_1',
      title: 'Ennin Nenjil',
      category: 'Single',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      spotifyUrl: 'https://spotify.com',
      youtubeUrl: 'https://youtube.com',
      releaseDate: new Date('2024-05-15'),
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
      releaseDate: new Date('2023-11-10'),
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
      releaseDate: new Date('2024-04-12'),
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
      releaseDate: new Date('2022-08-20'),
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
      releaseDate: new Date('2021-12-01'),
      description: 'The award-winning debut music album featuring 8 tracks of pure melodic bliss and independent storytelling.',
      isFeatured: true
    }
  ],
  blogs: [
    {
      _id: 'blog_1',
      title: 'The Song That Still Carries His Name',
      slug: 'the-song-that-still-carries-his-name',
      excerpt: 'Some songs do not end when the final note fades. They echo across generations, bridging a father\'s genius with a son\'s voice.',
      content: '<p>Every time I sit at the harmonium, I feel his presence. My father, Saji Ram, wasn\'t just a composer; he was a painter of emotions through music. The melodies he created for classics like <em>Kireedam</em> defined an era of storytelling in Indian cinema.</p><p>Today, as I compose my own tracks, I try to capture that same honesty. "Ennin Nenjil" is directly inspired by a notebook of sketches he left behind. The main melody hook was written in his handwriting, on a yellowed piece of paper dated 1989. For me, singing this song is not just a performance—it is a spiritual conversation with the man who gave me my voice.</p>',
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
  ],
  gallery: [
    {
      _id: 'gal_1',
      title: 'Live Performance at Grand Arena',
      url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1000&auto=format&fit=crop',
      type: 'image',
      category: 'Concerts',
      isFeatured: true
    },
    {
      _id: 'gal_2',
      title: 'Acoustic Session at Studio A',
      url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop',
      type: 'image',
      category: 'Studio',
      isFeatured: true
    },
    {
      _id: 'gal_3',
      title: 'Synthesizer and Composing setup',
      url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop',
      type: 'image',
      category: 'Studio',
      isFeatured: false
    },
    {
      _id: 'gal_4',
      title: 'Singing live at National Music Fest',
      url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1000&auto=format&fit=crop',
      type: 'image',
      category: 'Concerts',
      isFeatured: true
    },
    {
      _id: 'gal_5',
      title: 'Writing session notes',
      url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop',
      type: 'image',
      category: 'Personal',
      isFeatured: false
    },
    {
      _id: 'gal_6',
      title: 'Grand Piano close-up',
      url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=1000&auto=format&fit=crop',
      type: 'image',
      category: 'Studio',
      isFeatured: false
    },
    {
      _id: 'gal_7',
      title: 'Crowd at Concert',
      url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop',
      type: 'image',
      category: 'Concerts',
      isFeatured: false
    },
    {
      _id: 'gal_8',
      title: 'Electric Guitar tuning',
      url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop',
      type: 'image',
      category: 'Concerts',
      isFeatured: false
    },
    {
      _id: 'gal_9',
      title: 'Studio Mixing Board',
      url: 'https://images.unsplash.com/photo-1487180142328-0c4e37023af5?q=80&w=1000&auto=format&fit=crop',
      type: 'image',
      category: 'Studio',
      isFeatured: false
    },
    {
      _id: 'gal_10',
      title: 'Outdoor Inspiration Session',
      url: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=1000&auto=format&fit=crop',
      type: 'image',
      category: 'Personal',
      isFeatured: false
    },
    {
      _id: 'gal_11',
      title: 'Harmonium Practice',
      url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1000&auto=format&fit=crop',
      type: 'image',
      category: 'Personal',
      isFeatured: false
    },
    {
      _id: 'gal_12',
      title: 'Vocal recording booth',
      url: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=1000&auto=format&fit=crop',
      type: 'image',
      category: 'Studio',
      isFeatured: false
    },
    {
      _id: 'gal_13',
      title: 'Symphony orchestra violinists',
      url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1000&auto=format&fit=crop',
      type: 'image',
      category: 'Concerts',
      isFeatured: false
    },
    {
      _id: 'gal_14',
      title: 'Sunset Melody Writing',
      url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop',
      type: 'image',
      category: 'Personal',
      isFeatured: false
    },
    {
      _id: 'gal_15',
      title: 'Backstage warmups',
      url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1000&auto=format&fit=crop',
      type: 'image',
      category: 'Concerts',
      isFeatured: false
    }
  ],
  timeline: [
    {
      _id: 'time_1',
      year: '1998',
      title: 'Where it all began',
      description: 'Surrounded by music, instruments and endless curiosity.',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400'
    },
    {
      _id: 'time_2',
      year: '2008',
      title: 'Learning. Observing. Absorbing.',
      description: 'Learning not just music, but emotion, discipline and silence.',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=400'
    },
    {
      _id: 'time_3',
      year: '2016',
      title: 'Finding my voice',
      description: 'Stepping into studios, compositions and my own sound.',
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=400'
    },
    {
      _id: 'time_4',
      year: '2023',
      title: 'Creating. Performing. Inspiring.',
      description: 'Continuing the legacy and building a new musical tomorrow.',
      image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=400'
    }
  ],
  messages: [
    {
      _id: 'msg_1',
      name: 'Ramesh Nair',
      email: 'ramesh.nair@example.com',
      phone: '+91 98765 43210',
      subject: 'Booking for Live Performance',
      message: 'Hello Midhun, we are hosting a prestigious cultural event in Kochi next October and would love to book you and your ensemble for a live performance. Please let us know your availability.',
      status: 'unread',
      createdAt: new Date('2026-06-20')
    },
    {
      _id: 'msg_2',
      name: 'Suhana Sen',
      email: 'suhana.s@example.com',
      phone: '+91 88877 66554',
      subject: 'Film Score Collaboration Inquiry',
      message: 'Hi Midhun, I am an indie film director working on my next feature project. I am a huge admirer of Saji Ram sir\'s work, and after listening to "Oru Mazha", I am convinced you would be the perfect composer for our film. Let\'s connect for a coffee!',
      status: 'read',
      createdAt: new Date('2026-06-18')
    }
  ]
};

// CRUD Helper Methods
const MockDb = {
  getStats: () => ({
    songs: dataStore.songs.length,
    blogs: dataStore.blogs.length,
    galleryItems: dataStore.gallery.length,
    timelineEvents: dataStore.timeline.length,
    totalMessages: dataStore.messages.length,
    unreadMessages: dataStore.messages.filter(m => m.status === 'unread').length
  }),
  
  verifyAdmin: (username, password) => {
    if (username === dataStore.admin.username) {
      return bcrypt.compareSync(password, dataStore.admin.passwordHash);
    }
    return false;
  },

  // Songs
  getSongs: () => [...dataStore.songs].sort((a,b) => b.releaseDate - a.releaseDate),
  createSong: (song) => {
    const newSong = { _id: 'song_' + Date.now(), ...song, releaseDate: song.releaseDate ? new Date(song.releaseDate) : new Date() };
    dataStore.songs.push(newSong);
    return newSong;
  },
  updateSong: (id, update) => {
    const idx = dataStore.songs.findIndex(s => s._id === id);
    if (idx === -1) return null;
    dataStore.songs[idx] = { ...dataStore.songs[idx], ...update, releaseDate: update.releaseDate ? new Date(update.releaseDate) : dataStore.songs[idx].releaseDate };
    return dataStore.songs[idx];
  },
  deleteSong: (id) => {
    const idx = dataStore.songs.findIndex(s => s._id === id);
    if (idx === -1) return false;
    dataStore.songs.splice(idx, 1);
    return true;
  },

  // Blogs
  getBlogs: (all = false) => {
    let list = [...dataStore.blogs];
    if (!all) list = list.filter(b => b.isPublished);
    return list.sort((a,b) => b.createdAt - a.createdAt);
  },
  getBlogBySlug: (slug) => {
    return dataStore.blogs.find(b => b.slug === slug) || null;
  },
  createBlog: (blog) => {
    let slug = blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let existing = dataStore.blogs.find(b => b.slug === slug);
    let count = 1;
    while (existing) {
      slug = `${blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${count}`;
      existing = dataStore.blogs.find(b => b.slug === slug);
      count++;
    }
    const newBlog = { _id: 'blog_' + Date.now(), ...blog, slug, createdAt: new Date() };
    dataStore.blogs.push(newBlog);
    return newBlog;
  },
  updateBlog: (id, update) => {
    const idx = dataStore.blogs.findIndex(b => b._id === id);
    if (idx === -1) return null;
    dataStore.blogs[idx] = { ...dataStore.blogs[idx], ...update };
    return dataStore.blogs[idx];
  },
  deleteBlog: (id) => {
    const idx = dataStore.blogs.findIndex(b => b._id === id);
    if (idx === -1) return false;
    dataStore.blogs.splice(idx, 1);
    return true;
  },

  // Gallery
  getGallery: () => [...dataStore.gallery].sort((a,b) => b._id.localeCompare(a._id)),
  createGalleryItem: (item) => {
    const newItem = { _id: 'gal_' + Date.now(), ...item };
    dataStore.gallery.push(newItem);
    return newItem;
  },
  deleteGalleryItem: (id) => {
    const idx = dataStore.gallery.findIndex(g => g._id === id);
    if (idx === -1) return false;
    dataStore.gallery.splice(idx, 1);
    return true;
  },

  // Timeline
  getTimeline: () => [...dataStore.timeline].sort((a,b) => a.year.localeCompare(b.year)),
  createTimelineEvent: (item) => {
    const newItem = { _id: 'time_' + Date.now(), ...item };
    dataStore.timeline.push(newItem);
    return newItem;
  },
  deleteTimelineEvent: (id) => {
    const idx = dataStore.timeline.findIndex(t => t._id === id);
    if (idx === -1) return false;
    dataStore.timeline.splice(idx, 1);
    return true;
  },

  // Messages
  getMessages: () => [...dataStore.messages].sort((a,b) => b.createdAt - a.createdAt),
  createMessage: (msg) => {
    const newMsg = { _id: 'msg_' + Date.now(), ...msg, status: 'unread', createdAt: new Date() };
    dataStore.messages.push(newMsg);
    return newMsg;
  },
  markMessageRead: (id) => {
    const idx = dataStore.messages.findIndex(m => m._id === id);
    if (idx === -1) return null;
    dataStore.messages[idx].status = 'read';
    return dataStore.messages[idx];
  },
  deleteMessage: (id) => {
    const idx = dataStore.messages.findIndex(m => m._id === id);
    if (idx === -1) return false;
    dataStore.messages.splice(idx, 1);
    return true;
  }
};

module.exports = MockDb;
