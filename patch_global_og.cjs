const fs = require("fs");
let c = fs.readFileSync("src/app/layout.tsx", "utf8");

c = c.replace(
  /description: siteConfig\.description,\n  \},/g,
  `description: siteConfig.description,\n    images: [siteConfig.ogImage],\n  },`
);
c = c.replace(
  /openGraph: \{\n    type: "website",\n    siteName: siteConfig\.name,\n    title: \{\n      default: siteConfig\.name,\n      template: siteConfig\.name,\n    \},\n    description: siteConfig\.description,\n    images: \[siteConfig\.ogImage\],\n  \},/g,
  `openGraph: {\n    type: "website",\n    siteName: siteConfig.name,\n    title: {\n      default: siteConfig.name,\n      template: siteConfig.name,\n    },\n    description: siteConfig.description,\n    images: [{ url: siteConfig.ogImage }],\n  },`
);

fs.writeFileSync("src/app/layout.tsx", c);
console.log("Added global og:image to RootLayout");