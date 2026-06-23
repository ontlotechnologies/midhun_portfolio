import React from 'react';
import LegacyHero from '../components/LegacyHero';
import AboutSection from '../components/AboutSection';
import FatherLegacy from '../components/FatherLegacy';
import TimelineSection from '../components/TimelineSection';
import WorksShowcase from '../components/WorksShowcase';
import GallerySection from '../components/GallerySection';
import BlogSection from '../components/BlogSection';
import ContactForm from '../components/ContactForm';
import ScrollReveal from '../components/ScrollReveal';
import FaqRiderSection from '../components/FaqRiderSection';

export default function Home({ 
  songs, 
  blogs, 
  gallery, 
  timeline, 
  currentSong, 
  isPlaying, 
  onSongSelect, 
  setIsPlaying,
  navigate,
  onWorkClick
}) {

  const handleListenNow = () => {
    if (songs && songs.length > 0) {
      onSongSelect(songs[0]);
      setIsPlaying(true);
    }
  };

  const handleExploreWorks = () => {
    navigate('/works');
  };

  const handleReadFatherStory = () => {
    navigate('/about');
  };

  return (
    <div className="animate-fade-in text-charcoal-900">
      
      {/* 1. Hero Landing Story */}
      <LegacyHero 
        onPlayClick={handleListenNow} 
        onExploreClick={handleExploreWorks} 
      />

      <hr className="border-t border-cream-300/60 mx-auto max-w-7xl" />

      {/* 2. Artist Editorial Intro */}
      <ScrollReveal>
        <AboutSection onActionClick={handleExploreWorks} />
      </ScrollReveal>

      <hr className="border-t border-cream-300/60 mx-auto max-w-7xl" />

      {/* 3. Legacy Tribute Collage */}
      <ScrollReveal>
        <FatherLegacy onStoryClick={handleReadFatherStory} />
      </ScrollReveal>

      <hr className="border-t border-cream-300/60 mx-auto max-w-7xl" />

      {/* 4. Journey Timeline */}
      <ScrollReveal>
        <TimelineSection 
          timelineData={timeline} 
          onActionClick={() => navigate('/about')} 
        />
      </ScrollReveal>

      <hr className="border-t border-cream-300/60 mx-auto max-w-7xl" />

      {/* 5. Audio Player Showcase */}
      <ScrollReveal>
        <WorksShowcase 
          songs={songs}
          currentSong={currentSong}
          isPlaying={isPlaying}
          onSongSelect={onSongSelect}
          setIsPlaying={setIsPlaying}
          onWorkClick={onWorkClick}
        />
      </ScrollReveal>

      <hr className="border-t border-cream-300/60 mx-auto max-w-7xl" />

      {/* 6. Photo Masonry Gallery */}
      <ScrollReveal>
        <GallerySection 
          galleryItems={gallery.slice(0, 6)} 
          onViewAllClick={() => navigate('/gallery')}
        />
      </ScrollReveal>

      <hr className="border-t border-cream-300/60 mx-auto max-w-7xl" />

      {/* 7. Blog Stories */}
      <ScrollReveal>
        <BlogSection blogs={blogs} />
      </ScrollReveal>

      <hr className="border-t border-cream-300/60 mx-auto max-w-7xl" />

      {/* 8. FAQ & Artist Rider Section */}
      <ScrollReveal>
        <FaqRiderSection />
      </ScrollReveal>

      <hr className="border-t border-cream-300/60 mx-auto max-w-7xl" />

      {/* 9. Booking Contact Form */}
      <ScrollReveal>
        <ContactForm />
      </ScrollReveal>

    </div>
  );
}
