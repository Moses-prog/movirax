const fs = require("fs");
let content = fs.readFileSync("src/components/sections/Movie/Player/Player.tsx", "utf8");

// Remove the wrongly placed toggleFullscreen
const badBlock = `            const toggleFullscreen = async () => {
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
  };

  return (`;

if (content.includes(badBlock)) {
  content = content.replace(badBlock, `return (`);
} else {
  // It might be formatted differently
  content = content.replace(/const toggleFullscreen = async \(\) => \{[\s\S]*?console\.error\("Fullscreen error:", e\);\s*\}\s*};\s*return \(/, "return (");
}

const correctInsertionPoint = "  const handleShieldInteraction = (e: React.MouseEvent | React.TouchEvent) => {";
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
fs.writeFileSync("src/components/sections/Movie/Player/Player.tsx", content);
console.log("MoviePlayer fixed");