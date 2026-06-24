const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { Song, Blog, GalleryItem, TimelineEvent, Admin, MediaWork, SiteContent } = require('./models/Schemas');

async function seedDatabase() {
  try {
    // SAFE SEEDING GUARD: Skip if database is already populated
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      console.log('Seeding: Database already populated. Skipping seeding.');
      return;
    }

    // 1. Clear existing database collections (only runs on first setup)
    console.log('Seeding: Clearing existing data...');
    await Song.deleteMany({});
    await Blog.deleteMany({});
    await GalleryItem.deleteMany({});
    await TimelineEvent.deleteMany({});
    await Admin.deleteMany({});
    await MediaWork.deleteMany({});
    await SiteContent.deleteMany({});

    // 2. Seed Admin User
    console.log('Seeding: Creating admin account...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hashSync('admin123', salt);
    const admin = new Admin({
      username: 'admin',
      passwordHash: passwordHash
    });
    await admin.save();

    // 3. Seed Songs
    console.log('Seeding: Inserting songs...');
    await Song.insertMany([
      {
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
    ]);

    // 4. Seed Blogs
    console.log('Seeding: Inserting blogs...');
    await Blog.insertMany([
      {
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
    ]);

    // 5. Seed Gallery
    console.log('Seeding: Inserting gallery...');
    await GalleryItem.insertMany([
      { title: 'Live Performance at Grand Arena', url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1000&auto=format&fit=crop', type: 'image', category: 'Concerts', isFeatured: true },
      { title: 'Acoustic Session at Studio A', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop', type: 'image', category: 'Studio', isFeatured: true },
      { title: 'Synthesizer and Composing setup', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop', type: 'image', category: 'Studio', isFeatured: false },
      { title: 'Singing live at National Music Fest', url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1000&auto=format&fit=crop', type: 'image', category: 'Concerts', isFeatured: true },
      { title: 'Writing session notes', url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop', type: 'image', category: 'Personal', isFeatured: false },
      { title: 'Grand Piano close-up', url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=1000&auto=format&fit=crop', type: 'image', category: 'Studio', isFeatured: false },
      { title: 'Crowd at Concert', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop', type: 'image', category: 'Concerts', isFeatured: false },
      { title: 'Electric Guitar tuning', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop', type: 'image', category: 'Concerts', isFeatured: false },
      { title: 'Studio Mixing Board', url: 'https://images.unsplash.com/photo-1487180142328-0c4e37023af5?q=80&w=1000&auto=format&fit=crop', type: 'image', category: 'Studio', isFeatured: false },
      { title: 'Outdoor Inspiration Session', url: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=1000&auto=format&fit=crop', type: 'image', category: 'Personal', isFeatured: false },
      { title: 'Harmonium Practice', url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1000&auto=format&fit=crop', type: 'image', category: 'Personal', isFeatured: false },
      { title: 'Vocal recording booth', url: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=1000&auto=format&fit=crop', type: 'image', category: 'Studio', isFeatured: false },
      { title: 'Symphony orchestra violinists', url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1000&auto=format&fit=crop', type: 'image', category: 'Concerts', isFeatured: false },
      { title: 'Sunset Melody Writing', url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop', type: 'image', category: 'Personal', isFeatured: false },
      { title: 'Backstage warmups', url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1000&auto=format&fit=crop', type: 'image', category: 'Concerts', isFeatured: false }
    ]);

    // 6. Seed Timeline
    console.log('Seeding: Inserting timeline...');
    await TimelineEvent.insertMany([
      { year: '1998', title: 'Where it all began', description: 'Surrounded by music, instruments and endless curiosity.', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400' },
      { year: '2008', title: 'Learning. Observing. Absorbing.', description: 'Learning not just music, but emotion, discipline and silence.', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=400' },
      { year: '2016', title: 'Finding my voice', description: 'Stepping into studios, compositions and my own sound.', image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=400' },
      { year: '2023', title: 'Creating. Performing. Inspiring.', description: 'Continuing the legacy and building a new musical tomorrow.', image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=400' }
    ]);

    // 7. Seed Media Works
    console.log('Seeding: Inserting media works...');
    await MediaWork.insertMany([
      { title: 'Echoes of Silence', type: 'short_film', coverUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', mediaType: 'youtube', releaseYear: '2024', description: 'An award-winning short film exploring the visual landscape of memories and soundscapes in solitude.', isFeatured: true },
      { title: 'The Last Note', type: 'short_film', coverUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop', videoUrl: 'https://www.youtube.com/watch?v=9xwazD5SyVg', mediaType: 'youtube', releaseYear: '2023', description: 'A dramatic narrative of a maestro composing his final symphony in the misty hills of Munnar.', isFeatured: false },
      { title: 'Strings Attached - Season 1', type: 'web_series', coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', mediaType: 'youtube', releaseYear: '2023', description: 'A 5-episode musical drama series charting the struggles and triumphs of an indie band in Kochi.', isFeatured: true },
      { title: 'Kochi Chronicles', type: 'web_series', coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop', videoUrl: 'https://www.youtube.com/watch?v=9xwazD5SyVg', mediaType: 'youtube', releaseYear: '2022', description: 'A critically acclaimed web series depicting the intersecting lives of four street musicians.', isFeatured: false },
      { title: 'Rhythm & Soul Live', type: 'tv_program', coverUrl: 'https://images.unsplash.com/photo-1460889687773-43400005d654?q=80&w=800&auto=format&fit=crop', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', mediaType: 'youtube', releaseYear: '2024', description: 'A special weekly broadcast television show showcasing the rich classical fusion musical legacy of Kerala.', isFeatured: true },
      { title: 'Music Masters TV', type: 'tv_program', coverUrl: 'https://images.unsplash.com/photo-1522158632663-614062800fda?q=80&w=800&auto=format&fit=crop', videoUrl: 'https://www.youtube.com/watch?v=9xwazD5SyVg', mediaType: 'youtube', releaseYear: '2023', description: 'A primetime television program paying tribute to legendary music composers and their masterpieces.', isFeatured: false },
      { title: 'Path of the Wind', type: 'movie', coverUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', mediaType: 'youtube', releaseYear: '2024', description: 'A feature-length romantic drama. Midhun Saji Ram serves as the primary music director and composer.', isFeatured: true },
      { title: 'Shadows in the Rain', type: 'movie', coverUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800&auto=format&fit=crop', mediaType: 'image_only', releaseYear: '2022', description: 'An independent thriller movie. Poster art showcase; soundtrack composed by Midhun Saji Ram.', isFeatured: false },
      { title: 'Sunset Improvisations', type: 'independent_work', coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop', videoUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', mediaType: 'upload', releaseYear: '2024', description: 'A raw, single-take keyboard improvisation recorded during sunset on the beach. Audio upload.', isFeatured: true },
      { title: 'Sonic Landscapes - Cinematic Visualizer', type: 'independent_work', coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', mediaType: 'youtube', releaseYear: '2023', description: 'An experimental audiovisual track combining synth waves with ambient natural sound recordings.', isFeatured: false }
    ]);

    // 8. Seed Site Content (Dynamic Page Sections)
    console.log('Seeding: Inserting site content defaults...');
    await SiteContent.insertMany([
      {
        section: 'hero',
        data: {
          subtitle: 'The Sound. The Story. The Legacy.',
          titleLine1: 'A Legacy',
          titleLine2: 'He Gave.',
          titleLine3: 'A Voice I Carry.',
          description: 'From the melodies he created to the ones I dream today, this is our journey of music, memories and meaning.',
          quote: '"He wrote the melodies that touched millions. I carry them forward."',
          signature: 'Midhun Saji Ram',
          heroImage: '/midhunHero.png'
        }
      },
      {
        section: 'about',
        data: {
          subtitle: 'About Me',
          title: 'My music is a bridge\nbetween yesterday and tomorrow.',
          paragraph1: "I come from a musical lineage that shaped my ears, my heart, and my understanding of sound. As a music director, I search for the emotion behind every scene, every lyric, and every silence.",
          paragraph2: "As a singer, I give that emotion a voice. My music is rooted in melody, honesty, and feeling.",
          portraitImage: '/midhunBG.jpeg',
          stats: [
            { iconName: 'Music', value: '50+', label: 'Songs Composed' },
            { iconName: 'Award', value: '30+', label: 'Live Performances' },
            { iconName: 'Users', value: '20+', label: 'Collaborations' },
            { iconName: 'Heart', value: 'Millions', label: 'Listeners' }
          ]
        }
      },
      {
        section: 'father_legacy',
        data: {
          subtitle: "MY FATHER'S LEGACY",
          title: "Before I found my voice,\nI heard his.",
          paragraph1: "My father, Saji Ram, was a celebrated music director whose melodies touched countless hearts. He was the creative force behind the famous track from Kireedam, a song that still carries his signature, his soul, and his timeless musical instinct.",
          paragraph2: "Walking through recording sessions alongside him taught me the mechanics of composition and the honor of being a musician. His legacy is the foundation upon which I explore new musical frontiers.",
          mainImage: 'https://images.unsplash.com/photo-1610964198883-01c0c61e08cb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG11c2ljJTIwYXJ0aXN0JTIwYWdlZHxlbnwwfHwwfHx8MA%3D%3D',
          polaroidImage: 'https://plus.unsplash.com/premium_photo-1726804910786-9e72710480d3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bXVzaWMlMjBhcnRpc3QlMjBhZ2VkfGVufDB8fDB8fHww',
          polaroidCaption: 'Saji Ram',
          cursiveText: 'A legacy that lives on'
        }
      },
      {
        section: 'footer',
        data: {
          brandName: 'Midhun Saji Ram',
          brandTagline: 'Music Director & Composer',
          description: 'Bridging classical compositions and experimental soundscapes with contemporary cinematic storytelling.',
          bookingEmail: 'bookings@midhunsajiram.com',
          location: 'Kochi, Kerala, India',
          spotifyUrl: 'https://spotify.com',
          youtubeUrl: 'https://youtube.com',
          instagramUrl: 'https://instagram.com'
        }
      },
      {
        section: 'faqs',
        data: {
          subtitle: 'Got Questions?',
          title: 'Frequently Asked Questions',
          items: [
            {
              question: "How can I commission Midhun for a film score or composition?",
              answer: "You can reach out directly via the Booking Contact Form below with details about your script, timeline, and production scale. We schedule initial music-direction consultations to discuss thematic references and instrumentation requirements."
            },
            {
              question: "What is the typical timeline for background scoring?",
              answer: "Timeline depends on the film length and genre. Typically, a feature-length film background score takes 4 to 6 weeks, which includes thematic brainstorming, recording session musicians, synth layering, and final theater pre-mixes."
            },
            {
              question: "Does Midhun perform live, and what is the standard lineup?",
              answer: "Yes, Midhun performs both solo cinematic vocal sets and full live-band fusion sets. The standard lineup consists of a 5-piece band (keys, drums, guitars, bass, and woodwinds) alongside supporting vocalists, customized based on the stage."
            },
            {
              question: "Can directors/producers attend remote recording sessions?",
              answer: "Absolutely. We host high-fidelity remote recording reviews using Audiomovers Listento, allowing directors to listen to live acoustic recordings of strings, flutes, and percussion in real-time directly from our studio."
            }
          ]
        }
      }
    ]);

    console.log('Seeding: Database seeding completed successfully.');
  } catch (error) {
    console.error('Database seeding failed:', error.message);
  }
}

// Standalone execution support
if (require.main === module) {
  const dns = require('dns');
  dns.setDefaultResultOrder('ipv4first');
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {
    console.warn('Warning: Could not set DNS servers. Falling back to default system DNS.', e.message);
  }
  require('dotenv').config();
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI environment variable is missing. Cannot seed.');
    process.exit(1);
  }
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
      await seedDatabase();
      mongoose.connection.close();
    })
    .catch(err => {
      console.error('Mongoose connection failed:', err);
      process.exit(1);
    });
}

module.exports = seedDatabase;
