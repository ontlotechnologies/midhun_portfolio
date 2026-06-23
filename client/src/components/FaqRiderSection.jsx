import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, FileText, Download } from 'lucide-react';

export default function FaqRiderSection() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "How can I commission Midhun for a film score or composition?",
      answer: "You can reach out directly via the Booking Contact Form below with details about your script, timeline, and production scale. We schedule initial music-direction consultations to discuss thematic references and instrumentation requirements."
    },
    {
      question: "What is the typical timeline for background scoring?",
      answer: "Timeline depends on the film length and genre. Typically, a feature-length film background score takes 4 to 6 weeks, which includes thematic brainstorming, recording session musicians, synth layering, and final theater pre-mixes."
    },
    {
      question: "Does Midhun perform live, and what is the standard lineup?",
      answer: "Yes, Midhun performs both solo cinematic vocal sets and full live-band fusion sets. The standard lineup consists of a 5-piece band (keys, drums, guitars, bass, and woodwinds) alongside supporting vocalists, customized based on the stage."
    },
    {
      question: "Can directors/producers attend remote recording sessions?",
      answer: "Absolutely. We host high-fidelity remote recording reviews using Audiomovers Listento, allowing directors to listen to live acoustic recordings of strings, flutes, and percussion in real-time directly from our studio."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section id="faq-rider" className="relative py-20 bg-white overflow-hidden border-t border-cream-300/40">
      
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="text-[9px] uppercase tracking-[0.3em] text-gold-600 font-bold block mb-1 text-center">
            Got Questions?
          </span>
          <h2 className="font-serif text-charcoal-900 text-3xl md:text-5xl font-bold tracking-tight text-center">
            Frequently Asked Questions
          </h2>
          <div className="h-[1.5px] w-16 bg-gold-500 mt-4 mx-auto"></div>
        </div>

        {/* Centered FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-white rounded overflow-hidden shadow-sm transition-all duration-300 hover:border-gold-500/20"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between cursor-pointer focus:outline-none"
                >
                  <span className="font-serif text-charcoal-900 font-bold text-sm md:text-base pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`text-gold-600 transform transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-charcoal-500 font-light leading-relaxed border-t border-cream-200/50 text-left">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
}
