const fs = require("fs");
let content = fs.readFileSync("src/app/profiles/page.tsx", "utf8");

content = content.replace(/className="w-4 h-4" \/> PIN/g, `className="w-4 h-4 mr-2" /> PIN`);
content = content.replace(/className="w-4 h-4" \/> Add PIN/g, `className="w-4 h-4 mr-2" /> Add PIN`);

fs.writeFileSync("src/app/profiles/page.tsx", content);
console.log("Added mr-2");