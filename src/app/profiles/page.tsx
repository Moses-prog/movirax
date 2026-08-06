'use client';

import React, { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useRouter } from 'next/navigation';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input } from '@heroui/react';
import { Switch } from '@heroui/switch';
import { Plus, Edit2, CheckCircle2, AlertCircle } from 'lucide-react';

import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import UpgradeNotice from '@/components/ui/notice/Upgrade';

export default function ProfilesPage() {
  const { profiles, setActiveProfile, refreshProfiles, isLoading } = useProfile();
  const { hasAccess, feature, isLoading: isFeatureLoading } = useFeatureAccess('f4'); // f4 is Multiple Profiles
  const router = useRouter();
  const [isEditingMode, setIsEditingMode] = useState(false);
  
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newName, setNewName] = useState('');
  const [isKids, setIsKids] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('/avatars/1.png');

  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [editIsKids, setEditIsKids] = useState(false);

  if (isFeatureLoading || isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"/></div>;
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <UpgradeNotice 
          title="Upgrade Required" 
          description={feature && !feature.enabled 
            ? "This feature is currently disabled by the administrator."
            : "Multiple Profiles is a premium feature. Upgrade to Pro to share your account with family and friends!"}
        />
      </div>
    );
  }

  const handleSelectProfile = (profile: any) => {
    if (isEditingMode) {
      setEditingProfile(profile);
      setEditName(profile.name);
      setEditIsKids(profile.isKids || false);
      onEditOpen();
      return;
    }
    setActiveProfile(profile);
    router.push('/');
    router.refresh();
  };

  const handleAddProfile = async (onClose: () => void) => {
    if (!newName.trim()) return;
    try {
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          newProfile: { name: newName, avatar: selectedAvatar, isKids }
        })
      });
      if (res.ok) {
        await refreshProfiles();
        setNewName('');
        setIsKids(false);
        onClose();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveEdit = async (onClose: () => void) => {
    if (!editingProfile || !editName.trim()) return;
    try {
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          profileId: editingProfile.id,
          updates: { name: editName, isKids: editIsKids }
        })
      });
      if (res.ok) {
        await refreshProfiles();
        onClose();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProfile = async (onClose: () => void) => {
    if (!editingProfile) return;
    if (profiles.length <= 1) {
      alert("You must have at least one profile.");
      return;
    }
    const confirmDelete = window.confirm(`Are you sure you want to delete ${editingProfile.name}? This cannot be undone.`);
    if (!confirmDelete) return;

    try {
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          profileId: editingProfile.id
        })
      });
      if (res.ok) {
        await refreshProfiles();
        onClose();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent pointer-events-none" />

      <h1 className="text-4xl md:text-5xl font-black mb-12 text-foreground tracking-tight text-center relative z-10">
        Who's watching?
      </h1>

      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 max-w-5xl relative z-10">
        {profiles.map((profile) => (
          <div key={profile.id} className="group flex flex-col items-center gap-4 cursor-pointer" onClick={() => handleSelectProfile(profile)}>
            <div className="relative">
              <div className={`w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 transition-all duration-300 ${isEditingMode ? 'border-white/20 opacity-70 group-hover:border-white' : 'border-transparent group-hover:border-white group-hover:scale-105'}`}>
                {/* Fallback avatar if local missing */}
                <div className="w-full h-full bg-gradient-to-br from-red-600/50 to-orange-500/50 flex items-center justify-center text-4xl font-bold uppercase">
                  {profile.name.substring(0,2)}
                </div>
              </div>
              {isEditingMode && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl border-4 border-transparent">
                  <Edit2 className="text-white w-8 h-8" />
                </div>
              )}
            </div>
            <span className={`text-lg font-medium transition-colors ${isEditingMode ? 'text-white/70' : 'text-muted-foreground group-hover:text-white'}`}>
              {profile.name}
            </span>
          </div>
        ))}

        {profiles.length < 5 && (
          <div className="group flex flex-col items-center gap-4 cursor-pointer" onClick={onOpen}>
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-transparent bg-white/5 flex items-center justify-center transition-all duration-300 group-hover:bg-white/10 group-hover:border-white">
              <Plus className="w-16 h-16 text-muted-foreground group-hover:text-white transition-colors" />
            </div>
            <span className="text-lg font-medium text-muted-foreground group-hover:text-white transition-colors">
              Add Profile
            </span>
          </div>
        )}
      </div>

      <div className="mt-16 flex flex-col items-center gap-6 relative z-10">
        <Button 
          variant="bordered" 
          size="lg" 
          className={`border-2 font-bold tracking-widest uppercase transition-all ${isEditingMode ? 'bg-white text-black border-white hover:bg-white/90' : 'border-white/20 text-muted-foreground hover:border-white hover:text-white'}`}
          onPress={() => setIsEditingMode(!isEditingMode)}
        >
          {isEditingMode ? 'Done' : 'Manage Profiles'}
        </Button>

        <Button 
          as="a" 
          href="/support"
          variant="light" 
          size="sm" 
          className="text-muted-foreground/60 hover:text-white"
        >
          Need help? Contact Support
        </Button>
      </div>

      {/* Add Profile Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} classNames={{ base: "bg-background border border-white/10" }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add Profile</ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl mb-4 flex items-center justify-center text-2xl font-bold uppercase">
                    {newName ? newName.substring(0,2) : '?'}
                  </div>
                </div>
                <Input
                  label="Name"
                  placeholder="Profile Name"
                  value={newName}
                  onValueChange={setNewName}
                  classNames={{ inputWrapper: "bg-white/5 border border-white/10 focus-within:border-red-500/50" }}
                />
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 mt-2">
                  <div>
                    <p className="font-bold">Kids Profile</p>
                    <p className="text-xs text-muted-foreground">Restrict access to mature content.</p>
                  </div>
                  <Switch isSelected={isKids} onValueChange={setIsKids} color="danger" />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Cancel</Button>
                <Button color="danger" onPress={() => handleAddProfile(onClose)} isDisabled={!newName.trim()}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange} classNames={{ base: "bg-background border border-white/10" }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit Profile</ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl mb-4 flex items-center justify-center text-2xl font-bold uppercase">
                    {editName ? editName.substring(0,2) : '?'}
                  </div>
                </div>
                <Input
                  label="Name"
                  placeholder="Profile Name"
                  value={editName}
                  onValueChange={setEditName}
                  classNames={{ inputWrapper: "bg-white/5 border border-white/10 focus-within:border-red-500/50" }}
                />
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 mt-2">
                  <div>
                    <p className="font-bold">Kids Profile</p>
                    <p className="text-xs text-muted-foreground">Restrict access to mature content.</p>
                  </div>
                  <Switch isSelected={editIsKids} onValueChange={setEditIsKids} color="danger" />
                </div>
              </ModalBody>
              <ModalFooter className="flex justify-between w-full">
                <Button 
                  color="danger" 
                  variant="flat" 
                  onPress={() => handleDeleteProfile(onClose)}
                  isDisabled={profiles.length <= 1}
                >
                  Delete Profile
                </Button>
                <div className="flex gap-2">
                  <Button variant="light" onPress={onClose}>Cancel</Button>
                  <Button color="primary" onPress={() => handleSaveEdit(onClose)} isDisabled={!editName.trim()}>
                    Save Changes
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
