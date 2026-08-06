'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/admin/layout/Sidebar';
import { TopBar } from '@/components/admin/layout/TopBar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

function AdminShellSkeleton() {
  return (
    <div className="flex h-[100dvh] bg-background font-sans overflow-hidden text-foreground">
      {/* Sidebar Skeleton */}
      <aside className="w-[260px] h-[100dvh] flex-none bg-background/80 backdrop-blur-xl border-r border-border p-6 shadow-sm">
        <div className="w-[130px] h-[38px] rounded-xl bg-white/5 border border-white/10 mb-10 animate-pulse" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-10 rounded-xl bg-white/5 border border-white/10 animate-pulse"
            />
          ))}
        </div>
      </aside>

      {/* Main Content Area Skeleton */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* TopBar Skeleton */}
        <header className="h-[73px] flex-none bg-background/80 backdrop-blur-xl border-b border-border px-8 flex items-center justify-between shadow-sm">
          <div className="w-[220px] h-9 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
          <div className="w-[280px] h-9 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
        </header>

        {/* Content Skeleton */}
        <main className="flex-1 p-8 bg-background overflow-hidden">
          <div className="w-[180px] h-9 rounded-xl bg-white/5 border border-white/10 mb-10 animate-pulse" />
          
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 mb-10">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[136px] rounded-2xl bg-white/5 border border-white/10 animate-pulse"
              />
            ))}
          </div>
          
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="h-[300px] rounded-2xl bg-white/5 border border-white/10 animate-pulse"
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

import { getAllTickets, SupportTicket, TicketMessage } from '@/actions/support';
import { createClient } from '@/utils/supabase/client';
import { addToast } from '@heroui/react';

function getParsedMessages(ticket: SupportTicket): TicketMessage[] {
  if (!ticket.resolution) return [];
  try {
    const parsed = JSON.parse(ticket.resolution);
    if (Array.isArray(parsed)) return parsed;
    return [{ sender: 'admin', message: ticket.resolution, timestamp: ticket.resolved_at || ticket.updated_at }];
  } catch (e) {
    return [{ sender: 'admin', message: ticket.resolution, timestamp: ticket.resolved_at || ticket.updated_at }];
  }
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [notifications, setNotifications] = useState<{id: string, message: string, time: string}[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/check-auth', {
          method: 'GET',
        });

        if (!response.ok) {
          router.push('/admin-login');
          return;
        }

        setIsChecking(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin-login');
      }
    };

    checkAuth();
  }, [router]);

  const fetchTickets = async () => {
    const res = await getAllTickets();
    if (res.success && res.data) {
      setTickets(res.data);
    }
  };

  // Fetch initial tickets
  useEffect(() => {
    if (!isChecking) {
      fetchTickets();
    }
  }, [isChecking]);

  // Subscribe to global broadcasts from users
  useEffect(() => {
    if (isChecking) return;
    const supabase = createClient();
    
    const channel = supabase.channel('admin-global-tickets')
      .on('broadcast', { event: 'new_message' }, (payload) => {
        const { ticketId, ticketNumber } = payload.payload;
        fetchTickets(); // Refresh tickets list to get the new message
        
        const newNotif = {
          id: Date.now().toString(),
          message: `User sent a message on ticket #${ticketNumber || ticketId}`,
          time: 'Just now'
        };
        setNotifications(n => [newNotif, ...n].slice(0, 10));
        addToast({ title: newNotif.message, color: "primary" });
      })
      .on('broadcast', { event: 'new_ticket' }, (payload) => {
        const { ticketNumber } = payload.payload;
        fetchTickets(); // Refresh tickets list
        
        const newNotif = {
          id: Date.now().toString(),
          message: `New ticket created: #${ticketNumber}`,
          time: 'Just now'
        };
        setNotifications(n => [newNotif, ...n].slice(0, 10));
        addToast({ title: newNotif.message, color: "primary" });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isChecking]);

  if (isChecking) {
    return <AdminShellSkeleton />;
  }

  // Calculate unread count (tickets with at least one unread user message)
  const unreadSupportCount = tickets.reduce((count, ticket) => {
    const msgs = getParsedMessages(ticket);
    const hasUnread = msgs.some(m => m.sender === 'user' && !m.read);
    return count + (hasUnread ? 1 : 0);
  }, 0);

  return (
    <div className="flex h-[100dvh] bg-background font-sans overflow-hidden text-foreground">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
        unreadSupportCount={unreadSupportCount}
      />

      <div className="flex-1 min-w-0 flex flex-col relative">
        <TopBar 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          notifications={notifications}
        />

        <main className="flex-1 p-6 md:p-8 bg-background overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
