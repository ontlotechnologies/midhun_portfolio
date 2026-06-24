import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaInstagram, FaYoutube, FaSpotify } from 'react-icons/fa';

export default function Navbar({ activeSection, setActiveSection, currentPath, navigate, onSelectCategory }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'about', label: 'About', path: '/about' },
    { id: 'works', label: 'Works', path: '/works' },
    { id: 'blog', label: 'Blog', path: '/blog' },
    { id: 'gallery', label: 'Gallery', path: '/gallery' },
    { id: 'contact', label: 'Contact', path: '/contact' }
  ];

  const handleNavClick = (link) => {
    setIsOpen(false);
    if (link.id === 'works' && onSelectCategory) {
      onSelectCategory('audio');
    }
    navigate(link.path);
  };

  const showSolidNavbar = scrolled || currentPath !== '/';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${showSolidNavbar ? 'py-3 glass-premium shadow-sm shadow-gray-200/30' : 'py-4 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo Branding */}
        <div 
          className="cursor-pointer flex flex-col group text-left" 
          onClick={() => { 
            navigate('/'); 
            if (window.lenis) {
              window.lenis.scrollTo(0);
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }
          }}
        >
          <span className="font-script text-3.5xl md:text-4xl text-charcoal-900 group-hover:text-gold-600 transition-colors duration-300 leading-[0.8] tracking-normal select-none">
            Midhun Saji Ram
          </span>
          <span className="text-[7.5px] md:text-[8.5px] tracking-[0.38em] text-gray-500 uppercase font-bold mt-1.5 leading-none">
            Music Director | Singer
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-7">
          {navLinks.map((link) => {
            const isCurrent = currentPath === link.path;
            
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link)}
                className={`text-[10px] uppercase tracking-widest transition-colors duration-300 font-bold relative py-1 group ${isCurrent ? 'text-charcoal-900' : 'text-charcoal-900/60 hover:text-charcoal-900'}`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-charcoal-900 transition-transform duration-300 ${isCurrent ? 'scale-x-100' : 'scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left'}`}></span>
              </button>
            );
          })}
        </div>

        {/* Social Links & Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          <div className={`hidden sm:flex items-center space-x-4 transition-colors duration-300 ${showSolidNavbar ? 'text-charcoal-900' : 'text-white'}`}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors duration-300"><FaInstagram size={18} /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors duration-300"><FaYoutube size={18} /></a>
            <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors duration-300"><FaSpotify size={18} /></a>
          </div>

          <button 
            onClick={() => setIsOpen(true)}
            className={`lg:hidden transition-colors duration-300 hover:text-gold-500 cursor-pointer ${showSolidNavbar ? 'text-charcoal-900' : 'text-white'}`}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Drawer Menu (Global overlay) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />

            {/* Slide-in Drawer from Right to Left */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
              className="lg:hidden fixed top-0 right-0 h-screen w-[280px] bg-white z-50 shadow-2xl border-l border-cream-300/40 p-6 flex flex-col"
            >
              {/* Drawer Header with Close Button */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-cream-300/40">
                <span className="font-serif font-extrabold tracking-widest text-sm uppercase text-charcoal-900">Menu</span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-charcoal-900 hover:text-gold-500 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col space-y-4 text-left">
                {navLinks.map((link) => {
                  const isCurrent = currentPath === link.path;
                  
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleNavClick(link)}
                      className={`text-left text-sm uppercase tracking-widest transition-colors duration-300 font-serif border-b border-cream-300/20 pb-2 ${
                        isCurrent 
                          ? 'text-gold-600 font-bold' 
                          : 'text-charcoal-900/80 hover:text-gold-600'
                      }`}
                    >
                      {link.label}
                    </button>
                  );
                })}
              </div>

              {/* Social Channels */}
              <div className="mt-auto pt-6 border-t border-cream-300/40 flex justify-center space-x-6 text-charcoal-900">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-600 transition-colors duration-300"><FaInstagram size={20} /></a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-600 transition-colors duration-300"><FaYoutube size={20} /></a>
                <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-600 transition-colors duration-300"><FaSpotify size={20} /></a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
