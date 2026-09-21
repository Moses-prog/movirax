const fs = require("fs");
let c = fs.readFileSync("src/app/admin/tickets/page.tsx", "utf8");

// Remove Group orientation="vertical" wrapper inside selectedTicket
c = c.replace(
  /\{selectedTicket \? \(\s*<Group orientation="vertical" className="w-full h-full">/,
  `{selectedTicket ? (\n              <div className="flex flex-col w-full h-full bg-transparent">`
);

// Detail Header Panel
c = c.replace(
  /\{\/\* Detail Header \*\/\}\s*<Panel defaultSize=\{20\} minSize=\{15\} className="flex flex-col">/g,
  `{/* Detail Header */}\n                <div className="shrink-0 flex flex-col">`
);

// Detail Header End & Separator
c = c.replace(
  /<\/Panel>\s*<Separator className="h-4 flex items-center justify-center group cursor-row-resize relative z-10">\s*<div className="w-12 h-1 rounded-full bg-divider group-hover:bg-danger transition-colors flex items-center justify-center" \/>\s*<\/Separator>/g,
  `</div>`
);

// Ticket Description Panel
c = c.replace(
  /\{\/\* Ticket Description \*\/\}\s*<Panel defaultSize=\{50\} minSize=\{20\} className="flex flex-col">/g,
  `{/* Ticket Description */}\n                <div className="flex-1 min-h-0 flex flex-col border-b border-divider">`
);

// Resolution Area Panel
c = c.replace(
  /\{\/\* Resolution Area \*\/\}\s*<Panel defaultSize=\{30\} minSize=\{20\} className="flex flex-col">/g,
  `{/* Resolution Area */}\n                <div className="shrink-0 flex flex-col bg-background/50">`
);

// End of Group
c = c.replace(
  /<\/div>\s*<\/Panel>\s*<\/Group>\s*\) : \(/g,
  `</div>\n                </div>\n              </div>\n            ) : (`
);

fs.writeFileSync("src/app/admin/tickets/page.tsx", c);
console.log("Removed vertical adjusters from ticket chat view");