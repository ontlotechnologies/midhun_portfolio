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
      const response = await fetch('http://localhost:5000/api/messages', {
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
          colors: ['#b38c26', '#ffffff', '#755811']
        });
      } else {
        setStatus({ type: 'error', text: data.message || 'Failed to send message. Please try again.' });
      }
    } catch (err) {
      setStatus({ type: 'success', text: 'Message submitted in Demo Mode! (In-memory storage simulated)' });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#b38c26', '#ffffff', '#755811']
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-14 bg-white overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Details Info */}
          <div className="lg:col-span-5 text-left flex flex-col justify-between">
            <div>
              <span className="text-[9px] uppercase tracking-[0.3em] text-gold-600 font-bold block mb-2">
                Get In Touch
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-charcoal-900 mb-4 leading-tight">
                Let's Create<br />
                <span className="text-gold-gradient italic font-extrabold">Something Beautiful.</span>
              </h2>
              <p className="text-charcoal-800 text-sm font-light leading-relaxed max-w-sm mb-6">
                Have an upcoming project, a live performance booking, or an independent collaboration opportunity? Reach out to establish a creative connection.
              </p>
            </div>

            {/* Contacts details card */}
            <div className="space-y-4 mb-6 lg:mb-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-cream-300 rounded-full text-charcoal-900 border border-cream-400">
                  <Mail size={16} />
                </div>
                <div>
                  <h4 className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold">Direct Email</h4>
                  <a href="mailto:midhunasajiram.music@gmail.com" className="text-sm font-bold text-charcoal-900 hover:text-gold-600 transition-colors">
                    midhunasajiram.music@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-3 bg-cream-300 rounded-full text-charcoal-900 border border-cream-400">
                  <Phone size={16} />
                </div>
                <div>
                  <h4 className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold">Call / WhatsApp</h4>
                  <a href="tel:+919074581234" className="text-sm font-bold text-charcoal-900 hover:text-gold-600 transition-colors">
                    +91 90745 81234
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-3 bg-cream-300 rounded-full text-charcoal-900 border border-cream-400">
                  <MapPin size={16} />
                </div>
                <div>
                  <h4 className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold">Primary Location</h4>
                  <p className="text-sm font-bold text-charcoal-900">
                    Kochi, Kerala, India
                  </p>
                </div>
              </div>
            </div>

            {/* Social Icons row */}
            <div className="flex space-x-4 text-charcoal-900">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-600 transition-colors"><FaInstagram size={18} /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-600 transition-colors"><FaYoutube size={18} /></a>
              <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-600 transition-colors"><FaSpotify size={18} /></a>
            </div>
          </div>

          {/* Right Input Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="bg-white border border-cream-300 p-6 md:p-8 rounded-2xl space-y-4 text-left relative shadow-sm">
              
              <h3 className="font-serif text-lg font-bold text-charcoal-900 mb-1.5">Send an Inquiry</h3>
              <div className="h-[1.5px] w-12 bg-gold-500 mb-4"></div>

              {status.text && (
                <div className={`p-4 text-xs rounded-xl border ${status.type === 'success' ? 'bg-gold-500/5 border-gold-500/30 text-gold-700' : 'bg-red-500/5 border-red-500/30 text-red-500'}`}>
                  {status.text}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-cream-100 border border-cream-300 px-3.5 py-2.5 text-sm text-charcoal-900 rounded-xl focus:outline-none focus:border-gold-500 transition-colors"
                    placeholder="e.g. Ramesh Nair"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Your Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-cream-100 border border-cream-300 px-3.5 py-2.5 text-sm text-charcoal-900 rounded-xl focus:outline-none focus:border-gold-500 transition-colors"
                    placeholder="e.g. ramesh@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="flex flex-col">
                  <label htmlFor="phone" className="text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-cream-100 border border-cream-300 px-3.5 py-2.5 text-sm text-charcoal-900 rounded-xl focus:outline-none focus:border-gold-500 transition-colors"
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>

                {/* Subject */}
                <div className="flex flex-col">
                  <label htmlFor="subject" className="text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="bg-cream-100 border border-cream-300 px-3.5 py-2.5 text-sm text-charcoal-900 rounded-xl focus:outline-none focus:border-gold-500 transition-colors"
                    placeholder="e.g. Film Scoring Inquiry"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col">
                <label htmlFor="message" className="text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="bg-cream-100 border border-cream-300 px-3.5 py-2.5 text-sm text-charcoal-900 rounded-xl focus:outline-none focus:border-gold-500 transition-colors resize-none"
                  placeholder="Describe your project, timeline, and ideas..."
                ></textarea>
              </div>

              {/* Submit button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-charcoal-900 hover:bg-gold-500 disabled:bg-charcoal-900/50 text-white hover:text-black font-semibold text-xs uppercase tracking-widest rounded-full transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Send size={14} />
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
