const fs = require("fs");
let c = fs.readFileSync("src/types/index.ts", "utf8");

c = c.replace(
  /favicon: string;/,
  `favicon: string;\n  ogImage: string;`
);

fs.writeFileSync("src/types/index.ts", c);
console.log("Added ogImage to SiteConfigType");