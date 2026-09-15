'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Ban,
  CheckCircle,
  MoreVertical,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  User as HeroUser, 
  Chip, 
  Button, 
  Input, 
  Select, 
  SelectItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Spinner
} from '@heroui/react';
import { addToast } from '@heroui/react';

type UserStatus = 'active' | 'suspended' | 'banned';
type SubscriptionTier = 'free' | 'premium' | 'enterprise';
type StatusFilter = 'all' | UserStatus;

interface User {
  id: string;
  email: string;
  display_name?: string | null;
  avatar_url?: string | null;
  status: UserStatus;
  subscription_tier: SubscriptionTier;
  created_at: string;
}

const usersPerPage = 10;

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getSubscriptionColor(tier: SubscriptionTier) {
  const map: Record<SubscriptionTier, "default" | "secondary" | "primary"> = {
    free: 'default',
    premium: 'secondary',
    enterprise: 'primary',
  };
  return map[tier];
}

function getStatusColor(status: UserStatus) {
  const map: Record<UserStatus, "success" | "warning" | "danger"> = {
    active: 'success',
    suspended: 'warning',
    banned: 'danger',
  };
  return map[status];
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin');
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to load users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.email.toLowerCase().includes(query) ||
        (user.display_name || '').toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, statusFilter]);

  const pages = Math.ceil(filteredUsers.length / usersPerPage) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * usersPerPage;
    return filteredUsers.slice(start, start + usersPerPage);
  }, [currentPage, filteredUsers]);

  const updateUserStatus = async (userId: string, status: UserStatus) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status })
      });

      if (!res.ok) throw new Error('Failed to update status');

      setUsers((currentUsers) =>
        currentUsers.map((user) => (user.id === userId ? { ...user, status } : user))
      );
      addToast({ title: "User status updated", color: "success" });
    } catch (error) {
      console.error(`Failed to update user status to ${status}:`, error);
      addToast({ title: "Failed to update status", color: "danger" });
    } finally {
      setActionLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this user? This action cannot be undone.'
    );
    if (!confirmed) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      if (!res.ok) throw new Error('Failed to delete user');

      setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userId));
      addToast({ title: "User deleted successfully", color: "success" });
    } catch (error) {
      console.error('Failed to delete user:', error);
      addToast({ title: "Failed to delete user", color: "danger" });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl flex flex-col gap-6 pb-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Users</h1>
          <p className="text-default-500 mt-1">Manage and monitor all platform users</p>
        </div>
        <Button 
          color="danger"
          startContent={<Plus size={18} />}
          onPress={() => addToast({ title: 'Add User action is not connected yet.' })}
          className="font-bold shadow-lg shadow-danger-500/30"
        >
          Add User
        </Button>
      </header>

      <div className="flex flex-wrap items-center gap-4">
        <Input
          className="w-full sm:max-w-[400px]"
          placeholder="Search by email or name..."
          startContent={<Search size={18} className="text-default-400" />}
          value={searchQuery}
          onValueChange={setSearchQuery}
          variant="faded"
        />
        <Select 
          className="w-full sm:max-w-[200px]"
          selectedKeys={[statusFilter]}
          onChange={(e) => setStatusFilter((e.target.value as StatusFilter) || 'all')}
          variant="faded"
          aria-label="Filter by Status"
        >
          <SelectItem key="all">All Status</SelectItem>
          <SelectItem key="active">Active</SelectItem>
          <SelectItem key="suspended">Suspended</SelectItem>
          <SelectItem key="banned">Banned</SelectItem>
        </Select>
      </div>

      <Table 
        aria-label="Users table"
        classNames={{
          wrapper: "bg-background/60 dark:bg-default-100/50 shadow-sm border-none p-0",
          th: "bg-transparent text-default-500",
          td: "py-3 border-b border-divider/50",
        }}
        bottomContent={
          pages > 1 ? (
            <div className="flex w-full justify-center p-4 border-t border-divider/50">
              <Pagination
                isCompact
                showControls
                showShadow
                color="danger"
                page={currentPage}
                total={pages}
                onChange={(page) => setCurrentPage(page)}
              />
            </div>
          ) : null
        }
      >
        <TableHeader>
          <TableColumn>USER</TableColumn>
          <TableColumn>SUBSCRIPTION</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>JOINED</TableColumn>
          <TableColumn align="end">ACTIONS</TableColumn>
        </TableHeader>
        <TableBody 
          isLoading={loading}
          loadingContent={<Spinner color="danger" label="Loading users..." />}
          emptyContent={loading ? " " : "No users found"}
        >
          {paginatedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <HeroUser
                  avatarProps={{ radius: "md", src: user.avatar_url || `https://api.dicebear.com/9.x/notionists/svg?seed=${user.email}` }}
                  description={user.email}
                  name={user.display_name?.trim() || 'Unnamed user'}
                  classNames={{ name: "font-semibold text-sm", description: "text-xs" }}
                />
              </TableCell>
              <TableCell>
                <Chip size="sm" variant="flat" color={getSubscriptionColor(user.subscription_tier)} className="capitalize font-medium">
                  {user.subscription_tier}
                </Chip>
              </TableCell>
              <TableCell>
                <Chip size="sm" variant="dot" color={getStatusColor(user.status)} className="capitalize border-none">
                  {user.status}
                </Chip>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium text-default-500">{formatDate(user.created_at)}</span>
              </TableCell>
              <TableCell>
                <Dropdown placement="bottom-end" isDisabled={actionLoading}>
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light" className="text-default-500 hover:text-foreground">
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="User actions">
                    <DropdownItem key="active" onPress={() => updateUserStatus(user.id, 'active')} startContent={<CheckCircle size={16} />}>
                      Mark Active
                    </DropdownItem>
                    <DropdownItem key="suspended" onPress={() => updateUserStatus(user.id, 'suspended')} startContent={<AlertCircle size={16} />}>
                      Suspend User
                    </DropdownItem>
                    <DropdownItem key="banned" onPress={() => updateUserStatus(user.id, 'banned')} startContent={<Ban size={16} />} color="danger">
                      Ban User
                    </DropdownItem>
                    <DropdownItem key="delete" onPress={() => deleteUser(user.id)} startContent={<Trash2 size={16} />} color="danger" className="text-danger border-t border-divider mt-2 pt-2">
                      Delete User
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}