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
  
  if (c.includes(`classNames={{ wrapper: "shadow-none border-none bg-transparent p-0 overflow-x-auto max-w-[100vw] sm:max-w-full block" }} \n            classNames={{`)) {
    c = c.replace(
      /classNames=\{\{ wrapper: "shadow-none border-none bg-transparent p-0 overflow-x-auto max-w-\[100vw\] sm:max-w-full block" \}\} \n            classNames=\{\{/g,
      `classNames={{\n              wrapper: "shadow-none border-none bg-transparent p-0 overflow-x-auto max-w-[calc(100vw-32px)] md:max-w-full block",`
    );
    fs.writeFileSync(f, c);
  } else if (c.includes(`classNames={{ wrapper: "shadow-none border-none bg-transparent p-0 overflow-x-auto max-w-[100vw] sm:max-w-full block" }} classNames={{`)) {
    c = c.replace(
      /classNames=\{\{ wrapper: "shadow-none border-none bg-transparent p-0 overflow-x-auto max-w-\[100vw\] sm:max-w-full block" \}\} classNames=\{\{/g,
      `classNames={{ wrapper: "shadow-none border-none bg-transparent p-0 overflow-x-auto max-w-[calc(100vw-32px)] md:max-w-full block", `
    );
    fs.writeFileSync(f, c);
  }
});