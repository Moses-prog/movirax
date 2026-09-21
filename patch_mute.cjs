const fs = require("fs");
let content = fs.readFileSync("src/components/sections/Landing/LandingPage.tsx", "utf8");

const regex = /  const bentoVariant = \{/;

const replacement = `  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: isMuted ? "mute" : "unMute", args: [] }),
        "*"
      );
    }
  }, [isMuted]);

  const bentoVariant = {`;

if (content.match(regex)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync("src/components/sections/Landing/LandingPage.tsx", content);
  console.log("Replaced successfully!");
} else {
  console.log("Could not match regex.");
}