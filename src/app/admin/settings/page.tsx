'use client';

import React, { useState, useEffect } from 'react';
import { 
  Server,
  Save,
  Globe,
  Mail,
  Shield,
  Bell
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
import { getServerSettings, updateServerSettings } from '@/lib/settings';

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

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const serverStats = await getServerSettings();
      setMovieServer(String(serverStats.defaultMovie || 0));
      setTvServer(String(serverStats.defaultTv || 0));
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
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
