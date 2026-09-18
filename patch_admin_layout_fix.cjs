const fs = require("fs");
let layout = fs.readFileSync("src/app/admin/layout.tsx", "utf8");

// Remove the wrongly injected overlay from AdminShellSkeleton
layout = layout.replace(
  /function AdminShellSkeleton\(\) \{\s*return \(\s*<div className="flex h-\[100dvh\] bg-background font-sans overflow-hidden text-foreground">\s*\{\/\* Mobile Overlay \*\/}\s*\{sidebarOpen && \(\s*<div\s*className="fixed inset-0 z-40 bg-background\/80 backdrop-blur-sm md:hidden"\s*onClick=\{\(\) => setSidebarOpen\(false\)\}\s*\/>\s*\)\}/,
  `function AdminShellSkeleton() {
  return (
    <div className="flex h-[100dvh] bg-background font-sans overflow-hidden text-foreground">`
);

// Inject it into the ACTUAL AdminLayout return!
// The actual return has: <Sidebar \n          isOpen={sidebarOpen}
layout = layout.replace(
  /<div className="flex h-\[100dvh\] bg-background font-sans overflow-hidden text-foreground">\s*<Sidebar/,
  `<div className="flex h-[100dvh] bg-background font-sans overflow-hidden text-foreground">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/90 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar`
);

// Inject the pathname effect to close sidebar
layout = layout.replace(
  /const fetchTickets = async \(\) => \{/,
  `// Close sidebar on mobile when navigating
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  const fetchTickets = async () => {`
);

fs.writeFileSync("src/app/admin/layout.tsx", layout);