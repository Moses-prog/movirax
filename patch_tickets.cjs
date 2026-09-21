const fs = require("fs");
let c = fs.readFileSync("src/app/admin/tickets/page.tsx", "utf8");

// Add state for mobile
c = c.replace(
  /const \[selectedTicketId, setSelectedTicketId\] = useState<string \| null>\(null\);/,
  `const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);`
);

// We need to inject the "Back" button into the Chat Header.
c = c.replace(
  /<div className="flex justify-between items-start mb-4">/,
  `<div className="flex justify-between items-start mb-4">
              {isMobile && (
                <Button 
                  isIconOnly 
                  variant="light" 
                  onPress={() => setMobileView('list')} 
                  className="mr-2 -ml-2 text-default-500"
                >
                  <ChevronLeft size={20} />
                </Button>
              )}`
);

// We need to make sure clicking a ticket in the list switches to 'detail' view on mobile
c = c.replace(
  /onPress=\{\(\) => setSelectedTicketId\(t.id\)\}/g,
  `onPress={() => { setSelectedTicketId(t.id); if (isMobile) setMobileView('detail'); }}`
);

// Now we need to render the Group only on Desktop, or just hide Panels based on mobileView
c = c.replace(
  /<Group orientation="horizontal" className="w-full h-full">/,
  `<Group orientation="horizontal" className="w-full h-full">` // wait, I can just do this with CSS classes on Panels!
);
// Actually, Panel components can't have `className="hidden"` easily because `react-resizable-panels` calculates flex weights.
// If it's mobile, we should NOT render `<Group>`. We should just render the `div`s directly!
fs.writeFileSync("patch_tickets_step1.cjs", c);