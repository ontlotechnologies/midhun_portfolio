import React from 'react';
import LegacyHero from '../components/LegacyHero';
import AboutSection from '../components/AboutSection';
import FatherLegacy from '../components/FatherLegacy';
import TimelineSection from '../components/TimelineSection';
import WorksShowcase from '../components/WorksShowcase';
import GallerySection from '../components/GallerySection';
import BlogSection from '../components/BlogSection';
import ContactForm from '../components/ContactForm';

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
      <AboutSection onActionClick={handleExploreWorks} />

      <hr className="border-t border-cream-300/60 mx-auto max-w-7xl" />

      {/* 3. Legacy Tribute Collage */}
      <FatherLegacy onStoryClick={handleReadFatherStory} />

      <hr className="border-t border-cream-300/60 mx-auto max-w-7xl" />

      {/* 4. Journey Timeline */}
      <TimelineSection 
        timelineData={timeline} 
        onActionClick={() => navigate('/about')} 
      />

      <hr className="border-t border-cream-300/60 mx-auto max-w-7xl" />

      {/* 5. Audio Player Showcase */}
      <WorksShowcase 
        songs={songs}
        currentSong={currentSong}
        isPlaying={isPlaying}
        onSongSelect={onSongSelect}
        setIsPlaying={setIsPlaying}
        onWorkClick={onWorkClick}
      />

      <hr className="border-t border-cream-300/60 mx-auto max-w-7xl" />

      {/* 6. Photo Masonry Gallery */}
      <GallerySection galleryItems={gallery} />

      <hr className="border-t border-cream-300/60 mx-auto max-w-7xl" />

      {/* 7. Blog Stories */}
      <BlogSection blogs={blogs} />

      <hr className="border-t border-cream-300/60 mx-auto max-w-7xl" />

      {/* 8. Booking Contact Form */}
      <ContactForm />

    </div>
  );
}
