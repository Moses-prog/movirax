const fs = require("fs");
let content = fs.readFileSync("src/components/ui/button/UserProfileButton.tsx", "utf8");

content = content.replace(
  /import \{ useState, useEffect \} from "react";/,
  `import { useState, useEffect } from "react";\nimport { AlertCircle } from "lucide-react";`
);

fs.writeFileSync("src/components/ui/button/UserProfileButton.tsx", content);
console.log("Fixed AlertCircle in UserProfileButton");