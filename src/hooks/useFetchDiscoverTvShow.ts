"use client";

import { DiscoverTvShowsFetchQueryType } from "@/types/tv";
import { TvShowDiscoverResult } from "tmdb-ts/dist/types/discover";
import { discoverTvShows, getTrending, popularTvShows, airingTodayTvShows, onTheAirTvShows, topRatedTvShows } from "@/actions/tmdb";

interface FetchDiscoverTvShows {
  page?: number;
  type?: DiscoverTvShowsFetchQueryType;
  genres?: string;
}

const useFetchDiscoverTvShow = ({
  page = 1,
  type = "discover",
  genres,
}: FetchDiscoverTvShows): Promise<TvShowDiscoverResult> => {
  const discover = () => discoverTvShows(page, genres);
  const todayTrending = () => getTrending("tv", "day", page) as any;
  const thisWeekTrending = () => getTrending("tv", "week", page) as any;
  const popular = () => popularTvShows(page);
  const airingToday = () => airingTodayTvShows(page);
  const onTheAir = () => onTheAirTvShows(page);
  const topRated = () => topRatedTvShows(page);

  const queryData = {
    discover,
    todayTrending,
    thisWeekTrending,
    popular,
    airingToday,
    onTheAir,
    topRated,
  }[type];

  return queryData();
};

export default useFetchDiscoverTvShow;