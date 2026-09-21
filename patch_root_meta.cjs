const fs = require("fs");
let c = fs.readFileSync("src/app/layout.tsx", "utf8");

c = c.replace(
  `  description: siteConfig.description,\n    images: [siteConfig.ogImage],`,
  `  description: siteConfig.description,`
);

fs.writeFileSync("src/app/layout.tsx", c);
console.log("Fixed root metadata");