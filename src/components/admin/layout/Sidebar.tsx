'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Server,
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
import { Button, Tooltip, Avatar } from "@heroui/react";

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
    { label: 'Servers', href: '/admin/servers', Icon: Server },
    { label: 'Features', href: '/admin/features', Icon: Zap },
    { label: 'Support Tickets', href: '/admin/tickets', Icon: Ticket },
    { label: 'Analytics', href: '/admin/analytics', Icon: BarChart3 },
    { label: 'Promotions', href: '/admin/promotions', Icon: Tag },
    { label: 'Settings', href: '/admin/settings', Icon: Settings },
  ];

  return (
    <nav
      className={`sticky top-0 z-30 flex h-[100dvh] flex-none flex-col overflow-hidden bg-content1/80 py-6 shadow-sm backdrop-blur-xl border-r border-divider transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'w-[260px]' : 'w-[88px]'}`}
    >
      {/* Background ambient red glow at the top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-danger-500/5 to-transparent" />

      {/* Logo / Brand */}
      <div
        className={`mb-5 flex items-center px-4 pb-5 relative z-10 ${isOpen ? 'justify-between' : 'justify-center'} gap-3`}
      >
        {isOpen && (
          <div className="order-1 flex min-w-0 items-center gap-2.5 pl-2">
            <div className="h-8 w-1 shrink-0 rounded-full bg-gradient-to-br from-danger-600 to-danger-400" />
            <div className="min-w-0">
              <h1 className="m-0 text-base font-extrabold tracking-tight text-foreground">
                MOVIRA X
              </h1>
              <p className="m-0 mt-0.5 text-[11px] font-bold tracking-widest text-danger uppercase">
                ADMIN
              </p>
            </div>
          </div>
        )}

        <Button
          isIconOnly
          variant="light"
          onClick={onToggle}
          className={`text-default-500 hover:text-danger ${isOpen ? 'order-2' : 'order-1'}`}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
        </Button>
      </div>

      {/* Menu Items */}
      <div className={`flex-1 overflow-y-auto overflow-x-hidden relative z-10 px-3`}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = item.Icon;
          
          const LinkContent = (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`group my-1 flex items-center rounded-xl transition-all duration-200 cursor-pointer ${
                isOpen ? 'justify-start gap-3 px-3 py-2.5' : 'justify-center p-2.5'
              } ${
                isActive
                  ? 'bg-danger/10 text-danger font-bold'
                  : 'text-default-500 hover:bg-default-100 hover:text-foreground font-medium'
              }`}
            >
              <div className="relative flex shrink-0 items-center justify-center">
                <IconComponent size={20} />
                {!isOpen && item.label === 'Support Tickets' && unreadSupportCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white shadow-sm ring-2 ring-content1">
                    {unreadSupportCount}
                  </span>
                )}
              </div>
              
              {isOpen && (
                <div className="flex flex-1 items-center justify-between overflow-hidden">
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">{item.label}</span>
                  {item.label === 'Support Tickets' && unreadSupportCount > 0 && (
                    <span className="flex h-5 items-center justify-center rounded-full bg-danger px-1.5 text-[10px] font-bold text-white shadow-sm">
                      {unreadSupportCount}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );

          if (!isOpen) {
            return (
              <Tooltip key={item.href} content={item.label} placement="right" color="foreground">
                <div>{LinkContent}</div>
              </Tooltip>
            );
          }

          return LinkContent;
        })}
      </div>

      {/* Bottom Section */}
      <div
        className={`flex items-center p-4 relative z-10 gap-3 border-t border-divider mt-auto ${
          isOpen ? 'justify-start mx-3' : 'justify-center mx-2'
        }`}
      >
        <Avatar
          color="danger"
          name="Admin"
          size="sm"
          src="https://api.dicebear.com/9.x/notionists/svg?seed=Admin"
          className="shrink-0"
        />
        {isOpen && (
          <div className="min-w-0 flex-1">
            <p className="m-0 text-sm font-semibold text-foreground truncate">System Admin</p>
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(23,201,100,0.6)]" />
              <p className="m-0 text-xs font-medium text-default-500">Online</p>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}