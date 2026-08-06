"use client";

import { Skeleton } from "@heroui/react";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { ListVideo, History, MonitorPlay } from "lucide-react";
import CommunitySection from "./CommunitySection";
import TestimonialsSection from "./TestimonialsSection";
import PricingSection from "./PricingSection";
import FAQSection from "./FAQSection";

interface Movie {
  id: number;
  poster_path: string;
  backdrop_path?: string;
  trailerKey?: string;
  title: string;
  vote_average: number;
}

export default function LandingPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const accessToken = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
        if (!accessToken) {
          setMoviesLoading(false);
          return;
        }

        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?primary_release_year=2026&sort_by=popularity.desc`, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();

        if (data?.results && Array.isArray(data.results)) {
          const moviesData = data.results
            .filter((movie: any) => movie.poster_path)
            .slice(0, 8) // Fetch 8 movies for the grid
            .map((movie: any) => ({
              id: movie.id,
              poster_path: movie.poster_path,
              backdrop_path: movie.backdrop_path,
              title: movie.title,
              vote_average: movie.vote_average,
            }));
            
          if (moviesData.length > 0) {
            try {
              const videoRes = await fetch(`https://api.themoviedb.org/3/movie/${moviesData[0].id}/videos`, {
                headers: {
                  accept: "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
              });
              if (videoRes.ok) {
                const videoData = await videoRes.json();
                const trailer = videoData.results?.find((v: any) => v.site === "YouTube" && v.type === "Trailer");
                if (trailer) {
                  moviesData[0].trailerKey = trailer.key;
                }
              }
            } catch (e) {
              console.error("Failed to fetch trailer:", e);
            }
          }
          setMovies(moviesData);
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setMoviesLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const bentoVariant = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white selection:bg-red-500/30 transition-colors duration-300">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-orange-500 origin-left z-50"
        style={{ scaleX }}
      />

      <div className="relative z-10 px-4 py-20 lg:px-8 max-w-[1400px] mx-auto">
        
        {/* Bento Grid Container */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6 auto-rows-[auto] md:auto-rows-[260px]"
        >
          {/* Main Hero Cell (Spans 4 cols, 2 rows) */}
          <motion.div variants={bentoVariant} className="md:col-span-4 xl:col-span-4 md:row-span-2 p-4 lg:p-8 flex flex-col justify-center relative group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center space-x-2 mb-8">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-semibold tracking-wider uppercase text-gray-600 dark:text-gray-300">Movira X</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-semibold tracking-tight leading-[1.1] mb-6 text-gray-900 dark:text-white">
                Your cinematic universe, <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300">curated perfectly.</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-lg">
                Track watched films, save favorites, and build your personal collection within an uncompromisingly clean ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth?form=register">
                  <button className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl dark:shadow-none">
                    Start Free Trial
                  </button>
                </Link>
                <Link href="/auth">
                  <button className="px-8 py-4 bg-transparent border border-gray-300 dark:border-white/20 rounded-2xl font-bold text-gray-800 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    Sign In
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Quick Stat Cell (Spans 2 cols, 1 row) */}
          <motion.div variants={bentoVariant} className="md:col-span-2 xl:col-span-2 md:row-span-1 bg-white dark:bg-[#121212] rounded-[2.5rem] border border-gray-200 dark:border-white/5 p-8 flex flex-col justify-center relative overflow-hidden group shadow-sm dark:shadow-none transition-colors">
            <div className="absolute -bottom-10 -right-10 text-[180px] text-black/5 dark:text-white/5 font-black leading-none group-hover:scale-110 transition-transform duration-700">50K</div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 relative z-10">Database</h3>
            <div className="text-5xl font-semibold mb-2 text-gray-900 dark:text-white relative z-10">50,000+</div>
            <p className="text-gray-500 dark:text-gray-400 relative z-10">Movies updated daily.</p>
          </motion.div>

          {/* Movie Stack Cell (Spans 2 cols, 1 row) */}
          <motion.div variants={bentoVariant} className="md:col-span-2 xl:col-span-2 md:row-span-1 bg-red-600 rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer shadow-sm dark:shadow-none">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">Trending Now</h3>
              <p className="text-red-200 text-sm">Discover what the world is watching.</p>
            </div>
            {/* Small poster fan out */}
            <div className="absolute bottom-[-20px] right-[-10px] w-48 h-64 rotate-12 group-hover:rotate-0 group-hover:-translate-y-4 transition-all duration-500 shadow-2xl">
              {moviesLoading ? (
                <Skeleton className="w-full h-full rounded-xl bg-black/20" />
              ) : movies[0] ? (
                <Image src={`https://image.tmdb.org/t/p/w300${movies[0].poster_path}`} alt="Trending" fill className="object-cover rounded-xl border-4 border-red-500" />
              ) : null}
            </div>
          </motion.div>

          {/* Large Feature Cell (Spans 3 cols, 2 rows) */}
          <motion.div variants={bentoVariant} className="md:col-span-2 xl:col-span-3 md:row-span-2 bg-white dark:bg-[#121212] rounded-[2.5rem] border border-gray-200 dark:border-white/5 p-10 relative overflow-hidden flex flex-col justify-end group shadow-sm dark:shadow-none transition-colors">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-[#121212] z-10" />
            <div className="absolute top-8 left-8 right-8 bottom-32 flex flex-col gap-3 opacity-50 group-hover:opacity-100 transition-opacity duration-700">
              {/* Mock UI Watchlist */}
              {moviesLoading ? (
                <>
                  <Skeleton className="w-full h-20 rounded-2xl bg-black/5 dark:bg-white/5" />
                  <Skeleton className="w-full h-20 rounded-2xl bg-black/5 dark:bg-white/5" />
                  <Skeleton className="w-full h-20 rounded-2xl bg-black/5 dark:bg-white/5" />
                </>
              ) : (
                movies.slice(2, 5).map((movie, i) => (
                  <div key={i} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-3 flex items-center gap-4 transform group-hover:translate-x-2 transition-transform" style={{ transitionDelay: `${i * 100}ms` }}>
                    <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                      <Image src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 dark:text-white font-semibold truncate text-sm">{movie.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-green-600 dark:text-green-400 font-bold bg-green-100 dark:bg-green-400/10 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-400/20">{Math.round(movie.vote_average * 10)}% Match</span>
                        <span className="text-[10px] text-gray-500 hidden sm:block">Added Today</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-gray-300 dark:border-white/10 flex flex-shrink-0 items-center justify-center text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white/30 transition-all cursor-pointer">
                       ✓
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="relative z-20">
              <motion.div 
                className="w-12 h-12 bg-red-100 dark:bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-red-600 dark:text-red-500"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ListVideo className="w-6 h-6" />
              </motion.div>
              <h3 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">Smart Watchlist</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Organize your queue with intelligent sorting, custom lists, ratings, and detailed private notes.</p>
            </div>
          </motion.div>

          {/* Posters Grid Cell (Spans 3 cols, 2 rows) */}
          <motion.div variants={bentoVariant} className="md:col-span-2 xl:col-span-3 md:row-span-2 bg-white dark:bg-[#121212] rounded-[2.5rem] border border-gray-200 dark:border-white/5 p-6 relative overflow-hidden flex flex-col shadow-sm dark:shadow-none transition-colors min-h-[400px]">
            <div className="flex justify-between items-center mb-6 px-4 z-10 relative">
               <h3 className="text-xl font-semibold text-white drop-shadow-md">Weekly Highlights</h3>
               <span className="text-sm text-white/90 uppercase tracking-widest flex items-center gap-2 drop-shadow-md">
                 <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                 Trending Now
               </span>
            </div>
            
            <div className="absolute inset-0 w-full h-full bg-black/5 dark:bg-white/5 overflow-hidden">
              {moviesLoading ? (
                <Skeleton className="w-full h-full" />
              ) : movies[0] ? (
                <>
                  {movies[0].trailerKey ? (
                    <div className="absolute inset-0 pointer-events-none bg-black">
                      <iframe 
                        ref={iframeRef}
                        src={`https://www.youtube.com/embed/${movies[0].trailerKey}?autoplay=1&mute=1&loop=1&playlist=${movies[0].trailerKey}&controls=0&modestbranding=1&showinfo=0&rel=0&enablejsapi=1`}
                        title="Trailer"
                        className="w-[150%] h-[150%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover opacity-80"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <Image 
                      src={`https://image.tmdb.org/t/p/w1280${movies[0].backdrop_path || movies[0].poster_path}`} 
                      alt={movies[0].title} 
                      fill 
                      className="object-cover" 
                    />
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/30 pointer-events-none" />
                  
                  {/* Content & Mute button */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-between items-end z-10">
                    <div className="max-w-[70%]">
                      <h4 className="text-3xl font-bold text-white mb-2 drop-shadow-lg truncate">{movies[0].title}</h4>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-white bg-red-600 px-2 py-1 rounded border border-red-500">#1 TRENDING</span>
                        <span className="text-sm font-bold text-green-400 drop-shadow-md">{Math.round(movies[0].vote_average * 10)}% Match</span>
                      </div>
                    </div>
                    {movies[0].trailerKey && (
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          if (iframeRef.current && iframeRef.current.contentWindow) {
                            iframeRef.current.contentWindow.postMessage(
                              JSON.stringify({ event: 'command', func: isMuted ? 'unMute' : 'mute', args: [] }),
                              '*'
                            );
                          }
                          setIsMuted(!isMuted);
                        }}
                        className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all pointer-events-auto shadow-lg"
                        aria-label={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                        )}
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">No movies found</div>
              )}
            </div>
          </motion.div>

          {/* Small Feature 1 */}
          <motion.div variants={bentoVariant} className="md:col-span-2 xl:col-span-2 md:row-span-1 bg-white dark:bg-[#121212] rounded-[2.5rem] border border-gray-200 dark:border-white/5 p-8 flex flex-col justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group shadow-sm dark:shadow-none">
            <motion.div 
              className="w-10 h-10 bg-red-100 dark:bg-white/10 rounded-xl flex items-center justify-center text-red-600 dark:text-red-500 origin-bottom-left"
              whileHover={{ rotate: -15, scale: 1.2 }}
            >
              <History className="w-5 h-5" />
            </motion.div>
            <div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Track History</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Never forget what you watched or when you watched it.</p>
            </div>
          </motion.div>

          {/* Small Feature 2 */}
          <motion.div variants={bentoVariant} className="md:col-span-2 xl:col-span-2 md:row-span-1 bg-white dark:bg-[#121212] rounded-[2.5rem] border border-gray-200 dark:border-white/5 p-8 flex flex-col justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group shadow-sm dark:shadow-none">
            <motion.div 
              className="w-10 h-10 bg-red-100 dark:bg-white/10 rounded-xl flex items-center justify-center text-red-600 dark:text-red-500"
              whileHover={{ scale: 1.15, y: -2 }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <MonitorPlay className="w-5 h-5" />
            </motion.div>
            <div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Resume Anywhere</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Pick up exactly where you left off across all devices.</p>
            </div>
          </motion.div>

          {/* CTA Box */}
          <motion.div variants={bentoVariant} className="md:col-span-4 xl:col-span-2 md:row-span-1 bg-gray-900 dark:bg-white text-white dark:text-black rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center hover:scale-[1.02] transition-transform cursor-pointer group shadow-xl dark:shadow-none">
             <h3 className="text-3xl font-bold mb-2">Ready to dive in?</h3>
             <p className="text-gray-400 dark:text-gray-600 mb-6">Join the community today.</p>
             <Link href="/auth?form=register">
                <button className="px-6 py-3 bg-white dark:bg-black text-black dark:text-white rounded-xl font-bold group-hover:bg-red-500 dark:group-hover:bg-red-600 group-hover:text-white transition-colors">
                  Create Account
                </button>
             </Link>
          </motion.div>

        </motion.div>
      </div>

      <CommunitySection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />

      <div className="relative z-10 px-4 lg:px-8 max-w-[1400px] mx-auto mb-12">
        {/* Minimal Footer */}
        <footer className="pt-8 border-t border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 transition-colors">
          <p>&copy; 2026 Movira X. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
