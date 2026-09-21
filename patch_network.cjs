const fs = require("fs");
let content = fs.readFileSync("src/components/NetworkStatus.tsx", "utf8");

const regex = /  return \([\s\S]*?\);\n\}/m;

const replacement = `  return (
    <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
      {/* Dot Card */}
      <div className="bg-red-600/90 backdrop-blur-md shadow-lg flex items-center justify-center rounded-full shrink-0 h-9 w-9">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
      </div>

      {/* Text Card */}
      <div className="bg-red-600/90 backdrop-blur-md text-white px-4 shadow-lg text-sm font-medium flex items-center justify-center rounded-full shrink-0 whitespace-nowrap h-9">
        <span>You are currently offline</span>
      </div>
    </div>
  );
}`;

if (content.match(regex)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync("src/components/NetworkStatus.tsx", content);
  console.log("Replaced successfully!");
} else {
  console.log("Could not match regex.");
}