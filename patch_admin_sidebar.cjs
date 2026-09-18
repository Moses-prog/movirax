const fs = require("fs");

let layout = fs.readFileSync("src/app/admin/layout.tsx", "utf8");
// Inject mobile overlay right after the opening div
layout = layout.replace(
  /<div className="flex h-\[100dvh\] bg-background font-sans overflow-hidden text-foreground">/,
  `<div className="flex h-[100dvh] bg-background font-sans overflow-hidden text-foreground">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}`
);
fs.writeFileSync("src/app/admin/layout.tsx", layout);

let sidebar = fs.readFileSync("src/components/admin/layout/Sidebar.tsx", "utf8");
// Update Sidebar className for responsive behavior
sidebar = sidebar.replace(
  /className=\{`sticky top-0 z-30 flex h-\[100dvh\] flex-none flex-col overflow-hidden bg-content1\/80 py-6 shadow-sm backdrop-blur-xl border-r border-divider transition-\[width\] duration-300 ease-\[cubic-bezier\(0.4,0,0.2,1\)\] \$\{isOpen \? 'w-\[260px\]' : 'w-\[88px\]'\}`\}/g,
  `className={\`fixed inset-y-0 left-0 z-50 flex h-[100dvh] flex-none flex-col overflow-hidden bg-content1 py-6 shadow-2xl md:shadow-sm backdrop-blur-xl border-r border-divider transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] md:sticky md:top-0 \${isOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full md:translate-x-0 md:w-[88px]'}\`}`
);
// Also hide the collapse buttons on mobile!
sidebar = sidebar.replace(
  /<Button\s*isIconOnly\s*variant="light"\s*onClick=\{onToggle\}/g,
  `<Button isIconOnly variant="light" onClick={onToggle} className="hidden md:flex"`
);
fs.writeFileSync("src/components/admin/layout/Sidebar.tsx", sidebar);