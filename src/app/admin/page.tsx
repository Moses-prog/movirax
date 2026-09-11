'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, TrendingDown, TrendingUp, UserRound, Users, Ticket, AlertCircle, ExternalLink } from 'lucide-react';
import { getAdminUsers } from '@/actions/admin';
import { getAllTickets, SupportTicket } from '@/actions/support';
import { Chip, Spinner, Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Button } from '@heroui/react';
import Link from 'next/link';

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
          router.push('/admin/login');
          return;
        }

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
      label: 'Total Users',
      value: users.length.toString(),
      Icon: Users,
      color: "danger",
    },
    {
      label: 'Active Tickets',
      value: activeTicketsCount.toString(),
      Icon: Ticket,
      color: "warning",
    },
    {
      label: 'Total Revenue',
      value: 'TBD',
      Icon: TrendingUp,
      color: "success",
    },
    {
      label: 'Active Subs',
      value: 'TBD',
      Icon: CreditCard,
      color: "primary",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Spinner size="lg" color="danger" label="Loading dashboard..." />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'danger';
      case 'in_progress': return 'warning';
      case 'resolved':
      case 'closed': return 'success';
      default: return 'default';
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Overview Dashboard</h1>
        <p className="text-default-500 mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="border-none bg-background/60 dark:bg-default-100/50 shadow-sm">
            <CardBody className="p-6 flex flex-row items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-default-500 text-sm font-medium uppercase tracking-wider">{stat.label}</span>
                <span className="text-3xl font-bold text-foreground">{stat.value}</span>
              </div>
              <div className={`p-4 rounded-full bg-${stat.color}/10 text-${stat.color}`}>
                <stat.Icon size={28} className="opacity-80" />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Tickets */}
        <Card className="border-none bg-background/60 dark:bg-default-100/50 shadow-sm flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-foreground">Recent Tickets</h2>
              <p className="text-sm text-default-500">Latest support requests</p>
            </div>
            <Button as={Link} href="/admin/tickets" size="sm" variant="flat" endContent={<ExternalLink size={14} />}>
              View All
            </Button>
          </CardHeader>
          <CardBody className="px-6 pb-6 pt-0">
            {tickets.length > 0 ? (
              <Table aria-label="Recent Tickets" removeWrapper classNames={{ th: "bg-transparent text-default-500", td: "py-3" }}>
                <TableHeader>
                  <TableColumn>SUBJECT</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                </TableHeader>
                <TableBody>
                  {tickets.slice(0, 5).map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm truncate max-w-[200px]">{ticket.subject}</span>
                          <span className="text-xs text-default-500 truncate max-w-[200px]">{ticket.description}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip size="sm" variant="flat" color={getStatusColor(ticket.status) as any} className="capitalize">
                          {ticket.status.replace('_', ' ')}
                        </Chip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-default-500">
                <AlertCircle size={32} className="mb-2 opacity-50" />
                <p>No recent tickets</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Recent Users */}
        <Card className="border-none bg-background/60 dark:bg-default-100/50 shadow-sm flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-foreground">Recent Users</h2>
              <p className="text-sm text-default-500">Latest signups</p>
            </div>
            <Button as={Link} href="/admin/users" size="sm" variant="flat" endContent={<ExternalLink size={14} />}>
              View All
            </Button>
          </CardHeader>
          <CardBody className="px-6 pb-6 pt-0">
            {users.length > 0 ? (
              <Table aria-label="Recent Users" removeWrapper classNames={{ th: "bg-transparent text-default-500", td: "py-3" }}>
                <TableHeader>
                  <TableColumn>USER</TableColumn>
                  <TableColumn>ROLE</TableColumn>
                </TableHeader>
                <TableBody>
                  {users.slice(0, 5).map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <User
                          avatarProps={{ radius: "md", src: user.avatar_url || `https://api.dicebear.com/9.x/notionists/svg?seed=${user.email}` }}
                          description={user.email}
                          name={user.full_name || 'Anonymous'}
                          classNames={{ name: "font-semibold text-sm", description: "text-xs" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip size="sm" variant="dot" color={user.role === 'admin' ? 'danger' : 'default'} className="border-none capitalize">
                          {user.role || 'user'}
                        </Chip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-default-500">
                <UserRound size={32} className="mb-2 opacity-50" />
                <p>No recent users</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}