const fs = require("fs");

function fixUseClient(filePath) {
  let c = fs.readFileSync(filePath, "utf8");
  if (c.startsWith(`import { Suspense } from "react";\n"use client";`)) {
    c = c.replace(`import { Suspense } from "react";\n"use client";`, `"use client";\nimport { Suspense } from "react";`);
    fs.writeFileSync(filePath, c);
  }
}

fixUseClient("src/app/page.tsx");
fixUseClient("src/app/movie/[id]/player/page.tsx");
fixUseClient("src/app/tv/[id]/[season]/[episode]/player/page.tsx");
console.log("Fixed use client positioning");