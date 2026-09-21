const fs = require("fs");
let c = fs.readFileSync("src/app/admin/tickets/page.tsx", "utf8");

// Replace Left Column Panel start
c = c.replace(
  /\{\/\* Left Column: Ticket List \*\/\}\s*<Panel defaultSize=\{35\}/,
  `{/* Left Column: Ticket List */}\n          {(!isMobile || mobileView === 'list') && (<Panel defaultSize={35}`
);

// Replace Left Column Panel end & Separator
c = c.replace(
  /<\/Panel>\s*<Separator className="w-4 flex items-center justify-center group cursor-col-resize relative z-10">/,
  `</Panel>)}\n\n          {!isMobile && (\n            <Separator className="w-4 flex items-center justify-center group cursor-col-resize relative z-10">`
);

// Replace Right Column Panel start
c = c.replace(
  /<\/Separator>\s*\{\/\* Right Column: Detail View \*\/\}\s*<Panel defaultSize=\{65\}/,
  `</Separator>\n          )}\n\n          {/* Right Column: Detail View */}\n          {(!isMobile || mobileView === 'detail') && (<Panel defaultSize={65}`
);

// Replace Right Column Panel end
c = c.replace(
  /<\/Panel>\s*<\/Group>\s*<\/div>\s*<\/div>\s*\);\s*\}/,
  `</Panel>)}\n        </Group>\n      </div>\n    </div>\n  );\n}`
);

// Add ChevronLeft button to the Chat Header
c = c.replace(
  /<div className="flex items-center gap-3 mb-2">/,
  `{isMobile && (
                        <Button 
                          isIconOnly 
                          variant="light" 
                          onPress={() => setMobileView('list')} 
                          className="-ml-2 text-default-500 shrink-0"
                        >
                          <ChevronLeft size={24} />
                        </Button>
                      )}
                      <div className="flex items-center gap-3 mb-2">`
);

fs.writeFileSync("src/app/admin/tickets/page.tsx", c);
console.log("Patched panels!");