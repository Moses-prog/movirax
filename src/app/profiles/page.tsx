'use client';

import React, { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useRouter } from 'next/navigation';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, InputOtp, addToast } from '@heroui/react';
import { Switch } from '@heroui/switch';
import { Plus, Edit2, CheckCircle2, AlertCircle, Image as ImageIcon, Lock } from 'lucide-react';

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
  const [newPin, setNewPin] = useState('');
    const avatarOptions = [
    'https://image.tmdb.org/t/p/w200/5OK84Wn1bIEIThFKcVoaN087mLj.jpg',
    'https://image.tmdb.org/t/p/w200/8LqG2N6j98lFGMpuYsRUAhOunSd.jpg',
    'https://image.tmdb.org/t/p/w200/trzgptffGvAlAT6MEu01fz47cLW.jpg',
    'https://image.tmdb.org/t/p/w200/8RZLOyYGsoRe9p44q3xin9QkMHv.jpg',
    'https://image.tmdb.org/t/p/w200/tgxYh3jMs5bY2Ub4d2dcp9iaz1R.jpg',
    'https://image.tmdb.org/t/p/w200/2lKs67r7FI4bPu0AXxMUJZxmUXn.jpg',
    'https://image.tmdb.org/t/p/w200/3WdOloHpjtjL96uVOhFRRCcYSwq.jpg',
    'https://image.tmdb.org/t/p/w200/5qHNjhtjMD4YWH3UP0rm4tKwxCL.jpg'
  ];
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);

  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [editIsKids, setEditIsKids] = useState(false);
    const [editPin, setEditPin] = useState('');
  const [confirmDeletePending, setConfirmDeletePending] = useState(false);
  const [editAvatar, setEditAvatar] = useState(avatarOptions[0]);
  const { isOpen: isPinOpen, onOpen: onPinOpen, onOpenChange: onPinOpenChange } = useDisclosure();
  const [selectedLockedProfile, setSelectedLockedProfile] = useState<any>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const { isOpen: isSetPinOpen, onOpen: onSetPinOpen, onOpenChange: onSetPinOpenChange } = useDisclosure();
  const [tempPin, setTempPin] = useState('');
  const [isSettingPinFor, setIsSettingPinFor] = useState<'add' | 'edit' | null>(null);

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

    const openEditModalForProfile = (profile: any) => {
    setEditingProfile(profile);
    setEditName(profile.name);
    setEditIsKids(profile.isKids || false);
    setEditAvatar(profile.avatar || avatarOptions[0]);
    setEditPin(profile.pin || '');
    onEditOpen();
  };

  const handleSelectProfile = (profile: any) => {
    setConfirmDeletePending(false);
    
    // If the profile is locked, require the PIN before doing ANYTHING (entering OR editing)
    if (profile.pin) {
      setSelectedLockedProfile(profile);
      setEnteredPin('');
      setPinError(false);
      onPinOpen();
      return;
    }

    if (isEditingMode) {
      openEditModalForProfile(profile);
      return;
    }

    setActiveProfile(profile);
    router.push('/');
    router.refresh();
  };

  
  const handlePinSubmit = (onClose: () => void) => {
    if (selectedLockedProfile?.pin === enteredPin) {
      onClose();
      if (isEditingMode) {
        openEditModalForProfile(selectedLockedProfile);
      } else {
        setActiveProfile(selectedLockedProfile);
        router.push('/');
        router.refresh();
      }
    } else {
      setPinError(true);
    }
  };

  const handleAddProfile = async (onClose: () => void) => {
    if (!newName.trim()) return;
    try {
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          newProfile: { name: newName, avatar: selectedAvatar, isKids, pin: newPin }
        })
      });
            if (res.ok) {
        await refreshProfiles();
        setNewName('');
        setIsKids(false);
        setNewPin('');
        onClose();
        addToast({ title: 'Profile added successfully', color: 'success' });
      } else {
        addToast({ title: 'Failed to add profile', color: 'danger' });
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
          updates: { name: editName, isKids: editIsKids, avatar: editAvatar, pin: editPin }
        })
      });
            if (res.ok) {
        await refreshProfiles();
        onClose();
        addToast({ title: 'Profile saved successfully', color: 'success' });
      } else {
        addToast({ title: 'Failed to save profile', color: 'danger' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProfile = async (onClose: () => void) => {
    if (!editingProfile) return;
    if (profiles.length <= 1) {
      addToast({ title: "You must have at least one profile.", color: "danger" });
      return;
    }
    if (!confirmDeletePending) {
      setConfirmDeletePending(true);
      return;
    }

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
        addToast({ title: 'Profile deleted successfully', color: 'success' });
      } else {
        addToast({ title: 'Failed to delete profile', color: 'danger' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      <h1 className="text-4xl md:text-5xl font-black mb-12 text-foreground tracking-tight text-center relative z-10">
        Who's watching?
      </h1>

      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 max-w-5xl relative z-10">
        {profiles.map((profile) => (
          <div key={profile.id} className="group flex flex-col items-center gap-4 cursor-pointer" onClick={() => handleSelectProfile(profile)}>
            <div className="relative">
              <div className={`w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 transition-all duration-300 ${isEditingMode ? 'border-white/20 opacity-70 group-hover:border-white' : 'border-transparent group-hover:border-white group-hover:scale-105'}`}>
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-danger/20 flex items-center justify-center text-4xl font-bold uppercase text-danger">
                    {profile.name.substring(0,2)}
                  </div>
                )}
              </div>
              {isEditingMode && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl border-4 border-transparent">
                  <Edit2 className="text-white w-8 h-8" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
                <span className={`text-lg font-medium transition-colors ${isEditingMode ? 'text-white/70' : 'text-muted-foreground group-hover:text-white'}`}>
                  {profile.name}
                </span>
                {profile.pin && <Lock className="w-4 h-4 text-white/50" />}
              </div>
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
                                    <img src={selectedAvatar} alt="Avatar Preview" className="w-24 h-24 rounded-xl border-4 border-white/20 mb-4 object-cover" />
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                    {avatarOptions.map(url => (
                      <img 
                        key={url} 
                        src={url} 
                        onClick={() => setSelectedAvatar(url)}
                        className={`w-10 h-10 rounded-lg cursor-pointer transition-transform hover:scale-110 ${selectedAvatar === url ? 'ring-2 ring-red-500 scale-110' : 'opacity-50 hover:opacity-100'}`}
                      />
                    ))}
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
                                                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 mt-2">
                    <div className="flex flex-col gap-1">
                      <p className="font-bold">Profile Lock</p>
                      <p className="text-xs text-muted-foreground">Require a 4-digit PIN to access this profile.</p>
                    </div>
                    <Button 
                      color={newPin ? "success" : "default"} 
                      variant="flat" 
                      onPress={() => { setIsSettingPinFor('add'); setTempPin(newPin); onSetPinOpen(); }}
                    >
                      {newPin ? <><CheckCircle2 className="w-4 h-4 mr-2" /> PIN Set</> : <><Lock className="w-4 h-4 mr-2" /> Add PIN</>}
                    </Button>
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
                                    <img src={editAvatar} alt="Avatar Preview" className="w-24 h-24 rounded-xl border-4 border-white/20 mb-4 object-cover" />
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                    {avatarOptions.map(url => (
                      <img 
                        key={url} 
                        src={url} 
                        onClick={() => setEditAvatar(url)}
                        className={`w-10 h-10 rounded-lg cursor-pointer transition-transform hover:scale-110 ${editAvatar === url ? 'ring-2 ring-red-500 scale-110' : 'opacity-50 hover:opacity-100'}`}
                      />
                    ))}
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
                                                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 mt-2">
                    <div className="flex flex-col gap-1">
                      <p className="font-bold">Profile Lock</p>
                      <p className="text-xs text-muted-foreground">Require a 4-digit PIN to access this profile.</p>
                    </div>
                    <Button 
                      color={editPin ? "success" : "default"} 
                      variant="flat" 
                      onPress={() => { setIsSettingPinFor('edit'); setTempPin(editPin); onSetPinOpen(); }}
                    >
                      {editPin ? <><CheckCircle2 className="w-4 h-4 mr-2" /> PIN Set</> : <><Lock className="w-4 h-4 mr-2" /> Add PIN</>}
                    </Button>
                  </div>
                </ModalBody>
              <ModalFooter className="flex justify-between w-full">
                <Button 
                    color="danger" 
                    variant={confirmDeletePending ? "solid" : "flat"} 
                    onPress={() => handleDeleteProfile(onClose)}
                    isDisabled={profiles.length <= 1}
                  >
                    {confirmDeletePending ? "Yes, Delete" : "Delete Profile"}
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

      {/* PIN Unlock Modal */}
      <Modal isOpen={isPinOpen} onOpenChange={onPinOpenChange} placement="center" backdrop="blur">
        <ModalContent className="bg-content1/60 backdrop-blur-md border border-white/10 shadow-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center pb-0 mt-4">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 overflow-hidden ring-4 ring-primary/20 bg-white/5">
                  <img src={selectedLockedProfile?.avatar || avatarOptions[0]} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                Enter PIN for {selectedLockedProfile?.name}
              </ModalHeader>
              <ModalBody className="py-6 flex flex-col items-center">
                <InputOtp 
                  length={4}
                  value={enteredPin}
                  onValueChange={(val) => {
                    setEnteredPin(val);
                    setPinError(false);
                    if (val.length === 4) {
                      setTimeout(() => {
                        if (selectedLockedProfile?.pin === val) {
                          onClose();
                          if (isEditingMode) {
                            openEditModalForProfile(selectedLockedProfile);
                          } else {
                            setActiveProfile(selectedLockedProfile);
                            router.push('/');
                            router.refresh();
                          }
                        } else {
                          setPinError(true);
                        }
                      }, 300);
                    }
                  }}
                  isInvalid={pinError}
                  errorMessage={pinError ? "Incorrect PIN" : ""}
                  autoFocus
                  classNames={{
                    segmentWrapper: "gap-x-4",
                    segment: "w-14 h-14 rounded-full border-2 border-white/20 data-[active=true]:border-primary text-xl font-bold bg-white/5",
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose} className="w-full">
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Set PIN Modal */}
      <Modal isOpen={isSetPinOpen} onOpenChange={onSetPinOpenChange} placement="center" backdrop="blur">
        <ModalContent className="bg-content1/60 backdrop-blur-md border border-white/10 shadow-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center pb-0 mt-4">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-primary/20 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                {tempPin.length === 4 ? "Profile PIN Set!" : "Set Profile PIN"}
              </ModalHeader>
              <ModalBody className="py-6 flex flex-col items-center">
                <p className="text-center text-muted-foreground mb-4">
                  Enter a 4-digit PIN to lock this profile.
                </p>
                <InputOtp 
                  length={4}
                  value={tempPin}
                  onValueChange={(val) => {
                    setTempPin(val);
                    if (val.length === 4) {
                      setTimeout(() => {
                        if (isSettingPinFor === 'add') setNewPin(val);
                        if (isSettingPinFor === 'edit') setEditPin(val);
                        onClose();
                      }, 400);
                    }
                  }}
                  autoFocus
                  classNames={{
                    segmentWrapper: "gap-x-4",
                    segment: "w-14 h-14 rounded-full border-2 border-white/20 data-[active=true]:border-primary text-xl font-bold bg-white/5",
                  }}
                />
              </ModalBody>
              <ModalFooter className="flex-col gap-2">
                <Button variant="flat" onPress={onClose} className="w-full">Cancel</Button>
                {((isSettingPinFor === 'add' && newPin) || (isSettingPinFor === 'edit' && editPin)) && (
                  <Button color="danger" variant="flat" className="w-full" onPress={() => {
                    if (isSettingPinFor === 'add') setNewPin('');
                    if (isSettingPinFor === 'edit') setEditPin('');
                    onClose();
                  }}>
                    Remove PIN
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  );
}







