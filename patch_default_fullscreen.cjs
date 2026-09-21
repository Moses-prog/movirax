const fs = require("fs");
let c = fs.readFileSync("src/app/admin/tickets/page.tsx", "utf8");

c = c.replace(
  /onClick=\{\(\) => \{ setSelectedTicketId\(ticket\.id\); if \(window\.innerWidth < 1024\) setMobileView\('detail'\); \}\}/g,
  `onClick={() => { setSelectedTicketId(ticket.id); if (window.innerWidth < 1024) setMobileView('detail'); else setIsFullScreenChat(true); }}`
);

// If they exit focus and then click another ticket, it should go back to full screen.
// We also need to make sure that if selectedTicketId becomes null, isFullScreenChat goes to false so the list comes back!
c = c.replace(
  /const selectedTicket = tickets.find\(t => t.id === selectedTicketId\);/,
  `const selectedTicket = tickets.find(t => t.id === selectedTicketId);
  useEffect(() => { if (!selectedTicketId) setIsFullScreenChat(false); }, [selectedTicketId]);`
);

fs.writeFileSync("src/app/admin/tickets/page.tsx", c);
console.log("Made focus mode default on click");