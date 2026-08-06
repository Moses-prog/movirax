const fs = require('fs');
const envLines = fs.readFileSync('.env.local', 'utf8').split('\n');
const env = {};
envLines.forEach(l => {
  const idx = l.indexOf('=');
  if(idx > 0) {
    env[l.slice(0,idx).trim()] = l.slice(idx+1).trim().replace(/['"]/g, '');
  }
});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
supabase.from('user_profiles').select('*').limit(1).then(r => console.log(JSON.stringify(r.data ? Object.keys(r.data[0] || {}) : r.error, null, 2)));
