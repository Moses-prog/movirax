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

addAdapterToPage("src/app/library/page.tsx", `<Suspense>`, `</Suspense>`);