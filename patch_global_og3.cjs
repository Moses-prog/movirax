const fs = require("fs");
let c = fs.readFileSync("src/app/layout.tsx", "utf8");

// We'll just replace based on description: siteConfig.description,
c = c.split("description: siteConfig.description,").join("description: siteConfig.description,\n    images: [siteConfig.ogImage],");

fs.writeFileSync("src/app/layout.tsx", c);
console.log("Forced replacement");