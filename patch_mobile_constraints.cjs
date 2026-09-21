const fs = require("fs");
let c = fs.readFileSync("src/app/admin/tickets/page.tsx", "utf8");

c = c.replace(
  /<div className="flex flex-1 min-h-0 overflow-hidden shadow-sm">/,
  `<div className="flex flex-1 min-h-0 overflow-hidden shadow-sm w-full">`
);

// We will change the height to use dvh for mobile
c = c.replace(
  /<div className="mx-auto max-w-7xl h-\[calc\(100vh-120px\)\] flex flex-col gap-6 pb-10">/,
  `<div className="mx-auto max-w-7xl h-[calc(100dvh-120px)] md:h-[calc(100vh-120px)] flex flex-col gap-4 md:gap-6 pb-4 md:pb-10 w-full">`
);

// To ensure panels don't break on mobile, let's force 100% width on the active panel
c = c.replace(
  /className="flex flex-col rounded-2xl border-none bg-background\/60 dark:bg-default-100\/50 p-4 min-w-0"/g,
  `className="flex flex-col rounded-2xl border-none bg-background/60 dark:bg-default-100/50 p-4 min-w-0 w-full"`
);
c = c.replace(
  /className="flex flex-col rounded-2xl border-none bg-background\/60 dark:bg-default-100\/50 overflow-hidden min-w-0"/g,
  `className="flex flex-col rounded-2xl border-none bg-background/60 dark:bg-default-100/50 overflow-hidden min-w-0 w-full"`
);

// If the chat area was getting compressed horizontally by the Select input in the header, we should fix the header flex
c = c.replace(
  /<div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 border-b border-divider bg-transparent overflow-y-auto custom-scrollbar">/g,
  `<div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 md:p-6 border-b border-divider bg-transparent overflow-x-hidden">`
);

fs.writeFileSync("src/app/admin/tickets/page.tsx", c);
console.log("Patched mobile constraints");