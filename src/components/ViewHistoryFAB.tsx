"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ViewHistoryFAB() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Only render after mount to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  // Auto-hide drawer and slide out button after 3 seconds
  useEffect(() => {
    if (!isMounted || !isExpanded || !showContent) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setIsExpanded(false);
      setShowContent(false);
      setIsHovered(false);
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isMounted, isExpanded, showContent]);

  // Handle hover to slide button in
  const handleMouseEnter = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setIsHovered(true);
  };

  // Handle hover leave - slide out after 2 seconds if not expanded
  const handleMouseLeave = () => {
    if (!isExpanded && !showContent) {
      hoverTimerRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 2000);
    }
  };

  const handleClick = () => {
    if (isExpanded) {
      setIsExpanded(false);
      setShowContent(false);
      if (timerRef.current) clearTimeout(timerRef.current);
    } else {
      setIsExpanded(true);
      setShowContent(true);
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    setShowContent(false);
    setIsHovered(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* Glass Blur Background */}
      {isExpanded && showContent && (
        <div
          className="fixed inset-0 z-30 backdrop-blur-sm bg-black/10 cursor-pointer"
          onClick={handleClose}
        />
      )}

      {/* FAB Button Container */}
      <div
        className={`
          fixed right-0 top-1/2 -translate-y-1/2 z-40
          transition-all duration-500 ease-out
          ${isHovered || isExpanded ? 'translate-x-0' : 'translate-x-1/2'}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Expanded Content Drawer */}
        {isExpanded && showContent && (
          <div className="absolute right-20 -translate-y-1/2 top-0 w-64 animate-in slide-in-from-right-4 duration-300">
            <div className="backdrop-blur-xl bg-white/10 dark:bg-black/30 border border-white/20 rounded-2xl p-6 shadow-2xl space-y-4">
              {/* Header */}
              <div>
                <h3 className="text-white font-bold text-lg">View History</h3>
                <p className="text-white/60 text-sm">Check your watched movies</p>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <Link href="/library/history" onClick={handleClose}>
                  <Button
                    fullWidth
                    variant="flat"
                    className="bg-white/20 hover:bg-white/30 text-white font-semibold"
                    startContent={<Icon icon="mdi:play-circle" width={18} />}
                  >
                    View All
                  </Button>
                </Link>

                <Link href="/library" onClick={handleClose}>
                  <Button
                    fullWidth
                    variant="bordered"
                    className="border-white/20 text-white hover:bg-white/10"
                    startContent={<Icon icon="mdi:library-shelves" width={18} />}
                  >
                    My Library
                  </Button>
                </Link>
              </div>

              {/* Footer */}
              <p className="text-white/40 text-xs text-center pt-2">Auto-closing in 3s...</p>
            </div>
          </div>
        )}

        {/* Main FAB Button */}
        <Button
          isIconOnly
          onClick={handleClick}
          className={`
            relative z-50 shadow-2xl
            backdrop-blur-xl bg-white/20 dark:bg-white/10
            hover:bg-white/30 dark:hover:bg-white/20
            border border-white/30 dark:border-white/20
            text-white
            transition-all duration-300
            ${isExpanded ? 'scale-110 ring-2 ring-white/40' : 'scale-100 hover:scale-105'}
          `}
          size="lg"
          aria-label="View History"
          title="View History"
        >
          <Icon
            icon={isExpanded ? "mdi:close" : "mdi:history"}
            width="28"
            height="28"
            className="transition-transform duration-300"
          />
        </Button>
      </div>
    </>
  );
}
