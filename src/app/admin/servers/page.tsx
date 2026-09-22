'use client';

import React, { useState, useEffect } from 'react';
import { Save, Server, Tv, Film } from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Select, SelectItem, addToast, Spinner, Divider } from '@heroui/react';
import { fetchServerSettings, saveServerSettings } from '@/actions/settings';
import { getMoviePlayers, getTvShowPlayers } from '@/utils/players';

// Dummy ID to fetch players list
const mockPlayersMovie = getMoviePlayers('0');
const mockPlayersTv = getTvShowPlayers('0', 1, 1);

export default function ServersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [movieServer, setMovieServer] = useState<string>("0");
  const [tvServer, setTvServer] = useState<string>("0");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const settings = await fetchServerSettings();
      const mKey = settings.defaultMovie.toString();
      setMovieServer(mockPlayersMovie[settings.defaultMovie] ? mKey : '0');
      const tKey = settings.defaultTv.toString();
      setTvServer(mockPlayersTv[settings.defaultTv] ? tKey : '0');
    } catch (e) {
      console.error(e);
      addToast({ title: "Failed to load settings", color: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await saveServerSettings(parseInt(movieServer), parseInt(tvServer));
      if (success) {
        addToast({ title: "Server settings saved successfully", color: "success" });
      } else {
        addToast({ title: "Failed to save settings", color: "danger" });
      }
    } catch (e) {
      addToast({ title: "An error occurred", color: "danger" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Spinner size="lg" color="danger" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl flex flex-col gap-6 pb-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Server className="size-8 text-danger" />
            Server Configuration
          </h1>
          <p className="text-default-500 mt-1">
            Manage the primary default streaming servers for Movies and TV Shows.
          </p>
        </div>
        <Button 
          color="danger" 
          startContent={<Save size={18} />}
          onPress={handleSave}
          isLoading={isSaving}
          className="font-bold shadow-lg shadow-danger-500/30"
        >
          Save Changes
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm bg-background/60 dark:bg-default-100/50">
          <CardHeader className="flex items-center gap-3 px-6 pt-6 pb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <Film size={20} />
            </div>
            <h2 className="text-lg font-bold text-foreground">
              Movie Default Server
            </h2>
          </CardHeader>
          <Divider />
          <CardBody className="p-6">
            <p className="mb-6 text-sm text-default-500 leading-relaxed">
              Select the primary server that will automatically load when a user plays a movie. If this server fails, they can still manually switch to others.
            </p>
            <Select 
              label="Primary Movie Server"
              labelPlacement="outside"
              variant="faded"
              selectedKeys={[movieServer]}
              onChange={(e) => setMovieServer(e.target.value)}
              className="max-w-full"
              items={mockPlayersMovie.map((player, idx) => ({ 
                id: idx.toString(), 
                title: player.title, 
                fast: player.fast 
              }))}
              children={(item: any) => (
                <SelectItem key={item.id}>
                  {item.title} {item.fast ? '(Fast)' : ''}
                </SelectItem>
              )}
            />
          </CardBody>
        </Card>

        <Card className="border-none shadow-sm bg-background/60 dark:bg-default-100/50">
          <CardHeader className="flex items-center gap-3 px-6 pt-6 pb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <Tv size={20} />
            </div>
            <h2 className="text-lg font-bold text-foreground">
              TV Show Default Server
            </h2>
          </CardHeader>
          <Divider />
          <CardBody className="p-6">
            <p className="mb-6 text-sm text-default-500 leading-relaxed">
              Select the primary server that will automatically load when a user plays a TV Show episode. 
            </p>
            <Select 
              label="Primary TV Server"
              labelPlacement="outside"
              variant="faded"
              selectedKeys={[tvServer]}
              onChange={(e) => setTvServer(e.target.value)}
              className="max-w-full"
              items={mockPlayersTv.map((player, idx) => ({
                id: idx.toString(),
                title: player.title,
                fast: player.fast
              }))}
              children={(item: any) => (
                <SelectItem key={item.id}>
                  {item.title} {item.fast ? '(Fast)' : ''}
                </SelectItem>
              )}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}