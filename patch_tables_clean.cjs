const fs = require("fs");

function fixTable(filePath) {
  let c = fs.readFileSync(filePath, "utf8");
  
  if (c.includes("removeWrapper")) {
    c = c.replace(/removeWrapper\s*classNames=\{\{/g, `classNames={{\n              wrapper: "shadow-none border-none p-0 overflow-x-auto bg-transparent w-full max-w-[calc(100vw-32px)] md:max-w-full block",`);
    fs.writeFileSync(filePath, c);
  }
}

fixTable("src/app/admin/subscriptions/page.tsx");
fixTable("src/app/admin/servers/page.tsx");
fixTable("src/app/admin/features/page.tsx");
fixTable("src/app/admin/page.tsx");

let users = fs.readFileSync("src/app/admin/users/page.tsx", "utf8");
users = users.replace(
  /wrapper: "bg-background\/60 dark:bg-default-100\/50 shadow-sm border-none p-0",/,
  `wrapper: "bg-background/60 dark:bg-default-100/50 shadow-sm border-none p-0 overflow-x-auto w-full max-w-[calc(100vw-32px)] md:max-w-full block",`
);
fs.writeFileSync("src/app/admin/users/page.tsx", users);

console.log("Fixed Tables!");