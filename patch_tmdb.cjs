const fs = require('fs');
let c = fs.readFileSync('src/components/sections/About/InteractiveTour.tsx', 'utf8');

c = c.replace(/https:\/\/images\.unsplash\.com\/photo-1536440136628-849c177e76a1\?q=80&w=500&auto=format&fit=crop/g, 'https://image.tmdb.org/t/p/w500/i7UyjfPio0VFHB9rBUZSFyhOoM8.jpg');
c = c.replace(/https:\/\/images\.unsplash\.com\/photo-1626814026160-2237a95fc5a0\?q=80&w=500&auto=format&fit=crop/g, 'https://image.tmdb.org/t/p/w500/6rpvddXbaQPOi0fB2HKWbZ3uUSg.jpg');
c = c.replace(/https:\/\/images\.unsplash\.com\/photo-1446776811953-b23d062836c2\?q=80&w=500&auto=format&fit=crop/g, 'https://image.tmdb.org/t/p/w500/uxCaBoYXsDC4A0SqTm3SISj0OwK.jpg');
c = c.replace(/https:\/\/images\.unsplash\.com\/photo-1451187580459-43490279c0fa\?q=80&w=500&auto=format&fit=crop/g, 'https://image.tmdb.org/t/p/w500/sfQtVlIHljToOwYjhe21KPGzZWK.jpg');
c = c.replace(/https:\/\/images\.unsplash\.com\/photo-1478720568477-152d9b164e26\?q=80&w=1280&auto=format&fit=crop/g, 'https://image.tmdb.org/t/p/w1280/1CIaRYKf3zg2Xyce1CSfCMg2Vfw.jpg');
c = c.replace(/https:\/\/images\.unsplash\.com\/photo-1616530940355-351fabd9524b\?q=80&w=500&auto=format&fit=crop/g, 'https://image.tmdb.org/t/p/w500/cRrf3UIw1HmiFEkKo0Vi85fFjqF.jpg');

fs.writeFileSync('src/components/sections/About/InteractiveTour.tsx', c);