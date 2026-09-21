"use client";

import { DiscoverMoviesFetchQueryType } from "@/types/movie";
import { MovieDiscoverResult } from "tmdb-ts/dist/types/discover";
import { discoverMovies, getTrending, popularMovies, nowPlayingMovies, upcomingMovies, topRatedMovies } from "@/actions/tmdb";

interface FetchDiscoverMovies {
  page?: number;
  type?: DiscoverMoviesFetchQueryType;
  genres?: string;
}

const useFetchDiscoverMovies = ({
  page = 1,
  type = "discover",
  genres,
}: FetchDiscoverMovies): Promise<MovieDiscoverResult> => {
  const discover = () => discoverMovies(page, genres);
  const todayTrending = () => getTrending("movie", "day", page) as any;
  const thisWeekTrending = () => getTrending("movie", "week", page) as any;
  const popular = () => popularMovies(page);
  const nowPlaying = () => nowPlayingMovies(page);
  const upcoming = () => upcomingMovies(page);
  const topRated = () => topRatedMovies(page);

  const queryData = {
    discover,
    todayTrending,
    thisWeekTrending,
    popular,
    nowPlaying,
    upcoming,
    topRated,
  }[type];

  return queryData();
};

export default useFetchDiscoverMovies;