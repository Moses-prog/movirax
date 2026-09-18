const fs = require("fs");
let c = fs.readFileSync("src/components/sections/About/InteractiveTour.tsx", "utf8");
c = c.replace(/p-4 md:p-6 py-8 md:py-12/g, "p-4 md:p-6 pt-8 pb-24 md:pt-12 md:pb-40");
fs.writeFileSync("src/components/sections/About/InteractiveTour.tsx", c);