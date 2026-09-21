const fs = require("fs");
let c = fs.readFileSync("src/app/admin/tickets/page.tsx", "utf8");

c = c.replace(
  /<header className="flex flex-wrap items-center justify-between gap-4 flex-shrink-0">/,
  `<header className={\`flex flex-wrap items-center justify-between gap-4 flex-shrink-0 \${(isFullScreenChat || (isMobile && mobileView === 'detail')) ? 'hidden' : ''}\`}>`
);

fs.writeFileSync("src/app/admin/tickets/page.tsx", c);
console.log("Hid header during full-screen/detail view");