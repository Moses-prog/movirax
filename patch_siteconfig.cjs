const fs = require("fs");

let content = fs.readFileSync("src/config/site.tsx", "utf8");

content = content.replace(/import \{ tmdb \} from "@\/api\/tmdb";\n?/, `import { getTrending, popularMovies, nowPlayingMovies, upcomingMovies, topRatedMovies, discoverMovies, popularTvShows, airingTodayTvShows, onTheAirTvShows, topRatedTvShows, discoverTvShows } from "@/actions/tmdb";\n`);

content = content.replace(/tmdb\.trending\.trending\("movie", "day", \{ page \}\)/g, 'getTrending("movie", "day", page) as any');
content = content.replace(/tmdb\.trending\.trending\("movie", "week", \{ page \}\)/g, 'getTrending("movie", "week", page) as any');
content = content.replace(/tmdb\.movies\.popular\(\{ page \}\)/g, 'popularMovies(page)');
content = content.replace(/tmdb\.movies\.nowPlaying\(\{ page \}\)/g, 'nowPlayingMovies(page)');
content = content.replace(/tmdb\.movies\.upcoming\(\{ page \}\)/g, 'upcomingMovies(page)');
content = content.replace(/tmdb\.movies\.topRated\(\{ page \}\)/g, 'topRatedMovies(page)');
content = content.replace(/tmdb\.discover\.movie\(\{ with_genres: '([^']+)', sort_by: '([^']+)', page \}\)/g, 'discoverMovies(page, "$1", "$2")');

content = content.replace(/tmdb\.trending\.trending\("tv", "day", \{ page \}\)/g, 'getTrending("tv", "day", page) as any');
content = content.replace(/tmdb\.trending\.trending\("tv", "week", \{ page \}\)/g, 'getTrending("tv", "week", page) as any');
content = content.replace(/tmdb\.tvShows\.popular\(\{ page \}\)/g, 'popularTvShows(page)');
content = content.replace(/tmdb\.tvShows\.airingToday\(\{ page \}\)/g, 'airingTodayTvShows(page)');
content = content.replace(/tmdb\.tvShows\.onTheAir\(\{ page \}\)/g, 'onTheAirTvShows(page)');
content = content.replace(/tmdb\.tvShows\.topRated\(\{ page \}\)/g, 'topRatedTvShows(page)');
content = content.replace(/tmdb\.discover\.tvShow\(\{ with_genres: '([^']+)', sort_by: '([^']+)', page \}\)/g, 'discoverTvShows(page, "$1", "$2")');

fs.writeFileSync("src/config/site.tsx", content);
console.log("Patched siteConfig!");