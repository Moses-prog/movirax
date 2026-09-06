"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useTransform, useMotionValue, useSpring, AnimatePresence, useMotionValueEvent } from "framer-motion";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function PullToRefresh({ children }: { children: React.ReactNode }) {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isReadyToRefresh, setIsReadyToRefresh] = useState(false);
  
  const rawPullY = useMotionValue(0);
  const pullY = useSpring(rawPullY, { stiffness: 300, damping: 25, mass: 0.8 });
  const topLiquidY = useSpring(0, { stiffness: 400, damping: 25 });
  
  const router = useRouter();
  const startY = useRef(0);
  const isAtTop = useRef(true);
  const controls = useAnimation();

  useMotionValueEvent(pullY, "change", (latest) => {
    if (isRefreshing) return;

    if (latest <= 120) {
      if (isReadyToRefresh) setIsReadyToRefresh(false);
      topLiquidY.set(latest);
    } else {
      if (!isReadyToRefresh) setIsReadyToRefresh(true);
      // Snap the top liquid back like broken tension!
      topLiquidY.set(0); 
    }
  });

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (isRefreshing) return;
      
      // Find closest actually scrollable container
      let target = e.target as HTMLElement | null;
      let isAtTopOfContainer = false;
      let hasScrollableContainer = false;
      
      while (target && target !== document.documentElement && target !== document.body) {
        const style = window.getComputedStyle(target);
        const isOverflowY = style.overflowY === 'auto' || style.overflowY === 'scroll';
        
        // Only count it as a scrollable container if it has overflowing content
        if (isOverflowY && target.scrollHeight > target.clientHeight) {
          hasScrollableContainer = true;
          isAtTopOfContainer = target.scrollTop <= 0;
          break;
        }
        target = target.parentElement;
      }
      
      // If no inner scrollable container, check window
      const finalIsAtTop = hasScrollableContainer ? isAtTopOfContainer : window.scrollY <= 0;
      
      if (finalIsAtTop) {
        startY.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling || isRefreshing) return;
      
      const currentY = e.touches[0].clientY;
      const distance = currentY - startY.current;
      
      if (distance < 0) {
        // If pulling up, cancel the pull-to-refresh immediately to allow native downward scrolling
        setIsPulling(false);
        return;
      }
      
      // Introduce a small deadzone (8px) before we steal the scroll gesture.
      // This prevents horizontal swipes or tiny jitters from freezing the page.
      if (distance > 8) {
        if (e.cancelable) e.preventDefault();
        const pullDistance = Math.pow(distance - 8, 0.85) * 1.5;
        const clamped = Math.min(pullDistance, 180);
        rawPullY.set(clamped);
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;
      setIsPulling(false);
      
      const currentPull = rawPullY.get();
      
      if (currentPull > 120 && !isRefreshing) {
        setIsRefreshing(true);
        // Hold the droplet at the refresh point
        rawPullY.set(120);
        // Nudge content down slightly to give room
        controls.start({ y: 50, transition: { type: "spring", bounce: 0.4 } });
        
        window.location.reload();
        setTimeout(() => {
          setIsRefreshing(false);
          setIsReadyToRefresh(false);
          rawPullY.set(0);
          controls.start({ y: 0 });
        }, 1000);
      } else {
        rawPullY.set(0);
        controls.start({ y: 0 });
      }
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isPulling, isRefreshing, rawPullY, controls, router]);

  // Path interpolation for the retracting top liquid - moved offscreen (-30) to prevent top-edge stains
  const path = useTransform(topLiquidY, [0, 50, 100, 120], [
    "M 0 -30 C 100 -30, 200 -30, 200 -30 C 200 -30, 300 -30, 400 -30 L 400 -30 L 0 -30 Z",
    "M 0 -30 C 100 -30, 140 50, 200 50 C 260 50, 300 -30, 400 -30 L 400 -30 L 0 -30 Z",
    "M 0 -30 C 120 -30, 150 100, 200 100 C 250 100, 280 -30, 400 -30 L 400 -30 L 0 -30 Z",
    "M 0 -30 C 140 -30, 160 140, 200 140 C 240 140, 260 -30, 400 -30 L 400 -30 L 0 -30 Z"
  ]);

  // Droplet position follows finger
  const dropletY = useTransform(pullY, [0, 120, 180], [-50, 100, 140]);
  const spinnerY = useTransform(dropletY, y => (y as number) + 8); // Adjusted for 40px droplet

  return (
    <div className="relative w-full h-full min-h-dvh">
      {/* SVG Definitions */}
      <svg className="w-0 h-0 absolute">
        <defs>
          <linearGradient id="dripGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <filter id="gooeyRefresh">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" />
          </filter>
        </defs>
      </svg>

      <div className="fixed top-0 left-0 w-full h-[200px] z-50 pointer-events-none flex justify-center">
        {/* Gooey Layer: Merges the SVG Path and HTML Droplet seamlessly */}
        {/* Added hardware acceleration transforms to prevent WebKit rendering trail stains */}
        <div 
          className="absolute inset-0 w-full h-full will-change-transform" 
          style={{ 
            filter: "url(#gooeyRefresh)", 
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)"
          }}
        >
          <svg
            viewBox="0 0 400 200"
            className="w-full h-full absolute top-0 left-0"
            preserveAspectRatio="none"
          >
            <motion.path d={path} fill="url(#dripGradient)" />
          </svg>
          
          {/* Using HTML div ensures a perfect circle regardless of screen aspect ratio */}
          <motion.div
            className="absolute left-1/2 -ml-5 rounded-full"
            style={{ 
              width: 40, 
              height: 40, 
              top: dropletY, 
              background: "linear-gradient(to right, #dc2626, #f97316)" 
            }}
          />
        </div>

        {/* Crisp Layer: Spinner inside the droplet */}
        <AnimatePresence>
          {(isReadyToRefresh || isRefreshing) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute left-1/2 -ml-3"
              style={{ top: spinnerY }}
            >
              <Loader2 className="w-6 h-6 animate-spin text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        animate={controls}
        style={{ y: useTransform(pullY, value => value * 0.2) }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
