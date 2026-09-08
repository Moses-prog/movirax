'use client';

import React, { useState, useEffect } from 'react';
import { Settings2, Save, Server, Tv, Film } from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Select, SelectItem, addToast, Spinner } from '@heroui/react';
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
      setMovieServer(settings.defaultMovie.toString());
      setTvServer(settings.defaultTv.toString());
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
    return <div className="flex h-64 items-center justify-center"><Spinner size="lg" color="danger" /></div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-white tracking-tight">
            <Server className="size-8 text-red-500" />
            Server Configuration
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage the primary default streaming servers for Movies and TV Shows.
          </p>
        </div>
        <Button 
          color="danger" 
          startContent={<Save className="size-4" />}
          onPress={handleSave}
          isLoading={isSaving}
          className="font-semibold shadow-lg shadow-red-500/20"
        >
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-zinc-900/50 border border-white/10 backdrop-blur-sm">
          <CardHeader className="border-b border-white/10 p-6">
            <h2 className="flex items-center gap-3 text-xl font-semibold text-white">
              <Film className="size-5 text-red-500" />
              Movie Default Server
            </h2>
          </CardHeader>
          <CardBody className="p-6">
            <p className="mb-6 text-sm text-zinc-400 leading-relaxed">
              Select the primary server that will automatically load when a user plays a movie. If this server fails, they can still manually switch to others.
            </p>
            <Select 
              label="Primary Movie Server"
              variant="bordered"
              selectedKeys={[movieServer]}
              onChange={(e) => setMovieServer(e.target.value)}
              className="max-w-full"
              classNames={{
                trigger: "bg-zinc-900 border-white/20 hover:border-red-500/50 transition-colors",
              }}
            >
              {mockPlayersMovie.map((player, idx) => (
                <SelectItem key={idx.toString()} value={idx.toString()}>
                  {player.title} {player.fast ? '(Fast)' : ''}
                </SelectItem>
              ))}
            </Select>
          </CardBody>
        </Card>

        <Card className="bg-zinc-900/50 border border-white/10 backdrop-blur-sm">
          <CardHeader className="border-b border-white/10 p-6">
            <h2 className="flex items-center gap-3 text-xl font-semibold text-white">
              <Tv className="size-5 text-red-500" />
              TV Show Default Server
            </h2>
          </CardHeader>
          <CardBody className="p-6">
            <p className="mb-6 text-sm text-zinc-400 leading-relaxed">
              Select the primary server that will automatically load when a user plays a TV Show episode. 
            </p>
            <Select 
              label="Primary TV Server"
              variant="bordered"
              selectedKeys={[tvServer]}
              onChange={(e) => setTvServer(e.target.value)}
              className="max-w-full"
              classNames={{
                trigger: "bg-zinc-900 border-white/20 hover:border-red-500/50 transition-colors",
              }}
            >
              {mockPlayersTv.map((player, idx) => (
                <SelectItem key={idx.toString()} value={idx.toString()}>
                  {player.title} {player.fast ? '(Fast)' : ''}
                </SelectItem>
              ))}
            </Select>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}