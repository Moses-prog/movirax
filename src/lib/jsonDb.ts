import fs from 'fs';
import path from 'path';

// Define the schema for our local JSON database
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

export interface LocalDatabase {
  features: FeatureFlag[];
  profiles: Record<string, SubProfile[]>; // key is auth.users.id
}

const dbPath = path.join(process.cwd(), '.data.json');

const defaultDb: LocalDatabase = {
  features: [
    { id: 'f1', name: '4K Ultra HD Streaming', description: 'Stream movies and TV shows in maximum 4K resolution.', enabled: true, free_tier: false, pro_tier: true },
    { id: 'f2', name: 'Ad-Free Experience', description: 'Remove all advertisements before and during playback.', enabled: true, free_tier: false, pro_tier: true },
    { id: 'f3', name: 'Offline Downloads', description: 'Allow users to download content for offline viewing.', enabled: false, free_tier: false, pro_tier: true },
    { id: 'f4', name: 'Multiple Profiles', description: 'Create up to 5 profiles per account.', enabled: true, free_tier: false, pro_tier: true },
    { id: 'f5', name: 'Early Access Content', description: 'Get access to new releases 1 week early.', enabled: false, free_tier: false, pro_tier: true },
    { id: 'f6', name: 'Watchlist & History', description: 'Save items to watchlist and track watch history.', enabled: true, free_tier: true, pro_tier: true },
  ],
  profiles: {}
};

function ensureDbExists() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2), 'utf-8');
  }
}

export function readDb(): LocalDatabase {
  try {
    ensureDbExists();
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data) as LocalDatabase;
  } catch (error) {
    console.error('Error reading JSON DB:', error);
    return defaultDb;
  }
}

export function writeDb(data: LocalDatabase): boolean {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing JSON DB:', error);
    return false;
  }
}

// Helper functions for features
export function getFeatures(): FeatureFlag[] {
  return readDb().features;
}

export function updateFeature(id: string, updates: Partial<FeatureFlag>): boolean {
  const db = readDb();
  const index = db.features.findIndex(f => f.id === id);
  if (index !== -1) {
    db.features[index] = { ...db.features[index], ...updates };
    return writeDb(db);
  }
  return false;
}

export function addFeature(feature: FeatureFlag): boolean {
  const db = readDb();
  db.features.push(feature);
  return writeDb(db);
}

// Helper functions for profiles
export function getUserProfiles(userId: string): SubProfile[] {
  const db = readDb();
  return db.profiles[userId] || [];
}

export function addUserProfile(userId: string, profile: SubProfile): boolean {
  const db = readDb();
  if (!db.profiles[userId]) {
    db.profiles[userId] = [];
  }
  // Max 5 profiles
  if (db.profiles[userId].length >= 5) {
    return false;
  }
  db.profiles[userId].push(profile);
  return writeDb(db);
}

export function updateUserProfile(userId: string, profileId: string, updates: Partial<SubProfile>): boolean {
  const db = readDb();
  if (!db.profiles[userId]) return false;
  
  const index = db.profiles[userId].findIndex(p => p.id === profileId);
  if (index !== -1) {
    db.profiles[userId][index] = { ...db.profiles[userId][index], ...updates };
    return writeDb(db);
  }
  return false;
}

export function deleteUserProfile(userId: string, profileId: string): boolean {
  const db = readDb();
  if (!db.profiles[userId]) return false;
  
  db.profiles[userId] = db.profiles[userId].filter(p => p.id !== profileId);
  return writeDb(db);
}
