const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseKey) { console.error("No service role key"); process.exit(1); }
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from("user_profiles").select("*").limit(1);
  if (error) console.error("Error:", error);
  else console.log("Success. Columns:", data.length > 0 ? Object.keys(data[0]) : "No rows");
}
check();