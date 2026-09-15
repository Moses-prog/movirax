'use client';

import React, { useRef, useEffect } from 'react';

interface DynamicMovie {
  title: string;
  posterPath?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  label?: string;
  isGenre?: boolean;
  img?: HTMLImageElement;
}

const GENRES = ["Sci-Fi", "Action", "Drama", "Thriller", "Comedy", "Horror", "Romance", "Adventure", "Fantasy", "Mystery", "Animation", "Crime", "Documentary"];
const FALLBACK_MOVIES = [
  { title: "Inception" }, { title: "The Dark Knight" }, { title: "Interstellar" }, 
  { title: "The Matrix" }, { title: "Dune" }, { title: "Oppenheimer" }
];

interface Props {
  dynamicMovies?: DynamicMovie[];
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
        
        let label = undefined;
        let isGenre = false;
        let img = undefined;
        let pRadius = Math.random() * 1.5 + 0.5;
        
        if (i < 15 && availableGenres.length > 0) {
          label = availableGenres.pop();
          isGenre = true;
          pRadius = 2.5;
        } else if (i >= 15 && i < 40 && availableMovies.length > 0) {
          const movie = availableMovies.pop();
          if (movie) {
            label = movie.title;
            if (movie.posterPath) {
              img = new Image();
              img.src = `https://image.tmdb.org/t/p/w92${movie.posterPath}`;
              pRadius = 10; // larger radius for poster nodes
            } else {
              pRadius = 2.0;
            }
          }
        }

        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: pRadius,
          color: isRed ? '220, 38, 38' : '255, 255, 255',
          label,
          isGenre,
          img
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

        // Draw connections
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
            
            const isMeaningfulConnection = (p.isGenre && p2.label) || (p2.isGenre && p.label);
            const isRedConnection = p.color === '220, 38, 38' || p2.color === '220, 38, 38';
            const colorRGB = isRedConnection ? '220, 38, 38' : '255, 255, 255';
            
            ctx.strokeStyle = `rgba(${colorRGB}, ${(isMeaningfulConnection ? opacity * 0.4 : opacity * 0.15)})`;
            ctx.lineWidth = isMeaningfulConnection ? 1.5 : 1;
            ctx.stroke();
          }
        }
      }

      // Draw dots, posters, and text
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (p.img && p.img.complete && p.img.naturalWidth > 0) {
          // Draw tiny poster in a circle
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.clip();
          // Draw image to fill the circle (assuming typical poster aspect ratio 2:3, we center it)
          const imgWidth = p.radius * 2;
          const imgHeight = p.radius * 3;
          ctx.drawImage(p.img, p.x - p.radius, p.y - p.radius * 1.5, imgWidth, imgHeight);
          ctx.restore();
          
          // Subtle border around the poster circle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${p.color}, 0.7)`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          // Normal dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${p.label ? 1 : 0.6})`;
          ctx.fill();
        }

        // Draw text offset
        if (p.label) {
          ctx.font = p.isGenre ? "bold 13px system-ui, sans-serif" : "11px system-ui, sans-serif";
          ctx.fillStyle = p.isGenre ? `rgba(255, 255, 255, 0.95)` : `rgba(161, 161, 170, 0.8)`;
          ctx.shadowColor = "rgba(0,0,0,0.8)";
          ctx.shadowBlur = 4;
          // Offset text based on whether it has a poster (which is much wider)
          const offset = (p.img && p.img.complete) ? p.radius + 6 : 8;
          ctx.fillText(p.label, p.x + offset, p.y + 4);
          ctx.shadowBlur = 0;
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
