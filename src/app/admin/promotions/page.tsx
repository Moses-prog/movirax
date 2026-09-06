'use client';

import React, { useState, useEffect } from 'react';
import { 
  Tag, 
  Plus, 
  Search, 
  Copy, 
  Trash2,
  Calendar,
  AlertCircle,
  Percent,
  TrendingUp,
  RefreshCcw
} from 'lucide-react';
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, addToast } from '@heroui/react';
import { Switch } from '@heroui/switch';
import { getPromotions, createPromotion, togglePromotionStatus, deletePromotion, Promotion } from '@/lib/promotions';

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Create Modal State
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [newCode, setNewCode] = useState('');
  const [newValue, setNewValue] = useState('');

  const loadData = async () => {
    setLoading(true);
    const data = await getPromotions();
    setPromotions(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredPromotions = promotions.filter(p => 
    p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    const success = await togglePromotionStatus(id, !currentStatus);
    if (success) {
      setPromotions(promotions.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p));
      addToast({ title: "Promotion status updated", color: "success" });
    } else {
      addToast({ title: "Failed to update promotion", color: "danger" });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this promo code?")) {
      const success = await deletePromotion(id);
      if (success) {
        setPromotions(promotions.filter(p => p.id !== id));
        addToast({ title: "Promotion deleted", color: "success" });
      } else {
        addToast({ title: "Failed to delete promotion", color: "danger" });
      }
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    addToast({ title: "Promo code copied to clipboard", color: "default" });
  };

  const handleCreate = async (onClose: () => void) => {
    if (!newCode || !newValue) return;
    
    const success = await createPromotion(newCode, Number(newValue));
    if (success) {
      addToast({ title: "Promotion created successfully", color: "success" });
      setNewCode('');
      setNewValue('');
      onClose();
      loadData();
    } else {
      addToast({ title: "Failed to create promotion. Code may already exist.", color: "danger" });
    }
  };

  // Stats
  const activeCodes = promotions.filter(p => p.is_active).length;

  if (loading) return <div className="p-8 text-center"><div className="animate-spin size-8 border-4 border-danger border-t-transparent rounded-full mx-auto" /></div>;

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="m-0 mb-1 text-3xl font-extrabold tracking-tight text-foreground">Promotions & Discounts</h1>
          <p className="m-0 text-sm font-medium text-muted-foreground">
            Create coupon codes to offer percentage discounts
          </p>
        </div>
        
        <Button
          color="danger"
          className="bg-gradient-to-r from-red-600 to-orange-500 font-bold text-white shadow-md"
          startContent={<Plus size={18} />}
          onPress={onOpen}
        >
          Create Promotion
        </Button>
      </header>

      {/* Top Metrics Grid */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-background/50 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between text-muted-foreground mb-4">
            <h3 className="text-[13px] font-bold uppercase tracking-wider">Total Promo Codes</h3>
            <div className="rounded-lg bg-orange-500/10 text-orange-500 p-2"><TrendingUp size={20} /></div>
          </div>
          <h2 className="text-3xl font-black text-foreground">{promotions.length}</h2>
        </div>

        <div className="rounded-2xl border border-white/5 bg-background/50 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between text-muted-foreground mb-4">
            <h3 className="text-[13px] font-bold uppercase tracking-wider">Active Codes</h3>
            <div className="rounded-lg bg-blue-500/10 text-blue-500 p-2"><Tag size={20} /></div>
          </div>
          <h2 className="text-3xl font-black text-foreground">{activeCodes}</h2>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 flex items-center gap-4">
        <Input
          placeholder="Search by code..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<Search size={16} className="text-muted-foreground" />}
          className="max-w-md"
          classNames={{ inputWrapper: "bg-white/5 border border-white/5 hover:bg-white/10" }}
        />
        <Button isIconOnly variant="flat" onPress={loadData}><RefreshCcw size={16} /></Button>
      </div>

      {/* Promotions Table */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-background/50 shadow-sm backdrop-blur-xl">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Table Header */}
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_0.5fr] items-center gap-4 border-b border-white/5 bg-white/5 px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
              <div>Promo Code</div>
              <div>Discount</div>
              <div>Created Date</div>
              <div className="text-center">Status</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Table Body */}
            {filteredPromotions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <AlertCircle className="mb-3 size-10 text-muted-foreground/50" />
                <p className="text-sm font-medium text-muted-foreground">No promotions found</p>
              </div>
            ) : (
              filteredPromotions.map((promo, idx) => {
                return (
                  <div 
                    key={promo.id} 
                    className={`grid grid-cols-[1.5fr_1fr_1fr_1fr_0.5fr] items-center gap-4 px-6 py-5 transition-colors hover:bg-white/5 ${idx !== filteredPromotions.length - 1 ? 'border-b border-white/5' : ''}`}
                  >
                    {/* Code */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="flex items-center gap-1.5 rounded bg-white/10 px-2 py-1 text-[14px] font-black tracking-widest text-foreground font-mono">
                          {promo.code}
                          <button onClick={() => copyCode(promo.code)} className="text-muted-foreground hover:text-foreground ml-1">
                            <Copy size={12} />
                          </button>
                        </span>
                      </div>
                    </div>

                    {/* Discount */}
                    <div className="flex items-center gap-2">
                      <div className={`flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500`}>
                        <Percent size={14} />
                      </div>
                      <span className="text-[15px] font-black text-foreground">
                        {promo.discount_percent}%
                      </span>
                    </div>

                    {/* Created */}
                    <div className="flex items-center gap-1.5 text-[12px] font-medium text-foreground">
                      <Calendar size={14} className="text-muted-foreground" />
                      {new Date(promo.created_at).toLocaleDateString()}
                    </div>

                    {/* Status */}
                    <div className="flex justify-center">
                      <Switch 
                        isSelected={promo.is_active} 
                        onValueChange={() => toggleStatus(promo.id, promo.is_active)}
                        color="success"
                        size="sm"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDelete(promo.id)}
                        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Create Modal */}
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
              <ModalHeader className="flex flex-col gap-1 text-foreground">Create Promotion</ModalHeader>
              <ModalBody className="py-6 flex flex-col gap-4">
                <Input
                  label="Promo Code"
                  placeholder="e.g. SUMMER2024"
                  value={newCode}
                  onValueChange={(val) => setNewCode(val.toUpperCase())}
                  classNames={{ inputWrapper: "bg-white/5 border border-white/10 focus-within:border-red-500/50 uppercase font-mono" }}
                />
                
                <div className="flex gap-4">
                  <Input
                    label="Discount Percentage"
                    type="number"
                    placeholder="e.g. 25"
                    value={newValue}
                    onValueChange={setNewValue}
                    className="flex-1"
                    endContent={<Percent size={14} className="text-muted-foreground"/>}
                    classNames={{ inputWrapper: "bg-white/5 border border-white/10 focus-within:border-red-500/50" }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button 
                  color="danger" 
                  onPress={() => handleCreate(onClose)}
                  className="bg-gradient-to-r from-red-600 to-orange-500 font-bold text-white shadow-md"
                  isDisabled={!newCode || !newValue}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
