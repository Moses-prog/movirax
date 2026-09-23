import { syncHistory } from "@/actions/histories";
import { ContentType } from "@/types";
import { diff } from "@/utils/helpers";
import { useDocumentVisibility } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import useSupabaseUser from "./useSupabaseUser";

export type PlayerEventType = "play" | "pause" | "seeked" | "ended" | "timeupdate";

export interface BasePlayerEventEnvelope<T> {
  type: "PLAYER_EVENT" | "MEDIA_DATA";
  data: T;
}

export interface VidlinkEventData {
  event: PlayerEventType;
  currentTime: number;
  duration: number;
  mtmdbId: number;
  mediaType: ContentType;
  season?: number;
  episode?: number;
}

export type VidlinkPlayerMessage = BasePlayerEventEnvelope<VidlinkEventData>;

export interface VidkingEventData {
  event: PlayerEventType;
  currentTime: number;
  duration: number;
  id: string | number;
  mediaType: ContentType;
  season?: number;
  episode?: number;
  progress?: number;
}

export type VidkingPlayerMessage = BasePlayerEventEnvelope<VidkingEventData>;

export interface UnifiedPlayerEventData {
  event: PlayerEventType;
  currentTime: number;
  duration: number;
  mediaId: string | number;
  mediaType: ContentType;
  season?: number;
  episode?: number;
  progress?: number;
}

export interface PlayerAdapter<RawMessage extends BasePlayerEventEnvelope<any>> {
  /** Domain origin for identifying source */
  origin: `https://${string}`;
  /** Converts raw → unified structure */
  parse: (raw: RawMessage) => UnifiedPlayerEventData | null;
}

export type AdapterMap = Record<string, PlayerAdapter<any>>;

export const playerAdapters = {
  vidlink: {
    origin: "https://vidlink.pro",
    parse: (raw) => {
      if (raw.type !== "PLAYER_EVENT") return null;
      const d = raw.data;
      return {
        ...d,
        mediaId: d.mtmdbId,
      };
    },
  } satisfies PlayerAdapter<VidlinkPlayerMessage>,

  vidking: {
    origin: "https://www.vidking.net",
    parse: (raw) => {
      if (raw.type !== "PLAYER_EVENT") return null;
      const d = raw.data;
      return {
        ...d,
        mediaId: d.id,
      };
    },
  } satisfies PlayerAdapter<VidkingPlayerMessage>,
} as const satisfies AdapterMap;

export interface UsePlayerEventsOptions {
  mediaId?: number | string;
  mediaType?: "movie" | "tv";
  metadata?: { season?: number; episode?: number };
  saveHistory?: boolean;
  onPlay?: (data: UnifiedPlayerEventData) => void;
  onPause?: (data: UnifiedPlayerEventData) => void;
  onSeeked?: (data: UnifiedPlayerEventData) => void;
  onEnded?: (data: UnifiedPlayerEventData) => void;
  onTimeUpdate?: (data: UnifiedPlayerEventData) => void;
}

export function usePlayerEvents(options: UsePlayerEventsOptions = {}) {
  const { data: user } = useSupabaseUser();
  const documentState = useDocumentVisibility();

  const { mediaId, mediaType, metadata, saveHistory, onPlay, onPause, onSeeked, onEnded, onTimeUpdate } = options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lastEvent, setLastEvent] = useState<PlayerEventType | null>(null);
  const [lastCurrentTime, setLastCurrentTime] = useState(0);

  const eventDataRef = useRef<UnifiedPlayerEventData | null>(null);

  // Fallback: Initial sync for players that don't emit postMessage events (e.g. vidsrc.sh)
  useEffect(() => {
    if (!saveHistory || !user || !mediaId) return;
    
    // Give it a brief delay to avoid spamming if they immediately close it
    const timer = setTimeout(() => {
      if (!eventDataRef.current) {
        syncToServer({
          event: "play",
          currentTime: 0,
          duration: 0,
          mediaId: mediaId,
          mediaType: mediaType || "movie",
          season: metadata?.season,
          episode: metadata?.episode
        });
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [saveHistory, user, mediaId, mediaType, metadata?.season, metadata?.episode]);

  const syncToServer = async (data: UnifiedPlayerEventData, completed?: boolean) => {
    if (!saveHistory || !user) return;
    if (lastCurrentTime !== 0 && diff(data.currentTime, lastCurrentTime) <= 5) return; // prevent spam

    const payload: UnifiedPlayerEventData = {
      ...data,
      mediaId: data.mediaId || mediaId || "",
      mediaType: data.mediaType || mediaType || "movie",
      season: data.season || metadata?.season || 0,
      episode: data.episode || metadata?.episode || 0,
    };

    const { success, message } = await syncHistory(payload, completed);
    if (success) setLastCurrentTime(data.currentTime);
    else {
      console.error("Save history failed:", message);
      alert("History sync failed: " + message);
    }
  };

  useEffect(() => {
    if (!saveHistory || !user) return;
    if (documentState === "visible") return;
    if (!eventDataRef.current) return;
    syncToServer(eventDataRef.current);
  }, [documentState, lastCurrentTime]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!saveHistory || !user) return;
      if (!eventDataRef.current) return;

      const payload = {
        ...eventDataRef.current,
        completed: eventDataRef.current.event === "ended",
      };
      navigator.sendBeacon("/api/player/save-history", JSON.stringify(payload));
    };

    const handleMessage = (event: MessageEvent) => {
      const adapter = Object.values(playerAdapters).find((a) => a.origin === event.origin);
      if (!adapter) return;

      let rawData: any;
      try {
        rawData = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch (err) {
        console.warn("Invalid JSON from player:", err);
        return;
      }

      const parsed = adapter.parse(rawData);
      if (!parsed) return;

      // Inject explicitly provided mediaId and mediaType if adapter didn't parse them
      const enrichedParsed = {
        ...parsed,
        mediaId: parsed.mediaId || mediaId || "",
        mediaType: parsed.mediaType || mediaType || "movie",
        season: parsed.season || metadata?.season || 0,
        episode: parsed.episode || metadata?.episode || 0,
      };

      eventDataRef.current = enrichedParsed;
      setLastEvent(enrichedParsed.event);
      switch (enrichedParsed.event) {
        case "play":
          setIsPlaying(true);
          onPlay?.(enrichedParsed);
          break;
        case "pause":
          setIsPlaying(false);
          onPause?.(enrichedParsed);
          break;
        case "ended":
          setIsPlaying(false);
          syncToServer(enrichedParsed, true);
          onEnded?.(enrichedParsed);
          break;
        case "seeked":
          setCurrentTime(enrichedParsed.currentTime);
          setDuration(enrichedParsed.duration);
          onSeeked?.(enrichedParsed);
          break;
        case "timeupdate":
          setCurrentTime(enrichedParsed.currentTime);
          setDuration(enrichedParsed.duration);
          onTimeUpdate?.(enrichedParsed);
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (eventDataRef.current) handleBeforeUnload();
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return { isPlaying, currentTime, duration, lastEvent };
}
