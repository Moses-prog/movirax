const fs = require("fs");

function wrapWithSuspense(filePath, exportName) {
  let c = fs.readFileSync(filePath, "utf8");
  if (!c.includes("import { Suspense } from")) {
    c = `import { Suspense } from "react";\n` + c;
  }
  
  if (exportName === "default RootPage") {
    // For app/page.tsx
    c = c.replace(/export default function RootPage\(\) \{/, `function RootPageContent() {`);
    c = c + `\n\nexport default function RootPage() {\n  return (\n    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center"><Spinner size="lg" /></div>}>\n      <RootPageContent />\n    </Suspense>\n  );\n}\n`;
  } else if (exportName === "AuthPage") {
    // For auth/page.tsx
    c = c.replace(/const AuthPage: NextPage = \(\) => \{/, `const AuthPageContent: NextPage = () => {`);
    c = c.replace(/export default AuthPage;/, `const AuthPage: NextPage = () => {\n  return (\n    <Suspense>\n      <AuthPageContent />\n    </Suspense>\n  );\n};\n\nexport default AuthPage;`);
  } else if (exportName === "MoviePlayerPage") {
    // For movie player
    c = c.replace(/const MoviePlayerPage: NextPage<Params<\{ id: number \}\>> = \(\{ params \}\) => \{/, `const MoviePlayerPageContent: NextPage<Params<{ id: number }>> = ({ params }) => {`);
    c = c.replace(/export default MoviePlayerPage;/, `const MoviePlayerPage: NextPage<Params<{ id: number }>> = ({ params }) => {\n  return (\n    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center"><Spinner size="lg" variant="simple" /></div>}>\n      <MoviePlayerPageContent params={params} />\n    </Suspense>\n  );\n};\n\nexport default MoviePlayerPage;`);
  } else if (exportName === "TvShowPlayerPage") {
    // For tv player
    c = c.replace(/const TvShowPlayerPage: NextPage<Params<\{ id: number; season: number; episode: number \}\>> = \(\{\s*params,\s*\}\) => \{/, `const TvShowPlayerPageContent: NextPage<Params<{ id: number; season: number; episode: number }>> = ({ params }) => {`);
    c = c.replace(/export default TvShowPlayerPage;/, `const TvShowPlayerPage: NextPage<Params<{ id: number; season: number; episode: number }>> = ({ params }) => {\n  return (\n    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center"><Spinner size="lg" color="warning" variant="simple" /></div>}>\n      <TvShowPlayerPageContent params={params} />\n    </Suspense>\n  );\n};\n\nexport default TvShowPlayerPage;`);
  }

  fs.writeFileSync(filePath, c);
}

wrapWithSuspense("src/app/page.tsx", "default RootPage");
wrapWithSuspense("src/app/auth/page.tsx", "AuthPage");
wrapWithSuspense("src/app/movie/[id]/player/page.tsx", "MoviePlayerPage");
wrapWithSuspense("src/app/tv/[id]/[season]/[episode]/player/page.tsx", "TvShowPlayerPage");
console.log("Added Suspense boundaries");