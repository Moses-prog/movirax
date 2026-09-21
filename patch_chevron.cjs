const fs = require("fs");
let c = fs.readFileSync("src/app/admin/tickets/page.tsx", "utf8");

c = c.replace(
  /\{isMobile && \(\s*<Button\s*isIconOnly\s*variant="light"\s*onPress=\{\(\) => setMobileView\('list'\)\}/,
  `{(isMobile || isFullScreenChat) && (
                        <Button 
                          isIconOnly 
                          variant="light" 
                          onPress={() => {
                            if (isMobile) setMobileView('list');
                            else setIsFullScreenChat(false);
                          }}`
);

fs.writeFileSync("src/app/admin/tickets/page.tsx", c);
console.log("Added Chevron back button for Desktop Full Screen");