"use server";

import { getServerSettings, updateServerSettings, ServerSettings } from '@/lib/settings';

export async function fetchServerSettings(): Promise<ServerSettings> {
  return await getServerSettings();
}

export async function saveServerSettings(movie: number, tv: number): Promise<boolean> {
  // In a real production app, verify the caller is an admin here!
  return await updateServerSettings(movie, tv);
}