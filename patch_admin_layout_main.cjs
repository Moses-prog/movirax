const fs = require("fs");
let layout = fs.readFileSync("src/app/admin/layout.tsx", "utf8");
layout = layout.replace(
  /<main className="flex-1 p-6 md:p-8 bg-background overflow-y-auto">/,
  `<main className="flex-1 p-4 md:p-8 bg-background overflow-y-auto overflow-x-hidden">`
);
fs.writeFileSync("src/app/admin/layout.tsx", layout);