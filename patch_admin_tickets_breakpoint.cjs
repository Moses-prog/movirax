const fs = require("fs");
let c = fs.readFileSync("src/app/admin/tickets/page.tsx", "utf8");

c = c.replace(/window\.innerWidth < 768/g, "window.innerWidth < 1024");
c = c.replace(/window\.innerWidth >= 768/g, "window.innerWidth >= 1024");

fs.writeFileSync("src/app/admin/tickets/page.tsx", c);
console.log("Bumped isMobile breakpoint to 1024px in Admin tickets");