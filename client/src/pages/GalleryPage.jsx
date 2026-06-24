import React from 'react';
import GallerySection from '../components/GallerySection';

export default function GalleryPage({ gallery, loading }) {
  return (
    <div className="pt-20 animate-fade-in">
      <GallerySection galleryItems={gallery} infiniteScroll={true} loading={loading} />
    </div>
  );
}
