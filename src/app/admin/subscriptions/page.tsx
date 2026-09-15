'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  Search, 
  MoreVertical, 
  CreditCard,
  Ban
} from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  User, 
  Chip, 
  Button, 
  Input, 
  Select, 
  SelectItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Card,
  CardBody,
  Pagination,
  addToast,
  Spinner
} from '@heroui/react';
import { getAllSubscriptions, cancelUserSubscription, UserSubscription } from '@/lib/subscriptions';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    async function load() {
      const subs = await getAllSubscriptions();
      setSubscriptions(subs);
      setIsLoading(false);
    }
    load();
  }, []);
  
  const filteredSubs = useMemo(() => {
    return subscriptions.filter(sub => {
      const email = sub.user_email?.toLowerCase() || '';
      const name = sub.user_name?.toLowerCase() || '';
      const matchesSearch = email.includes(searchQuery.toLowerCase()) || 
                            name.includes(searchQuery.toLowerCase()) ||
                            sub.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' ? true : sub.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [subscriptions, searchQuery, statusFilter]);

  const pages = Math.ceil(filteredSubs.length / rowsPerPage);
  const paginatedSubs = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredSubs.slice(start, end);
  }, [page, filteredSubs]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'trialing': return 'primary';
      case 'cancelled': return 'default';
      case 'past_due': return 'danger';
      default: return 'default';
    }
  };

  const handleCancel = async (id: string) => {
    if (confirm('Are you sure you want to force cancel this subscription?')) {
      const ok = await cancelUserSubscription(id);
      if (ok) {
        setSubscriptions(subscriptions.map(s => s.id === id ? { ...s, status: 'cancelled' } : s));
        addToast({ title: 'Subscription cancelled successfully', color: 'success' });
      } else {
        addToast({ title: 'Failed to cancel subscription', color: 'danger' });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Spinner size="lg" color="danger" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl flex flex-col gap-6 pb-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Subscription Management</h1>
          <p className="text-default-500 mt-1">Manage active subscriptions, trials, and manual cancellations</p>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-none bg-background/60 dark:bg-default-100/50 shadow-sm">
          <CardBody className="p-5 flex flex-col gap-1">
            <p className="text-xs font-bold text-default-500 uppercase tracking-wider">Active Subs</p>
            <p className="text-3xl font-black text-foreground">{subscriptions.filter(s => s.status === 'active').length}</p>
          </CardBody>
        </Card>
        <Card className="border-none bg-background/60 dark:bg-default-100/50 shadow-sm">
          <CardBody className="p-5 flex flex-col gap-1">
            <p className="text-xs font-bold text-default-500 uppercase tracking-wider">Cancelled</p>
            <p className="text-3xl font-black text-default-400">{subscriptions.filter(s => s.status === 'cancelled').length}</p>
          </CardBody>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Input
          className="w-full sm:max-w-[400px]"
          placeholder="Search by name, email, or ID..."
          startContent={<Search size={18} className="text-default-400" />}
          value={searchQuery}
          onValueChange={setSearchQuery}
          variant="faded"
        />
        <Select 
          className="w-full sm:max-w-[200px]"
          selectedKeys={[statusFilter]}
          onChange={(e) => setStatusFilter(e.target.value || 'all')}
          variant="faded"
        >
          <SelectItem key="all" value="all">All Statuses</SelectItem>
          <SelectItem key="active" value="active">Active</SelectItem>
          <SelectItem key="cancelled" value="cancelled">Cancelled</SelectItem>
        </Select>
      </div>

      <Card className="border-none shadow-sm bg-background/60 dark:bg-default-100/50">
        <Table 
          aria-label="Subscriptions Table" 
          removeWrapper 
          classNames={{
            th: "bg-transparent text-default-500 font-semibold text-xs tracking-wider",
            td: "py-4",
          }}
          bottomContent={
            pages > 1 ? (
              <div className="flex w-full justify-center p-4 border-t border-divider/50">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="danger"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            ) : null
          }
        >
          <TableHeader>
            <TableColumn>CUSTOMER</TableColumn>
            <TableColumn>PLAN & PRICING</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>RENEWS / ENDS</TableColumn>
            <TableColumn>PAYMENT</TableColumn>
            <TableColumn align="center">ACTIONS</TableColumn>
          </TableHeader>
          <TableBody 
            emptyContent={
              <div className="flex flex-col items-center justify-center py-10 text-default-500">
                <CreditCard size={32} className="mb-2 opacity-50" />
                <p>No subscriptions found</p>
              </div>
            }
          >
            {paginatedSubs.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>
                  <User
                    avatarProps={{ radius: "md", src: `https://api.dicebear.com/9.x/notionists/svg?seed=${sub.user_email}` }}
                    description={sub.user_email}
                    name={sub.user_name || 'Unknown'}
                    classNames={{ name: "font-semibold text-sm", description: "text-xs" }}
                  />
                  <div className="text-[10px] text-default-400 mt-1 font-mono pl-10">{sub.id}</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-sm text-foreground">{sub.pricing_plans?.name || 'Unknown Plan'}</span>
                    <span className="text-xs font-medium text-default-500">${sub.pricing_plans?.price || 0}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat" color={getStatusColor(sub.status) as any} className="capitalize font-medium">
                    {sub.status}
                  </Chip>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-default-500">
                    {new Date(sub.current_period_end).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">{sub.payment_method}</span>
                    <span className="text-[10px] font-mono text-default-400 truncate max-w-[120px]">{sub.reference}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Dropdown placement="bottom-end">
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light" className="text-default-500 hover:text-foreground">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Subscription actions">
                        <DropdownItem 
                          key="cancel" 
                          onPress={() => handleCancel(sub.id)} 
                          isDisabled={sub.status === 'cancelled'}
                          startContent={<Ban size={16} />} 
                          color="danger"
                          className="text-danger"
                        >
                          Force Cancel
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
