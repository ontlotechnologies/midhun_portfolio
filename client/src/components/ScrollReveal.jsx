import React from 'react';
import { motion } from 'framer-motion';

export default function ScrollReveal({ children, delay = 0, duration = 1.3 }) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        scale: 0.98, 
        filter: 'blur(2px)',
        y: 20
      }}
      whileInView={{ 
        opacity: 1, 
        scale: 1, 
        filter: 'blur(0px)',
        y: 0
      }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.25, 1, 0.5, 1] // Luxurious easeOutQuart curve for natural deceleration
      }}
      style={{ willChange: 'transform, filter, opacity' }}
    >
      {children}
    </motion.div>
  );
}
