const fs = require("fs");
let c = fs.readFileSync("src/app/support/page.tsx", "utf8");

c = c.replace(
  /className=\{`w-full md:w-80 lg:w-96 flex-col border-r border-divider \$\{selectedTicketId \? 'hidden md:flex' : 'flex'\}`\}/g,
  `className={\`w-full lg:w-96 flex-col border-r border-divider \${selectedTicketId ? 'hidden lg:flex' : 'flex'}\`}`
);

c = c.replace(
  /className=\{`flex-1 flex-col bg-background\/50 \$\{!selectedTicketId \? 'hidden md:flex' : 'flex'\}`\}/g,
  `className={\`flex-1 flex-col bg-transparent \${!selectedTicketId ? 'hidden lg:flex' : 'flex'}\`}`
);

c = c.replace(
  /className="md:hidden" onPress=\{onBack\}/g,
  `className="lg:hidden" onPress={onBack}`
);

fs.writeFileSync("src/app/support/page.tsx", c);
console.log("Changed Support page to split on lg breakpoint instead of md");