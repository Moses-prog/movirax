import { siteConfig } from "@/config/site";
import { cn } from "@/utils/helpers";
import { getTvShowPlayers } from "@/utils/players";
import { Card, Skeleton } from "@heroui/react";
import { useDisclosure, useDocumentTitle, useIdle, useLocalStorage } from "@mantine/hooks";
import dynamic from "next/dynamic";
import { parseAsInteger, useQueryState } from "nuqs";
import { memo, useMemo, useEffect } from "react";
import { Episode, TvShowDetails } from "tmdb-ts";
import useBreakpoints from "@/hooks/useBreakpoints";
import { ADS_WARNING_STORAGE_KEY, SpacingClasses } from "@/utils/constants";
import { usePlayerEvents } from "@/hooks/usePlayerEvents";

const AdsWarning = dynamic(() => import("@/components/ui/overlay/AdsWarning"));
const TvShowPlayerHeader = dynamic(() => import("./Header"));
const TvShowPlayerSourceSelection = dynamic(() => import("./SourceSelection"));
const TvShowPlayerEpisodeSelection = dynamic(() => import("./EpisodeSelection"));
const TvShowPlayerSeasonSelection = dynamic(() => import("./SeasonSelection"));

export interface TvShowPlayerProps {
  tv: TvShowDetails;
  id: number;
  seriesName: string;
  seasonName: string;
  episode: Episode;
  episodes: Episode[];
  nextEpisodeNumber: number | null;
  prevEpisodeNumber: number | null;
  startAt?: number;
  defaultServer?: number;
}


// -----------------------------------------------------------------
// AD BLOCKER LOGIC (REFINED FOR MOBILE COMPATIBILITY)
// -----------------------------------------------------------------
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
}

const TvShowPlayer: React.FC<TvShowPlayerProps> = ({
  tv,
  id,
  episode,
  episodes,
  startAt,
  defaultServer = 0,
  ...props
}) => {
  const [seen] = useLocalStorage<boolean>({
    key: ADS_WARNING_STORAGE_KEY,
    getInitialValueInEffect: false,
  });

  const { mobile } = useBreakpoints();
  const players = getTvShowPlayers(id, episode.season_number, episode.episode_number, startAt);
  const idle = useIdle(3000);

  useEffect(() => {
    installAdBlocker();
  }, []);
  const [sourceOpened, sourceHandlers] = useDisclosure(false);
  const [episodeOpened, episodeHandlers] = useDisclosure(false);
  const [seasonOpened, seasonHandlers] = useDisclosure(false);
  const [selectedSource, setSelectedSource] = useQueryState<number>(
    "src",
    parseAsInteger.withDefault(defaultServer),
  );

  usePlayerEvents({
    saveHistory: true,
    metadata: { season: episode.season_number, episode: episode.episode_number },
  });
  useDocumentTitle(
    `Play ${props.seriesName} - ${props.seasonName} - ${episode.name} | ${siteConfig.name}`,
  );

  const PLAYER = useMemo(() => players[selectedSource] || players[0], [players, selectedSource]);

  return (
    <>
      <AdsWarning />

      <div className={cn("relative", SpacingClasses.reset)}>
        <TvShowPlayerHeader
          id={id}
          episode={episode}
          hidden={idle && !mobile}
          selectedSource={selectedSource}
          onOpenSource={sourceHandlers.open}
          onOpenEpisode={episodeHandlers.open}
          onOpenSeason={seasonHandlers.open}
          totalSeasons={tv.number_of_seasons}
          currentSeason={episode.season_number}
          {...props}
        />

        <Card shadow="md" radius="none" className="relative h-screen">
          <Skeleton className="absolute h-full w-full" />
          {seen && (
            <iframe
              allowFullScreen
              key={PLAYER.title}
              src={PLAYER.source}
              className={cn("z-10 h-full", { "pointer-events-none": idle && !mobile })}
            />
          )}
        </Card>
      </div>

      <TvShowPlayerSourceSelection
        opened={sourceOpened}
        onClose={sourceHandlers.close}
        players={players}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
      />
      <TvShowPlayerSeasonSelection
        id={id}
        opened={seasonOpened}
        onClose={seasonHandlers.close}
        totalSeasons={tv.number_of_seasons}
        currentSeason={episode.season_number}
      />
      <TvShowPlayerEpisodeSelection
        id={id}
        opened={episodeOpened}
        onClose={episodeHandlers.close}
        episodes={episodes}
      />
    </>
  );
};

export default memo(TvShowPlayer);
