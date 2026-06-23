import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { FaInstagram, FaYoutube, FaSpotify } from 'react-icons/fa';

export default function Navbar({ activeSection, setActiveSection, currentPath, navigate }) {
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

  const handleNavClick = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const showSolidNavbar = scrolled || currentPath !== '/';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${showSolidNavbar ? 'py-3 glass-premium shadow-sm shadow-gray-200/30' : 'py-4 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo Branding */}
        <div 
          className="cursor-pointer flex flex-col group text-left" 
          onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
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
                onClick={() => handleNavClick(link.path)}
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
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden transition-colors duration-300 hover:text-gold-500 cursor-pointer ${showSolidNavbar ? 'text-charcoal-900' : 'text-white'}`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Drawer Menu (Global overlay) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] bg-white/98 backdrop-blur-xl z-40 transition-all duration-300 flex flex-col items-center justify-center space-y-8 animate-fade-in border-t border-gold-600/10">
          {navLinks.map((link) => {
            const isCurrent = currentPath === link.path;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.path)}
                className={`text-lg uppercase tracking-widest transition-colors duration-300 font-serif ${isCurrent ? 'text-gold-600 font-bold' : 'text-charcoal-900 hover:text-gold-600'}`}
              >
                {link.label}
              </button>
            );
          })}

          <div className="flex space-x-6 text-charcoal-900 pt-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-600 transition-colors duration-300"><FaInstagram size={22} /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-600 transition-colors duration-300"><FaYoutube size={22} /></a>
            <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-600 transition-colors duration-300"><FaSpotify size={22} /></a>
          </div>
        </div>
      )}
    </nav>
  );
}
