const fs = require("fs");
let c = fs.readFileSync("src/app/admin/tickets/page.tsx", "utf8");

// Imports
c = c.replace(
  /ChevronLeft\r?\n\} from 'lucide-react';/,
  `ChevronLeft,\n  Maximize,\n  Minimize\n} from 'lucide-react';`
);

// State
c = c.replace(
  /const \[mobileView, setMobileView\] = useState<'list' \| 'detail'>\('list'\);/,
  `const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
  const [isFullScreenChat, setIsFullScreenChat] = useState(false);`
);

// Conditionally render the left panel and separator based on BOTH isMobile and isFullScreenChat
// Old: {(!isMobile || mobileView === 'list') && (<Panel defaultSize={35}
// New: {(!isMobile && !isFullScreenChat || (isMobile && mobileView === 'list')) && (<Panel defaultSize={35}
c = c.replace(
  /\{\(!isMobile \|\| mobileView === 'list'\) && \(<Panel defaultSize=\{35\}/g,
  `{((!isMobile && !isFullScreenChat) || (isMobile && mobileView === 'list')) && (<Panel defaultSize={35}`
);

// Old: {!isMobile && ( <Separator
// New: {!isMobile && !isFullScreenChat && ( <Separator
c = c.replace(
  /\{!isMobile && \(\s*<Separator className="w-4/g,
  `{!isMobile && !isFullScreenChat && (\n            <Separator className="w-4`
);

// Inside the Chat Header, add the Full Screen toggle button next to the other actions
c = c.replace(
  /<div className="flex items-center gap-3">/,
  `<div className="flex items-center gap-3">
                        {!isMobile && (
                          <Button
                            isIconOnly
                            variant="light"
                            className="text-default-500 hover:text-foreground"
                            onPress={() => setIsFullScreenChat(!isFullScreenChat)}
                          >
                            {isFullScreenChat ? <Minimize size={18} /> : <Maximize size={18} />}
                          </Button>
                        )}`
);

fs.writeFileSync("src/app/admin/tickets/page.tsx", c);
console.log("Added Desktop Full-Screen Chat toggle");