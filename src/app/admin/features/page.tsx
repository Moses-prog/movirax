'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import { 
  Button, 
  Input, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  useDisclosure, 
  addToast, 
  Spinner,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardBody,
  Chip,
  Pagination,
  Switch
} from '@heroui/react';

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
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  
  // Add Feature Modal
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [newFeatureName, setNewFeatureName] = useState('');
  const [newFeatureDesc, setNewFeatureDesc] = useState('');
  const [isAdding, setIsAdding] = useState(false);

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

  const filteredFeatures = useMemo(() => {
    return features.filter(f => 
      !f.id.startsWith('sys_') &&
      (f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       f.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [features, searchQuery]);

  const pages = Math.ceil(filteredFeatures.length / rowsPerPage);
  const paginatedFeatures = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredFeatures.slice(start, end);
  }, [page, filteredFeatures]);

  const toggleStatus = async (id: string, field: 'enabled' | 'free_tier' | 'pro_tier') => {
    const featureToUpdate = features.find(f => f.id === id);
    if (!featureToUpdate) return;
    
    const newValue = !featureToUpdate[field];
    
    setFeatures(features.map(f => {
      if (f.id === id) {
        return { ...f, [field]: newValue };
      }
      return f;
    }));

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
        setFeatures(features);
        addToast({ title: "Failed to update", color: "danger" });
      }
    } catch (e) {
      setFeatures(features);
      addToast({ title: "Network error", color: "danger" });
    }
  };

  const deleteFeature = async (id: string) => {
    if (confirm('Are you sure you want to delete this feature?')) {
      const backup = [...features];
      setFeatures(features.filter(f => f.id !== id));
      addToast({ title: "Feature removed", color: "danger" });
      
      try {
        await fetch('/api/admin/features', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', id })
        });
      } catch(e) {
        setFeatures(backup);
      }
    }
  };

  const handleAddFeature = async (onClose: () => void) => {
    if (!newFeatureName.trim()) return;
    
    setIsAdding(true);
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
        setFeatures([json.data, ...features]);
        addToast({ title: "Feature added successfully", color: "success" });
        setNewFeatureName('');
        setNewFeatureDesc('');
        onClose();
      } else {
        addToast({ title: "Failed to add feature", color: "danger" });
      }
    } catch (e) {
      addToast({ title: "Network error", color: "danger" });
    } finally {
      setIsAdding(false);
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Feature Management</h1>
          <p className="text-default-500 mt-1">Configure plan permissions and global feature toggles</p>
        </div>
        
        <Button
          color="danger"
          startContent={<Plus size={18} />}
          onPress={onOpen}
          className="font-bold shadow-lg shadow-danger-500/30"
        >
          Add New Feature
        </Button>
      </header>

      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search features..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<Search size={18} className="text-default-400" />}
          className="max-w-md"
          variant="faded"
        />
      </div>

      <Card className="border-none shadow-sm bg-background/60 dark:bg-default-100/50">
        <Table 
          aria-label="Features Management Table" 
          classNames={{
              wrapper: "shadow-none border-none p-0 overflow-x-auto bg-transparent w-full max-w-[calc(100vw-32px)] md:max-w-full block",
            th: "bg-transparent text-default-500 font-semibold text-xs tracking-wider",
            td: "py-4",
          }}
          bottomContent={
            pages > 1 ? (
              <div className="flex w-full justify-center p-4 border-t border-divider/50">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="danger"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            ) : null
          }
        >
          <TableHeader>
            <TableColumn>FEATURE</TableColumn>
            <TableColumn align="center">GLOBAL STATUS</TableColumn>
            <TableColumn align="center">FREE TIER</TableColumn>
            <TableColumn align="center">PRO TIER</TableColumn>
            <TableColumn align="end">ACTIONS</TableColumn>
          </TableHeader>
          <TableBody 
            emptyContent={
              <div className="flex flex-col items-center justify-center py-10 text-default-500">
                <AlertCircle size={32} className="mb-2 opacity-50" />
                <p>No features found matching "{searchQuery}"</p>
              </div>
            }
          >
            {paginatedFeatures.map((feature) => (
              <TableRow key={feature.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <Zap size={14} className={feature.enabled ? "text-primary" : "text-default-400"} />
                      {feature.name}
                    </h3>
                    <p className="mt-1 text-xs text-default-500 max-w-[400px]">
                      {feature.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Switch 
                      isSelected={feature.enabled} 
                      onValueChange={() => toggleStatus(feature.id, 'enabled')}
                      color="success"
                      size="sm"
                    />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${feature.enabled ? 'text-success' : 'text-default-400'}`}>
                      {feature.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Button 
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => toggleStatus(feature.id, 'free_tier')}
                      isDisabled={!feature.enabled}
                      className={feature.free_tier ? 'text-success' : 'text-default-300'}
                    >
                      {feature.free_tier ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Button 
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => toggleStatus(feature.id, 'pro_tier')}
                      isDisabled={!feature.enabled}
                      className={feature.pro_tier ? 'text-primary' : 'text-default-300'}
                    >
                      {feature.pro_tier ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => deleteFeature(feature.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Add Feature Modal */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add New Feature</ModalHeader>
              <ModalBody>
                <Input
                  label="Feature Name"
                  labelPlacement="outside"
                  placeholder="e.g. 8K Streaming"
                  value={newFeatureName}
                  onValueChange={setNewFeatureName}
                  variant="faded"
                />
                
                <Input
                  label="Description"
                  labelPlacement="outside"
                  placeholder="Brief explanation of the feature"
                  value={newFeatureDesc}
                  onValueChange={setNewFeatureDesc}
                  variant="faded"
                  className="mt-4"
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button 
                  color="danger" 
                  onPress={() => handleAddFeature(onClose)}
                  isDisabled={!newFeatureName.trim()}
                  isLoading={isAdding}
                  className="font-bold shadow-lg shadow-danger-500/30"
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
