"use server";
import { tmdb } from "@/api/tmdb";
import { env } from "@/utils/env";

export async function getMovieDetails(id: number, append?: string[]) {
  return tmdb.movies.details(id, append as any);
}

export async function getTvShowDetails(id: number, append?: string[]) {
  return tmdb.tvShows.details(id, append as any);
}

export async function getTvShowSeason(id: number, seasonNumber: number) {
  return tmdb.tvShows.season(id, seasonNumber);
}

export async function searchMovies(query: string, page: number) {
  return tmdb.search.movies({ query, page });
}

export async function searchTvShows(query: string, page: number) {
  return tmdb.search.tvShows({ query, page });
}

export async function getMovieGenres() {
  return tmdb.genres.movies();
}

export async function getTvGenres() {
  return tmdb.genres.tvShows();
}

export async function getTrending(mediaType: "movie" | "tv", timeWindow: "day" | "week", page?: number) {
  return tmdb.trending.trending(mediaType, timeWindow, { page });
}

export async function getLandingMovies() {
  const token = process.env.TMDB_ACCESS_TOKEN || process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
  const res = await fetch("https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&page=1", {
    headers: { Authorization: `Bearer ${token}`, accept: "application/json" }
  });
  return res.json();
}

export async function getLandingMovieVideos(id: number) {
  const token = process.env.TMDB_ACCESS_TOKEN || process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos`, {
    headers: { Authorization: `Bearer ${token}`, accept: "application/json" }
  });
  return res.json();
}

export async function discoverMovies(page: number, genres?: string, sortBy?: string) {
  return tmdb.discover.movie({ page, with_genres: genres, sort_by: sortBy as any });
}
export async function popularMovies(page: number) {
  return tmdb.movies.popular({ page });
}
export async function nowPlayingMovies(page: number) {
  return tmdb.movies.nowPlaying({ page });
}
export async function upcomingMovies(page: number) {
  return tmdb.movies.upcoming({ page });
}
export async function topRatedMovies(page: number) {
  return tmdb.movies.topRated({ page });
}

export async function discoverTvShows(page: number, genres?: string, sortBy?: string) {
  return tmdb.discover.tvShow({ page, with_genres: genres, sort_by: sortBy as any });
}
export async function popularTvShows(page: number) {
  return tmdb.tvShows.popular({ page });
}
export async function airingTodayTvShows(page: number) {
  return tmdb.tvShows.airingToday({ page });
}
export async function onTheAirTvShows(page: number) {
  return tmdb.tvShows.onTheAir({ page });
}
export async function topRatedTvShows(page: number) {
  return tmdb.tvShows.topRated({ page });
}
