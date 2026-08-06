'use client';

import React, { useEffect, useState } from 'react';
import { 
  LifeBuoy, 
  Search, 
  Filter, 
  UserCircle, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  MoreVertical,
  Paperclip,
  MessageSquare,
  CheckCheck
} from 'lucide-react';
import { Button, Input, Textarea, Avatar, addToast, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Spinner } from '@heroui/react';
import { Switch } from '@heroui/switch';
import { Select, SelectItem } from '@heroui/select';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { 
  getAdminFeatures,
  getAllTickets,
  SupportTicket, 
  TicketStatus, 
  updateTicketStatus,
  addTicketMessage,
  TicketMessage,
  markMessagesRead
} from "@/actions/support";
import { createClient } from "@/utils/supabase/client";
import { useRef } from 'react';

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Reply/Resolution State
  const [resolutionContent, setResolutionContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const supabase = createClient();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    fetchTickets(true);
    
    // Poll for new messages every 10 seconds
    const interval = setInterval(() => {
      fetchTickets(false);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchTickets = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    const res = await getAllTickets();
    if (res.success && res.data) {
      setTickets(res.data);
      // Only set initial selected ticket if we don't have one and we're showing loading
      if (showLoading && res.data.length > 0 && !selectedTicketId) {
        setSelectedTicketId(res.data[0].id);
      }
    } else if (showLoading) {
      addToast({ title: "Failed to load tickets: " + (res.error || "Unknown error"), color: "danger" });
    }
    if (showLoading) setIsLoading(false);
  };

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  // When selected ticket changes, clear the resolution box
  useEffect(() => {
    if (selectedTicket) {
      setResolutionContent('');
    }
  }, [selectedTicket?.id]);

  // Realtime channel for the currently selected ticket
  useEffect(() => {
    if (!selectedTicketId) return;
    
    // Mark messages as read when viewing
    markMessagesRead(selectedTicketId, 'admin').then(() => {
      fetchTickets(false); // refresh to show updated state
    });

    const channel = supabase.channel(`ticket-${selectedTicketId}`)
      .on('broadcast', { event: 'new_message' }, () => {
        fetchTickets(false);
        markMessagesRead(selectedTicketId, 'admin'); // mark new arrivals as read
      })
      .on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.payload?.sender === 'user') {
          setIsTyping(payload.payload.isTyping);
        }
      })
      .on('broadcast', { event: 'read' }, (payload) => {
        if (payload.payload?.reader === 'user') {
          fetchTickets(false);
        }
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      setIsTyping(false); // reset on unmount
    };
  }, [selectedTicketId]);

  const handleTyping = (val: string) => {
    setResolutionContent(val);
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { sender: 'admin', isTyping: val.length > 0 }
      });
    }
  };

  const filteredTickets = tickets.filter(t => {
    const userName = t.user_profiles?.name || t.auth_users?.email || 'Unknown User';
    const matchesSearch = userName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.ticket_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'in_progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'resolved': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'closed': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default: return 'bg-white/10 text-white/50 border-white/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle size={14} />;
      case 'in_progress': return <Clock size={14} />;
      case 'resolved':
      case 'closed': return <CheckCircle2 size={14} />;
      default: return <LifeBuoy size={14} />;
    }
  };

  const getTypeLabel = (type: string) => {
    return type.replace('_', ' ');
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: TicketStatus) => {
    const res = await updateTicketStatus(ticketId, newStatus);
    if (res.success) {
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
      addToast({ title: `Ticket status updated to ${newStatus.replace('_', ' ')}`, color: 'success' });
    } else {
      addToast({ title: "Failed to update status", color: "danger" });
    }
  };

  const handleSendResolution = async (isResolve: boolean) => {
    if (!resolutionContent.trim() || !selectedTicket) return;
    
    setIsSending(true);
    const res = await addTicketMessage(selectedTicket.id, resolutionContent, 'admin', isResolve);
    
    if (res.success && res.data) {
      if (channelRef.current) {
        channelRef.current.send({ type: 'broadcast', event: 'new_message', payload: {} });
        channelRef.current.send({ type: 'broadcast', event: 'typing', payload: { sender: 'admin', isTyping: false } });
      }
      setTickets(tickets.map(t => {
        if (t.id === selectedTicket.id) {
          return { ...t, resolution: res.data.resolution, status: res.data.status };
        }
        return t;
      }));
      setResolutionContent(""); // clear input after sending
      
      addToast({ 
        title: isResolve ? "Resolution saved and ticket resolved" : "Reply sent to user", 
        color: "success" 
      });
    } else {
      addToast({ title: isResolve ? "Failed to save resolution" : "Failed to send reply", color: "danger" });
    }
    
    setIsSending(false);
  };
  
  // Helper to parse messages
  const getParsedMessages = (ticket: SupportTicket): TicketMessage[] => {
    if (!ticket.resolution) return [];
    try {
      const parsed = JSON.parse(ticket.resolution);
      if (Array.isArray(parsed)) return parsed;
      return [{ sender: 'admin', message: ticket.resolution, timestamp: ticket.resolved_at || ticket.updated_at }];
    } catch (e) {
      return [{ sender: 'admin', message: ticket.resolution, timestamp: ticket.resolved_at || ticket.updated_at }];
    }
  };

  const parsedMessages = selectedTicket ? getParsedMessages(selectedTicket) : [];

  useEffect(() => {
    scrollToBottom();
  }, [parsedMessages, isTyping]);

  return (
    <div className="mx-auto max-w-7xl h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="m-0 mb-1 text-3xl font-extrabold tracking-tight text-foreground">Support Tickets</h1>
          <p className="m-0 text-sm font-medium text-muted-foreground">
            Manage user inquiries, upgrades, and cancellations
          </p>
        </div>
        <Button variant="flat" onPress={fetchTickets} startContent={<Clock size={16} />}>
          Refresh
        </Button>
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Group orientation="horizontal" className="w-full h-full">
          {/* Left Column: Ticket List */}
          <Panel defaultSize={35} minSize={5} className="flex flex-col rounded-2xl border border-white/5 bg-background/95 p-4 shadow-sm min-w-0">
            <Group orientation="vertical" className="w-full h-full">
              {/* Filters */}
              <Panel defaultSize={20} minSize={15} maxSize={40} className="flex flex-col gap-3">
                <Input
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  startContent={<Search size={16} className="text-muted-foreground" />}
                  classNames={{ inputWrapper: "bg-white/5 border border-white/5" }}
                />
                <Select 
                  selectedKeys={new Set([statusFilter])}
                  onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
                  aria-label="Filter by status"
                  startContent={<Filter size={16} className="text-muted-foreground" />}
                  classNames={{ trigger: "bg-white/5 border border-white/5" }}
                >
                  <SelectItem key="all">All Statuses</SelectItem>
                  <SelectItem key="open">Open</SelectItem>
                  <SelectItem key="in_progress">In Progress</SelectItem>
                  <SelectItem key="resolved">Resolved</SelectItem>
                  <SelectItem key="closed">Closed</SelectItem>
                </Select>
              </Panel>

              <Separator className="h-4 flex items-center justify-center group cursor-row-resize relative z-10">
                <div className="w-12 h-1 rounded-full bg-white/10 group-hover:bg-red-500/50 transition-colors flex items-center justify-center" />
              </Separator>

              {/* List */}
              <Panel defaultSize={80} minSize={30} className="flex flex-col">
                <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                  {isLoading ? (
                    <div className="flex justify-center py-10">
                      <Spinner />
                    </div>
                  ) : filteredTickets.length === 0 ? (
                    <div className="py-10 text-center text-sm text-muted-foreground">
                      No tickets found.
                    </div>
                  ) : (
                    filteredTickets.map(ticket => (
                      <button
                        key={ticket.id}
                        onClick={() => setSelectedTicketId(ticket.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          selectedTicketId === ticket.id 
                            ? 'border-red-500/50 bg-red-500/5' 
                            : 'border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(ticket.status)}`}>
                            {getStatusIcon(ticket.status)}
                            {ticket.status.replace('_', ' ')}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-medium">
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-[14px] font-bold text-foreground truncate mb-1">{ticket.subject}</h4>
                        <p className="text-[12px] text-muted-foreground truncate mb-3">
                          {ticket.user_profiles?.name || ticket.auth_users?.email || 'Unknown User'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded capitalize">
                            {getTypeLabel(ticket.request_type)}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </Panel>
            </Group>
          </Panel>

          <Separator className="w-4 flex items-center justify-center group cursor-col-resize hidden md:flex relative z-10">
            <div className="h-12 w-1 rounded-full bg-white/10 group-hover:bg-red-500/50 transition-colors flex items-center justify-center" />
          </Separator>

          {/* Right Column: Ticket Detail */}
          <Panel defaultSize={65} minSize={5} className="flex flex-col rounded-2xl border border-white/5 bg-background/50 shadow-sm overflow-hidden min-w-0">
          {selectedTicket ? (
            <Group orientation="vertical" className="w-full h-full">
              {/* Detail Header */}
              <Panel defaultSize={20} minSize={15} className="flex flex-col">
                <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 border-b border-white/5 bg-white/5 overflow-y-auto custom-scrollbar">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-foreground">{selectedTicket.subject}</h2>
                      <span className="text-[12px] font-bold text-muted-foreground uppercase">{selectedTicket.ticket_number}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-foreground font-medium">
                        <UserCircle size={16} className="text-muted-foreground" />
                        {selectedTicket.user_profiles?.name || 'Unknown User'}
                        <span className="text-muted-foreground font-normal">({selectedTicket.auth_users?.email || 'No email'})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Select 
                      selectedKeys={new Set([selectedTicket.status])}
                      onSelectionChange={(keys) => handleUpdateStatus(selectedTicket.id, Array.from(keys)[0] as TicketStatus)}
                      aria-label="Status"
                      size="sm"
                      className="w-[140px]"
                      classNames={{ trigger: "bg-background border border-white/10" }}
                    >
                      <SelectItem key="open" startContent={<AlertCircle size={14} className="text-orange-500" />}>Open</SelectItem>
                      <SelectItem key="in_progress" startContent={<Clock size={14} className="text-blue-500" />}>In Progress</SelectItem>
                      <SelectItem key="resolved" startContent={<CheckCircle2 size={14} className="text-green-500" />}>Resolved</SelectItem>
                      <SelectItem key="closed" startContent={<CheckCircle2 size={14} className="text-gray-500" />}>Closed</SelectItem>
                    </Select>
                  </div>
                </div>
              </Panel>

              <Separator className="h-4 flex items-center justify-center group cursor-row-resize relative z-10">
                <div className="w-12 h-1 rounded-full bg-white/10 group-hover:bg-red-500/50 transition-colors flex items-center justify-center" />
              </Separator>

              {/* Ticket Description */}
              <Panel defaultSize={50} minSize={20} className="flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col custom-scrollbar bg-background/50">
                  <div className="flex justify-start w-full">
                    <div className="bg-content2 text-foreground border border-white/5 rounded-2xl rounded-tl-sm p-3 max-w-[90%] sm:max-w-[80%] shadow-md text-sm">
                      <div className="flex justify-between items-center gap-4 mb-1">
                        <span className="text-[11px] font-bold text-blue-400 flex items-center gap-1">
                          <UserCircle size={12} /> User Original Request
                        </span>
                        <span className="text-[10px] opacity-70">{new Date(selectedTicket.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">
                        {selectedTicket.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Render parsed messages if any exist */}
                  {getParsedMessages(selectedTicket).map((msg, idx) => (
                    <div key={idx} className={`flex w-full ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 text-sm max-w-[90%] sm:max-w-[80%] shadow-md ${
                        msg.sender === 'admin' 
                          ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm' 
                          : 'bg-content2 text-foreground rounded-2xl rounded-tl-sm border border-white/5'
                      }`}>
                        <div className="flex justify-between items-center gap-4 mb-1">
                          <span className={`text-[11px] font-bold flex items-center gap-1 ${
                            msg.sender === 'admin' ? 'text-green-100' : 'text-blue-400'
                          }`}>
                            {msg.sender === 'admin' && <CheckCircle2 size={12} />}
                            {msg.sender === 'admin' ? 'You (Admin)' : 'User Reply'}
                          </span>
                          <span className="text-[10px] opacity-70 flex items-center gap-1">
                            {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            {msg.sender === 'admin' && (
                              msg.read ? <CheckCheck size={12} className="text-blue-200" /> : <CheckCircle2 size={12} className="text-white/50" />
                            )}
                          </span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start w-full">
                      <div className="bg-content2 text-foreground p-3 rounded-2xl rounded-tl-sm shadow-md text-sm italic opacity-70 flex items-center gap-2 border border-white/5">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                          <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                        </div>
                        User is typing...
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </Panel>

              <Separator className="h-4 flex items-center justify-center group cursor-row-resize relative z-10">
                <div className="w-12 h-1 rounded-full bg-white/10 group-hover:bg-red-500/50 transition-colors flex items-center justify-center" />
              </Separator>

              {/* Resolution Area */}
              <Panel defaultSize={30} minSize={20} className="flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 border-t border-white/5 bg-background/50 flex flex-col gap-3 custom-scrollbar">
                  <Textarea 
                    placeholder="Provide a resolution to the user's issue..."
                    value={resolutionContent}
                    onValueChange={handleTyping}
                    minRows={3}
                    maxRows={8}
                    classNames={{ 
                      inputWrapper: "bg-white/5 border-white/10 focus-within:border-green-500/50"
                    }}
                  />
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="text-xs text-muted-foreground">
                      Reply leaves the ticket open. Resolve will close it.
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <Button 
                        color="primary" 
                        className="font-bold text-white bg-blue-600"
                        onPress={() => handleSendResolution(false)}
                        isLoading={isSending}
                        isDisabled={!resolutionContent.trim()}
                      >
                        Reply Message
                      </Button>
                      <Button 
                        color="success" 
                        className="font-bold text-white bg-green-600"
                        endContent={<Send size={16} />}
                        onPress={() => handleSendResolution(true)}
                        isLoading={isSending}
                        isDisabled={!resolutionContent.trim()}
                      >
                        Resolve Ticket
                      </Button>
                    </div>
                  </div>
                </div>
              </Panel>
            </Group>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center p-8">
              <MessageSquare className="mb-4 size-16 text-muted-foreground/30" />
              <h2 className="text-xl font-bold text-foreground">Select a ticket</h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">Choose a ticket from the list to view its details, provide a resolution, or assign it to an administrator.</p>
            </div>
          )}
          </Panel>
        </Group>
      </div>
    </div>
  );
}
