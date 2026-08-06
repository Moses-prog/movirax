'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Ban,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

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

function getInitial(user: User) {
  return (user.display_name || user.email || 'U').trim().charAt(0).toUpperCase();
}

function getDisplayName(user: User) {
  return user.display_name?.trim() || 'Unnamed user';
}

function getSubscriptionBadgeClasses(tier: SubscriptionTier): string {
  const map: Record<SubscriptionTier, string> = {
    free: 'bg-white/5 text-muted-foreground border-white/5',
    premium: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    enterprise: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
  return map[tier];
}

function getStatusBadge(status: UserStatus) {
  const map: Record<UserStatus, { label: string; Icon: LucideIcon; classes: string }> = {
    active: {
      label: 'Active',
      Icon: CheckCircle,
      classes: 'bg-green-500/10 text-green-500 border-green-500/20',
    },
    suspended: {
      label: 'Suspended',
      Icon: AlertCircle,
      classes: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    },
    banned: {
      label: 'Banned',
      Icon: Ban,
      classes: 'bg-red-500/10 text-red-500 border-red-500/20',
    },
  };
  return map[status];
}

function TableSkeleton({ showText }: { showText: boolean }) {
  return (
    <div>
      {showText && (
        <p className="mb-4 text-center text-[13px] font-semibold text-muted-foreground">
          Loading users...
        </p>
      )}
      {Array.from({ length: 7 }).map((_, index) => (
        <div
          key={index}
          className={`grid min-w-[920px] grid-cols-[2fr_1.5fr_1.2fr_1fr_0.8fr] items-center gap-4 p-5 ${
            index < 6 ? 'border-b border-white/5' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="size-10 shrink-0 animate-pulse rounded-full bg-white/5" />
            <div className="flex-1">
              <div className="mb-2 h-3.5 w-[150px] animate-pulse rounded-md bg-white/5" />
              <div className="h-3 w-[220px] animate-pulse rounded-md bg-white/5" />
            </div>
          </div>
          {['w-[110px]', 'w-[124px]', 'w-[100px]', 'w-[36px] ml-auto'].map((width, i) => (
            <div key={i} className={`h-7 animate-pulse rounded-md bg-white/5 ${width}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [slowLoading, setSlowLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setSlowLoading(true), 900);

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
        window.clearTimeout(timer);
        setSlowLoading(false);
        setLoading(false);
      }
    };

    fetchUsers();

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    const nextUsers = users.filter((user) => {
      const matchesSearch =
        !query ||
        user.email.toLowerCase().includes(query) ||
        (user.display_name || '').toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    setFilteredUsers(nextUsers);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, users]);

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
  const visibleStart = filteredUsers.length === 0 ? 0 : startIndex + 1;
  const visibleEnd = Math.min(endIndex, filteredUsers.length);

  const pageNumbers = useMemo(() => {
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
    if (pages.length <= 5) return pages;

    const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    return Array.from({ length: 5 }, (_, index) => start + index);
  }, [currentPage, totalPages]);

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
    } catch (error) {
      console.error(`Failed to update user status to ${status}:`, error);
    } finally {
      setShowDropdown(null);
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
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setShowDropdown(null);
      setActionLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="m-0 mb-1 text-3xl font-extrabold tracking-tight text-foreground">Users</h1>
          <p className="m-0 text-sm font-medium text-muted-foreground">
            Manage and monitor all platform users
          </p>
        </div>

        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-4 text-[13px] font-bold text-white shadow-[0_14px_30px_rgba(225,29,72,0.18)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_14px_30px_rgba(225,29,72,0.3)] active:scale-[0.98]"
          onClick={() => console.info('Add User action is not connected yet.')}
        >
          <Plus size={17} />
          Add User
        </button>
      </header>

      {/* Search and filters */}
      <section className="mb-5 flex flex-wrap items-center gap-4">
        <label className="relative flex-1 basis-[320px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none size-4" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by email or name..."
            className="w-full rounded-xl border border-white/5 bg-white/5 py-2.5 pl-10 pr-4 text-[14px] font-medium text-foreground outline-none transition-all duration-200 hover:border-white/10 hover:bg-white/10 focus:border-red-500/50 focus:bg-background focus:ring-2 focus:ring-red-500/20"
          />
        </label>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          className="h-[44px] w-[180px] cursor-pointer appearance-none rounded-xl border border-white/5 bg-white/5 px-4 text-[14px] font-bold text-foreground outline-none transition-all duration-200 hover:border-white/10 hover:bg-white/10 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 1rem center',
          }}
        >
          <option value="all" className="bg-background">All Status</option>
          <option value="active" className="bg-background">Active</option>
          <option value="suspended" className="bg-background">Suspended</option>
          <option value="banned" className="bg-background">Banned</option>
        </select>
      </section>

      {/* Users table */}
      <section className="overflow-hidden rounded-2xl border border-white/5 bg-background/50 shadow-sm backdrop-blur-xl">
        <div className="overflow-x-auto">
          {/* Table Header */}
          <div className="grid min-w-[920px] grid-cols-[2fr_1.5fr_1.2fr_1fr_0.8fr] items-center gap-4 border-b border-white/5 bg-white/5 px-5 py-3.5 text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
            <span>User</span>
            <span>Subscription</span>
            <span>Status</span>
            <span>Joined</span>
            <span className="text-right">Actions</span>
          </div>

          {loading ? (
            <TableSkeleton showText={slowLoading} />
          ) : paginatedUsers.length === 0 ? (
            <div className="min-w-[920px] py-12 text-center text-[14px] font-bold text-muted-foreground">
              No users found
            </div>
          ) : (
            paginatedUsers.map((user, index) => {
              const statusBadge = getStatusBadge(user.status);
              const StatusIcon = statusBadge.Icon;

              return (
                <div
                  key={user.id}
                  className={`grid min-w-[920px] grid-cols-[2fr_1.5fr_1.2fr_1fr_0.8fr] items-center gap-4 px-5 py-4 transition-colors duration-200 hover:bg-white/5 ${
                    index < paginatedUsers.length - 1 ? 'border-b border-white/5' : ''
                  }`}
                >
                  {/* User Profile */}
                  <div className="flex min-w-0 items-center gap-3">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt=""
                        className="size-10 shrink-0 rounded-full border border-white/5 object-cover"
                      />
                    ) : (
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/5 bg-white/5 text-[14px] font-black text-foreground">
                        {getInitial(user)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="m-0 truncate text-[14px] font-bold text-foreground">
                        {getDisplayName(user)}
                      </p>
                      <p className="m-0 mt-1 truncate text-[12px] font-medium text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Subscription Tier */}
                  <div>
                    <span
                      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[12px] font-bold capitalize ${getSubscriptionBadgeClasses(
                        user.subscription_tier
                      )}`}
                    >
                      {user.subscription_tier}
                    </span>
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[12px] font-bold ${statusBadge.classes}`}
                    >
                      <StatusIcon size={14} />
                      {statusBadge.label}
                    </span>
                  </div>

                  {/* Date Joined */}
                  <span className="text-[13px] font-bold text-muted-foreground">
                    {formatDate(user.created_at)}
                  </span>

                  {/* Actions */}
                  <div className="relative flex justify-end">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => setShowDropdown((current) => (current === user.id ? null : user.id))}
                      className="flex size-9 items-center justify-center rounded-xl border border-white/5 bg-white/5 text-muted-foreground transition-all duration-200 hover:border-white/10 hover:bg-white/10 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <MoreVertical size={17} />
                    </button>

                    {showDropdown === user.id && (
                      <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[190px] overflow-hidden rounded-xl border border-white/5 bg-background/95 shadow-2xl backdrop-blur-xl">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="flex w-full items-center gap-2.5 px-3.5 py-3 text-[13px] font-bold text-foreground transition-colors hover:bg-white/5"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-circle">
                            <circle cx="12" cy="12" r="10"/>
                            <circle cx="12" cy="10" r="3"/>
                            <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/>
                          </svg>
                          View Profile
                        </Link>
                        {user.status === 'banned' ? (
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => updateUserStatus(user.id, 'active')}
                            className="flex w-full items-center gap-2.5 px-3.5 py-3 text-[13px] font-bold text-green-500 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <CheckCircle size={15} />
                            Unban User
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => updateUserStatus(user.id, 'banned')}
                            className="flex w-full items-center gap-2.5 px-3.5 py-3 text-[13px] font-bold text-red-500 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Ban size={15} />
                            Ban User
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => deleteUser(user.id)}
                          className="flex w-full items-center gap-2.5 border-t border-white/5 px-3.5 py-3 text-[13px] font-bold text-red-500 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                          Delete User
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Pagination */}
      <footer className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <p className="m-0 text-[13px] font-bold text-muted-foreground">
          Showing {visibleStart}-{visibleEnd} of {filteredUsers.length}
        </p>

        <div className="flex items-center gap-1.5">
          <PaginationButton
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          >
            <ChevronLeft size={16} />
          </PaginationButton>
          {pageNumbers.map((page) => (
            <PaginationButton
              key={page}
              active={page === currentPage}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </PaginationButton>
          ))}
          <PaginationButton
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          >
            <ChevronRight size={16} />
          </PaginationButton>
        </div>
      </footer>
    </div>
  );
}

function PaginationButton({
  active,
  disabled,
  children,
  onClick,
}: {
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex size-9 min-w-[36px] items-center justify-center rounded-xl text-[13px] font-black transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
        active
          ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-sm'
          : 'border border-white/5 bg-white/5 text-muted-foreground hover:border-white/10 hover:bg-white/10 hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}
