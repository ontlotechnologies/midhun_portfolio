import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, Eye, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BlogDetailPage({ blog, onBackClick, loading }) {
  const [copied, setCopied] = useState(false);
  const viewLogged = useRef(false);

  useEffect(() => {
    if (blog && blog._id && !viewLogged.current) {
      viewLogged.current = true;
      
      // Increment local count optimistically
      blog.views = (blog.views || 0) + 1;

      const incrementView = async () => {
        try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
          await fetch(`${API_URL}/blogs/${blog._id}/view`, { method: 'POST' });
        } catch (err) {
          console.error('Failed to increment blog view count:', err);
        }
      };
      incrementView();
    }
  }, [blog]);

  const fallbackCopyText = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
    document.body.removeChild(textArea);
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Clipboard copy failed:', err);
          fallbackCopyText(shareUrl);
        });
    } else {
      fallbackCopyText(shareUrl);
    }
  };

  if (loading || !blog) {
    return (
      <div className="min-h-screen bg-white text-charcoal-900 animate-fade-in flex flex-col pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-6 w-full flex-1 flex flex-col justify-start animate-pulse">
          <div className="h-4 bg-cream-200 rounded w-32 mb-8" />
          <div className="h-64 md:h-80 bg-cream-200 rounded-2xl mb-8 w-full" />
          <div className="h-8 bg-cream-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-cream-200 rounded w-1/2 mb-6" />
          <div className="space-y-3 mb-8">
            <div className="h-3.5 bg-cream-200 rounded w-full" />
            <div className="h-3.5 bg-cream-200 rounded w-5/6" />
            <div className="h-3.5 bg-cream-200 rounded w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-charcoal-900 animate-fade-in flex flex-col pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col justify-start font-outfit">
        
        {/* Navigation & Actions Header */}
        <div className="flex items-center justify-between mb-8 select-none">
          <button 
            onClick={onBackClick}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gold-500 hover:text-charcoal-900 font-bold transition-colors duration-300 group cursor-pointer w-fit"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
            <span>Back</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cream-100 hover:bg-gold-500 hover:text-white border border-cream-300 text-charcoal-900 text-[9px] uppercase tracking-wider font-bold rounded-lg transition-all duration-300 cursor-pointer shadow-sm active:scale-[0.98]"
            title="Share Story"
          >
            <Share2 size={11} />
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>

        {/* Blog Article Outer Container */}
        <div className="bg-cream-200/50 border border-cream-300/60 rounded overflow-hidden shadow-sm">
          
          {/* Cover Banner */}
          {blog.coverUrl && (
            <div className="h-64 md:h-80 relative bg-neutral-200 border-b border-cream-300/40">
              <img 
                src={blog.coverUrl} 
                alt={blog.title} 
                className="w-full h-full object-cover filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cream-200/80 via-transparent to-transparent"></div>
            </div>
          )}

          {/* Headline details & Meta */}
          <div className="p-6 md:p-10 pb-0 text-left">
            <h1 className="font-serif text-2xl md:text-4xl text-charcoal-900 font-extrabold tracking-tight mb-4 leading-tight">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2.5 text-[10px] text-gray-500 uppercase tracking-widest font-mono border-b border-cream-300 pb-5">
              <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span>&bull;</span>
              <span className="flex items-center"><Clock size={11} className="mr-1" /> {blog.readingTime} read</span>
              <span>&bull;</span>
              <span className="flex items-center text-slate-500"><Eye size={11} className="mr-1 text-gold-500" /> {blog.views || 0} views</span>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="p-6 md:p-10 pt-6 text-left prose prose-stone max-w-none">
            {blog.excerpt && (
              <p className="font-serif text-gold-900 text-sm md:text-base leading-relaxed italic border-l-2 border-gold-500 pl-4 mb-6">
                {blog.excerpt}
              </p>
            )}
            <div 
              className="text-charcoal-900 font-light leading-loose text-sm md:text-base space-y-4 font-sans"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* Footer Author Stamp */}
          <div className="border-t border-cream-300 p-6 bg-cream-300/30 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 rounded-full border border-gold-500/20 overflow-hidden bg-neutral-200">
                <img 
                  src="data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" viewBox=\"0 0 100 100\"><rect width=\"100%\" height=\"100%\" fill=\"%23b89033\"/><text x=\"50%\" y=\"55%\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-family=\"serif\" font-size=\"40\" font-weight=\"bold\" fill=\"%23ffffff\">M</text></svg>" 
                  alt="Midhun Saji Ram" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h5 className="font-serif text-charcoal-900 font-bold text-xs">Midhun Saji Ram</h5>
                <p className="text-[9px] text-gray-500 uppercase tracking-wider">Author & Artiste</p>
              </div>
            </div>

            <button
              onClick={onBackClick}
              className="text-[9px] font-bold uppercase tracking-widest border border-charcoal-900/20 hover:border-gold-500 text-charcoal-900 hover:text-gold-600 px-4 py-2 rounded transition-all cursor-pointer"
            >
              Back to Reflections
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
