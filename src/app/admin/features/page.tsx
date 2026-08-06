'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Plus, 
  Search, 
  Settings2, 
  CheckCircle2, 
  XCircle, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, addToast, Spinner } from '@heroui/react';
import { Switch } from '@heroui/switch';

interface Feature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  free_tier: boolean;
  pro_tier: boolean;
}

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add Feature Modal
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [newFeatureName, setNewFeatureName] = useState('');
  const [newFeatureDesc, setNewFeatureDesc] = useState('');

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const res = await fetch('/api/admin/features');
      const json = await res.json();
      if (json.success) {
        setFeatures(json.data);
      }
    } catch (error) {
      console.error('Failed to fetch features:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFeatures = features.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatus = async (id: string, field: 'enabled' | 'free_tier' | 'pro_tier') => {
    // Optimistic update
    const featureToUpdate = features.find(f => f.id === id);
    if (!featureToUpdate) return;
    
    const newValue = !featureToUpdate[field];
    
    setFeatures(features.map(f => {
      if (f.id === id) {
        return { ...f, [field]: newValue };
      }
      return f;
    }));

    // Server update
    try {
      const res = await fetch('/api/admin/features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          id,
          updates: { [field]: newValue }
        })
      });
      const json = await res.json();
      
      if (json.success) {
        addToast({ title: "Settings saved", color: "success" });
      } else {
        // Revert on failure
        setFeatures(features);
        addToast({ title: "Failed to update", color: "danger" });
      }
    } catch (e) {
      setFeatures(features); // Revert
      addToast({ title: "Network error", color: "danger" });
    }
  };

  const deleteFeature = (id: string) => {
    setFeatures(features.filter(f => f.id !== id));
    addToast({ title: "Feature removed", color: "danger" });
    // TODO: backend delete if needed
  };

  const handleAddFeature = async (onClose: () => void) => {
    if (!newFeatureName.trim()) return;
    
    const newFeature = {
      name: newFeatureName,
      description: newFeatureDesc,
      enabled: true,
      free_tier: false,
      pro_tier: true,
    };
    
    try {
      const res = await fetch('/api/admin/features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          feature: newFeature
        })
      });
      const json = await res.json();
      
      if (json.success) {
        setFeatures(json.data);
        setNewFeatureName('');
        setNewFeatureDesc('');
        addToast({ title: "Feature added successfully", color: "success" });
        onClose();
      } else {
        addToast({ title: "Failed to add feature", color: "danger" });
      }
    } catch (e) {
      addToast({ title: "Network error", color: "danger" });
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="m-0 mb-1 text-3xl font-extrabold tracking-tight text-foreground">Feature Toggles</h1>
          <p className="m-0 text-sm font-medium text-muted-foreground">
            Instantly enable or disable features and configure tier restrictions
          </p>
        </div>
        
        <Button
          color="danger"
          className="bg-gradient-to-r from-red-600 to-orange-500 font-bold text-white shadow-md"
          startContent={<Plus size={18} />}
          onPress={onOpen}
        >
          Add New Feature
        </Button>
      </header>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search features..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<Search size={16} className="text-muted-foreground" />}
          className="max-w-md"
          classNames={{
            inputWrapper: "bg-white/5 border border-white/5 hover:bg-white/10 group-data-[focus=true]:bg-background group-data-[focus=true]:border-red-500/50"
          }}
        />
        <div className="ml-auto flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-4 py-2">
          <Settings2 size={16} className="text-muted-foreground" />
          <span className="text-[13px] font-bold text-muted-foreground">Configuration Mode</span>
        </div>
      </div>

      {/* Features Table */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-background/50 shadow-sm backdrop-blur-xl">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Table Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_0.5fr] items-center gap-4 border-b border-white/5 bg-white/5 px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
              <div>Feature</div>
              <div className="text-center">Global Status</div>
              <div className="text-center">Free Tier</div>
              <div className="text-center text-orange-500">Pro Tier</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Table Body */}
            {isLoading ? (
              <div className="flex justify-center py-12"><Spinner color="danger" /></div>
            ) : filteredFeatures.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <AlertCircle className="mb-3 size-10 text-muted-foreground/50" />
                <p className="text-sm font-medium text-muted-foreground">No features found matching "{searchQuery}"</p>
              </div>
            ) : (
              filteredFeatures.map((feature, idx) => (
                <div 
                  key={feature.id} 
                  className={`grid grid-cols-[2fr_1fr_1fr_1fr_0.5fr] items-center gap-4 px-6 py-5 transition-colors hover:bg-white/5 ${idx !== filteredFeatures.length - 1 ? 'border-b border-white/5' : ''}`}
                >
                  {/* Feature Info */}
                  <div>
                    <h3 className="flex items-center gap-2 text-[15px] font-bold text-foreground">
                      <Zap size={14} className={feature.enabled ? "text-orange-500" : "text-muted-foreground"} />
                      {feature.name}
                    </h3>
                    <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed pr-4">
                      {feature.description}
                    </p>
                  </div>

                  {/* Global Status */}
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Switch 
                      isSelected={feature.enabled} 
                      onValueChange={() => toggleStatus(feature.id, 'enabled')}
                      color="danger"
                      size="sm"
                    />
                    <span className={`text-[11px] font-bold uppercase tracking-widest ${feature.enabled ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {feature.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  {/* Free Tier */}
                  <div className="flex justify-center">
                    <button 
                      onClick={() => toggleStatus(feature.id, 'free_tier')}
                      disabled={!feature.enabled}
                      className={`flex size-8 items-center justify-center rounded-full transition-all hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 ${feature.free_tier ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-white/20 hover:bg-white/10 hover:text-white/50'}`}
                    >
                      {feature.free_tier ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    </button>
                  </div>

                  {/* Pro Tier */}
                  <div className="flex justify-center">
                    <button 
                      onClick={() => toggleStatus(feature.id, 'pro_tier')}
                      disabled={!feature.enabled}
                      className={`flex size-8 items-center justify-center rounded-full transition-all hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 ${feature.pro_tier ? 'bg-orange-500/10 text-orange-500' : 'bg-white/5 text-white/20 hover:bg-white/10 hover:text-white/50'}`}
                    >
                      {feature.pro_tier ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => deleteFeature(feature.id)}
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Feature Modal */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        classNames={{
          base: "bg-background border border-white/10",
          header: "border-b border-white/5",
          footer: "border-t border-white/5",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-foreground">Add New Feature</ModalHeader>
              <ModalBody className="py-6 flex flex-col gap-4">
                <Input
                  label="Feature Name"
                  placeholder="e.g. 8K Streaming"
                  value={newFeatureName}
                  onValueChange={setNewFeatureName}
                  classNames={{
                    inputWrapper: "bg-white/5 border border-white/10 hover:bg-white/10 focus-within:border-red-500/50"
                  }}
                />
                
                <Input
                  label="Description"
                  placeholder="Brief explanation of the feature"
                  value={newFeatureDesc}
                  onValueChange={setNewFeatureDesc}
                  classNames={{
                    inputWrapper: "bg-white/5 border border-white/10 hover:bg-white/10 focus-within:border-red-500/50"
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button 
                  color="danger" 
                  onPress={() => handleAddFeature(onClose)}
                  className="bg-gradient-to-r from-red-600 to-orange-500 font-bold text-white shadow-md"
                  isDisabled={!newFeatureName.trim()}
                >
                  Create Feature
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
