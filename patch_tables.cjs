const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith(".tsx")) {
      results.push(file);
    }
  });
  return results;
}

const files = walk("src/app/admin");

files.forEach(f => {
  let c = fs.readFileSync(f, "utf8");
  let modified = false;

  // For AdminDashboard, wrap the two tables
  if (c.includes("<Table aria-label=\"Recent Tickets\" removeWrapper")) {
    c = c.replace(/<Table aria-label="Recent Tickets" removeWrapper/g, `<div className="overflow-x-auto w-full max-w-[100vw]"><Table aria-label="Recent Tickets" removeWrapper`);
    c = c.replace(/<\/Table>\s*<\/CardBody>/, `</Table></div>\n            </CardBody>`);
    modified = true;
  }
  if (c.includes("<Table aria-label=\"Recent Users\" removeWrapper")) {
    c = c.replace(/<Table aria-label="Recent Users" removeWrapper/g, `<div className="overflow-x-auto w-full max-w-[100vw]"><Table aria-label="Recent Users" removeWrapper`);
    c = c.replace(/<\/Table>\s*<\/CardBody>/, `</Table></div>\n            </CardBody>`);
    modified = true;
  }

  // For Users page (already wrapped in Table's default wrapper, but we need to add overflow-x-auto to it!)
  if (c.includes(`wrapper: "bg-background/60 dark:bg-default-100/50 shadow-sm border-none p-0"`)) {
    c = c.replace(
      `wrapper: "bg-background/60 dark:bg-default-100/50 shadow-sm border-none p-0"`,
      `wrapper: "bg-background/60 dark:bg-default-100/50 shadow-sm border-none p-0 overflow-x-auto max-w-[100vw]"`
    );
    modified = true;
  }

  // For Subscriptions page
  if (c.includes("<Table \n            aria-label=\"Subscriptions Table\" \n            removeWrapper")) {
    c = c.replace(/<Table \n            aria-label="Subscriptions Table" \n            removeWrapper/g, `<div className="overflow-x-auto w-full max-w-[100vw]"><Table aria-label="Subscriptions Table" removeWrapper`);
    c = c.replace(/<\/Table>\s*<\/Card>/, `</Table></div>\n        </Card>`);
    modified = true;
  }

  // For Servers page
  if (c.includes("<Table aria-label=\"Servers table\" removeWrapper")) {
    c = c.replace(/<Table aria-label="Servers table" removeWrapper/g, `<div className="overflow-x-auto w-full max-w-[100vw]"><Table aria-label="Servers table" removeWrapper`);
    c = c.replace(/<\/Table>\s*<\/Card>/, `</Table></div>\n        </Card>`);
    modified = true;
  }

  // For Features page
  if (c.includes("<Table aria-label=\"Features table\" removeWrapper")) {
    c = c.replace(/<Table aria-label="Features table" removeWrapper/g, `<div className="overflow-x-auto w-full max-w-[100vw]"><Table aria-label="Features table" removeWrapper`);
    c = c.replace(/<\/Table>\s*<\/Card>/, `</Table></div>\n        </Card>`);
    modified = true;
  }
  
  if (c.includes("<Table aria-label=\"Features table\"") && !c.includes("removeWrapper")) {
      // In case removeWrapper is not there
      c = c.replace(/<Table aria-label="Features table"/g, `<div className="overflow-x-auto w-full max-w-[100vw]"><Table aria-label="Features table"`);
      c = c.replace(/<\/Table>\s*<\/Card>/, `</Table></div>\n        </Card>`);
      modified = true;
  }

  if (modified) fs.writeFileSync(f, c);
});

console.log("Tables patched!");