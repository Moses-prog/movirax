const fs = require("fs");

// 1. Revert manifest to portrait
let manifest = fs.readFileSync("public/manifest.json", "utf8");
manifest = manifest.replace('"orientation": "any"', '"orientation": "portrait"');
fs.writeFileSync("public/manifest.json", manifest);

// 2. Patch MoviePlayerHeader
let header = fs.readFileSync("src/components/sections/Movie/Player/Header.tsx", "utf8");
header = header.replace(
  "import ActionButton from \"./ActionButton\";",
  "import ActionButton from \"./ActionButton\";\nimport { FiMaximize } from \"react-icons/fi\";"
);
header = header.replace(
  "onOpenSource: () => void;",
  "onOpenSource: () => void;\n  onToggleFullscreen?: () => void;"
);
header = header.replace(
  "onOpenSource,\n}) => {",
  "onOpenSource,\n  onToggleFullscreen,\n}) => {"
);
header = header.replace(
  "<Server size={34} />\n        </ActionButton>",
  `<Server size={34} />
        </ActionButton>
        {onToggleFullscreen && (
          <ActionButton label="Fullscreen" tooltip="Rotate to Fullscreen" onClick={onToggleFullscreen}>
            <FiMaximize size={34} />
          </ActionButton>
        )}`
);
fs.writeFileSync("src/components/sections/Movie/Player/Header.tsx", header);

// 3. Patch MoviePlayer
let player = fs.readFileSync("src/components/sections/Movie/Player/Player.tsx", "utf8");

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

// Insert the fullscreen logic just before return (<>
player = player.replace("return (", `${fullscreenLogic}\n\n  return (`);

player = player.replace(
  "onOpenSource={handlers.open}",
  "onOpenSource={handlers.open}\n          onToggleFullscreen={toggleFullscreen}"
);
fs.writeFileSync("src/components/sections/Movie/Player/Player.tsx", player);
console.log("MoviePlayer and Header patched");