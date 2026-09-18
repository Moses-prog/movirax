const fs = require('fs');
let c = fs.readFileSync('src/components/sections/About/InteractiveTour.tsx', 'utf8');

// Replace TMDB images with Unsplash images
c = c.replace(/https:\/\/image\.tmdb\.org\/t\/p\/w500\/8cdWjvZQUExUUTzyp4t6EDMubfO\.jpg/g, 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500&auto=format&fit=crop');
c = c.replace(/https:\/\/image\.tmdb\.org\/t\/p\/w500\/1pdfLvkbY9ohJlCjQH2TDpiO9JC\.jpg/g, 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=500&auto=format&fit=crop');
c = c.replace(/https:\/\/image\.tmdb\.org\/t\/p\/w500\/gEU2QniE6E77NI6lCU6MvlId7St\.jpg/g, 'https://images.unsplash.com/photo-1446776811953-b23d062836c2?q=80&w=500&auto=format&fit=crop');
c = c.replace(/https:\/\/image\.tmdb\.org\/t\/p\/w500\/f89U3ADr1oiB1s9GvwJwBZZ4Zcz\.jpg/g, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=500&auto=format&fit=crop');
c = c.replace(/https:\/\/image\.tmdb\.org\/t\/p\/w1280\/8pjWz2lt29KyVGoq1mEBtEPvq10\.jpg/g, 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1280&auto=format&fit=crop');
c = c.replace(/https:\/\/image\.tmdb\.org\/t\/p\/w500\/8Gxv8gSFCU0XGDykEGv7zR1n2ua\.jpg/g, 'https://images.unsplash.com/photo-1616530940355-351fabd9524b?q=80&w=500&auto=format&fit=crop');

// Fix ProfilesSandbox mobile wrap
c = c.replace(/className="flex gap-8"/g, 'className="flex flex-wrap justify-center gap-4 md:gap-8"');
c = c.replace(/w-24 h-24/g, 'w-16 h-16 md:w-24 md:h-24');

// Fix Sandbox Container min-height for mobile
c = c.replace(/min-h-\[500px\]/g, 'min-h-[400px] md:min-h-[500px]');
c = c.replace(/gap-12 p-6 py-12/g, 'gap-8 p-4 md:p-6 py-8 md:py-12');
c = c.replace(/justify-center p-8/g, 'justify-center p-4 md:p-8');

fs.writeFileSync('src/components/sections/About/InteractiveTour.tsx', c);