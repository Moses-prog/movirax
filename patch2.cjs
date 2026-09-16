const fs = require('fs');
let c = fs.readFileSync('src/config/site.tsx', 'utf8');

c = c.replace(/query: \(page = 1\) => tmdb\.discover\.movie\(\{ with_genres: '', sort_by: 'popularity\.desc', page \}\), param: "genre-(\d+)"/g, 'query: (page = 1) => tmdb.discover.movie({ with_genres: \'\', sort_by: \'popularity.desc\', page }), param: "genre-"');

c = c.replace(/query: \(page = 1\) => tmdb\.discover\.tvShow\(\{ with_genres: '', sort_by: 'popularity\.desc', page \}\), param: "genre-(\d+)"/g, 'query: (page = 1) => tmdb.discover.tvShow({ with_genres: \'\', sort_by: \'popularity.desc\', page }), param: "genre-"');

fs.writeFileSync('src/config/site.tsx', c);