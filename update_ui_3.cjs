const fs = require("fs");
let content = fs.readFileSync("src/app/profiles/page.tsx", "utf8");

if (!content.includes("Lock,")) {
  content = content.replace(
    /import \{ Plus, Edit2, CheckCircle2, AlertCircle, Image as ImageIcon \} from 'lucide-react';/,
    `import { Plus, Edit2, CheckCircle2, AlertCircle, Image as ImageIcon, Lock } from 'lucide-react';`
  );
}

content = content.replace(
  /<span className=\{\`text-lg font-medium transition-colors \$\{isEditingMode \? 'text-white\/70' : 'text-muted-foreground group-hover:text-white'\}\`\}>\n\s*\{profile\.name\}\n\s*<\/span>/,
  `<div className="flex items-center gap-2">\n                <span className={\`text-lg font-medium transition-colors \${isEditingMode ? 'text-white/70' : 'text-muted-foreground group-hover:text-white'}\`}>\n                  {profile.name}\n                </span>\n                {profile.pin && <Lock className="w-4 h-4 text-white/50" />}\n              </div>`
);

fs.writeFileSync("src/app/profiles/page.tsx", content);
console.log("Added lock icon");