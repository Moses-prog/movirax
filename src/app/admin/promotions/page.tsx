'use client';

import React, { useState } from 'react';
import { 
  Tag, 
  Plus, 
  Search, 
  Copy, 
  Trash2,
  Calendar,
  AlertCircle,
  Percent,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, addToast } from '@heroui/react';
import { Switch } from '@heroui/switch';
import { Select, SelectItem } from '@heroui/select';

interface Promotion {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  expiration_date: string;
  is_active: boolean;
  usage_count: number;
  max_uses: number | null;
  revenue_generated: number;
}

const mockPromotions: Promotion[] = [
  { id: 'promo_1', code: 'SUMMER25', type: 'percentage', value: 25, expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), is_active: true, usage_count: 142, max_uses: null, revenue_generated: 4260 },
  { id: 'promo_2', code: 'WELCOME10', type: 'fixed', value: 10, expiration_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), is_active: true, usage_count: 854, max_uses: null, revenue_generated: 8540 },
  { id: 'promo_3', code: 'FLASH50', type: 'percentage', value: 50, expiration_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), is_active: false, usage_count: 500, max_uses: 500, revenue_generated: 3750 },
];

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create Modal State
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<Set<string>>(new Set(['percentage']));
  const [newValue, setNewValue] = useState('');
  const [newMaxUses, setNewMaxUses] = useState('');
  const [newExpiration, setNewExpiration] = useState('');

  const filteredPromotions = promotions.filter(p => 
    p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setPromotions(promotions.map(p => p.id === id ? { ...p, is_active: !p.is_active } : p));
    addToast({ title: "Promotion status updated", color: "success" });
  };

  const deletePromotion = (id: string) => {
    setPromotions(promotions.filter(p => p.id !== id));
    addToast({ title: "Promotion deleted", color: "danger" });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    addToast({ title: "Promo code copied to clipboard", color: "default" });
  };

  const handleCreate = (onClose: () => void) => {
    if (!newCode || !newValue) return;
    
    const typeValue = Array.from(newType)[0] as 'percentage' | 'fixed';
    
    const newPromo: Promotion = {
      id: `promo_${Date.now()}`,
      code: newCode.toUpperCase(),
      type: typeValue,
      value: Number(newValue),
      expiration_date: newExpiration ? new Date(newExpiration).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
      usage_count: 0,
      max_uses: newMaxUses ? Number(newMaxUses) : null,
      revenue_generated: 0
    };
    
    setPromotions([newPromo, ...promotions]);
    
    // Reset form
    setNewCode('');
    setNewValue('');
    setNewMaxUses('');
    setNewExpiration('');
    
    addToast({ title: "Promotion created successfully", color: "success" });
    onClose();
  };

  // Stats
  const totalRevenue = promotions.reduce((acc, p) => acc + p.revenue_generated, 0);
  const totalUses = promotions.reduce((acc, p) => acc + p.usage_count, 0);
  const activeCodes = promotions.filter(p => p.is_active).length;

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="m-0 mb-1 text-3xl font-extrabold tracking-tight text-foreground">Promotions & Discounts</h1>
          <p className="m-0 text-sm font-medium text-muted-foreground">
            Create coupon codes and track marketing campaigns
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
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-background/50 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between text-muted-foreground mb-4">
            <h3 className="text-[13px] font-bold uppercase tracking-wider">Total Coupon Revenue</h3>
            <div className="rounded-lg bg-green-500/10 text-green-500 p-2"><DollarSign size={20} /></div>
          </div>
          <h2 className="text-3xl font-black text-foreground">${totalRevenue.toLocaleString()}</h2>
        </div>
        
        <div className="rounded-2xl border border-white/5 bg-background/50 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between text-muted-foreground mb-4">
            <h3 className="text-[13px] font-bold uppercase tracking-wider">Total Redemptions</h3>
            <div className="rounded-lg bg-orange-500/10 text-orange-500 p-2"><TrendingUp size={20} /></div>
          </div>
          <h2 className="text-3xl font-black text-foreground">{totalUses.toLocaleString()}</h2>
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
      </div>

      {/* Promotions Table */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-background/50 shadow-sm backdrop-blur-xl">
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            {/* Table Header */}
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_0.5fr] items-center gap-4 border-b border-white/5 bg-white/5 px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
              <div>Promo Code</div>
              <div>Discount</div>
              <div>Usage</div>
              <div>Revenue</div>
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
                const isExpired = new Date(promo.expiration_date) < new Date();
                
                return (
                  <div 
                    key={promo.id} 
                    className={`grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_0.5fr] items-center gap-4 px-6 py-5 transition-colors hover:bg-white/5 ${idx !== filteredPromotions.length - 1 ? 'border-b border-white/5' : ''}`}
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
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium mt-2">
                        <Calendar size={12} />
                        Expires: {new Date(promo.expiration_date).toLocaleDateString()}
                        {isExpired && <span className="text-red-500 ml-1">(Expired)</span>}
                      </div>
                    </div>

                    {/* Discount */}
                    <div className="flex items-center gap-2">
                      <div className={`flex size-8 items-center justify-center rounded-lg ${promo.type === 'percentage' ? 'bg-purple-500/10 text-purple-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {promo.type === 'percentage' ? <Percent size={14} /> : <DollarSign size={14} />}
                      </div>
                      <span className="text-[15px] font-black text-foreground">
                        {promo.type === 'percentage' ? `${promo.value}%` : `$${promo.value}`}
                      </span>
                    </div>

                    {/* Usage */}
                    <div>
                      <div className="text-[14px] font-bold text-foreground">
                        {promo.usage_count.toLocaleString()}
                        {promo.max_uses && <span className="text-muted-foreground font-medium text-[12px]"> / {promo.max_uses.toLocaleString()}</span>}
                      </div>
                      <div className="w-24 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="h-full bg-orange-500 rounded-full" 
                          style={{ width: promo.max_uses ? `${Math.min(100, (promo.usage_count / promo.max_uses) * 100)}%` : '100%' }}
                        />
                      </div>
                    </div>

                    {/* Revenue */}
                    <div className="text-[14px] font-bold text-foreground">
                      ${promo.revenue_generated.toLocaleString()}
                    </div>

                    {/* Status */}
                    <div className="flex justify-center">
                      <Switch 
                        isSelected={promo.is_active} 
                        onValueChange={() => toggleStatus(promo.id)}
                        color="success"
                        size="sm"
                        isDisabled={isExpired}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => deletePromotion(promo.id)}
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
                  <Select 
                    label="Discount Type"
                    selectedKeys={newType}
                    onSelectionChange={(keys) => setNewType(keys as Set<string>)}
                    className="flex-1"
                    classNames={{ trigger: "bg-white/5 border border-white/10" }}
                  >
                    <SelectItem key="percentage" startContent={<Percent size={14}/>}>Percentage</SelectItem>
                    <SelectItem key="fixed" startContent={<DollarSign size={14}/>}>Fixed Amount</SelectItem>
                  </Select>
                  
                  <Input
                    label="Value"
                    type="number"
                    placeholder="e.g. 25"
                    value={newValue}
                    onValueChange={setNewValue}
                    className="flex-1"
                    startContent={Array.from(newType)[0] === 'fixed' ? <DollarSign size={14} className="text-muted-foreground"/> : null}
                    endContent={Array.from(newType)[0] === 'percentage' ? <Percent size={14} className="text-muted-foreground"/> : null}
                    classNames={{ inputWrapper: "bg-white/5 border border-white/10 focus-within:border-red-500/50" }}
                  />
                </div>

                <div className="flex gap-4">
                  <Input
                    label="Expiration Date"
                    type="date"
                    value={newExpiration}
                    onValueChange={setNewExpiration}
                    className="flex-1"
                    classNames={{ inputWrapper: "bg-white/5 border border-white/10 focus-within:border-red-500/50" }}
                  />
                  
                  <Input
                    label="Max Uses (Optional)"
                    type="number"
                    placeholder="e.g. 100"
                    value={newMaxUses}
                    onValueChange={setNewMaxUses}
                    className="flex-1"
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
