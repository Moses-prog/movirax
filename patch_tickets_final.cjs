const fs = require("fs");
let c = fs.readFileSync("src/app/admin/tickets/page.tsx", "utf8");

// Add ChevronLeft
c = c.replace(/CheckCheck\n\} from 'lucide-react';/, "CheckCheck, ChevronLeft\n} from 'lucide-react';");

// Add State
c = c.replace(
  /const \[selectedTicketId, setSelectedTicketId\] = useState<string \| null>\(null\);/,
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

// Add mobileView setter to the ticket click
c = c.replace(
  /onPress=\{\(\) => setSelectedTicketId\(ticket.id\)\}/g,
  `onPress={() => { setSelectedTicketId(ticket.id); if (isMobile) setMobileView('detail'); }}`
);
c = c.replace(
  /onPress=\{\(\) => setSelectedTicketId\(t.id\)\}/g,
  `onPress={() => { setSelectedTicketId(t.id); if (isMobile) setMobileView('detail'); }}`
);

// Conditionally render the Panels
c = c.replace(
  /<Panel defaultSize=\{35\}/,
  `{(!isMobile || mobileView === 'list') && (<Panel defaultSize={35}`
);

// End of first panel is before <Separator />
c = c.replace(
  /<\/Panel>\s*<Separator/,
  `</Panel>)}\n            {!isMobile && <Separator`
);

// Next panel
c = c.replace(
  /<Separator className="w-2 bg-transparent" \/>\s*<Panel defaultSize=\{65\}/,
  `<Separator className="w-2 bg-transparent" />}\n            {(!isMobile || mobileView === 'detail') && (<Panel defaultSize={65}`
);

// End of second panel is before </Group>
c = c.replace(
  /<\/Panel>\s*<\/Group>/,
  `</Panel>)}\n          </Group>`
);

// Inject back button in Header
c = c.replace(
  /<div className="flex justify-between items-start mb-4">/,
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
  /<\/div>\s*<\/div>\s*<div className="text-xl font-black/,
  `</div>\n                  </div>\n                  </div>\n                  <div className="text-xl font-black`
);

fs.writeFileSync("src/app/admin/tickets/page.tsx", c);