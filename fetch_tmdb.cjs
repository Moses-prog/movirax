const fs = require("fs");
const env = fs.readFileSync(".env.local", "utf8");
const token = env.split("\n").find(l => l.startsWith("NEXT_PUBLIC_TMDB_ACCESS_TOKEN=")).split("=")[1].replace(/"/g, "").trim();

fetch("https://api.themoviedb.org/3/movie/popular", { headers: { Authorization: "Bearer " + token } })
  .then(r => r.json())
  .then(data => {
    data.results.slice(0, 10).forEach(m => {
      console.log(m.title, m.poster_path, m.backdrop_path);
    });
  });