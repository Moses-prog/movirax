const fs = require("fs");
let content = fs.readFileSync("src/components/sections/Landing/LandingPage.tsx", "utf8");

const regex = /  useEffect\(\(\) => \{\n    if \(iframeRef\.current && iframeRef\.current\.contentWindow\) \{\n      iframeRef\.current\.contentWindow\.postMessage\(\n        JSON\.stringify\(\{ event: "command", func: isMuted \? "mute" : "unMute", args: \[\] \}\),\n        "\*"\n      \);\n    \}\n  \}, \[isMuted\]\);\n\n/m;

if (content.match(regex)) {
  content = content.replace(regex, "");
  fs.writeFileSync("src/components/sections/Landing/LandingPage.tsx", content);
  console.log("Removed duplicate useEffect successfully!");
} else {
  console.log("Could not match regex.");
}