const fs = require("fs");
let settings = fs.readFileSync("src/app/admin/settings/page.tsx", "utf8");

// Fix container design
settings = settings.replace(
  /className="flex flex-col gap-4 bg-default-50 p-6 rounded-2xl border border-default-200"/g,
  `className="flex flex-col gap-4 bg-default-100/50 shadow-none p-6 rounded-2xl border border-divider"`
);

// Fix alignment for Paystack
settings = settings.replace(
  /<div className="flex justify-between items-center mb-2">\s*<div>\s*<h3 className="text-lg font-semibold flex items-center gap-2">Paystack Integration/g,
  `<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">\n                      <div>\n                        <h3 className="text-lg font-semibold flex flex-wrap items-center gap-2">Paystack Integration`
);

// Fix alignment for Flutterwave
settings = settings.replace(
  /<div className="flex justify-between items-center mb-2">\s*<div>\s*<h3 className="text-lg font-semibold flex items-center gap-2">Flutterwave Integration/g,
  `<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">\n                      <div>\n                        <h3 className="text-lg font-semibold flex flex-wrap items-center gap-2">Flutterwave Integration`
);

fs.writeFileSync("src/app/admin/settings/page.tsx", settings);