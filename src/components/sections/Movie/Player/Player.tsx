"use client";

import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { parseAsInteger, useQueryState } from "nuqs";
import {
  useDisclosure,
  useDocumentTitle,
  useIdle,
  useLocalStorage,
} from "@mantine/hooks";
import { Skeleton } from "@heroui/react";

import { ADS_WARNING_STORAGE_KEY, SpacingClasses } from "@/utils/constants";
import { siteConfig } from "@/config/site";
import useBreakpoints from "@/hooks/useBreakpoints";
import { cn } from "@/utils/helpers";
import { mutateMovieTitle } from "@/utils/movies";
import { getMoviePlayers } from "@/utils/players";
import { MovieDetails } from "tmdb-ts/dist/types/movies";
import { usePlayerEvents } from "@/hooks/usePlayerEvents";

// --- Types ---
type PlayerAction = "play" | "pause" | "setVolume" | "mute" | "seek";

interface IframeMessage {
  type: "PLAYER_COMMAND";
  action: PlayerAction;
  value?: number | boolean | string;
}

const AdsWarning = dynamic(() => import("@/components/ui/overlay/AdsWarning"));
const MoviePlayerHeader = dynamic(() => import("./Header"));
const MoviePlayerSourceSelection = dynamic(() => import("./SourceSelection"));

// ─────────────────────────────────────────────────────────────────
// AD BLOCKER LOGIC (REFINED FOR MOBILE COMPATIBILITY)
// ─────────────────────────────────────────────────────────────────
function installAdBlocker() {
  if (typeof window === "undefined" || (window as any).__adBlockInstalled) return;
  (window as any).__adBlockInstalled = true;

  const ownOrigin = window.location.origin;
  const isSafe = (url: string) =>
    !url ||
    url.startsWith(ownOrigin) ||
    url.startsWith("/") ||
    url.startsWith("#") ||
    url.startsWith("blob:") ||
    url === "about:blank";

  // 1. Permanent Override of Window Triggers
  window.open = () => null;
  window.alert = () => null;

  // 2. Link Interception (Capture Phase)
  document.addEventListener("click", (e) => {
    const anchor = (e.target as Element)?.closest("a");
    if (!anchor) return;
    const href = anchor.getAttribute("href") ?? "";
    const target = anchor.getAttribute("target") ?? "";
    
    if (!isSafe(href) && ["_blank", "_top", "_parent"].includes(target)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);

  // 3. Location Proxy (Detection Avoidance)
  try {
    const realLocation = window.location;
    const proxy = new Proxy(realLocation, {
      set(target, prop, value) {
        if (prop === "href" && !isSafe(String(value))) return true;
        (target as any)[prop] = value;
        return true;
      },
      get(target, prop) {
        const val = (target as any)[prop];
        if (typeof val === "function") {
          return (...args: any[]) => {
            if (["assign", "replace"].includes(prop as string) && !isSafe(args[0])) return;
            return val.apply(target, args);
          };
        }
        return val;
      },
    });

    Object.defineProperty(window, "location", { get: () => proxy, configurable: true });
  } catch (e) { /* Silently fail if browser restricts location redefine */ }

  // 4. Force Focus Loop - REMOVED
  // Aggressive window.focus() loops prevent mobile browsers from natively handling 
  // cross-origin iframe interactions and fullscreen API requests.
}

// ─────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────
const MoviePlayer: React.FC<{ movie: MovieDetails; startAt?: number }> = ({
  movie,
  startAt,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const shieldTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isShieldActive, setIsShieldActive] = useState(true);
  const [iframeSrc, setIframeSrc] = useState("");
  const [seen] = useLocalStorage<boolean>({
    key: ADS_WARNING_STORAGE_KEY,
    getInitialValueInEffect: false,
  });

  const players = getMoviePlayers(movie.id, startAt);
  const title = mutateMovieTitle(movie);
  const idle = useIdle(4000);
  const { mobile } = useBreakpoints();
  const [opened, handlers] = useDisclosure(false);
  const [selectedSource, setSelectedSource] = useQueryState<number>(
    "src",
    parseAsInteger.withDefault(0),
  );

  usePlayerEvents({ saveHistory: true });
  useDocumentTitle(`Play ${title} | ${siteConfig.name}`);

  const PLAYER = useMemo(() => {
    const basePlayer = players[selectedSource] || players[0];
    const sep = basePlayer.source.includes("?") ? "&" : "?";
    
    // Disable forced autoplay on mobile to prevent OS-level media blocks
    const autoPlayParam = mobile ? "" : "autoplay=1&";

    return {
      ...basePlayer,
      source: `${basePlayer.source}${sep}${autoPlayParam}modestbranding=1`,
    };
  }, [players, selectedSource, mobile]);

  useEffect(() => {
    installAdBlocker();
    setIframeSrc(PLAYER.source);
    setIsShieldActive(true);
  }, [PLAYER.source]);

  // ── Sync UI via postMessage ──
  const postCommand = useCallback((action: PlayerAction, value?: any) => {
    if (iframeRef.current?.contentWindow) {
      const payload: IframeMessage = { type: "PLAYER_COMMAND", action, value };
      iframeRef.current.contentWindow.postMessage(payload, "*");
    }
  }, []);

  // ── Shield Logic ──
  const handleShieldInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    (window as any).__userGesture = true;
    
    setIsShieldActive(false);
    iframeRef.current?.focus();

    if (shieldTimerRef.current) clearTimeout(shieldTimerRef.current);
    // Re-enable shield after 10s of inactivity to catch delayed ads
    shieldTimerRef.current = setTimeout(() => {
      setIsShieldActive(true);
      (window as any).__userGesture = false;
    }, 10000);
  };

  return (
    <>
      <AdsWarning />
      <div className={cn("relative h-screen w-full bg-black overflow-hidden flex flex-col", SpacingClasses.reset)}>
        
        <MoviePlayerHeader
          id={movie.id}
          movieName={title}
          onOpenSource={handlers.open}
          hidden={idle && !mobile}
        />

        <div className="relative flex-1 w-full bg-black flex items-center justify-center">
          <Skeleton className="absolute inset-0 h-full w-full opacity-10" />

          {seen && iframeSrc && (
            <div className="relative w-full h-full">
              <iframe
                ref={iframeRef}
                key={PLAYER.title}
                src={iframeSrc}
                allowFullScreen
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                referrerPolicy="no-referrer"
                className="absolute inset-0 z-10 w-full h-full border-0"
              />

              {/* THE SHIELD: Only active on Desktop so mobile users can tap the native play button */}
              {(isShieldActive && !mobile) && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-20 cursor-pointer bg-transparent"
                  onMouseDown={handleShieldInteraction}
                  onTouchStart={handleShieldInteraction}
                />
              )}
            </div>
          )}
        </div>

      </div>

      <MoviePlayerSourceSelection
        opened={opened}
        onClose={handlers.close}
        players={players}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
      />
    </>
  );
};

export default MoviePlayer;