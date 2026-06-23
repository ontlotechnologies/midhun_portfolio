import React from 'react';
import GallerySection from '../components/GallerySection';

export default function GalleryPage({ gallery }) {
  return (
    <div className="pt-20 animate-fade-in">
      <GallerySection galleryItems={gallery} />
    </div>
  );
}
