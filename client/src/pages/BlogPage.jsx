import React from 'react';
import BlogSection from '../components/BlogSection';

export default function BlogPage({ blogs }) {
  return (
    <div className="pt-20 animate-fade-in">
      <BlogSection blogs={blogs} />
    </div>
  );
}
