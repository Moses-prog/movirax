const fs = require("fs");
let c = fs.readFileSync("src/app/layout.tsx", "utf8");

c = c.replace(
  /<body className=\{cn\("bg-background min-h-dvh antialiased overflow-x-clip", Poppins.className\)\}>/,
  `<body className={cn("bg-background min-h-dvh antialiased select-none overflow-x-clip", Poppins.className)}>`
);

fs.writeFileSync("src/app/layout.tsx", c);
console.log("Restored select-none");