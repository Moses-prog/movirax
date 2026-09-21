const fs = require("fs");
let c = fs.readFileSync("src/app/layout.tsx", "utf8");

if (!c.includes("metadataBase:")) {
  c = c.replace(
    /export const metadata: Metadata = \{/,
    `export const metadata: Metadata = {\n  metadataBase: new URL("https://movirax.vercel.app"),`
  );
  fs.writeFileSync("src/app/layout.tsx", c);
  console.log("Added metadataBase to RootLayout");
}