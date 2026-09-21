const fs = require("fs");
let c = fs.readFileSync("src/config/site.tsx", "utf8");

c = c.replace(
  /favicon: "\/favicon.ico",/,
  `favicon: "/favicon.ico",\n  ogImage: "/moviraxlogo.png",`
);

fs.writeFileSync("src/config/site.tsx", c);
console.log("Added ogImage to siteConfig");