const fs = require("fs");
let c = fs.readFileSync("src/config/site.tsx", "utf8");

const movieGenres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" }
];

const tvGenres = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 9648, name: "Mystery" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" }
];

const movieGenreBlocks = movieGenres.map(g => `      { name: "${g.name} Movies", query: (page = 1) => tmdb.discover.movie({ with_genres: \'${g.id}\', sort_by: \'popularity.desc\', page }), param: "genre-${g.id}" },`).join("\n");
const tvGenreBlocks = tvGenres.map(g => `      { name: "${g.name} TV", query: (page = 1) => tmdb.discover.tvShow({ with_genres: \'${g.id}\', sort_by: \'popularity.desc\', page }), param: "genre-${g.id}" },`).join("\n");

// Replace all the broken movie genre blocks
c = c.replace(/\{ name: "[^"]+ Movies", query: \(page = 1\) => tmdb\.discover\.movie\(\{ with_genres: '[^']*', sort_by: 'popularity\.desc', page \}\), param: "genre-[0-9]*" \},?\r?\n?/g, "");
c = c.replace(/\{ name: "[^"]+ Movies", query: \(page = 1\) => tmdb\.discover\.movie\(\{ with_genres: '[^']*', sort_by: 'popularity\.desc', page \}\), param: "genre-" \},?\r?\n?/g, "");

// Insert them after Top Rated Movies
c = c.replace(/name: "Top Rated Movies",\s*query: \(page = 1\) => tmdb\.movies\.topRated\(\{ page \}\),\s*param: "topRated",\s*\},/, `name: "Top Rated Movies",\n        query: (page = 1) => tmdb.movies.topRated({ page }),\n        param: "topRated",\n      },\n` + movieGenreBlocks + "\n");

// Replace all the broken TV genre blocks
c = c.replace(/\{ name: "[^"]+ TV.*?", query: \(page = 1\) => tmdb\.discover\.tvShow\(\{ with_genres: '[^']*', sort_by: 'popularity\.desc', page \}\), param: "genre-[0-9]*" \},?\r?\n?/g, "");
c = c.replace(/\{ name: "[^"]+ TV.*?", query: \(page = 1\) => tmdb\.discover\.tvShow\(\{ with_genres: '[^']*', sort_by: 'popularity\.desc', page \}\), param: "genre-" \},?\r?\n?/g, "");

// Insert them after Top Rated TV Shows
c = c.replace(/name: "Top Rated TV Shows",\s*\/\/ @ts-expect-error:[^\n]+\n\s*query: \(page = 1\) => tmdb\.tvShows\.topRated\(\{ page \}\),\s*param: "topRated",\s*\},/, `name: "Top Rated TV Shows",\n        // @ts-expect-error:\n        query: (page = 1) => tmdb.tvShows.topRated({ page }),\n        param: "topRated",\n      },\n` + tvGenreBlocks + "\n");

fs.writeFileSync("src/config/site.tsx", c);