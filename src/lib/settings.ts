'use server';

import { getFeatures, updateFeature, addFeature, FeatureFlag } from './jsonDb';

export interface ServerSettings {
  defaultMovie: number;
  defaultTv: number;
}

const SETTINGS_ID = 'sys_default_servers';

export async function getServerSettings(): Promise<ServerSettings> {
  const features = await getFeatures();
  const setting = features.find(f => f.id === SETTINGS_ID);
  
  if (setting && setting.description) {
    try {
      const parsed = JSON.parse(setting.description);
      return {
        defaultMovie: typeof parsed.movie === 'number' ? parsed.movie : 0,
        defaultTv: typeof parsed.tv === 'number' ? parsed.tv : 0,
      };
    } catch (e) {
      console.error("Failed to parse server settings", e);
    }
  }
  
  return { defaultMovie: 0, defaultTv: 0 };
}

export async function updateServerSettings(movie: number, tv: number): Promise<boolean> {
  const features = await getFeatures();
  const setting = features.find(f => f.id === SETTINGS_ID);
  
  const description = JSON.stringify({ movie, tv });
  
  if (setting) {
    return await updateFeature(SETTINGS_ID, { description });
  } else {
    const newFeature: FeatureFlag = {
      id: SETTINGS_ID,
      name: 'System Default Servers',
      description,
      enabled: true,
      free_tier: true,
      pro_tier: true
    };
    return await addFeature(newFeature);
  }
}export interface PaymentSettings {
  paystackEnabled: boolean;
  paystackPublicKey: string;
  paystackSecretKey: string;
  flutterwaveEnabled: boolean;
  flutterwavePublicKey: string;
  flutterwaveSecretKey: string;
}

const PAYMENT_SETTINGS_ID = 'sys_payment_gateways';

export async function getPaymentSettings(): Promise<PaymentSettings> {
  const features = await getFeatures();
  const setting = features.find(f => f.id === PAYMENT_SETTINGS_ID);
  
  if (setting && setting.description) {
    try {
      const parsed = JSON.parse(setting.description);
      return {
        paystackEnabled: !!parsed.paystackEnabled,
        paystackPublicKey: parsed.paystackPublicKey || '',
        paystackSecretKey: parsed.paystackSecretKey || '',
        flutterwaveEnabled: !!parsed.flutterwaveEnabled,
        flutterwavePublicKey: parsed.flutterwavePublicKey || '',
        flutterwaveSecretKey: parsed.flutterwaveSecretKey || '',
      };
    } catch (e) {
      console.error("Failed to parse payment settings", e);
    }
  }
  
  return {
    paystackEnabled: false,
    paystackPublicKey: '',
    paystackSecretKey: '',
    flutterwaveEnabled: false,
    flutterwavePublicKey: '',
    flutterwaveSecretKey: '',
  };
}

export async function updatePaymentSettings(settings: PaymentSettings): Promise<boolean> {
  const features = await getFeatures();
  const setting = features.find(f => f.id === PAYMENT_SETTINGS_ID);
  
  const description = JSON.stringify(settings);
  
  if (setting) {
    return await updateFeature(PAYMENT_SETTINGS_ID, { description });
  } else {
    const newFeature: FeatureFlag = {
      id: PAYMENT_SETTINGS_ID,
      name: 'System Payment Gateways',
      description,
      enabled: true,
      free_tier: true,
      pro_tier: true
    };
    return await addFeature(newFeature);
  }
}
