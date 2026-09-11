'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Search, Bell, LogOut, Settings as SettingsIcon } from 'lucide-react';
import FullscreenToggleButton from '@/components/ui/button/FullscreenToggleButton';
import ThemeSwitchDropdown from '@/components/ui/input/ThemeSwitchDropdown';
import BrandLogo from '@/components/ui/other/BrandLogo';
import { Input, Badge, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, Button } from "@heroui/react";

interface TopBarProps {
  onMenuClick: () => void;
  notifications?: {id: string, message: string, time: string}[];
}

export function TopBar({ onMenuClick, notifications = [] }: TopBarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="sticky top-0 z-20 flex items-center justify-between border-b border-divider bg-background/80 px-4 md:px-8 py-3 shadow-sm backdrop-blur-md">
      {/* Left Side - Menu Button & Brand */}
      <div className="flex items-center gap-3 md:gap-6">
        <Button
          isIconOnly
          variant="light"
          onClick={onMenuClick}
          className="text-default-500 hover:text-foreground"
        >
          <Menu size={20} />
        </Button>
        <div className="flex items-center gap-3">
          <BrandLogo className="max-h-8 md:max-h-10" />
          <span className="hidden sm:inline whitespace-nowrap text-xs font-bold uppercase tracking-wide text-danger">
            Admin
          </span>
        </div>
      </div>

      {/* Right Side - Search, Display Controls, Notifications, Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Search Box */}
        <div className="hidden sm:block">
          <Input
            classNames={{
              base: "max-w-full sm:max-w-[12rem] md:max-w-[16rem] h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Search..."
            size="sm"
            startContent={<Search size={16} />}
            type="search"
          />
        </div>

        <div className="flex items-center gap-1">
          <ThemeSwitchDropdown />
          <FullscreenToggleButton />
        </div>

        {/* Notifications */}
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button
              isIconOnly
              variant="light"
              className="text-default-500 hover:text-foreground"
            >
              <Badge color="danger" content={notifications.length} isInvisible={notifications.length === 0} shape="circle">
                <Bell size={18} />
              </Badge>
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Notifications" className="w-[300px]" disabledKeys={notifications.length === 0 ? ["empty"] : []}>
            <DropdownItem key="header" className="h-10 gap-2 font-bold cursor-default" isReadOnly>
              Notifications
            </DropdownItem>
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <DropdownItem key={notif.id} description={notif.time} className="py-2">
                  {notif.message}
                </DropdownItem>
              ))
            ) : (
              <DropdownItem key="empty" className="py-6 text-center text-default-400">
                No new notifications
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>

        {/* Profile Menu */}
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform ml-2"
              color="danger"
              name="Admin"
              size="sm"
              src="https://api.dicebear.com/9.x/notionists/svg?seed=Admin"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2" isReadOnly>
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold text-danger">admin@movirax.com</p>
            </DropdownItem>
            <DropdownItem 
              key="settings" 
              startContent={<SettingsIcon size={16} />}
              onPress={() => router.push('/admin/settings')}
            >
              Settings
            </DropdownItem>
            <DropdownItem 
              key="logout" 
              color="danger" 
              startContent={<LogOut size={16} />}
              onPress={handleLogout}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}