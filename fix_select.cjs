const fs = require("fs");
let content = fs.readFileSync("src/app/admin/servers/page.tsx", "utf8");

content = content.replace(
  /setMovieServer\(settings\.defaultMovie\.toString\(\)\);/,
  "const mKey = settings.defaultMovie.toString();\n      setMovieServer(mockPlayersMovie[settings.defaultMovie] ? mKey : '0');"
);

content = content.replace(
  /setTvServer\(settings\.defaultTv\.toString\(\)\);/,
  "const tKey = settings.defaultTv.toString();\n      setTvServer(mockPlayersTv[settings.defaultTv] ? tKey : '0');"
);

fs.writeFileSync("src/app/admin/servers/page.tsx", content);
console.log("Fixed Select out-of-bounds crash");