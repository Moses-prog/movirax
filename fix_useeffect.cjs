const fs = require("fs");
let content = fs.readFileSync("src/app/profiles/page.tsx", "utf8");

content = content.replace(
  /import React, \{ useState \} from 'react';/,
  `import React, { useState, useEffect } from 'react';`
);

fs.writeFileSync("src/app/profiles/page.tsx", content);
console.log("Added useEffect import");