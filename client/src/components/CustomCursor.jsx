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
  const isVisible = useRef(false);
  
  const notes = ['♪', '♫', '♬', '♩'];
  
  useEffect(() => {
    const onMouseMove = (e) => {
      isVisible.current = true;
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    
    const onMouseLeave = () => {
      isVisible.current = false;
    };
    
    const handleInteractionStart = (x, y, targetEl) => {
      if (!targetEl) return;
      const target = targetEl.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer, .card, img, .interactive');
      
      if (target) {
        if (!isHovering.current) {
          isHovering.current = true;
          spawnParticles(x, y);
        }
      } else {
        if (isHovering.current) {
          isHovering.current = false;
        }
      }
    };

    const onMouseOver = (e) => {
      handleInteractionStart(mouse.current.x, mouse.current.y, e.target);
    };

    const onTouchStart = (e) => {
      isVisible.current = true;
      if (e.touches && e.touches[0]) {
        mouse.current.x = e.touches[0].clientX;
        mouse.current.y = e.touches[0].clientY;
        handleInteractionStart(mouse.current.x, mouse.current.y, e.target);
      }
    };

    const onTouchMove = (e) => {
      isVisible.current = true;
      if (e.touches && e.touches[0]) {
        mouse.current.x = e.touches[0].clientX;
        mouse.current.y = e.touches[0].clientY;
      }
    };

    const onTouchEnd = () => {
      isVisible.current = false;
    };
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    
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
      
      const targetOpacity = isVisible.current ? 1 : 0;
      
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px) translate(-50%, -50%) scale(${currentDotScale.current})`;
        cursorDotRef.current.style.opacity = targetOpacity;
      }
      if (cursorOutlineRef.current) {
        cursorOutlineRef.current.style.transform = `translate(${outline.current.x}px, ${outline.current.y}px) translate(-50%, -50%) scale(${currentScale.current})`;
        cursorOutlineRef.current.style.opacity = targetOpacity;
        
        // Inline styles bypass Tailwind build-time purge/compilation dynamic class bugs entirely
        if (isHovering.current) {
          cursorOutlineRef.current.style.borderColor = '#000000';
          cursorOutlineRef.current.style.backgroundColor = 'rgba(0, 0, 0, 0.08)';
        } else {
          cursorOutlineRef.current.style.borderColor = 'rgba(0, 0, 0, 0.35)';
          cursorOutlineRef.current.style.backgroundColor = 'transparent';
        }
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
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
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
    <div className="custom-cursor-container z-[9999] pointer-events-none fixed top-0 left-0 w-full h-full overflow-hidden">
      <div ref={particlesContainerRef} className="particles-container absolute top-0 left-0 w-full h-full pointer-events-none" />
      <div 
        ref={cursorOutlineRef} 
        className="cursor-outline absolute top-0 left-0 w-10 h-10 border rounded-full pointer-events-none transition-colors duration-300 backdrop-blur-[0.5px]"
        style={{ borderColor: 'rgba(0, 0, 0, 0.25)', backgroundColor: 'transparent', boxShadow: '0 0 2px rgba(255, 255, 255, 0.4)' }}
      />
      <div 
        ref={cursorDotRef} 
        className="cursor-dot absolute top-0 left-0 w-1.5 h-1.5 bg-black rounded-full pointer-events-none border border-white/20"
        style={{ backgroundColor: '#000000', boxShadow: '0 0 4px rgba(255, 255, 255, 0.5)' }}
      />
    </div>
  );
};

export default CustomCursor;
