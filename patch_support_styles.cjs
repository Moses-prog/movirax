const fs = require("fs");
let c = fs.readFileSync("src/app/support/page.tsx", "utf8");

// Main Chat Card
c = c.replace(
  /<Card className="bg-white\/5 border border-white\/5 shadow-none h-full flex flex-col">/,
  `<Card className="bg-transparent shadow-none h-full flex flex-col border-none">`
);

// Chat Header
c = c.replace(
  /<div className="p-4 border-b border-white\/5 flex flex-col md:flex-row gap-4 justify-between md:items-center bg-white\/5">/,
  `<div className="p-4 border-b border-divider flex flex-col md:flex-row gap-4 justify-between md:items-center bg-default-100/20">`
);

// User Chat Bubble
c = c.replace(
  /className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-sm max-w-\[90%\] sm:max-w-\[80%\] shadow-md text-sm"/g,
  `className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-sm max-w-[90%] sm:max-w-[80%] shadow-sm text-sm"`
);

// Admin Chat Bubble
c = c.replace(
  /'bg-content2 text-foreground rounded-2xl rounded-tl-sm border border-white\/5'/g,
  `'bg-default-200 text-foreground rounded-2xl rounded-tl-sm border-none'`
);

// Typing Indicator
c = c.replace(
  /className="bg-content2 text-foreground p-3 rounded-2xl rounded-tl-sm shadow-md text-sm italic opacity-70 flex items-center gap-2"/g,
  `className="bg-default-100 text-foreground p-3 rounded-2xl rounded-tl-sm shadow-none text-sm italic opacity-70 flex items-center gap-2"`
);

// Reply Box Container
c = c.replace(
  /<div className="p-4 border-t border-white\/5 bg-background\/50">/,
  `<div className="p-4 border-t border-divider bg-transparent">`
);

// Reply Input
c = c.replace(
  /classNames=\{\{ inputWrapper: "bg-white\/5 border border-white\/10" \}\}/g,
  `variant="faded"`
);

// Closed Ticket Box
c = c.replace(
  /<div className="p-4 rounded-xl bg-white\/5 border border-white\/10 flex flex-col items-center justify-center text-center gap-2">/,
  `<div className="p-4 rounded-xl bg-default-100/50 border border-divider flex flex-col items-center justify-center text-center gap-2">`
);

// Modal Base
c = c.replace(
  /classNames=\{\{ base: "bg-background border border-white\/10" \}\}/,
  `classNames={{ base: "bg-background border border-divider" }}`
);

// Modal Select trigger
c = c.replace(
  /classNames=\{\{ trigger: "bg-white\/5 border border-white\/10" \}\}/,
  `variant="faded"`
);

fs.writeFileSync("src/app/support/page.tsx", c);
console.log("Cleaned up Support page crypto styles");