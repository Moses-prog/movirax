const fs = require("fs");
let c = fs.readFileSync("src/app/providers.tsx", "utf8");

c = c.replace(/const \{ content \} = useDiscoverFilters\(\);\n  const tv = pathName\.includes\("\/tv\/"\) \|\| content === "tv";/, "");
c = c.replace(/import useDiscoverFilters from "@\/hooks\/useDiscoverFilters";\n/, "");

fs.writeFileSync("src/app/providers.tsx", c);
console.log("Removed dead useDiscoverFilters from providers");