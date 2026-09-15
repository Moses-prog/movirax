"use server";

import { createClient } from "@/utils/supabase/server";
import { requireAuth } from "./auth-helpers";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

export type TicketRequestType = 'upgrade' | 'downgrade' | 'cancel' | 'billing' | 'other';
export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface SupportTicket {
  id: string;
  ticket_number: string;
  user_id: string;
  request_type: TicketRequestType;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigned_to: string | null;
  resolution: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  closed_at: string | null;
  // Included via join occasionally:
  auth_users?: { email: string } | null;
  user_profiles?: { name: string } | null;
}

function generateTicketNumber() {
  return 'TKT-' + Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createTicket(data: {
  subject: string;
  description: string;
  request_type: TicketRequestType;
  priority?: TicketPriority;
}) {
  try {
    const user = await requireAuth();
    if (!user) return { success: false, error: "Unauthorized" };

    const supabase = await createClient();
    
    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .insert({
        user_id: user.id,
        ticket_number: generateTicketNumber(),
        subject: data.subject,
        description: data.description,
        request_type: data.request_type,
        priority: data.priority || 'normal',
        status: 'open'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating ticket:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/support');
    return { success: true, data: ticket };
  } catch (error) {
    console.error('Action error:', error);
    return { success: false, error: 'Failed to create ticket' };
  }
}

export async function getUserTickets() {
  noStore();
  try {
    const user = await requireAuth();
    if (!user) return { success: false, error: "Unauthorized", data: [] };

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user tickets:', error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data as SupportTicket[] };
  } catch (error) {
    console.error('Action error:', error);
    return { success: false, error: 'Failed to fetch tickets', data: [] };
  }
}

export async function getAllTickets() {
  noStore();
  try {
    // Note: Assuming admin auth check happens in the layout or route handler.
    const user = await requireAuth();
    if (!user) return { success: false, error: "Unauthorized", data: [] };

    // Use admin client to bypass RLS and fetch ALL users' tickets
    const supabase = await createClient(true);
    
    const { data: tickets, error } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all tickets:', error);
      return { success: false, error: error.message, data: [] };
    }

    let finalData = tickets || [];

    if (finalData.length > 0) {
      // Manually join user_profiles to avoid foreign key schema cache errors
      const userIds = [...new Set(finalData.map((t: any) => t.user_id))];
      // Initialize raw Supabase JS client for admin auth operations
      const { createClient: createSupabaseJs } = require('@supabase/supabase-js');
      const supabaseAdmin = createSupabaseJs(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );

      const [userProfilesResult, mainProfilesResult, authResult] = await Promise.all([
        supabase.from('user_profiles').select('id, name').in('id', userIds),
        supabase.from('profiles').select('id, username').in('id', userIds),
        supabaseAdmin.auth.admin.listUsers()
      ]);
        
      const userProfileMap = userProfilesResult.data ? Object.fromEntries(userProfilesResult.data.map((p: any) => [p.id, p])) : {};
      const mainProfileMap = mainProfilesResult.data ? Object.fromEntries(mainProfilesResult.data.map((p: any) => [p.id, p])) : {};
      const emailMap = authResult.data?.users ? Object.fromEntries(authResult.data.users.map((u: any) => [u.id, u.email])) : {};

      finalData = finalData.map((t: any) => ({
        ...t,
        user_profiles: { 
          name: userProfileMap[t.user_id]?.name || mainProfileMap[t.user_id]?.username || null 
        },
        auth_users: emailMap[t.user_id] ? { email: emailMap[t.user_id] } : null
      }));
    }

    return { success: true, data: finalData as SupportTicket[] };
  } catch (error) {
    console.error('Action error:', error);
    return { success: false, error: 'Failed to fetch tickets', data: [] };
  }
}

export async function updateTicketStatus(ticketId: string, status: TicketStatus, resolution?: string) {
  try {
    const user = await requireAuth();
    if (!user) return { success: false, error: "Unauthorized" };

    const { createClient: createSupabaseJs } = require('@supabase/supabase-js');
    const supabaseAdmin = createSupabaseJs(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const updateData: any = { 
      status, 
      updated_at: new Date().toISOString() 
    };
    
    if (resolution !== undefined) {
      updateData.resolution = resolution;
    }
    
    if (status === 'resolved') {
      updateData.resolved_at = new Date().toISOString();
    } else if (status === 'closed') {
      updateData.closed_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from('support_tickets')
      .update(updateData)
      .eq('id', ticketId)
      .select()
      .single();

    if (error) {
      console.error('Error updating ticket status:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/tickets');
    revalidatePath('/support');
    return { success: true, data };
  } catch (error) {
    console.error('Action error:', error);
    return { success: false, error: 'Failed to update ticket' };
  }
}

export interface TicketMessage {
  sender: 'user' | 'admin';
  message: string;
  timestamp: string;
  read?: boolean;
}

export async function markMessagesRead(ticketId: string, reader: 'user' | 'admin') {
  try {
    const user = await requireAuth();
    if (!user) return { success: false, error: "Unauthorized" };

    const { createClient: createSupabaseJs } = require('@supabase/supabase-js');
    const supabaseAdmin = createSupabaseJs(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: ticket, error: fetchError } = await supabaseAdmin
      .from('support_tickets')
      .select('resolution')
      .eq('id', ticketId)
      .single();

    if (fetchError || !ticket || !ticket.resolution) {
      return { success: false, error: 'Ticket not found or empty' };
    }

    try {
      const messages: TicketMessage[] = JSON.parse(ticket.resolution);
      if (!Array.isArray(messages)) return { success: true }; // Legacy format, ignore

      let changed = false;
      const updatedMessages = messages.map(msg => {
        // If the reader is 'user', mark 'admin' messages as read
        if (msg.sender !== reader && !msg.read) {
          changed = true;
          return { ...msg, read: true };
        }
        return msg;
      });

      if (!changed) return { success: true };

      const { error: updateError } = await supabaseAdmin
        .from('support_tickets')
        .update({ resolution: JSON.stringify(updatedMessages) })
        .eq('id', ticketId);

      if (updateError) return { success: false, error: updateError.message };

      return { success: true };
    } catch (e) {
      return { success: true }; // Legacy format, ignore
    }
  } catch (error) {
    return { success: false, error: 'Failed to mark read' };
  }
}

export async function addTicketMessage(ticketId: string, message: string, sender: 'user' | 'admin', resolve?: boolean) {
  try {
    const user = await requireAuth();
    if (!user) return { success: false, error: "Unauthorized" };

    const supabase = await createClient(true);
    
    // Fetch the current ticket to get existing resolution/messages
    const { data: ticket, error: fetchError } = await supabase
      .from('support_tickets')
      .select('resolution, status')
      .eq('id', ticketId)
      .single();

    if (fetchError || !ticket) {
      return { success: false, error: fetchError?.message || 'Ticket not found' };
    }

    let messages: TicketMessage[] = [];
    
    if (ticket.resolution) {
      try {
        const parsed = JSON.parse(ticket.resolution);
        if (Array.isArray(parsed)) {
          messages = parsed;
        } else {
          // Legacy plain text resolution
          messages.push({ sender: 'admin', message: ticket.resolution, timestamp: new Date().toISOString() });
        }
      } catch (e) {
        // Legacy plain text resolution
        messages.push({ sender: 'admin', message: ticket.resolution, timestamp: new Date().toISOString() });
      }
    }

    messages.push({
      sender,
      message,
      timestamp: new Date().toISOString()
    });

    const newResolution = JSON.stringify(messages);
    
    let newStatus = ticket.status;
    if (resolve) {
      newStatus = 'resolved';
    } else if (sender === 'user' && ticket.status === 'resolved') {
      newStatus = 'in_progress';
    } else if (ticket.status === 'open' && sender === 'admin') {
      newStatus = 'in_progress';
    }

    return await updateTicketStatus(ticketId, newStatus, newResolution);
  } catch (error) {
    console.error('Action error:', error);
    return { success: false, error: 'Failed to add message' };
  }
}
