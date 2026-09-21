const fs = require("fs");

function fixUseClient(filePath) {
  let c = fs.readFileSync(filePath, "utf8");
  if (c.startsWith(`import { NuqsAdapter } from "nuqs/adapters/next/app";\n"use client";`)) {
    c = c.replace(`import { NuqsAdapter } from "nuqs/adapters/next/app";\n"use client";`, `"use client";\nimport { NuqsAdapter } from "nuqs/adapters/next/app";`);
    fs.writeFileSync(filePath, c);
  }
}

fixUseClient("src/app/page.tsx");
fixUseClient("src/app/auth/page.tsx");
fixUseClient("src/app/search/page.tsx");
fixUseClient("src/app/discover/page.tsx");
fixUseClient("src/app/movie/[id]/player/page.tsx");
fixUseClient("src/app/tv/[id]/[season]/[episode]/player/page.tsx");
console.log("Fixed use client positioning for NuqsAdapter");