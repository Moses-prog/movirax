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
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner
} from '@heroui/react';
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

  return (
    <div className="mx-auto max-w-7xl flex flex-col gap-6 pb-10">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Promotions & Discounts</h1>
          <p className="text-default-500 mt-1">
            Create coupon codes to offer percentage discounts
          </p>
        </div>
        
        <Button
          color="danger"
          startContent={<Plus size={18} />}
          onPress={onOpen}
        >
          Create Promotion
        </Button>
      </header>

      {/* Top Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm bg-background/60 dark:bg-default-100/50">
          <CardBody className="p-6">
            <div className="flex items-center justify-between text-default-500 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider">Total Promo Codes</h3>
              <div className="rounded-lg bg-default-100 text-foreground p-2"><TrendingUp size={20} /></div>
            </div>
            <h2 className="text-3xl font-black text-foreground">{promotions.length}</h2>
          </CardBody>
        </Card>

        <Card className="border-none shadow-sm bg-background/60 dark:bg-default-100/50">
          <CardBody className="p-6">
            <div className="flex items-center justify-between text-default-500 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider">Active Codes</h3>
              <div className="rounded-lg bg-default-100 text-foreground p-2"><Tag size={20} /></div>
            </div>
            <h2 className="text-3xl font-black text-foreground">{activeCodes}</h2>
          </CardBody>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by code..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<Search size={16} className="text-default-400" />}
          className="max-w-md"
          variant="faded"
        />
        <Button isIconOnly variant="flat" onPress={loadData}><RefreshCcw size={16} /></Button>
      </div>

      {/* Promotions Table */}
      <Card className="border-none shadow-sm bg-background/60 dark:bg-default-100/50">
        <Table 
          aria-label="Promotions table"
          removeWrapper
          classNames={{
            th: "bg-transparent text-default-500 uppercase text-xs font-bold",
            td: "py-4",
          }}
          children={[
            <TableHeader key="header" children={[
              <TableColumn key="code" children="PROMO CODE" />,
              <TableColumn key="discount" children="DISCOUNT" />,
              <TableColumn key="created" children="CREATED DATE" />,
              <TableColumn key="status" align="center" children="STATUS" />,
              <TableColumn key="actions" align="end" children="ACTIONS" />
            ]} />,
            <TableBody key="body"
              emptyContent={loading ? <Spinner color="danger" /> : "No promotions found"}
              items={filteredPromotions}
              isLoading={loading}
              children={(promo) => (
                <TableRow key={promo.id} className="border-b border-divider last:border-b-0 hover:bg-default-100/50 transition-colors" children={[
                  <TableCell key="cell-code" children={
                    <span className="flex items-center gap-1.5 w-fit rounded bg-default-100 px-2 py-1 text-[14px] font-black tracking-widest text-foreground font-mono">
                      {promo.code}
                      <button onClick={() => copyCode(promo.code)} className="text-default-400 hover:text-foreground ml-1 transition-colors">
                        <Copy size={12} />
                      </button>
                    </span>
                  } />,
                  <TableCell key="cell-discount" children={
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Percent size={14} />
                      </div>
                      <span className="text-[15px] font-black text-foreground">
                        {promo.discount_percent}%
                      </span>
                    </div>
                  } />,
                  <TableCell key="cell-created" children={
                    <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                      <Calendar size={14} className="text-default-400" />
                      {new Date(promo.created_at).toLocaleDateString()}
                    </div>
                  } />,
                  <TableCell key="cell-status" children={
                    <div className="flex justify-center">
                      <Switch 
                        isSelected={promo.is_active} 
                        onValueChange={() => toggleStatus(promo.id, promo.is_active)}
                        color="success"
                        size="sm"
                      />
                    </div>
                  } />,
                  <TableCell key="cell-actions" children={
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDelete(promo.id)}
                        className="flex size-8 items-center justify-center rounded-lg text-default-400 transition-colors hover:bg-danger/10 hover:text-danger"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  } />
                ]} />
              )}
            />
          ]}
        />
      </Card>

      {/* Create Modal */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        backdrop="blur"
        children={
          <ModalContent children={(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-foreground" children="Create Promotion" />
              <ModalBody className="py-6 flex flex-col gap-4" children={[
                <Input
                  key="code-input"
                  label="Promo Code"
                  placeholder="e.g. SUMMER2024"
                  value={newCode}
                  onValueChange={(val) => setNewCode(val.toUpperCase())}
                  variant="faded"
                  classNames={{ input: "uppercase font-mono font-bold tracking-wider" }}
                />,
                <Input
                  key="value-input"
                  label="Discount Percentage"
                  type="number"
                  placeholder="e.g. 25"
                  value={newValue}
                  onValueChange={setNewValue}
                  variant="faded"
                  endContent={<Percent size={14} className="text-default-400"/>}
                />
              ]} />
              <ModalFooter children={[
                <Button key="cancel" variant="light" onPress={onClose} children="Cancel" />,
                <Button key="create"
                  color="danger" 
                  onPress={() => handleCreate(onClose)}
                  isDisabled={!newCode || !newValue}
                  children="Create"
                />
              ]} />
            </>
          )} />
        }
      />
    </div>
  );
}
