const fs = require("fs");
let settings = fs.readFileSync("src/app/admin/settings/page.tsx", "utf8");
settings = settings.replace(
  /flex-wrap sm:flex-nowrap/,
  `overflow-x-auto custom-scrollbar`
);
fs.writeFileSync("src/app/admin/settings/page.tsx", settings);