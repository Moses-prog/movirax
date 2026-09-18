const fs = require("fs");
const env = fs.readFileSync(".env.local", "utf8");
const token = env.split("\n").find(l => l.startsWith("NEXT_PUBLIC_TMDB_ACCESS_TOKEN=")).split("=")[1].replace(/"/g, "").trim();
// Wait, the token has a `# Keep your long token here` comment on the same line!
const actualToken = token.split(" ")[0];

fetch("https://api.themoviedb.org/3/movie/popular", { headers: { Authorization: "Bearer " + actualToken } })
  .then(r => r.json())
  .then(data => console.log(data));