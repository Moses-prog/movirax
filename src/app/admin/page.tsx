'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, TrendingDown, TrendingUp, UserRound, Users, Ticket, AlertCircle } from 'lucide-react';
import { getAdminUsers } from '@/actions/admin';
import { getAllTickets, SupportTicket } from '@/actions/support';
import { Chip, Spinner } from '@heroui/react';

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  const [users, setUsers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const authResponse = await fetch('/api/admin/check-auth', {
          method: 'GET',
        });

        if (!authResponse.ok) {
          router.push('/admin-login');
          return;
        }

        // Fetch data
        const [usersRes, ticketsRes] = await Promise.all([
          getAdminUsers(),
          getAllTickets()
        ]);

        if (usersRes.success && usersRes.data) {
          setUsers(usersRes.data);
        }
        if (ticketsRes.success && ticketsRes.data) {
          setTickets(ticketsRes.data);
        }

      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [router]);

  const activeTicketsCount = tickets.filter(t => t.status !== 'closed' && t.status !== 'resolved').length;

  const statCards = [
    {
      label: 'All Users',
      value: users.length.toString(),
      Icon: Users,
      bgGradient: 'var(--admin-accent-gradient)',
    },
    {
      label: 'Active Support Tickets',
      value: activeTicketsCount.toString(),
      Icon: Ticket,
      bgGradient: 'linear-gradient(135deg, #3f3f46 0%, #f59e0b 100%)',
    },
    {
      label: 'Total Revenue',
      value: 'Coming soon',
      Icon: TrendingUp,
      bgGradient: 'linear-gradient(135deg, #1f2937 0%, #e11d48 100%)',
    },
    {
      label: 'Active Subscriptions',
      value: 'Coming soon',
      Icon: CreditCard,
      bgGradient: 'linear-gradient(135deg, #3f1f1f 0%, #dc2626 100%)',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" color="danger" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'warning';
      case 'in_progress': return 'primary';
      case 'resolved':
      case 'closed': return 'success';
      default: return 'default';
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: '700',
            margin: '0 0 0.5rem 0',
            color: 'var(--admin-text)',
            letterSpacing: '-0.5px',
          }}
        >
          Dashboard
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: 'var(--admin-muted)',
            margin: 0,
            fontWeight: '500',
          }}
        >
          Welcome back! Here's your platform overview.
        </p>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        {statCards.map((card) => {
          const IconComponent = card.Icon;
          return (
            <div
              key={card.label}
              style={{
                backgroundColor: 'var(--admin-surface)',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                border: '1px solid var(--admin-border)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <p
                  style={{
                    margin: '0',
                    fontSize: '12px',
                    color: 'var(--admin-muted)',
                    fontWeight: '600',
                    letterSpacing: '0.3px',
                    textTransform: 'uppercase',
                  }}
                >
                  {card.label}
                </p>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: card.bgGradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  <IconComponent size={20} />
                </div>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: '24px',
                  fontWeight: '700',
                  color: 'var(--admin-text)',
                  letterSpacing: '-0.5px',
                }}
              >
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Lists Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        
        {/* Support Tickets List */}
        <div className="bg-background/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-sm flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[15px] font-bold text-foreground">Recent Support Tickets</h3>
            <button onClick={() => router.push('/admin/tickets')} className="text-xs text-red-500 font-bold hover:underline">
              View All
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            {tickets.length > 0 ? (
              <div className="flex flex-col gap-3">
                {tickets.slice(0, 10).map((ticket) => (
                  <div key={ticket.id} onClick={() => router.push(`/admin/tickets?id=${ticket.id}`)} className="p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <p className="font-bold text-[13px] text-foreground truncate">{ticket.subject}</p>
                      <p className="text-[11px] text-muted-foreground mt-1 truncate">{ticket.ticket_number} • {new Date(ticket.created_at).toLocaleDateString()}</p>
                    </div>
                    <Chip size="sm" variant="flat" color={getStatusColor(ticket.status) as any} className="shrink-0 scale-90 origin-right">
                      {ticket.status.replace('_', ' ')}
                    </Chip>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                <AlertCircle className="opacity-20 mb-2" size={32} />
                <p className="text-sm font-medium">No support tickets found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Users List */}
        <div className="bg-background/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-sm flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[15px] font-bold text-foreground">Registered Users</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            {users.length > 0 ? (
              <div className="flex flex-col gap-3">
                {users.slice(0, 20).map((u) => (
                  <div key={u.id} className="p-3 rounded-xl border border-white/5 bg-white/5 flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {u.user_metadata?.username?.charAt(0)?.toUpperCase() || u.email?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[13px] text-foreground truncate">{u.user_metadata?.username || 'No username'}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{u.email}</p>
                      </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground whitespace-nowrap">
                      Joined {new Date(u.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                <Users className="opacity-20 mb-2" size={32} />
                <p className="text-sm font-medium">No users found.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
