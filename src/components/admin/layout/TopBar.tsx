'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Search, Bell, LogOut, Settings as SettingsIcon, ChevronDown } from 'lucide-react';
import FullscreenToggleButton from '@/components/ui/button/FullscreenToggleButton';
import ThemeSwitchDropdown from '@/components/ui/input/ThemeSwitchDropdown';
import BrandLogo from '@/components/ui/other/BrandLogo';

interface TopBarProps {
  onMenuClick: () => void;
  notifications?: {id: string, message: string, time: string}[];
}

export function TopBar({ onMenuClick, notifications = [] }: TopBarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin-login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-background/80 px-4 md:px-8 py-4 shadow-sm backdrop-blur-xl">
      {/* Left Side - Menu Button & Brand */}
      <div className="flex items-center gap-3 md:gap-6">
        <button
          onClick={onMenuClick}
          className="flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-all duration-200 hover:bg-white/5 hover:text-foreground"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-3">
          <BrandLogo className="max-h-8 md:max-h-10" />
          <span className="hidden sm:inline whitespace-nowrap text-xs font-bold uppercase tracking-wide text-red-500">
            Admin
          </span>
        </div>
      </div>

      {/* Right Side - Search, Display Controls, Notifications, Profile */}
      <div className="flex items-center gap-2 md:gap-6">
        {/* Search Box */}
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2 transition-all duration-200 hover:border-white/10 hover:bg-white/10 focus-within:border-red-500/50 focus-within:bg-background focus-within:ring-2 focus-within:ring-red-500/20">
          <Search size={16} className="shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-20 md:w-32 lg:w-40 bg-transparent text-[13px] font-medium text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-0.5 md:gap-1">
          <ThemeSwitchDropdown />
          <FullscreenToggleButton />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-all duration-200 hover:bg-white/5 hover:text-red-500"
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-[0_0_0_2px_hsl(var(--background))]">
                {notifications.length}
              </span>
            )}
          </button>
          
          {showNotifMenu && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[300px] overflow-hidden rounded-2xl border border-white/5 bg-background/90 shadow-2xl backdrop-blur-2xl">
              <div className="border-b border-white/5 px-4 py-3">
                <h3 className="text-sm font-bold">Notifications</h3>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div key={notif.id} className="border-b border-white/5 px-4 py-3 hover:bg-white/5 transition-colors">
                      <p className="text-[13px] font-medium">{notif.message}</p>
                      <span className="text-[11px] text-muted-foreground">{notif.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-[13px] text-muted-foreground">
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/5 p-1.5 pr-2.5 text-muted-foreground transition-all duration-200 hover:border-white/10 hover:bg-white/10"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-orange-500 text-xs font-bold text-white shadow-sm">
              A
            </div>
            <ChevronDown size={16} className="text-muted-foreground" />
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[200px] overflow-hidden rounded-2xl border border-white/5 bg-background/90 shadow-2xl backdrop-blur-2xl">
              {/* Settings */}
              <button
                onClick={() => {
                  router.push('/admin/settings');
                  setShowProfileMenu(false);
                }}
                className="flex w-full items-center gap-2.5 border-b border-white/5 px-4 py-3 text-[13px] font-medium text-foreground transition-all duration-200 hover:bg-white/5 hover:text-red-500"
              >
                <SettingsIcon size={16} />
                Settings
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-4 py-3 text-[13px] font-medium text-red-500 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
