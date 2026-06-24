import React from 'react';
import AboutSection from '../components/AboutSection';
import FatherLegacy from '../components/FatherLegacy';
import TimelineSection from '../components/TimelineSection';

export default function AboutPage({ timelineData, onStoryClick, onExploreClick, loading, siteContent = {} }) {
  return (
    <div className="pt-20 animate-fade-in">
      <AboutSection onActionClick={onExploreClick} content={siteContent.about} />
      <FatherLegacy onStoryClick={onStoryClick} content={siteContent.father_legacy} />
      <TimelineSection timelineData={timelineData} onActionClick={onStoryClick} loading={loading} />
    </div>
  );
}
