'use client';

import { useState, useEffect } from 'react';
import useSupabaseUser from './useSupabaseUser';
import { useDisclosure } from '@heroui/react';

interface Feature {
  id: string;
  name: string;
  enabled: boolean;
  free_tier: boolean;
  pro_tier: boolean;
}

export function useFeatureAccess(featureId: string) {
  const { data: user, isLoading: userLoading } = useSupabaseUser();
  const [hasAccess, setHasAccess] = useState<boolean>(true);
  const [feature, setFeature] = useState<Feature | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Expose a modal state for the "Upgrade" dialog
  const { isOpen: showUpgradeModal, onOpen: triggerUpgradeModal, onOpenChange: onUpgradeModalChange } = useDisclosure();

  useEffect(() => {
    if (userLoading) return;

    const checkAccess = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/admin/features');
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            const targetFeature = json.data.find((f: Feature) => f.id === featureId);
            setFeature(targetFeature || null);
            
            if (!targetFeature) {
              setHasAccess(false); // Unknown feature
              return;
            }

            if (!targetFeature.enabled) {
              setHasAccess(false); // Globally disabled
              return;
            }

            // Check tier access
            const tier = user?.subscription_tier || 'free';
            if (tier === 'free' && !targetFeature.free_tier) {
              setHasAccess(false);
              return;
            }
            if (tier === 'pro' && !targetFeature.pro_tier) {
              setHasAccess(false);
              return;
            }

            setHasAccess(true);
          }
        }
      } catch (error) {
        console.error('Failed to check feature access', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [userLoading, user, featureId]);

  return {
    hasAccess,
    feature,
    isLoading: isLoading || userLoading,
    showUpgradeModal,
    triggerUpgradeModal,
    onUpgradeModalChange
  };
}
