const fs = require("fs");

// 1. Fix Support Page
let support = fs.readFileSync("src/app/support/page.tsx", "utf8");

// Fix exact heights to flex
support = support.replace(
  /<div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8">/,
  `<div className="h-[100dvh] bg-background pt-24 pb-4 md:pb-8 px-4 md:px-8 flex flex-col">`
);
support = support.replace(
  /<div className="max-w-6xl mx-auto h-\[calc\(100vh-160px\)\] flex flex-col">/,
  `<div className="max-w-6xl mx-auto w-full flex-1 flex flex-col min-h-0">`
);

// 2. Fix Settings Page Alignment
let settings = fs.readFileSync("src/app/admin/settings/page.tsx", "utf8");
settings = settings.replace(
  /<div className="flex items-center justify-between bg-default-100\/50 p-4 rounded-xl border border-divider">/g,
  `<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-default-100/50 p-4 rounded-xl border border-divider">`
);

// Settings page also has a header which could wrap badly?
// <header className="flex flex-wrap items-center justify-between gap-4"> -> perfectly fine.

// Also, the Tabs classNames in settings:
settings = settings.replace(
  /tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider px-6 pt-4",/,
  `tabList: "gap-4 md:gap-6 w-full relative rounded-none p-0 border-b border-divider px-4 md:px-6 pt-4 flex-wrap sm:flex-nowrap",`
);

fs.writeFileSync("src/app/support/page.tsx", support);
fs.writeFileSync("src/app/admin/settings/page.tsx", settings);

console.log("Fixed Support and Settings!");