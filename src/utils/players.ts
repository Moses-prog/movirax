import { PlayersProps } from "@/types";

/**
 * Generates a list of movie players with their respective titles and source URLs.
 * Each player is constructed using the provided movie ID.
 *
 * @param {string | number} id - The ID of the movie to be embedded in the player URLs.
 * @param {number} [startAt] - The start position in seconds to be embedded in the player URLs. Optional.
 * @returns {PlayersProps[]} - An array of objects, each containing
 * the title of the player and the corresponding source URL.
 */
export const getMoviePlayers = (id: string | number, startAt?: number): PlayersProps[] => {
  return [
    {
      title: "Movirax Server 1",
      source: `https://vidlink.pro/movie/${id}?player=jw&primaryColor=006fee&secondaryColor=a2a2a2&iconColor=eefdec&autoplay=false&startAt=${startAt || ""}`,
      recommended: true,
      fast: true,
      ads: true,
      resumable: true,
    },
    {
      title: "Movirax Server 2",
      source: `https://vidlink.pro/movie/${id}?primaryColor=006fee&autoplay=false&startAt=${startAt}`,
      recommended: true,
      fast: true,
      ads: true,
      resumable: true,
    },
    {
      title: "Movirax Server 3",
      source: `https://www.vidking.net/embed/movie/${id}?color=006fee&autoplay=false`,
      recommended: true,
      fast: true,
      resumable: true,
    },
    {
      title: "Movirax Server 15",
      source: `https://vidsrc.cc/v3/embed/movie/${id}?autoPlay=false`,
      recommended: true,
      fast: true,
      ads: true,
    },
    {
      title: "Movirax Server 4",
      source: `https://embed.su/embed/movie/${id}`,
      ads: true,
    },
    {
      title: "Movirax Server 5",
      source: `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`,
      fast: true,
      ads: true,
    },
    {
      title: "Movirax Server 6",
      source: `https://player.autoembed.cc/embed/movie/${id}`,
      ads: true,
    },
    {
      title: "Movirax Server 7",
      source: `https://www.nontongo.win/embed/movie/${id}`,
      ads: true,
    },
    {
      title: "Movirax Server 8",
      source: `https://autoembed.co/movie/tmdb/${id}`,
      fast: true,
      ads: true,
    },
    {
      title: "Movirax Server 10",
      source: `https://www.2embed.cc/embed/${id}`,
      ads: true,
    },
    {
      title: "Movirax Server 11",
      source: `https://vidsrc.xyz/embed/movie/${id}`,
      ads: true,
    },
    {
      title: "Movirax Server 14",
      source: `https://vidsrc.cc/v2/embed/movie/${id}?autoPlay=false`,
      ads: true,
    },
    {
      title: "Movirax Server 16",
      source: `https://moviesapi.club/movie/${id}`,
      ads: true,
    },
  ];
};

/**
 * Generates a list of TV show players with their respective titles and source URLs.
 * Each player is constructed using the provided TV show ID, season, and episode.
 */
export const getTvShowPlayers = (
  id: string | number,
  season: number,
  episode: number,
  startAt?: number,
): PlayersProps[] => {
  return [
    {
      title: "Movirax Server 1",
      source: `https://vidlink.pro/tv/${id}/${season}/${episode}?player=jw&primaryColor=f5a524&secondaryColor=a2a2a2&iconColor=eefdec&autoplay=false&startAt=${startAt || ""}`,
      recommended: true,
      fast: true,
      ads: true,
      resumable: true,
    },
    {
      title: "Movirax Server 2",
      source: `https://vidlink.pro/tv/${id}/${season}/${episode}?primaryColor=f5a524&autoplay=false&startAt=${startAt}`,
      recommended: true,
      fast: true,
      ads: true,
      resumable: true,
    },
    {
      title: "Movirax Server 3",
      source: `https://www.vidking.net/embed/tv/${id}/${season}/${episode}?color=f5a524&autoplay=false`,
      recommended: true,
      fast: true,
      resumable: true,
    },
    {
      title: "Movirax Server 4",
      source: `https://embed.su/embed/tv/${id}/${season}/${episode}`,
      ads: true,
    },
    {
      title: "Movirax Server 5",
      source: `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${season}&e=${episode}`,
      fast: true,
      ads: true,
    },
    {
      title: "Movirax Server 6",
      source: `https://filmku.stream/embed/series?tmdb=${id}&sea=${season}&epi=${episode}`,
      ads: true,
    },
    {
      title: "Movirax Server 7",
      source: `https://www.NontonGo.win/embed/tv/${id}/${season}/${episode}`,
      ads: true,
    },
    {
      title: "Movirax Server 8",
      source: `https://autoembed.co/tv/tmdb/${id}-${season}-${episode}`,
      fast: true,
      ads: true,
    },
    {
      title: "Movirax Server 9",
      source: `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}`,
      ads: true,
    },
    {
      title: "Movirax Server 10",
      source: `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`,
      ads: true,
    },
    {
      title: "Movirax Server 11",
      source: `https://vidsrc.xyz/embed/tv/${id}/${season}/${episode}`,
      ads: true,
    },
    {
      title: "Movirax Server 12",
      source: `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`,
      ads: true,
    },
    {
      title: "Movirax Server 13",
      source: `https://vidsrc.icu/embed/tv/${id}/${season}/${episode}`,
      ads: true,
    },
    {
      title: "Movirax Server 14",
      source: `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}?autoPlay=false`,
      ads: true,
    },
    {
      title: "Movirax Server 15",
      source: `https://vidsrc.cc/v3/embed/tv/${id}/${season}/${episode}?autoPlay=false`,
      recommended: true,
      fast: true,
      ads: true,
    },
    {
      title: "Movirax Server 16",
      source: `https://moviesapi.club/tv/${id}-${season}-${episode}`,
      ads: true,
    },
  ];
};