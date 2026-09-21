const fs = require("fs");
let content = fs.readFileSync("src/components/NetworkStatus.tsx", "utf8");

// 1. Update timeout from 800 to 2500
content = content.replace("const t = setTimeout(() => setShowOfflineText(true), 800);", "const t = setTimeout(() => setShowOfflineText(true), 2500);");

// 2. Add breathing to red dot
const redDotRegex = /\{\/\* Dot Card \(Red\) \*\/\}\s*<motion\.div\s*layout\s*className="bg-red-600\/90/m;
const redDotReplacement = `{/* Dot Card (Red) */}
            <motion.div 
              layout 
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" } }}
              className="bg-red-600/90`;

content = content.replace(redDotRegex, redDotReplacement);

fs.writeFileSync("src/components/NetworkStatus.tsx", content);
console.log("Updated red dot breathing and delay successfully!");