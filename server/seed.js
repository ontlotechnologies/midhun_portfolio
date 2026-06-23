const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { Song, Blog, GalleryItem, TimelineEvent, Admin } = require('./models/Schemas');

async function seedDatabase() {
  try {
    // 1. Clear existing database collections
    console.log('Seeding: Clearing existing data...');
    await Song.deleteMany({});
    await Blog.deleteMany({});
    await GalleryItem.deleteMany({});
    await TimelineEvent.deleteMany({});
    await Admin.deleteMany({});

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
      {
        title: 'Live Performance at Grand Arena',
        url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1000&auto=format&fit=crop',
        type: 'image',
        category: 'Concerts',
        isFeatured: true
      },
      {
        title: 'Acoustic Session at Studio A',
        url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop',
        type: 'image',
        category: 'Studio',
        isFeatured: true
      },
      {
        title: 'Synthesizer and Composing setup',
        url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop',
        type: 'image',
        category: 'Studio',
        isFeatured: false
      },
      {
        title: 'Singing live at National Music Fest',
        url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1000&auto=format&fit=crop',
        type: 'image',
        category: 'Concerts',
        isFeatured: true
      },
      {
        title: 'Writing session notes',
        url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop',
        type: 'image',
        category: 'Personal',
        isFeatured: false
      },
      {
        title: 'Grand Piano close-up',
        url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=1000&auto=format&fit=crop',
        type: 'image',
        category: 'Studio',
        isFeatured: false
      },
      {
        title: 'Crowd at Concert',
        url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop',
        type: 'image',
        category: 'Concerts',
        isFeatured: false
      },
      {
        title: 'Electric Guitar tuning',
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop',
        type: 'image',
        category: 'Concerts',
        isFeatured: false
      },
      {
        title: 'Studio Mixing Board',
        url: 'https://images.unsplash.com/photo-1487180142328-0c4e37023af5?q=80&w=1000&auto=format&fit=crop',
        type: 'image',
        category: 'Studio',
        isFeatured: false
      },
      {
        title: 'Outdoor Inspiration Session',
        url: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=1000&auto=format&fit=crop',
        type: 'image',
        category: 'Personal',
        isFeatured: false
      },
      {
        title: 'Harmonium Practice',
        url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1000&auto=format&fit=crop',
        type: 'image',
        category: 'Personal',
        isFeatured: false
      },
      {
        title: 'Vocal recording booth',
        url: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=1000&auto=format&fit=crop',
        type: 'image',
        category: 'Studio',
        isFeatured: false
      },
      {
        title: 'Symphony orchestra violinists',
        url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1000&auto=format&fit=crop',
        type: 'image',
        category: 'Concerts',
        isFeatured: false
      },
      {
        title: 'Sunset Melody Writing',
        url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop',
        type: 'image',
        category: 'Personal',
        isFeatured: false
      },
      {
        title: 'Backstage warmups',
        url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1000&auto=format&fit=crop',
        type: 'image',
        category: 'Concerts',
        isFeatured: false
      }
    ]);

    // 6. Seed Timeline
    console.log('Seeding: Inserting timeline...');
    await TimelineEvent.insertMany([
      {
        year: '1998',
        title: 'Where it all began',
        description: 'Surrounded by music, instruments and endless curiosity.',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400'
      },
      {
        year: '2008',
        title: 'Learning. Observing. Absorbing.',
        description: 'Learning not just music, but emotion, discipline and silence.',
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=400'
      },
      {
        year: '2016',
        title: 'Finding my voice',
        description: 'Stepping into studios, compositions and my own sound.',
        image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=400'
      },
      {
        year: '2023',
        title: 'Creating. Performing. Inspiring.',
        description: 'Continuing the legacy and building a new musical tomorrow.',
        image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=400'
      }
    ]);

    console.log('Seeding: Database seeding completed successfully.');
  } catch (error) {
    console.error('Database seeding failed:', error.message);
  }
}

// Standalone execution support
if (require.main === module) {
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
