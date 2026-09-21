const fs = require("fs");
let content = fs.readFileSync("public/manifest.json", "utf8");
content = content.replace('"orientation": "portrait"', '"orientation": "any"');
fs.writeFileSync("public/manifest.json", content);
console.log("Successfully patched manifest.json!");