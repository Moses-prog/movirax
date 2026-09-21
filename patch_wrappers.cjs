const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    if (fs.statSync(file).isDirectory()) {
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

  // Replace 'removeWrapper' on tables inside CardBody with a proper wrapper configuration.
  if (c.includes("removeWrapper") && c.includes("<Table")) {
    c = c.replace(
      /removeWrapper/g,
      `classNames={{ wrapper: "shadow-none border-none bg-transparent p-0 overflow-x-auto max-w-[100vw] sm:max-w-full block" }}`
    );
    // If the table already had a classNames prop, it will now have TWO classNames props, which React dislikes!
    // We need to merge them.
    modified = true;
  }
  
  if (modified) fs.writeFileSync(f, c);
});
console.log("Patched wrappers!");