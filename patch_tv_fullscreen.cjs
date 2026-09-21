const fs = require("fs");

let header = fs.readFileSync("src/components/sections/Tv/Player/Header.tsx", "utf8");
header = header.replace(
  "import ActionButton from \"./ActionButton\";",
  "import ActionButton from \"./ActionButton\";\nimport { FiMaximize } from \"react-icons/fi\";"
);
header = header.replace(
  "onOpenSeason: () => void;",
  "onOpenSeason: () => void;\n  onToggleFullscreen?: () => void;"
);
header = header.replace(
  "onOpenSeason,\n}) => {",
  "onOpenSeason,\n  onToggleFullscreen,\n}) => {"
);
header = header.replace(
  "<List size={34} />\n        </ActionButton>",
  `<List size={34} />
        </ActionButton>
        {onToggleFullscreen && (
          <ActionButton label="Fullscreen" tooltip="Rotate to Fullscreen" onClick={onToggleFullscreen}>
            <FiMaximize size={34} />
          </ActionButton>
        )}`
);
fs.writeFileSync("src/components/sections/Tv/Player/Header.tsx", header);

let player = fs.readFileSync("src/components/sections/Tv/Player/Player.tsx", "utf8");
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
  };`;
player = player.replace("return (", `${fullscreenLogic}\n\n  return (`);
player = player.replace(
  "onOpenSeason={seasonHandlers.open}",
  "onOpenSeason={seasonHandlers.open}\n            onToggleFullscreen={toggleFullscreen}"
);
fs.writeFileSync("src/components/sections/Tv/Player/Player.tsx", player);
console.log("TvPlayer and Header patched");