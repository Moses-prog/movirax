"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";

export default function PullToRefresh({ children }: { children: React.ReactNode }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const rawPullY = useMotionValue(0);
  const pullY = useSpring(rawPullY, { stiffness: 400, damping: 30, mass: 0.8 });
  const opacity = useTransform(pullY, [0, 60], [0, 1]);
  const scale = useTransform(pullY, [0, 60], [0.5, 1]);
  
  const router = useRouter();
  const startY = useRef(0);
  const isAtTop = useRef(true);
  const controls = useAnimation();

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (isRefreshing) return;
      
      let target = e.target as HTMLElement | null;
      let hasScrollableContainer = false;
      let isAtTopOfContainer = false;

      while (target && target !== document.body) {
        const style = window.getComputedStyle(target);
        const isOverflowY = style.overflowY === "auto" || style.overflowY === "scroll";
        
        if (isOverflowY && target.scrollHeight > target.clientHeight) {
          hasScrollableContainer = true;
          isAtTopOfContainer = target.scrollTop <= 0;
          break;
        }
        target = target.parentElement;
      }

      if (!hasScrollableContainer) {
        isAtTop.current = window.scrollY <= 0;
      } else {
        isAtTop.current = isAtTopOfContainer;
      }

      if (isAtTop.current) {
        startY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isAtTop.current || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - startY.current;

      if (distance > 0) {
        const pullDistance = Math.min(distance * 0.4, 150); // Add resistance
        rawPullY.set(pullDistance);
        
        // Prevent default scrolling when pulling down
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = async () => {
      if (isRefreshing || !isAtTop.current) return;

      if (rawPullY.get() > 80) { // Threshold to trigger refresh
        setIsRefreshing(true);
        rawPullY.set(60); // Hold at refresh height
        
        router.refresh();
        
        setTimeout(() => {
          setIsRefreshing(false);
          rawPullY.set(0);
        }, 1500);
      } else {
        rawPullY.set(0);
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
  }, [isRefreshing, rawPullY, router]);

  return (
    <div className="relative w-full h-full min-h-dvh">
      {/* Professional Floating Refresh Indicator */}
      <motion.div
        className="absolute top-0 left-1/2 z-50 flex items-center justify-center rounded-full bg-background/90 shadow-2xl backdrop-blur-md border border-white/10"
        style={{
          y: pullY,
          x: "-50%",
          width: 40,
          height: 40,
          marginTop: -40, // Hide above the screen when y=0
          opacity,
          scale
        }}
      >
        <Spinner size="sm" color="danger" />
      </motion.div>

      {/* Page Content */}
      <motion.div
        animate={controls}
        style={{ y: pullY }}
        className="relative z-10 w-full h-full bg-background"
      >
        {children}
      </motion.div>
    </div>
  );
}