const fs = require("fs");
let content = fs.readFileSync("src/utils/players.ts", "utf8");

// Remove Server 3 block from movie players
content = content.replace(
  /\s*\{\s*title:\s*"Movirax Server 3",\s*source:\s*`https:\/\/www\.vidking\.net\/embed\/movie\/\$\{id\}\?color=e50914&autoplay=false`,\s*recommended:\s*true,\s*fast:\s*true,\s*resumable:\s*true,\s*\},/,
  ""
);

// Remove Server 3 block from tv players
content = content.replace(
  /\s*\{\s*title:\s*"Movirax Server 3",\s*source:\s*`https:\/\/www\.vidking\.net\/embed\/tv\/\$\{id\}\/\$\{season\}\/\$\{episode\}\?color=e50914&autoplay=false`,\s*recommended:\s*true,\s*fast:\s*true,\s*resumable:\s*true,\s*\},/,
  ""
);

fs.writeFileSync("src/utils/players.ts", content);
console.log("Removed dead vidking.net server");