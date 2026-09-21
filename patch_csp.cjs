const fs = require("fs");
let content = fs.readFileSync("next.config.mjs", "utf8");

content = content.replace(
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com;",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://challenges.cloudflare.com;"
);

fs.writeFileSync("next.config.mjs", content);
console.log("Patched next.config.mjs to allow Cloudflare Turnstile script.");