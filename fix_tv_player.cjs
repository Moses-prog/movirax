const fs = require("fs");
let content = fs.readFileSync("src/components/sections/Tv/Player/Player.tsx", "utf8");

content = content.replace(/const toggleFullscreen = async \(\) => \{[\s\S]*?console\.error\("Fullscreen error:", e\);\s*\}\s*};\s*return \(/, "return (");

const correctInsertionPoint = "  const PLAYER = useMemo(";
const fullscreenLogic = `  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        if (screen.orientation && screen.orientation.lock) {
          await screen.orientation.lock("landscape").catch(console.error);
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        if (screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock();
        }
      }
    } catch (e) {
      console.error("Fullscreen error:", e);
    }
  };\n\n`;

content = content.replace(correctInsertionPoint, fullscreenLogic + correctInsertionPoint);
fs.writeFileSync("src/components/sections/Tv/Player/Player.tsx", content);
console.log("TvPlayer fixed");