import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);
  const particlesContainerRef = useRef(null);
  
  // State refs for animation loop to avoid re-renders
  const mouse = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });
  const outline = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });
  
  const isHovering = useRef(false);
  const particles = useRef([]);
  
  const currentScale = useRef(1);
  const currentDotScale = useRef(1);
  
  const notes = ['♪', '♫', '♬', '♩'];
  
  useEffect(() => {
    // Only initialize the cursor effect if pointing device is accurate (desktop)
    if (!window.matchMedia("(pointer: fine)").matches) {
       return;
    }

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    
    const onMouseOver = (e) => {
      // Find closest interactive parent
      const target = e.target.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer, .card, img, .interactive');
      
      if (target) {
        if (!isHovering.current) {
          isHovering.current = true;
          if (cursorOutlineRef.current) {
            cursorOutlineRef.current.classList.add('border-[#D4AF37]', 'bg-[#D4AF37]/10');
            cursorOutlineRef.current.classList.remove('border-white/25');
          }
          spawnParticles(mouse.current.x, mouse.current.y);
        }
      } else {
        if (isHovering.current) {
          isHovering.current = false;
          if (cursorOutlineRef.current) {
            cursorOutlineRef.current.classList.remove('border-[#D4AF37]', 'bg-[#D4AF37]/10');
            cursorOutlineRef.current.classList.add('border-white/25');
          }
        }
      }
    };
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    
    let animationFrameId;
    
    const render = () => {
      // Smooth interpolation for outline position
      outline.current.x += (mouse.current.x - outline.current.x) * 0.15;
      outline.current.y += (mouse.current.y - outline.current.y) * 0.15;
      
      // Smooth interpolation for scale
      const targetScale = isHovering.current ? 1.5 : 1;
      currentScale.current += (targetScale - currentScale.current) * 0.15;
      
      const targetDotScale = isHovering.current ? 0 : 1;
      currentDotScale.current += (targetDotScale - currentDotScale.current) * 0.2;
      
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px) translate(-50%, -50%) scale(${currentDotScale.current})`;
      }
      if (cursorOutlineRef.current) {
        cursorOutlineRef.current.style.transform = `translate(${outline.current.x}px, ${outline.current.y}px) translate(-50%, -50%) scale(${currentScale.current})`;
      }
      
      // Update particles
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.life -= 0.012; // Controls lifespan
        
        if (p.life <= 0) {
          if (p.element && p.element.parentNode) {
            p.element.parentNode.removeChild(p.element);
          }
          particles.current.splice(i, 1);
          continue;
        }
        
        // Update physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.02; // Gentle gravity floating up
        p.rotation += p.rotSpeed;
        
        // Update DOM
        if (p.element) {
          p.element.style.transform = `translate(${p.x}px, ${p.y}px) scale(${p.scale}) rotate(${p.rotation}deg)`;
          // Fade out smoothly based on life
          p.element.style.opacity = Math.min(1, p.life * 1.5);
        }
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(animationFrameId);
      
      // Clean up particles
      particles.current.forEach(p => {
        if (p.element && p.element.parentNode) {
          p.element.parentNode.removeChild(p.element);
        }
      });
      particles.current = [];
    };
  }, []);
  
  const spawnParticles = (x, y) => {
    if (!particlesContainerRef.current) return;
    
    const numParticles = Math.floor(Math.random() * 3) + 4; // 4 to 6 particles
    
    for (let i = 0; i < numParticles; i++) {
      const el = document.createElement('div');
      el.className = 'music-particle';
      el.innerText = notes[Math.floor(Math.random() * notes.length)];
      particlesContainerRef.current.appendChild(el);
      
      particles.current.push({
        element: el,
        x: x,
        y: y,
        // Randomized velocities for a gentler burst effect
        vx: (Math.random() - 0.5) * 2, 
        vy: (Math.random() - 0.5) * 1.5 - 1,
        life: 1.0 + Math.random() * 0.4, 
        scale: 0.6 + Math.random() * 0.6,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 2
      });
    }
  };

  return (
    <div className="custom-cursor-container z-[9999] pointer-events-none fixed top-0 left-0 w-full h-full overflow-hidden hidden lg:block mix-blend-difference">
      <div ref={particlesContainerRef} className="particles-container absolute top-0 left-0 w-full h-full pointer-events-none" />
      <div 
        ref={cursorOutlineRef} 
        className="cursor-outline absolute top-0 left-0 w-10 h-10 border border-white/25 rounded-full pointer-events-none transition-colors duration-300 backdrop-blur-[2px]"
      />
      <div 
        ref={cursorDotRef} 
        className="cursor-dot absolute top-0 left-0 w-1.5 h-1.5 bg-[#D4AF37] rounded-full pointer-events-none"
        style={{ boxShadow: '0 0 10px rgba(212, 175, 55, 0.8)' }}
      />
    </div>
  );
};

export default CustomCursor;
