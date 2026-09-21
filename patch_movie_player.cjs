const fs = require("fs");
let content = fs.readFileSync("src/components/sections/Movie/Player/Player.tsx", "utf8");

// Add useRef import if not there
if (!content.includes("useRef")) {
  console.log("useRef not imported");
}

// Find the useMemo block
const useMemoRegex = /const PLAYER = useMemo\(\(\) => \{[\s\S]*?\}, \[players, selectedSource, mobile\]\);/m;

const replacement = `const isInitialMobile = useRef(typeof window !== "undefined" ? window.innerWidth < 768 : false).current;

  const PLAYER = useMemo(() => {
    const basePlayer = players[selectedSource] || players[0];
    const sep = basePlayer.source.includes("?") ? "&" : "?";
    
    // Disable forced autoplay on mobile to prevent OS-level media blocks
    // We use isInitialMobile so it doesn't recalculate and reload the iframe when the user rotates the screen
    const autoPlayParam = isInitialMobile ? "" : "autoplay=1&";

    return {
      ...basePlayer,
      source: \`\${basePlayer.source}\${sep}\${autoPlayParam}modestbranding=1\`,
    };
  }, [players, selectedSource, isInitialMobile]);`;

if (content.match(useMemoRegex)) {
  content = content.replace(useMemoRegex, replacement);
  fs.writeFileSync("src/components/sections/Movie/Player/Player.tsx", content);
  console.log("Successfully patched MoviePlayer.tsx!");
} else {
  console.log("Could not find the useMemo block.");
}