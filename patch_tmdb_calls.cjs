const fs = require("fs");

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // Remove import { tmdb } from "@/api/tmdb";
  content = content.replace(/import\s+\{\s*tmdb\s*\}\s+from\s+["']@\/api\/tmdb["'];?\n?/g, "");

  const imports = new Set();

  if (content.includes("tmdb.movies.details(")) {
    content = content.replace(/tmdb\.movies\.details\(([^)]+)\)/g, "getMovieDetails($1)");
    imports.add("getMovieDetails");
  }
  if (content.includes("tmdb.tvShows.details(")) {
    content = content.replace(/tmdb\.tvShows\.details\(([^)]+)\)/g, "getTvShowDetails($1)");
    imports.add("getTvShowDetails");
  }
  if (content.includes("tmdb.tvShows.season(")) {
    content = content.replace(/tmdb\.tvShows\.season\(([^)]+)\)/g, "getTvShowSeason($1)");
    imports.add("getTvShowSeason");
  }
  if (content.includes("tmdb.search.movies(")) {
    content = content.replace(/tmdb\.search\.movies\(([^)]+)\)/g, "searchMovies($1.query, $1.page)");
    imports.add("searchMovies");
  }
  if (content.includes("tmdb.search.tvShows(")) {
    content = content.replace(/tmdb\.search\.tvShows\(([^)]+)\)/g, "searchTvShows($1.query, $1.page)");
    imports.add("searchTvShows");
  }
  if (content.includes("tmdb.genres.movies()")) {
    content = content.replace(/tmdb\.genres\.movies\(\)/g, "getMovieGenres()");
    imports.add("getMovieGenres");
  }
  if (content.includes("tmdb.genres.tvShows()")) {
    content = content.replace(/tmdb\.genres\.tvShows\(\)/g, "getTvGenres()");
    imports.add("getTvGenres");
  }
  if (content.includes("tmdb.trending.trending(")) {
    content = content.replace(/tmdb\.trending\.trending\(([^)]+)\)/g, "getTrending($1)");
    imports.add("getTrending");
  }

  if (imports.size > 0) {
    const importStatement = `import { ${Array.from(imports).join(", ")} } from "@/actions/tmdb";\n`;
    // Insert after "use client" if it exists, otherwise at the top
    if (content.includes('"use client"')) {
      content = content.replace(/"use client";\n?/, `"use client";\n${importStatement}`);
    } else {
      content = importStatement + content;
    }
  }

  fs.writeFileSync(filePath, content);
}

const files = [
  "src/app/movie/[id]/Client.tsx",
  "src/app/movie/[id]/player/Client.tsx",
  "src/app/tv/[id]/Client.tsx",
  "src/app/tv/[id]/[season]/[episode]/player/Client.tsx",
  "src/components/sections/Auth/Forms.tsx",
  "src/components/sections/Search/List.tsx",
  "src/components/sections/Movie/Cards/Hover.tsx",
  "src/components/sections/TV/Cards/Hover.tsx",
  "src/components/sections/TV/Details/Episodes.tsx",
  "src/components/ui/input/GenresSelect.tsx"
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    replaceInFile(f);
    console.log(`Replaced in ${f}`);
  }
});