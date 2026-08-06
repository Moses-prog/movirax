'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  DollarSign,
  Zap,
  Ticket,
  BarChart3,
  Tag,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { cn } from '@/utils/cn'; // Assuming you have a cn utility, if not I will just use template literals

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  unreadSupportCount?: number;
}

export function Sidebar({ isOpen, onToggle, unreadSupportCount = 0 }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard', href: '/admin', Icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', Icon: Users },
    { label: 'Subscriptions', href: '/admin/subscriptions', Icon: CreditCard },
    { label: 'Pricing', href: '/admin/pricing', Icon: DollarSign },
    { label: 'Features', href: '/admin/features', Icon: Zap },
    { label: 'Support Tickets', href: '/admin/tickets', Icon: Ticket },
    { label: 'Analytics', href: '/admin/analytics', Icon: BarChart3 },
    { label: 'Promotions', href: '/admin/promotions', Icon: Tag },
    { label: 'Settings', href: '/admin/settings', Icon: Settings },
  ];

  return (
    <nav
      className={`sticky top-0 z-30 flex h-[100dvh] flex-none flex-col overflow-hidden bg-background/80 py-6 shadow-sm backdrop-blur-xl transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'w-[260px]' : 'w-[112px]'}`}
    >
      {/* Background ambient red glow at the top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-red-500/5 to-transparent" />

      {/* Logo / Brand */}
      <div
        className={`mb-5 flex items-center px-5 pb-5 relative z-10 ${isOpen ? 'justify-between' : 'justify-center'} gap-3`}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className={`flex shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/5 text-muted-foreground transition-all duration-200 hover:border-white/10 hover:bg-white/10 hover:text-red-500 ${isOpen ? 'order-2 size-9' : 'order-1 size-11'}`}
        >
          {isOpen ? <ChevronsLeft size={18} /> : <ChevronsRight size={18} />}
        </button>

        {isOpen && (
          <div className="order-1 flex min-w-0 items-center gap-2.5">
            <div className="h-8 w-1 shrink-0 rounded-full bg-gradient-to-br from-red-600 to-orange-500" />
            <div className="min-w-0">
              <h1 className="m-0 text-base font-extrabold tracking-tight text-foreground">
                MOVIRA X
              </h1>
              <p className="m-0 mt-0.5 text-[11px] font-bold tracking-widest text-red-500 uppercase">
                ADMIN
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <div className={`flex-1 overflow-y-auto relative z-10 ${isOpen ? 'px-3' : 'px-7'}`}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = item.Icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`group my-1 flex items-center rounded-xl transition-all duration-200 cursor-pointer ${
                isOpen ? 'justify-start gap-2.5 px-3 py-2.5 whitespace-nowrap' : 'justify-center py-2.5 whitespace-normal'
              } ${
                isActive
                  ? 'bg-gradient-to-r from-red-500/10 to-transparent text-foreground font-bold'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground font-medium'
              }`}
            >
              <span
                className={`flex shrink-0 relative items-center justify-center rounded-lg border transition-all duration-200 ${
                  isOpen ? 'size-8' : 'size-10'
                } ${
                  isActive
                    ? 'border-red-500/20 bg-red-500/10 text-red-500'
                    : 'border-white/5 bg-white/5 text-inherit group-hover:border-white/10 group-hover:bg-white/10'
                }`}
              >
                <IconComponent size={17} />
                {!isOpen && item.label === 'Support Tickets' && unreadSupportCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm">
                    {unreadSupportCount}
                  </span>
                )}
              </span>
              {isOpen && (
                <div className="flex flex-1 items-center justify-between overflow-hidden">
                  <span className="overflow-hidden text-ellipsis">{item.label}</span>
                  {item.label === 'Support Tickets' && unreadSupportCount > 0 && (
                    <span className="flex h-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white shadow-sm">
                      {unreadSupportCount}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div
        className={`flex items-center bg-gradient-to-r from-red-500/5 to-transparent p-4 relative z-10 gap-3 ${
          isOpen ? 'justify-start' : 'justify-center'
        }`}
      >
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-orange-500 text-sm font-bold text-white shadow-sm"
          aria-hidden="true"
        >
          A
        </div>
        {isOpen && (
          <div className="min-w-0 text-xs">
            <p className="m-0 font-semibold text-foreground">Admin User</p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <p className="m-0 text-[11px] font-medium text-muted-foreground">Online</p>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
