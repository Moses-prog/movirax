const fs = require("fs");
let c = fs.readFileSync("src/app/admin/tickets/page.tsx", "utf8");

// Add state for mobile
c = c.replace(
  /const \[selectedTicketId, setSelectedTicketId\] = useState<string \| null>\(null\);/,
  `const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMobileView('list'); // reset
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);`
);

// We need ChevronLeft imported
c = c.replace(
  /CheckCheck\n} from 'lucide-react';/,
  `CheckCheck, ChevronLeft\n} from 'lucide-react';`
);

// We need to inject the "Back" button into the Chat Header.
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
// Close the extra div
c = c.replace(
  /<\/div>\s*<\/div>\s*<div className="text-xl font-black/,
  `</div>\n              </div>\n              </div>\n              <div className="text-xl font-black`
);

// Switch to detail view on click
c = c.replace(
  /onPress=\{\(\) => setSelectedTicketId\(t\.id\)\}/g,
  `onPress={() => { setSelectedTicketId(t.id); if (window.innerWidth < 768) setMobileView('detail'); }}`
);

// Now for the Panels! If isMobile, render only the active view without Panels
c = c.replace(
  /<Group orientation="horizontal" className="w-full h-full">/,
  `{isMobile ? (
            <div className="w-full h-full flex flex-col relative overflow-hidden">
`
);

fs.writeFileSync("src/app/admin/tickets/page.tsx", c);