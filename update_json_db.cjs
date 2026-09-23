const fs = require("fs");
let content = fs.readFileSync("src/lib/jsonDb.ts", "utf8");

content = content.replace(
  /isKids\?: boolean;\n\}/g,
  `isKids?: boolean;\n  pin?: string | null;\n}`
);

content = content.replace(
  /isKids: p\.is_kids\n\s*\}\)\);/g,
  `isKids: p.is_kids,\n      pin: p.parent_pin\n    }));`
);

content = content.replace(
  /is_kids: profile\.isKids \|\| false\n\s*\}\);/g,
  `is_kids: profile.isKids || false,\n      parent_pin: profile.pin || null\n    });`
);

content = content.replace(
  /if \(updates\.isKids !== undefined\) dbUpdates\.is_kids = updates\.isKids;/g,
  `if (updates.isKids !== undefined) dbUpdates.is_kids = updates.isKids;\n  if (updates.pin !== undefined) dbUpdates.parent_pin = updates.pin === "" ? null : updates.pin;`
);

fs.writeFileSync("src/lib/jsonDb.ts", content);
console.log("Updated jsonDb.ts");