const fs = require("fs");
let c = fs.readFileSync("src/app/admin/tickets/page.tsx", "utf8");

// State
c = c.replace(
  `const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);`,
  `const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMobileView('list');
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);`
);

// Click
c = c.replace(
  /onPress=\{\(\) => setSelectedTicketId\(t\.id\)\}/g,
  `onPress={() => { setSelectedTicketId(t.id); if (window.innerWidth < 768) setMobileView('detail'); }}`
);

// Icon
c = c.replace(
  `CheckCheck\n} from 'lucide-react';`,
  `CheckCheck,\n  ChevronLeft\n} from 'lucide-react';`
);

// Back button
c = c.replace(
  `<div className="flex justify-between items-start mb-4">`,
  `<div className="flex items-start mb-4 gap-2">
                    {isMobile && (
                      <Button 
                        isIconOnly 
                        variant="light" 
                        onPress={() => setMobileView('list')} 
                        className="-ml-2 mt-[-4px] text-default-500 shrink-0"
                      >
                        <ChevronLeft size={24} />
                      </Button>
                    )}
                    <div className="flex justify-between items-start w-full">`
);
c = c.replace(
  `</div>
                    </div>
                    <div className="text-xl font-black leading-tight text-foreground">{selectedTicket.subject}</div>`,
  `</div>
                    </div>
                    </div>
                    <div className="text-xl font-black leading-tight text-foreground">{selectedTicket.subject}</div>`
);

// Panels
c = c.replace(
  `<Group orientation="horizontal" className="w-full h-full">
          {/* Left Column: Ticket List */}
          <Panel defaultSize={35} minSize={5} className="flex flex-col rounded-2xl border-none bg-background/60 dark:bg-default-100/50 p-4 min-w-0">`,
  `<Group orientation="horizontal" className="w-full h-full">
          {/* Left Column: Ticket List */}
          {(!isMobile || mobileView === 'list') && (<Panel defaultSize={35} minSize={5} className="flex flex-col rounded-2xl border-none bg-background/60 dark:bg-default-100/50 p-4 min-w-0">`
);

c = c.replace(
  `            </Group>
          </Panel>

          <Separator className="w-4 flex items-center justify-center group cursor-col-resize relative z-10">
            <div className="h-12 w-1 rounded-full bg-divider group-hover:bg-danger transition-colors flex items-center justify-center" />
          </Separator>

          {/* Right Column: Detail View */}
          <Panel defaultSize={65} minSize={5} className="flex flex-col rounded-2xl border-none bg-background/60 dark:bg-default-100/50 overflow-hidden min-w-0">`,
  `            </Group>
          </Panel>)}

          {!isMobile && (
            <Separator className="w-4 flex items-center justify-center group cursor-col-resize relative z-10">
              <div className="h-12 w-1 rounded-full bg-divider group-hover:bg-danger transition-colors flex items-center justify-center" />
            </Separator>
          )}

          {/* Right Column: Detail View */}
          {(!isMobile || mobileView === 'detail') && (<Panel defaultSize={65} minSize={5} className="flex flex-col rounded-2xl border-none bg-background/60 dark:bg-default-100/50 overflow-hidden min-w-0">`
);

c = c.replace(
  `          </Panel>
        </Group>`,
  `          </Panel>)}
        </Group>`
);


fs.writeFileSync("src/app/admin/tickets/page.tsx", c);