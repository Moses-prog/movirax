import { NextRequest, NextResponse } from 'next/server';
import { getUserProfiles, addUserProfile, updateUserProfile, deleteUserProfile, SubProfile } from '@/lib/jsonDb';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let profiles = await getUserProfiles(user.id);
    
    // If no profiles exist for this user, automatically create a default one
    if (profiles.length === 0) {
      const defaultProfile: SubProfile = {
        id: `p_${Date.now()}`,
        name: user.user_metadata?.full_name || 'My Profile',
        avatar: '/avatars/1.png'
      };
      await addUserProfile(user.id, defaultProfile);
      profiles = [defaultProfile];
    }

    return NextResponse.json({ success: true, data: profiles });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, profileId, updates, newProfile } = body;

    if (action === 'add' && newProfile) {
      const profile: SubProfile = {
        id: `p_${Date.now()}`,
        name: newProfile.name,
        avatar: newProfile.avatar || '/avatars/1.png',
        isKids: newProfile.isKids || false
      };
      const success = await addUserProfile(user.id, profile);
      if (success) {
        return NextResponse.json({ success: true, data: await getUserProfiles(user.id) });
      }
      return NextResponse.json({ success: false, error: 'Max profiles reached or error' }, { status: 400 });
    }

    if (action === 'update' && profileId && updates) {
      const success = await updateUserProfile(user.id, profileId, updates);
      if (success) {
        return NextResponse.json({ success: true, data: await getUserProfiles(user.id) });
      }
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    if (action === 'delete' && profileId) {
      const success = await deleteUserProfile(user.id, profileId);
      if (success) {
        return NextResponse.json({ success: true, data: await getUserProfiles(user.id) });
      }
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
