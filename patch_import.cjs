const fs = require("fs");
let c = fs.readFileSync("src/app/admin/tickets/page.tsx", "utf8");

c = c.replace(
  /CheckCheck\n\} from 'lucide-react';/g,
  `CheckCheck,\n  ChevronLeft\n} from 'lucide-react';`
);

fs.writeFileSync("src/app/admin/tickets/page.tsx", c);
console.log("Imported ChevronLeft");