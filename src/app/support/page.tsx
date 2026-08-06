'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Textarea, addToast, Card, CardBody, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Spinner } from '@heroui/react';
import { Select, SelectItem } from '@heroui/select';
import { LifeBuoy, Plus, Clock, CheckCircle2, AlertCircle, FileText, CheckCheck, ChevronLeft } from 'lucide-react';
import { getUserTickets, createTicket, SupportTicket, TicketRequestType, addTicketMessage, TicketMessage, markMessagesRead } from '@/actions/support';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserCircle, Send } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

function getParsedMessages(ticket: SupportTicket): TicketMessage[] {
  if (!ticket.resolution) return [];
  try {
    const parsed = JSON.parse(ticket.resolution);
    if (Array.isArray(parsed)) return parsed;
    return [{ sender: 'admin', message: ticket.resolution, timestamp: ticket.resolved_at || ticket.updated_at }];
  } catch (e) {
    return [{ sender: 'admin', message: ticket.resolution, timestamp: ticket.resolved_at || ticket.updated_at }];
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open': return 'warning';
    case 'in_progress': return 'primary';
    case 'resolved': return 'success';
    case 'closed': return 'default';
    default: return 'default';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'open': return <AlertCircle size={14} />;
    case 'in_progress': return <Clock size={14} />;
    case 'resolved': return <CheckCircle2 size={14} />;
    default: return <FileText size={14} />;
  }
};

function TicketChatView({ ticket, onReplySent, onBack }: { ticket: SupportTicket, onReplySent: () => void, onBack: () => void }) {
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const supabase = createClient();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    // Mark admin messages as read when we view the ticket
    markMessagesRead(ticket.id, 'user').then(() => {
      onReplySent(); // refresh to show updated state
    });

    // Initialize Supabase channel
    const channel = supabase.channel(`ticket-${ticket.id}`)
      .on('broadcast', { event: 'new_message' }, () => {
        onReplySent(); 
        markMessagesRead(ticket.id, 'user'); // instantly mark newly arrived messages as read
      })
      .on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.payload?.sender === 'admin') {
          setIsTyping(payload.payload.isTyping);
        }
      })
      .on('broadcast', { event: 'read' }, (payload) => {
        if (payload.payload?.reader === 'admin') {
          onReplySent();
        }
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ticket.id]);

  const parsedMessages = getParsedMessages(ticket);

  useEffect(() => {
    scrollToBottom();
  }, [parsedMessages, isTyping]);

  const handleTyping = (val: string) => {
    setReplyContent(val);
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { sender: 'user', isTyping: val.length > 0 }
      });
    }
  };

  const handleSendReply = async () => {
    if (!replyContent.trim()) return;
    setIsReplying(true);
    const res = await addTicketMessage(ticket.id, replyContent, 'user');
    if (res.success) {
      if (channelRef.current) {
        channelRef.current.send({ type: 'broadcast', event: 'new_message', payload: {} });
        channelRef.current.send({ type: 'broadcast', event: 'typing', payload: { sender: 'user', isTyping: false } });
      }
      
      // Send global broadcast to admin layout
      supabase.channel('admin-global-tickets').send({
        type: 'broadcast',
        event: 'new_message',
        payload: { ticketId: ticket.id, ticketNumber: ticket.ticket_number }
      });
      
      addToast({ title: "Reply sent", color: "success" });
      setReplyContent('');
      onReplySent();
    } else {
      addToast({ title: "Failed to send reply", color: "danger" });
    }
    setIsReplying(false);
  };

  const messages = getParsedMessages(ticket);

  return (
    <Card className="bg-white/5 border border-white/5 shadow-none h-full flex flex-col">
      <CardBody className="p-0 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between md:items-center bg-white/5">
          <div className="flex items-center gap-3">
            <Button isIconOnly variant="light" size="sm" className="md:hidden" onPress={onBack}>
              <ChevronLeft size={20} />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{ticket.ticket_number}</span>
                <Chip size="sm" variant="flat" color={getStatusColor(ticket.status) as any} startContent={getStatusIcon(ticket.status)}>
                  {ticket.status.replace('_', ' ')}
                </Chip>
              </div>
              <h3 className="text-lg font-bold truncate max-w-[250px] sm:max-w-[400px]">{ticket.subject}</h3>
            </div>
          </div>
          <div className="text-xs text-muted-foreground font-medium hidden md:block">
            Submitted {new Date(ticket.created_at).toLocaleDateString()}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col space-y-4">
          {/* Initial Request */}
          <div className="flex justify-end w-full">
            <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-sm max-w-[90%] sm:max-w-[80%] shadow-md text-sm">
              <div className="flex justify-between items-center gap-4 mb-1">
                <span className="text-[11px] font-bold text-blue-100">You (Original Request)</span>
                <span className="text-[10px] opacity-70">{new Date(ticket.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <p className="whitespace-pre-wrap">{ticket.description}</p>
            </div>
          </div>

          {/* Chat History */}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 text-sm max-w-[90%] sm:max-w-[80%] shadow-md ${
                msg.sender === 'admin' 
                  ? 'bg-content2 text-foreground rounded-2xl rounded-tl-sm border border-white/5' 
                  : 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
              }`}>
                <div className="flex justify-between items-center gap-4 mb-1">
                  <span className={`text-[11px] font-bold flex items-center gap-1 ${msg.sender === 'admin' ? 'text-green-400' : 'text-blue-100'}`}>
                    {msg.sender === 'admin' && <CheckCircle2 size={12} />}
                    {msg.sender === 'admin' ? 'Support Admin' : 'You'}
                  </span>
                  <span className="text-[10px] opacity-70 flex items-center gap-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    {msg.sender === 'user' && (
                      msg.read ? <CheckCheck size={12} className="text-blue-200" /> : <CheckCircle2 size={12} className="text-white/50" />
                    )}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start w-full">
              <div className="bg-content2 text-foreground p-3 rounded-2xl rounded-tl-sm shadow-md text-sm italic opacity-70 flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                  <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                </div>
                Support Admin is typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Box */}
        <div className="p-4 border-t border-white/5 bg-background/50">
          {ticket.status !== 'closed' ? (
            <div className="flex gap-2">
              <Input 
                placeholder="Type a reply..." 
                value={replyContent}
                onValueChange={handleTyping}
                classNames={{ inputWrapper: "bg-white/5 border border-white/10" }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendReply();
                  }
                }}
              />
              <Button 
                color="primary" 
                isIconOnly 
                isLoading={isReplying} 
                isDisabled={!replyContent.trim()}
                onPress={handleSendReply}
              >
                <Send size={18} />
              </Button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center gap-2">
              <CheckCircle2 size={24} className="text-green-500/70" />
              <p className="text-sm font-medium text-foreground">This ticket is closed</p>
              <p className="text-xs text-muted-foreground">Please open a new ticket if you need further assistance.</p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

export default function UserSupportPage() {
  const queryClient = useQueryClient();
  
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newType, setNewType] = useState<TicketRequestType>('other');

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const { data: ticketsResponse, isLoading, refetch } = useQuery({
    queryKey: ['support_tickets'],
    queryFn: async () => {
      const res = await getUserTickets();
      if (!res.success) {
        addToast({ title: "Failed to load tickets: " + (res.error || "Unknown error"), color: "danger" });
        return [];
      }
      return res.data || [];
    },
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });
  
  const tickets = ticketsResponse || [];
  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  // Auto-select first ticket if none selected on desktop
  useEffect(() => {
    if (tickets.length > 0 && !selectedTicketId && window.innerWidth >= 768) {
      setSelectedTicketId(tickets[0].id);
    }
  }, [tickets, selectedTicketId]);

  const handleCreateTicket = async (onClose: () => void) => {
    if (!newSubject.trim() || !newDescription.trim()) return;
    setIsSubmitting(true);
    const res = await createTicket({
      subject: newSubject,
      description: newDescription,
      request_type: newType,
      priority: 'normal'
    });
    
    if (res.success && res.data) {
      // Send global broadcast to admin layout
      const supabase = createClient();
      supabase.channel('admin-global-tickets').send({
        type: 'broadcast',
        event: 'new_ticket',
        payload: { ticketNumber: res.data.ticket_number }
      });

      addToast({ title: "Ticket created successfully", color: "success" });
      refetch();
      setNewSubject('');
      setNewDescription('');
      setNewType('other');
      setSelectedTicketId(res.data.id); // Auto select new ticket
      onClose();
    } else {
      addToast({ title: res.error || "Failed to create ticket", color: "danger" });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto h-[calc(100vh-160px)] flex flex-col">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-2">
              <LifeBuoy className="text-red-500" />
              Support Inbox
            </h1>
            <p className="text-muted-foreground mt-1">Manage your support requests and chat with our team</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="flat" onPress={() => refetch()} startContent={<Clock size={16} />} isLoading={isLoading}>
              Refresh
            </Button>
            <Button color="danger" startContent={<Plus size={16} />} onPress={onOpen}>
              New Ticket
            </Button>
          </div>
        </div>

        {/* Main Interface */}
        <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl overflow-hidden flex shadow-xl backdrop-blur-xl">
          
          {/* List Sidebar */}
          <div className={`w-full md:w-80 lg:w-96 flex-col border-r border-white/5 ${selectedTicketId ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-white/5 font-bold text-sm tracking-widest uppercase text-muted-foreground bg-black/20">
              Your Tickets
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Spinner size="md" />
                </div>
              ) : tickets.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-3">
                  <LifeBuoy size={32} className="opacity-30" />
                  <p className="text-sm">No tickets found. Need help? Open a new ticket.</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {tickets.map(ticket => {
                    const messages = getParsedMessages(ticket);
                    const unreadUserCount = messages.filter(m => m.sender === 'admin' && !m.read).length;
                    
                    return (
                      <button
                        key={ticket.id}
                        onClick={() => setSelectedTicketId(ticket.id)}
                        className={`text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors relative ${selectedTicketId === ticket.id ? 'bg-white/10' : ''}`}
                      >
                        {selectedTicketId === ticket.id && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-r-md" />
                        )}
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <h4 className="font-bold text-sm truncate text-foreground flex-1">{ticket.subject}</h4>
                          {unreadUserCount > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0">
                              {unreadUserCount}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <Chip size="sm" variant="flat" color={getStatusColor(ticket.status) as any} className="scale-90 origin-left">
                            {ticket.status.replace('_', ' ')}
                          </Chip>
                          <span className="text-[10px] text-muted-foreground font-medium uppercase">
                            {new Date(ticket.created_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Chat Detail Area */}
          <div className={`flex-1 flex-col bg-background/50 ${!selectedTicketId ? 'hidden md:flex' : 'flex'}`}>
            {selectedTicket ? (
              <TicketChatView 
                ticket={selectedTicket} 
                onReplySent={refetch} 
                onBack={() => setSelectedTicketId(null)}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <LifeBuoy size={64} className="text-white/10 mb-4" />
                <h3 className="text-xl font-bold text-foreground">No Ticket Selected</h3>
                <p className="text-muted-foreground mt-2 max-w-sm">
                  Select a ticket from the sidebar to view the conversation and reply, or open a new ticket if you need assistance.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Modal for New Ticket */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} classNames={{ base: "bg-background border border-white/10" }}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Submit a Support Ticket</ModalHeader>
                <ModalBody>
                  <Select 
                    label="What do you need help with?"
                    selectedKeys={new Set([newType])}
                    onSelectionChange={(keys) => setNewType(Array.from(keys)[0] as TicketRequestType)}
                    classNames={{ trigger: "bg-white/5 border border-white/10" }}
                  >
                    <SelectItem key="billing">Billing Issue</SelectItem>
                    <SelectItem key="upgrade">Upgrade Request</SelectItem>
                    <SelectItem key="downgrade">Downgrade Request</SelectItem>
                    <SelectItem key="cancel">Cancellation</SelectItem>
                    <SelectItem key="other">Other / General Inquiry</SelectItem>
                  </Select>

                  <Input 
                    label="Subject"
                    placeholder="Brief summary of the issue"
                    value={newSubject}
                    onValueChange={setNewSubject}
                    classNames={{ inputWrapper: "bg-white/5 border border-white/10" }}
                  />

                  <Textarea 
                    label="Description"
                    placeholder="Provide details about your issue so we can help you faster..."
                    value={newDescription}
                    onValueChange={setNewDescription}
                    minRows={4}
                    classNames={{ inputWrapper: "bg-white/5 border border-white/10" }}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>Cancel</Button>
                  <Button color="danger" onPress={() => handleCreateTicket(onClose)} isLoading={isSubmitting} isDisabled={!newSubject.trim() || !newDescription.trim()}>
                    Submit Ticket
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
