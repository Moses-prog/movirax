const fs = require("fs");

function addAdapterToPage(filePath, openTag, closeTag) {
  let c = fs.readFileSync(filePath, "utf8");
  if (!c.includes("NuqsAdapter")) {
    if (!c.includes("import { NuqsAdapter }")) {
      c = `import { NuqsAdapter } from "nuqs/adapters/next/app";\n` + c;
    }
    c = c.replace(openTag, `${openTag}\n      <NuqsAdapter>`);
    c = c.replace(closeTag, `      </NuqsAdapter>\n    ${closeTag}`);
    fs.writeFileSync(filePath, c);
    console.log(`Added NuqsAdapter to ${filePath}`);
  }
}

// 1. src/app/page.tsx
addAdapterToPage("src/app/page.tsx", `<Suspense fallback={<div className="w-full h-screen flex items-center justify-center"><Spinner size="lg" /></div>}>`, `</Suspense>`);

// 2. src/app/auth/page.tsx
addAdapterToPage("src/app/auth/page.tsx", `<Suspense>`, `</Suspense>`);

// 3. src/app/search/page.tsx
addAdapterToPage("src/app/search/page.tsx", `<Suspense>`, `</Suspense>`);

// 4. src/app/discover/page.tsx
addAdapterToPage("src/app/discover/page.tsx", `<Suspense>`, `</Suspense>`);

// 5. src/app/movie/[id]/player/page.tsx
addAdapterToPage("src/app/movie/[id]/player/page.tsx", `<Suspense fallback={<div className="w-full h-screen flex items-center justify-center"><Spinner size="lg" variant="simple" /></div>}>`, `</Suspense>`);

// 6. src/app/tv/[id]/[season]/[episode]/player/page.tsx
addAdapterToPage("src/app/tv/[id]/[season]/[episode]/player/page.tsx", `<Suspense fallback={<div className="w-full h-screen flex items-center justify-center"><Spinner size="lg" color="warning" variant="simple" /></div>}>`, `</Suspense>`);
