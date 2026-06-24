import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { FaInstagram, FaYoutube, FaSpotify } from 'react-icons/fa';
import confetti from 'canvas-confetti';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', text: 'Thank you! Your message has been sent successfully.' });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#2563eb', '#ffffff', '#1e40af']
        });
      } else {
        setStatus({ type: 'error', text: data.message || 'Failed to send message. Please try again.' });
      }
    } catch (err) {
      setStatus({ type: 'error', text: 'Failed to send message. Please check your internet connection and try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-14 bg-white border-t border-cream-300/40 font-outfit">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 text-left flex flex-col justify-between self-stretch min-h-full">
            <div className="space-y-5">
              <div>
                <span className="text-[8.5px] uppercase tracking-[0.25em] text-gold-600 font-black block mb-1">
                  Get In Touch
                </span>
                <h2 className="font-outfit text-3xl md:text-4xl font-black tracking-tight text-charcoal-900 leading-tight">
                  Let's Create <br />
                  <span className="text-gold-gradient italic font-normal">Something Beautiful.</span>
                </h2>
              </div>
              
              <p className="text-gray-500 text-xs font-light leading-relaxed max-w-sm">
                Have an upcoming cinematic score, a live performance booking, or an independent collaboration opportunity? Reach out to establish a creative connection.
              </p>
            </div>

            {/* Compact details stack */}
            <div className="space-y-4 my-8 lg:my-6">
              <div className="flex items-start space-x-3.5 group">
                <div className="w-7 h-7 bg-cream-100 border border-cream-300/60 rounded flex items-center justify-center text-gold-600 shrink-0 group-hover:bg-gold-500 group-hover:text-black transition-colors duration-300">
                  <Mail size={12} />
                </div>
                <div className="min-w-0">
                  <span className="text-[8px] uppercase tracking-[0.2em] text-gray-400 font-bold block">Direct Email</span>
                  <a href="mailto:midhunasajiram.music@gmail.com" className="text-[11px] font-black text-charcoal-900 hover:text-gold-600 transition-colors mt-0.5 block break-all font-mono">
                    midhunasajiram.music@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 group">
                <div className="w-7 h-7 bg-cream-100 border border-cream-300/60 rounded flex items-center justify-center text-gold-600 shrink-0 group-hover:bg-gold-500 group-hover:text-black transition-colors duration-300">
                  <Phone size={12} />
                </div>
                <div className="min-w-0">
                  <span className="text-[8px] uppercase tracking-[0.2em] text-gray-400 font-bold block">Call / WhatsApp</span>
                  <a href="tel:+919074581234" className="text-[11px] font-black text-charcoal-900 hover:text-gold-600 transition-colors mt-0.5 block font-mono">
                    +91 90745 81234
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 group">
                <div className="w-7 h-7 bg-cream-100 border border-cream-300/60 rounded flex items-center justify-center text-gold-600 shrink-0 group-hover:bg-gold-500 group-hover:text-black transition-colors duration-300">
                  <MapPin size={12} />
                </div>
                <div className="min-w-0">
                  <span className="text-[8px] uppercase tracking-[0.2em] text-gray-400 font-bold block">Primary Location</span>
                  <span className="text-[11px] font-black text-charcoal-900 mt-0.5 block font-mono">
                    Kochi, Kerala, India
                  </span>
                </div>
              </div>
            </div>

            {/* Social channels stack */}
            <div className="flex space-x-3.5 text-gray-400 pt-4 border-t border-cream-200/50">
              {[
                { icon: <FaSpotify size={15} />, url: 'https://spotify.com' },
                { icon: <FaYoutube size={15} />, url: 'https://youtube.com' },
                { icon: <FaInstagram size={15} />, url: 'https://instagram.com' }
              ].map((item, index) => (
                <a 
                  key={index} 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-gold-600 transition-colors duration-300"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Sleek minimal form */}
          <div className="lg:col-span-7 bg-cream-100/40 border border-cream-300/50 p-6 sm:p-8 rounded text-left">
            <form onSubmit={handleSubmit} className="space-y-5 text-left relative">
              <div className="border-b border-cream-200 pb-3 mb-2 flex items-center justify-between">
                <h3 className="font-outfit text-xs uppercase tracking-widest font-black text-charcoal-900">Send an Inquiry</h3>
                <span className="text-[8px] text-gray-400 uppercase tracking-widest font-mono">&bull; Field Required</span>
              </div>

              {status.text && (
                <div className={`p-3.5 text-[11px] rounded border transition-all ${
                  status.type === 'success' 
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700' 
                    : 'bg-red-500/5 border-red-500/20 text-red-600'
                }`}>
                  {status.text}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {/* Name */}
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-[8.5px] uppercase tracking-widest text-gold-600 font-bold block mb-1">Your Name &bull;</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-transparent border-0 border-b border-cream-300 focus:border-gold-500 focus:ring-0 focus:outline-none rounded-none px-0 py-2 text-xs text-charcoal-900 transition-colors duration-300 placeholder:text-gray-400/70"
                    placeholder="Ramesh Nair"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-[8.5px] uppercase tracking-widest text-gold-600 font-bold block mb-1">Your Email &bull;</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-transparent border-0 border-b border-cream-300 focus:border-gold-500 focus:ring-0 focus:outline-none rounded-none px-0 py-2 text-xs text-charcoal-900 transition-colors duration-300 placeholder:text-gray-400/70"
                    placeholder="ramesh@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {/* Phone */}
                <div className="flex flex-col">
                  <label htmlFor="phone" className="text-[8.5px] uppercase tracking-widest text-gold-600 font-bold block mb-1">Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-transparent border-0 border-b border-cream-300 focus:border-gold-500 focus:ring-0 focus:outline-none rounded-none px-0 py-2 text-xs text-charcoal-900 transition-colors duration-300 placeholder:text-gray-400/70"
                    placeholder="+91 98765 43210"
                  />
                </div>

                {/* Subject */}
                <div className="flex flex-col">
                  <label htmlFor="subject" className="text-[8.5px] uppercase tracking-widest text-gold-600 font-bold block mb-1">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="bg-transparent border-0 border-b border-cream-300 focus:border-gold-500 focus:ring-0 focus:outline-none rounded-none px-0 py-2 text-xs text-charcoal-900 transition-colors duration-300 placeholder:text-gray-400/70"
                    placeholder="Film Scoring Inquiry"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col">
                <label htmlFor="message" className="text-[8.5px] uppercase tracking-widest text-gold-600 font-bold block mb-1">Message &bull;</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  className="bg-transparent border-0 border-b border-cream-300 focus:border-gold-500 focus:ring-0 focus:outline-none rounded-none px-0 py-2 text-xs text-charcoal-900 transition-colors duration-300 resize-none placeholder:text-gray-400/70"
                  placeholder="Describe your project, timeline, and scoring requirements..."
                ></textarea>
              </div>

              {/* Submit button */}
              <div className="pt-2 flex justify-start">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-2.5 bg-black hover:bg-gold-500 disabled:bg-charcoal-900/50 text-white hover:text-black font-black text-[9px] uppercase tracking-[0.25em] rounded transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
                >
                  {loading ? (
                    <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Send size={10} />
                      <span>Send Inquiry Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
