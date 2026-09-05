import { createClient } from '@/utils/supabase/server';

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  free_tier: boolean;
  pro_tier: boolean;
}

export interface SubProfile {
  id: string;
  name: string;
  avatar: string;
  isKids?: boolean;
}

// Helper functions for features
export async function getFeatures(): Promise<FeatureFlag[]> {
  const supabase = await createClient();
  const { data } = await supabase.from('app_features').select('*').order('id');
  return data || [];
}

export async function updateFeature(id: string, updates: Partial<FeatureFlag>): Promise<boolean> {
  const supabase = await createClient(true);
  const { error } = await supabase.from('app_features').update(updates).eq('id', id);
  return !error;
}

export async function addFeature(feature: FeatureFlag): Promise<boolean> {
  const supabase = await createClient(true);
  const { error } = await supabase.from('app_features').insert(feature);
  return !error;
}

// Helper functions for profiles
export async function getUserProfiles(userId: string): Promise<SubProfile[]> {
  const supabase = await createClient();
  const { data } = await supabase.from('user_profiles').select('*').eq('user_id', userId).order('created_at');
  if (!data) return [];
  return data.map(p => ({
    id: p.id,
    name: p.name,
    avatar: p.avatar,
    isKids: p.is_kids
  }));
}

export async function addUserProfile(userId: string, profile: SubProfile): Promise<boolean> {
  const supabase = await createClient();
  // Check count
  const { count } = await supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('user_id', userId);
  if (count && count >= 5) return false;

  const { error } = await supabase.from('user_profiles').insert({
    id: profile.id,
    user_id: userId,
    name: profile.name,
    avatar: profile.avatar,
    is_kids: profile.isKids || false
  });
  return !error;
}

export async function updateUserProfile(userId: string, profileId: string, updates: Partial<SubProfile>): Promise<boolean> {
  const supabase = await createClient();
  const dbUpdates: any = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar;
  if (updates.isKids !== undefined) dbUpdates.is_kids = updates.isKids;

  const { error } = await supabase.from('user_profiles').update(dbUpdates).eq('user_id', userId).eq('id', profileId);
  return !error;
}

export async function deleteUserProfile(userId: string, profileId: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from('user_profiles').delete().eq('user_id', userId).eq('id', profileId);
  return !error;
}
