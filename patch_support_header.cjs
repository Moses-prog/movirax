const fs = require("fs");
let c = fs.readFileSync("src/app/support/page.tsx", "utf8");

c = c.replace(
  /<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">/,
  `<div className={\`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0 \${selectedTicketId ? 'hidden lg:flex' : 'flex'}\`}>`
);

fs.writeFileSync("src/app/support/page.tsx", c);
console.log("Hid header on Support page during mobile chat view");