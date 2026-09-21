const fs = require("fs");
let c = fs.readFileSync("src/app/layout.tsx", "utf8");

c = c.replace(/import \{ NuqsAdapter \} from "nuqs\/adapters\/next\/app";\n/, "");
c = c.replace(/<Suspense>\s*<NuqsAdapter>/, "");
c = c.replace(/<\/NuqsAdapter>\s*<\/Suspense>/, "");

fs.writeFileSync("src/app/layout.tsx", c);
console.log("Removed NuqsAdapter and global Suspense from layout.tsx");