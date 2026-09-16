const fs = require('fs');
let c = fs.readFileSync('src/config/site.tsx', 'utf8');
c = c.replace(/query: \(\) => tmdb\.trending\.trending\("movie", "day"\)/g, 'query: (page = 1) => tmdb.trending.trending("movie", "day", { page })');
c = c.replace(/query: \(\) => tmdb\.trending\.trending\("movie", "week"\)/g, 'query: (page = 1) => tmdb.trending.trending("movie", "week", { page })');
c = c.replace(/query: \(\) => tmdb\.movies\.popular\(\)/g, 'query: (page = 1) => tmdb.movies.popular({ page })');
c = c.replace(/query: \(\) => tmdb\.movies\.nowPlaying\(\)/g, 'query: (page = 1) => tmdb.movies.nowPlaying({ page })');
c = c.replace(/query: \(\) => tmdb\.movies\.upcoming\(\)/g, 'query: (page = 1) => tmdb.movies.upcoming({ page })');
c = c.replace(/query: \(\) => tmdb\.movies\.topRated\(\)/g, 'query: (page = 1) => tmdb.movies.topRated({ page })');
c = c.replace(/query: \(\) => tmdb\.discover\.movie\(\{ with_genres: '(\d+)', sort_by: 'popularity\.desc' \}\)/g, 'query: (page = 1) => tmdb.discover.movie({ with_genres: \'\', sort_by: \'popularity.desc\', page })');

c = c.replace(/query: \(\) => tmdb\.trending\.trending\("tv", "day"\)/g, 'query: (page = 1) => tmdb.trending.trending("tv", "day", { page })');
c = c.replace(/query: \(\) => tmdb\.trending\.trending\("tv", "week"\)/g, 'query: (page = 1) => tmdb.trending.trending("tv", "week", { page })');
c = c.replace(/query: \(\) => tmdb\.tvShows\.popular\(\)/g, 'query: (page = 1) => tmdb.tvShows.popular({ page })');
c = c.replace(/query: \(\) => tmdb\.tvShows\.onTheAir\(\)/g, 'query: (page = 1) => tmdb.tvShows.onTheAir({ page })');
c = c.replace(/query: \(\) => tmdb\.tvShows\.topRated\(\)/g, 'query: (page = 1) => tmdb.tvShows.topRated({ page })');
c = c.replace(/query: \(\) => tmdb\.discover\.tvShow\(\{ with_genres: '(\d+)', sort_by: 'popularity\.desc' \}\)/g, 'query: (page = 1) => tmdb.discover.tvShow({ with_genres: \'\', sort_by: \'popularity.desc\', page })');
fs.writeFileSync('src/config/site.tsx', c);