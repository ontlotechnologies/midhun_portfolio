import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const particlesContainerRef = useRef(null);
  const particles = useRef([]);
  const notes = ['♪', '♫', '♬', '♩'];
  
  useEffect(() => {
    const onClick = (e) => {
      let x, y;
      if (e.clientX !== undefined) {
        x = e.clientX;
        y = e.clientY;
      } else if (e.touches && e.touches[0]) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else {
        return;
      }
      spawnParticles(x, y);
    };

    window.addEventListener('click', onClick);
    
    let animationFrameId;
    
    const render = () => {
      // Update particles physics and DOM positions
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.life -= 0.015; // Controls lifespan speed
        
        if (p.life <= 0) {
          if (p.element && p.element.parentNode) {
            p.element.parentNode.removeChild(p.element);
          }
          particles.current.splice(i, 1);
          continue;
        }
        
        // Apply velocity & gentle upward drift
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.025; // Gentle gravity floating up
        p.rotation += p.rotSpeed;
        
        // Update DOM transform and fade out smoothly
        if (p.element) {
          p.element.style.transform = `translate(${p.x}px, ${p.y}px) scale(${p.scale}) rotate(${p.rotation}deg)`;
          p.element.style.opacity = Math.min(1, p.life * 1.5);
        }
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.removeEventListener('click', onClick);
      cancelAnimationFrame(animationFrameId);
      
      // Clean up any remaining particles
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
    
    const numParticles = Math.floor(Math.random() * 3) + 5; // 5 to 7 particles
    
    for (let i = 0; i < numParticles; i++) {
      const el = document.createElement('div');
      el.className = 'music-particle';
      el.innerText = notes[Math.floor(Math.random() * notes.length)];
      particlesContainerRef.current.appendChild(el);
      
      // Randomize velocities for a spreading burst effect
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.0 + Math.random() * 2.5;
      
      particles.current.push({
        element: el,
        x: x,
        y: y,
        vx: Math.cos(angle) * speed, 
        vy: Math.sin(angle) * speed - 1.2, // bias movement upwards
        life: 1.0 + Math.random() * 0.4, 
        scale: 0.5 + Math.random() * 0.7,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 3
      });
    }
  };

  return (
    <div className="custom-cursor-container z-[9999] pointer-events-none fixed top-0 left-0 w-full h-full overflow-hidden">
      <div ref={particlesContainerRef} className="particles-container absolute top-0 left-0 w-full h-full pointer-events-none" />
    </div>
  );
};

export default CustomCursor;
