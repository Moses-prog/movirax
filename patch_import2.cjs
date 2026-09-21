const fs = require("fs");
let c = fs.readFileSync("src/app/admin/tickets/page.tsx", "utf8");

c = c.replace(
  /CheckCheck\r?\n\} from 'lucide-react';/,
  `CheckCheck,\n  ChevronLeft\n} from 'lucide-react';`
);

fs.writeFileSync("src/app/admin/tickets/page.tsx", c);
console.log("Imported ChevronLeft with CRLF support");