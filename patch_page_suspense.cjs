const fs = require("fs");
let c = fs.readFileSync("src/app/page.tsx", "utf8");

c = c.replace(
  /const HomePage = \(\) => \{\n  return \(\n    <div className="flex flex-col gap-3 md:gap-8">\n      <ContinueWatching \/>\n      <HomePageList \/>\n    <\/div>\n  \);\n\};/,
  `const HomePage = () => {\n  return (\n    <div className="flex flex-col gap-3 md:gap-8">\n      <Suspense fallback={<div className="w-full py-20 flex justify-center"><Spinner size="lg" /></div>}>\n        <NuqsAdapter>\n          <ContinueWatching />\n          <HomePageList />\n        </NuqsAdapter>\n      </Suspense>\n    </div>\n  );\n};`
);

c = c.replace(
  /export default function RootPage\(\) \{\n  return \(\n    <Suspense fallback=\{<div className="w-full h-screen flex items-center justify-center"><Spinner size="lg" \/><\/div>\}>\n      <NuqsAdapter>\n      <RootPageContent \/>\n          <\/NuqsAdapter>\n    <\/Suspense>\n  \);\n\}/,
  `export default function RootPage() {\n  return <RootPageContent />;\n}`
);

fs.writeFileSync("src/app/page.tsx", c);
console.log("Refactored Suspense in page.tsx");