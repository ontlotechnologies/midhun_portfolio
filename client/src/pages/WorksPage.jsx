import React from 'react';
import WorksShowcase from '../components/WorksShowcase';

export default function WorksPage({ songs, currentSong, isPlaying, onSongSelect, setIsPlaying, onWorkClick }) {
  return (
    <div className="pt-20 animate-fade-in">
      <WorksShowcase 
        songs={songs}
        currentSong={currentSong}
        isPlaying={isPlaying}
        onSongSelect={onSongSelect}
        setIsPlaying={setIsPlaying}
        onWorkClick={onWorkClick}
      />
    </div>
  );
}
