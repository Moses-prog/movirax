'use client';

import React, { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  label?: string;
  isGenre?: boolean;
}

const GENRES = ["Sci-Fi", "Action", "Drama", "Thriller", "Comedy", "Horror", "Romance", "Adventure", "Fantasy", "Mystery", "Animation", "Crime", "Documentary"];
const FALLBACK_MOVIES = ["Inception", "The Dark Knight", "Interstellar", "The Matrix", "Pulp Fiction", "Dune", "Oppenheimer", "Avatar", "Gladiator", "Titanic", "Jurassic Park", "The Shining", "Alien", "Jaws", "Blade Runner", "Mad Max", "Goodfellas", "Fight Club", "Se7en", "The Godfather", "Parasite", "Whiplash", "Everything Everywhere", "Spider-Verse"];

interface Props {
  dynamicMovies?: string[];
}

export const CinematicUniverse = ({ dynamicMovies = [] }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // Config
    const PARTICLE_COUNT = 70;
    const CONNECTION_DISTANCE = 150;
    const MOUSE_INTERACTION_DISTANCE = 200;
    
    let mouse = { x: -1000, y: -1000 };

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        // Handle high-DPI displays for crisp text
        const dpr = window.devicePixelRatio || 1;
        canvas.width = parent.clientWidth * dpr;
        canvas.height = parent.clientHeight * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `${parent.clientHeight}px`;
      }
    };

    const initParticles = () => {
      particles = [];
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;

      let availableGenres = [...GENRES].sort(() => 0.5 - Math.random());
      const sourceMovies = dynamicMovies.length > 0 ? dynamicMovies : FALLBACK_MOVIES;
      let availableMovies = [...sourceMovies].sort(() => 0.5 - Math.random());

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const isRed = Math.random() > 0.7;
        
        // Assign labels to some particles
        let label = undefined;
        let isGenre = false;
        
        // About 15 genres, 25 movies, 30 empty dots
        if (i < 15 && availableGenres.length > 0) {
          label = availableGenres.pop();
          isGenre = true;
        } else if (i >= 15 && i < 40 && availableMovies.length > 0) {
          label = availableMovies.pop();
        }

        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5, // slower movement for readability
          vy: (Math.random() - 0.5) * 0.5,
          radius: label ? (isGenre ? 2.5 : 1.5) : (Math.random() * 1.5 + 0.5),
          color: isRed ? '220, 38, 38' : '255, 255, 255',
          label,
          isGenre
        });
      }
    };

    const draw = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));

        // Draw connections first so they are under the dots/text
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity = 1 - (dist / CONNECTION_DISTANCE);
            
            // Highlight connections between genres and movies
            const isMeaningfulConnection = (p.isGenre && p2.label) || (p2.isGenre && p.label);
            const isRedConnection = p.color === '220, 38, 38' || p2.color === '220, 38, 38';
            const colorRGB = isRedConnection ? '220, 38, 38' : '255, 255, 255';
            
            ctx.strokeStyle = `rgba(${colorRGB}, ${(isMeaningfulConnection ? opacity * 0.4 : opacity * 0.15)})`;
            ctx.lineWidth = isMeaningfulConnection ? 1.5 : 1;
            ctx.stroke();
          }
        }
      }

      // Draw dots and text on top of lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.label ? 1 : 0.6})`;
        ctx.fill();

        // Draw text
        if (p.label) {
          ctx.font = p.isGenre ? "bold 13px system-ui, sans-serif" : "11px system-ui, sans-serif";
          ctx.fillStyle = p.isGenre ? `rgba(255, 255, 255, 0.95)` : `rgba(161, 161, 170, 0.8)`;
          
          // Add a subtle glow/shadow to text for readability against lines
          ctx.shadowColor = "rgba(0,0,0,0.8)";
          ctx.shadowBlur = 4;
          ctx.fillText(p.label, p.x + 8, p.y + 4);
          ctx.shadowBlur = 0; // reset
        }

        // Mouse interaction
        const dxMouse = p.x - mouse.x;
        const dyMouse = p.y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        
        if (distMouse < MOUSE_INTERACTION_DISTANCE) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          const opacity = 1 - (distMouse / MOUSE_INTERACTION_DISTANCE);
          ctx.strokeStyle = `rgba(${p.color}, ${opacity * 0.4})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          
          p.x += (dxMouse / distMouse) * 1.5;
          p.y += (dyMouse / distMouse) * 1.5;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', () => {
      resize();
      initParticles();
    });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove as EventListener);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Initial setup with a slight delay to ensure container is fully sized
    setTimeout(() => {
      resize();
      initParticles();
      draw();
    }, 100);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove as EventListener);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto z-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.06)_0%,transparent_70%)] pointer-events-none" />
      <canvas 
        ref={canvasRef} 
        className="block"
        style={{
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)'
        }}
      />
    </div>
  );
};
