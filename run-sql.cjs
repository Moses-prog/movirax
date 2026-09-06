const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  // Using the postgres connection string since supabase-js can't run DDL easily without rpc
  const { Client } = require('pg');
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  
  await client.connect();
  const sql = fs.readFileSync('supabase/migrations/20260906154500_create_promotions.sql', 'utf8');
  await client.query(sql);
  console.log('Migration applied');
  await client.end();
}

run().catch(console.error);
