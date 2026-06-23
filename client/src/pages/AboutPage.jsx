import React from 'react';
import AboutSection from '../components/AboutSection';
import FatherLegacy from '../components/FatherLegacy';
import TimelineSection from '../components/TimelineSection';

export default function AboutPage({ timelineData, onStoryClick, onExploreClick }) {
  return (
    <div className="pt-20 animate-fade-in">
      <AboutSection onActionClick={onExploreClick} />
      <FatherLegacy onStoryClick={onStoryClick} />
      <TimelineSection timelineData={timelineData} onActionClick={onStoryClick} />
    </div>
  );
}
