const fs = require("fs");
let c = fs.readFileSync("src/app/layout.tsx", "utf8");

c = c.replace(
  /select-none /,
  ``
);

fs.writeFileSync("src/app/layout.tsx", c);
console.log("Removed select-none from body");