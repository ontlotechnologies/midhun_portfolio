import React from 'react';
import BlogSection from '../components/BlogSection';

export default function BlogPage({ blogs, loading }) {
  return (
    <div className="pt-20 animate-fade-in">
      <BlogSection blogs={blogs} loading={loading} />
    </div>
  );
}
