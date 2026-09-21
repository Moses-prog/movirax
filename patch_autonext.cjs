const fs = require("fs");
let content = fs.readFileSync("src/utils/players.ts", "utf8");

content = content.replace(/vidsrc\.(sh|me|in|pm)\/embed\/tv\/\$\{id\}\/\$\{season\}\/\$\{episode\}/g, "vidsrc.$1/embed/tv/${id}/${season}/${episode}?autonext=1");

fs.writeFileSync("src/utils/players.ts", content);
console.log("Added autonext=1 to vidsrc TV links");