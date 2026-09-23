const fs = require("fs");
let content = fs.readFileSync("src/app/api/profiles/route.ts", "utf8");

content = content.replace(
  /isKids: newProfile\.isKids \|\| false\n\s*\};/g,
  `isKids: newProfile.isKids || false,\n        pin: newProfile.pin || null\n      };`
);

fs.writeFileSync("src/app/api/profiles/route.ts", content);
console.log("Fixed API route");