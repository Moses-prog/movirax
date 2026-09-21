"use client";

import { useEffect, useState } from "react";
import { addToast } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";

export default function NetworkStatus() {
  const [isOffline, setIsOffline] = useState(false);
  const [isRestored, setIsRestored] = useState(false);
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    // Initial check (only run on client)
    if (typeof window !== "undefined" && !navigator.onLine) {
      setIsOffline(true);
    }

    const handleOnline = () => {
      setIsOffline(false);
      setIsRestored(true);
      setShowText(true);
      addToast({
        title: "Connection Restored",
        description: "You are back online.",
        color: "success",
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      setIsRestored(false);
      addToast({
        title: "You are offline",
        description: "Please check your internet connection.",
        color: "danger",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isRestored) {
      // Hide text after 1 second
      const t1 = setTimeout(() => setShowText(false), 1000);
      // Remove entirely after 5 seconds
      const t2 = setTimeout(() => setIsRestored(false), 5000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isRestored]);

  return (
    <AnimatePresence>
      {isOffline && !isRestored && (
        <motion.div 
          key="offline"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none flex items-center gap-2"
        >
          {/* Dot Card */}
          <div className="bg-red-600/90 backdrop-blur-md shadow-lg flex items-center justify-center rounded-full shrink-0 h-9 w-9">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
          </div>

          {/* Text Card */}
          <div className="bg-red-600/90 backdrop-blur-md text-white px-4 shadow-lg text-sm font-medium flex items-center justify-center rounded-full shrink-0 whitespace-nowrap h-9">
            <span>You are currently offline</span>
          </div>
        </motion.div>
      )}

      {isRestored && (
        <motion.div 
          key="restored"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none flex items-center justify-center"
        >
          <motion.div layout className="flex items-center gap-2">
            {/* Dot Card (Green) */}
            <motion.div 
              layout 
              animate={{ 
                rotate: showText ? 0 : 360,
                scale: showText ? 1 : [1, 1.3, 1]
              }}
              transition={{
                rotate: { duration: 0.8, ease: "easeInOut" },
                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
              }}
              className="bg-green-500/90 backdrop-blur-md shadow-lg flex items-center justify-center rounded-full shrink-0 h-9 w-9 origin-center"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
            </motion.div>

            {/* Text Card (Green) */}
            <AnimatePresence>
              {showText && (
                <motion.div 
                  layout
                  initial={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0, overflow: "hidden" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="shrink-0"
                >
                  <div className="bg-green-500/90 backdrop-blur-md text-white px-4 shadow-lg text-sm font-medium flex items-center justify-center rounded-full whitespace-nowrap h-9">
                    You're back online
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}