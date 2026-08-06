'use server';

import { createClient } from '@supabase/supabase-js';
import { env } from '@/utils/env';

export async function getAdminUsers() {
  try {
    const supabaseAdmin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error('Error fetching admin users:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data: users };
  } catch (error: any) {
    console.error('Exception fetching admin users:', error);
    return { success: false, error: error.message };
  }
}
