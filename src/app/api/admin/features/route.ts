import { NextRequest, NextResponse } from 'next/server';
import { getFeatures, updateFeature, addFeature, FeatureFlag } from '@/lib/jsonDb';

export async function GET() {
  try {
    const features = await getFeatures();
    return NextResponse.json({ success: true, data: features });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, updates, feature } = body;

    if (action === 'update' && id && updates) {
      const success = await updateFeature(id, updates);
      if (success) {
        return NextResponse.json({ success: true, data: await getFeatures() });
      }
      return NextResponse.json({ success: false, error: 'Feature not found' }, { status: 404 });
    }

    if (action === 'add' && feature) {
      const newFeature: FeatureFlag = {
        ...feature,
        id: `f${Date.now()}` // Generate temporary ID
      };
      const success = await addFeature(newFeature);
      if (success) {
        return NextResponse.json({ success: true, data: await getFeatures() });
      }
      return NextResponse.json({ success: false, error: 'Failed to add feature' }, { status: 500 });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
