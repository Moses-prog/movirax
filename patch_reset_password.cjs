const fs = require("fs");
let c = fs.readFileSync("src/app/auth/reset-password/page.tsx", "utf8");

if (!c.includes("NuqsAdapter")) {
  c = `import { NuqsAdapter } from "nuqs/adapters/next/app";\nimport { Suspense } from "react";\n` + c;
  c = c.replace(/return <AuthForms \/>;/, `return (\n    <Suspense>\n      <NuqsAdapter>\n        <AuthForms />\n      </NuqsAdapter>\n    </Suspense>\n  );`);
  fs.writeFileSync("src/app/auth/reset-password/page.tsx", c);
  console.log("Added NuqsAdapter and Suspense to reset-password page");
}