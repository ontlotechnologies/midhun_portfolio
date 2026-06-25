import React from 'react';
import BlogSection from '../components/BlogSection';

export default function BlogPage({ blogs, loading, navigate }) {
  return (
    <div className="pt-20 animate-fade-in">
      <BlogSection 
        blogs={blogs} 
        loading={loading} 
        onBlogClick={(blog) => navigate(`/blog-detail?id=${blog._id}`)} 
      />
    </div>
  );
}
