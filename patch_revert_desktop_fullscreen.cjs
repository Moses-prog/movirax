const fs = require("fs");
let c = fs.readFileSync("src/app/admin/tickets/page.tsx", "utf8");

c = c.replace(
  /onClick=\{\(\) => \{ setSelectedTicketId\(ticket\.id\); if \(window\.innerWidth < 1024\) setMobileView\('detail'\); else setIsFullScreenChat\(true\); \}\}/g,
  `onClick={() => { setSelectedTicketId(ticket.id); if (window.innerWidth < 1024) setMobileView('detail'); }}`
);

fs.writeFileSync("src/app/admin/tickets/page.tsx", c);
console.log("Reverted default full screen on desktop");