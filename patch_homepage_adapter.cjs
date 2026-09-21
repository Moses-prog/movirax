const fs = require("fs");
let c = fs.readFileSync("src/app/page.tsx", "utf8");

c = c.replace(
  /<ContinueWatching \/>[\s\S]*?<HomePageList \/>/g,
  `<Suspense fallback={<div className="w-full py-20 flex justify-center"><Spinner size="lg" /></div>}>\n        <NuqsAdapter>\n          <ContinueWatching />\n          <HomePageList />\n        </NuqsAdapter>\n      </Suspense>`
);

fs.writeFileSync("src/app/page.tsx", c);
console.log("Fixed HomePage missing adapter");