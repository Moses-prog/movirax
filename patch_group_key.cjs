const fs = require("fs");
let c = fs.readFileSync("src/app/admin/tickets/page.tsx", "utf8");

c = c.replace(
  /<Group orientation="horizontal" className="w-full h-full">/,
  `<Group key={isMobile ? 'mobile' : (isFullScreenChat ? 'full' : 'split')} orientation="horizontal" className="w-full h-full">`
);

fs.writeFileSync("src/app/admin/tickets/page.tsx", c);
console.log("Added key to Group to force resize re-calculation");