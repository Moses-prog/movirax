'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SubProfile } from '@/lib/jsonDb';
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';

interface ProfileContextType {
  activeProfile: SubProfile | null;
  setActiveProfile: (profile: SubProfile | null) => void;
  profiles: SubProfile[];
  refreshProfiles: () => Promise<void>;
  isLoading: boolean;
  multipleProfilesEnabled: boolean;
  watchHistoryEnabled: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [activeProfile, setActiveProfileState] = useState<SubProfile | null>(null);
  const [profiles, setProfiles] = useState<SubProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [multipleProfilesEnabled, setMultipleProfilesEnabled] = useState(true);
  const [watchHistoryEnabled, setWatchHistoryEnabled] = useState(true);
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    initContext();
  }, []);

  const initContext = async () => {
    setIsLoading(true);
    try {
      // Fetch feature flags first
      const featuresRes = await fetch('/api/admin/features');
      if (featuresRes.ok) {
        const featuresJson = await featuresRes.json();
        if (featuresJson.success) {
          const multi = featuresJson.data.find((f: any) => f.id === 'f4');
          const history = featuresJson.data.find((f: any) => f.id === 'f6');
          
          if (multi) setMultipleProfilesEnabled(multi.enabled);
          if (history) setWatchHistoryEnabled(history.enabled);
        }
      }

      // Fetch profiles
      const profilesRes = await fetch('/api/profiles');
      if (profilesRes.ok) {
        const profilesJson = await profilesRes.json();
        if (profilesJson.success) {
          setProfiles(profilesJson.data);
          
          // Check cookie for active profile
          const savedProfileId = Cookies.get('movira_active_profile');
          if (savedProfileId) {
            const found = profilesJson.data.find((p: SubProfile) => p.id === savedProfileId);
            if (found) {
              setActiveProfileState(found);
            }
          } else if (profilesJson.data.length === 1) {
            // Auto select if only 1
            setActiveProfileState(profilesJson.data[0]);
            Cookies.set('movira_active_profile', profilesJson.data[0].id, { expires: 365 });
          }
        }
      }
    } catch (e) {
      console.error("Failed to init profile context", e);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfiles = async () => {
    try {
      const profilesRes = await fetch('/api/profiles');
      if (profilesRes.ok) {
        const profilesJson = await profilesRes.json();
        if (profilesJson.success) {
          setProfiles(profilesJson.data);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const setActiveProfile = (profile: SubProfile | null) => {
    setActiveProfileState(profile);
    if (profile) {
      Cookies.set('movira_active_profile', profile.id, { expires: 365 });
    } else {
      Cookies.remove('movira_active_profile');
    }
  };

  // Enforce Navigation Guard
  useEffect(() => {
    if (isLoading) return;
    
    const isPublicRoute = pathname.startsWith('/auth') || pathname.startsWith('/admin') || pathname === '/';
    
    // If multiple profiles is enabled, and we are not on the profiles selection screen, and no profile is active, redirect to /profiles
    if (
      multipleProfilesEnabled && 
      !activeProfile && 
      !isPublicRoute && 
      pathname !== '/profiles'
    ) {
      router.push('/profiles');
    }
  }, [isLoading, activeProfile, multipleProfilesEnabled, pathname, router]);

  return (
    <ProfileContext.Provider value={{ 
      activeProfile, 
      setActiveProfile, 
      profiles, 
      refreshProfiles, 
      isLoading,
      multipleProfilesEnabled,
      watchHistoryEnabled
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
