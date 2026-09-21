const fs = require("fs");
let content = fs.readFileSync("src/utils/players.ts", "utf8");

// Replace domains with active ones
// Movies
content = content.replace("vidsrc.xyz/embed/movie", "vidsrc.sh/embed/movie");
content = content.replace("vidsrc.cc/v2/embed/movie", "vidsrc.me/embed/movie");
content = content.replace("vidsrc.cc/v3/embed/movie", "vidsrc.in/embed/movie");

// TV Shows
content = content.replace("vidsrc.xyz/embed/tv", "vidsrc.sh/embed/tv");
content = content.replace("vidsrc.to/embed/tv", "vidsrc.me/embed/tv");
content = content.replace("vidsrc.icu/embed/tv", "vidsrc.in/embed/tv");
content = content.replace("vidsrc.cc/v2/embed/tv", "vidsrc.pm/embed/tv");
content = content.replace("vidsrc.cc/v3/embed/tv", "vidsrc.sh/embed/tv");

// Strip the stray autoPlay=false from the vidsrc urls to match the official docs
content = content.replace(/\?autoPlay=false/g, "");

fs.writeFileSync("src/utils/players.ts", content);
console.log("Updated vidsrc domains!");