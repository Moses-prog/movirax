const fs = require("fs");
let c = fs.readFileSync("src/app/admin/tickets/page.tsx", "utf8");

c = c.replace(
  /<Button\s*isIconOnly\s*variant="light"\s*className="text-default-500 hover:text-foreground"\s*onPress=\{\(\) => setIsFullScreenChat\(!isFullScreenChat\)\}\s*>\s*\{isFullScreenChat \? <Minimize size=\{18\} \/> : <Maximize size=\{18\} \/>\}\s*<\/Button>/,
  `<Button
                            variant="flat"
                            color={isFullScreenChat ? "danger" : "default"}
                            className="font-bold shadow-sm"
                            onPress={() => setIsFullScreenChat(!isFullScreenChat)}
                            startContent={isFullScreenChat ? <Minimize size={18} /> : <Maximize size={18} />}
                          >
                            {isFullScreenChat ? "Exit Focus" : "Focus Mode"}
                          </Button>`
);

fs.writeFileSync("src/app/admin/tickets/page.tsx", c);
console.log("Made focus mode button very visible");