'use client';

import React, { useState, useEffect } from 'react';
import { 
  Server,
  Save,
  Globe,
  Mail,
  Shield,
  Bell,
  CreditCard
} from 'lucide-react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Input, 
  Button,
  Tabs,
  Tab,
  Switch,
  addToast,
  Spinner
} from '@heroui/react';
import { getServerSettings, updateServerSettings, getPaymentSettings, updatePaymentSettings, PaymentSettings } from '@/lib/settings';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Server Settings
  const [movieServer, setMovieServer] = useState('0');
  const [tvServer, setTvServer] = useState('0');

  // General Settings (UI only placeholders if no backend exists yet)
  const [siteName, setSiteName] = useState('Movira X');
  const [contactEmail, setContactEmail] = useState('support@movirax.com');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    paystackEnabled: false,
    paystackPublicKey: '',
    paystackSecretKey: '',
    flutterwaveEnabled: false,
    flutterwavePublicKey: '',
    flutterwaveSecretKey: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const serverStats = await getServerSettings();
      setMovieServer(String(serverStats.defaultMovie || 0));
      setTvServer(String(serverStats.defaultTv || 0));

      const payments = await getPaymentSettings();
      setPaymentSettings(payments);
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveServers = async () => {
    setSaving(true);
    try {
      const success = await updateServerSettings(Number(movieServer), Number(tvServer));
      if (success) {
        addToast({ title: "Server settings saved successfully", color: "success" });
      } else {
        addToast({ title: "Failed to save server settings", color: "danger" });
      }
    } catch (error) {
      addToast({ title: "Error saving settings", color: "danger" });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGeneral = async () => {
    setSaving(true);
    // Placeholder for general settings save
    setTimeout(() => {
      setSaving(false);
      addToast({ title: "General settings saved successfully", color: "success" });
    }, 800);
  };

  const handleSavePayments = async () => {
    setSaving(true);
    try {
      const success = await updatePaymentSettings(paymentSettings);
      if (success) {
        addToast({ title: "Payment settings saved successfully", color: "success" });
      } else {
        addToast({ title: "Failed to save payment settings", color: "danger" });
      }
    } catch (error) {
      addToast({ title: "Error saving payment settings", color: "danger" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner color="danger" size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-6 pb-10">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">System Settings</h1>
          <p className="text-default-500 mt-1">Configure global application preferences and defaults</p>
        </div>
      </header>

      <Card className="border-none shadow-sm bg-background/60 dark:bg-default-100/50">
        <CardBody className="p-0">
          <Tabs 
            aria-label="Settings Options" 
            color="danger" 
            variant="underlined"
            classNames={{
              tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider px-6 pt-4",
              cursor: "w-full bg-danger",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-danger font-semibold"
            }}
          >
            {/* General Tab */}
            <Tab
              key="general"
              title={
                <div className="flex items-center space-x-2">
                  <Globe size={18} />
                  <span>General</span>
                </div>
              }
            >
              <div className="p-6 flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Site Name" 
                    placeholder="e.g. Movira X"
                    value={siteName}
                    onValueChange={setSiteName}
                    variant="faded"
                    startContent={<Globe size={16} className="text-default-400" />}
                  />
                  <Input 
                    label="Support Email" 
                    placeholder="support@example.com"
                    value={contactEmail}
                    onValueChange={setContactEmail}
                    variant="faded"
                    startContent={<Mail size={16} className="text-default-400" />}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-default-500 border-b border-divider pb-2">Access & Security</h3>
                  
                  <div className="flex items-center justify-between bg-default-100/50 p-4 rounded-xl border border-divider">
                    <div>
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Shield size={16} className="text-danger" /> 
                        Maintenance Mode
                      </h4>
                      <p className="text-xs text-default-500 mt-1">Lock down the site for non-admin users during updates.</p>
                    </div>
                    <Switch 
                      isSelected={maintenanceMode}
                      onValueChange={setMaintenanceMode}
                      color="danger" 
                    />
                  </div>

                  <div className="flex items-center justify-between bg-default-100/50 p-4 rounded-xl border border-divider">
                    <div>
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Bell size={16} className="text-primary" /> 
                        Allow New Registrations
                      </h4>
                      <p className="text-xs text-default-500 mt-1">Users can create new accounts and sign up.</p>
                    </div>
                    <Switch 
                      isSelected={registrationEnabled}
                      onValueChange={setRegistrationEnabled}
                      color="primary" 
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-divider">
                  <Button 
                    color="danger" 
                    startContent={<Save size={18} />}
                    onPress={handleSaveGeneral}
                    isLoading={saving}
                  >
                    Save General Settings
                  </Button>
                </div>
              </div>
            </Tab>

            {/* Servers Tab */}
            <Tab
              key="servers"
              title={
                <div className="flex items-center space-x-2">
                  <Server size={18} />
                  <span>Servers & Providers</span>
                </div>
              }
            >
              <div className="p-6 flex flex-col gap-8">
                <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 text-sm text-warning-600 dark:text-warning-500 flex gap-3">
                  <Server className="shrink-0 mt-0.5" size={18} />
                  <p>Configure the default streaming server IDs for Movies and TV Shows. These IDs correspond to your active backend providers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    type="number"
                    label="Default Movie Server ID" 
                    placeholder="e.g. 0"
                    value={movieServer}
                    onValueChange={setMovieServer}
                    variant="faded"
                    description="The fallback streaming server for movies."
                  />
                  <Input 
                    type="number"
                    label="Default TV Show Server ID" 
                    placeholder="e.g. 1"
                    value={tvServer}
                    onValueChange={setTvServer}
                    variant="faded"
                    description="The fallback streaming server for TV episodes."
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-divider">
                  <Button 
                    color="danger" 
                    startContent={<Save size={18} />}
                    onPress={handleSaveServers}
                    isLoading={saving}
                  >
                    Save Server Settings
                  </Button>
                </div>
              </div>
            </Tab>

            {/* Payment Gateways Tab */}
            <Tab
              key="payments"
              title={
                <div className="flex items-center space-x-2">
                  <CreditCard size={18} />
                  <span>Payment Gateways</span>
                </div>
              }
            >
              <div className="p-6 flex flex-col gap-8">
                {/* Paystack Section */}
                <div className="flex flex-col gap-4 bg-default-50 p-6 rounded-2xl border border-default-200">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">Paystack Integration <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Card Payments</span></h3>
                      <p className="text-sm text-default-500">Configure Paystack API keys for primary subscription billing.</p>
                    </div>
                    <Switch 
                      color="success" 
                      isSelected={paymentSettings.paystackEnabled}
                      onValueChange={(val) => setPaymentSettings({...paymentSettings, paystackEnabled: val})}
                    >
                      Enabled
                    </Switch>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label="Public Key" 
                      placeholder="pk_test_..." 
                      variant="faded" 
                      value={paymentSettings.paystackPublicKey}
                      onValueChange={(val) => setPaymentSettings({...paymentSettings, paystackPublicKey: val})}
                    />
                    <Input 
                      label="Secret Key" 
                      placeholder="sk_test_..." 
                      type="password"
                      variant="faded" 
                      value={paymentSettings.paystackSecretKey}
                      onValueChange={(val) => setPaymentSettings({...paymentSettings, paystackSecretKey: val})}
                    />
                  </div>
                </div>

                {/* Flutterwave Section */}
                <div className="flex flex-col gap-4 bg-default-50 p-6 rounded-2xl border border-default-200">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">Flutterwave Integration <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">Checkout Options</span></h3>
                      <p className="text-sm text-default-500">Configure Flutterwave API keys for alternative checkout methods.</p>
                    </div>
                    <Switch 
                      color="success" 
                      isSelected={paymentSettings.flutterwaveEnabled}
                      onValueChange={(val) => setPaymentSettings({...paymentSettings, flutterwaveEnabled: val})}
                    >
                      Enabled
                    </Switch>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label="Public Key" 
                      placeholder="FLWPUBK_TEST-..." 
                      variant="faded" 
                      value={paymentSettings.flutterwavePublicKey}
                      onValueChange={(val) => setPaymentSettings({...paymentSettings, flutterwavePublicKey: val})}
                    />
                    <Input 
                      label="Secret Key" 
                      placeholder="FLWSECK_TEST-..." 
                      type="password"
                      variant="faded" 
                      value={paymentSettings.flutterwaveSecretKey}
                      onValueChange={(val) => setPaymentSettings({...paymentSettings, flutterwaveSecretKey: val})}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-divider">
                  <Button 
                    color="danger" 
                    startContent={<Save size={18} />}
                    onPress={handleSavePayments}
                    isLoading={saving}
                  >
                    Save Payment Gateways
                  </Button>
                </div>
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
