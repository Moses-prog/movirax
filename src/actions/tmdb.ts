"use server";
import { tmdb } from "@/api/tmdb";

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

export async function getTrending(mediaType: "movie" | "tv", timeWindow: "day" | "week") {
  return tmdb.trending.trending(mediaType, timeWindow);
}

export async function getLandingMovies() {
  const res = await fetch("https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&page=1", {
    headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`, accept: "application/json" }
  });
  return res.json();
}

export async function getLandingMovieVideos(id: number) {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos`, {
    headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`, accept: "application/json" }
  });
  return res.json();
}