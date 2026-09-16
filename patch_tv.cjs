const fs = require('fs');
let c = fs.readFileSync('src/config/site.tsx', 'utf8');

c = c.replace(/tmdb\.discover\.tvShow\(\{ with_genres: '([^']+)', sort_by: 'popularity\.desc', page \}\)/g, "tmdb.discover.tvShow({ with_genres: '$1', sort_by: 'vote_count.desc', page })");

fs.writeFileSync('src/config/site.tsx', c);