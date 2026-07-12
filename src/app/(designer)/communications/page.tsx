'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Mail,
  Send,
  MessageSquare,
  Phone,
  FileText,
  Users,
  Calendar,
  Sparkles,
  Inbox,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
}

interface CommLog {
  id: string;
  type: string;
  direction: string;
  subject: string | null;
  content: string;
  createdAt: string;
  client: { firstName: string; lastName: string };
  order: { orderNumber: string } | null;
}

const TEMPLATES = [
  {
    id: 'deposit',
    name: 'Deposit Payment Request',
    subject: 'Deposit Invoice: Starting Work on Your Custom Order',
    body: (clientName: string) => `Dear ${clientName},\n\nWe are excited to begin crafting your bespoke garment! To initiate fabric sourcing and pattern draping, we require a 50% deposit.\n\nYou can log into your Client Portal to download the invoice and check the details. Please let us know once the payment has been arranged.\n\nWarmest regards,\nTimi Classic Bespoke`
  },
  {
    id: 'fitting',
    name: 'First Fitting Invitation',
    subject: 'Invitation: First Fitting Session',
    body: (clientName: string) => `Dear ${clientName},\n\nYour custom garment has progressed to the fitting phase! We are ready to schedule your first fitting session to make necessary adjustments.\n\nPlease let us know your availability this week so we can secure an appointment for you.\n\nBest regards,\nTimi Classic Bespoke`
  },
  {
    id: 'measurements',
    name: 'Measurement Verification',
    subject: 'Action Required: Verifying Body Measurements',
    body: (clientName: string) => `Dear ${clientName},\n\nTo ensure an absolute, tailored fit for your custom garment, we need to double check a few measurements. You can review your currently logged measurement stats inside the Client Portal.\n\nPlease reply with any updates or confirm your measurements so we can proceed safely to cutting.\n\nWarmest regards,\nTimi Classic Bespoke`
  },
  {
    id: 'pickup',
    name: 'Garment Ready for Collection',
    subject: 'Exciting News: Your Timiclassic Garment is Ready!',
    body: (clientName: string) => `Dear ${clientName},\n\nWe have completed all final quality checks, and your custom garment is ready for collection! We are absolutely thrilled with the result and can't wait for you to wear it.\n\nPlease let us know when you plan to stop by, or confirm your delivery address.\n\nWith gratitude,\nTimi Classic Bespoke`
  }
];

export default function CommunicationsHub() {
  const { data: session } = useSession();
  const myId = (session?.user as any)?.id;
  const isStaff = (session?.user as any)?.role === 'STAFF';
  
  const [activeTab, setActiveTab] = useState<'CLIENT' | 'INTERNAL'>(isStaff ? 'INTERNAL' : 'CLIENT');
  
  const [comms, setComms] = useState<CommLog[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  // Internal chat states
  const [internalPeers, setInternalPeers] = useState<{id: string, name: string, role: string}[]>([]);
  const [selectedPeerId, setSelectedPeerId] = useState('');
  const [internalMessages, setInternalMessages] = useState<any[]>([]);
  const [internalContent, setInternalContent] = useState('');
  const [loadingInternal, setLoadingInternal] = useState(false);

  // Send message form states
  const [selectedClientId, setSelectedClientId] = useState('');
  const [commType, setCommType] = useState('EMAIL'); // EMAIL, WHATSAPP, PHONE, SMS, NOTE
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);

  const fetchComms = async () => {
    try {
      const [commsRes, clientsRes] = await Promise.all([
        fetch('/api/communications'),
        fetch('/api/clients'),
      ]);
      if (commsRes.ok && clientsRes.ok) {
        setComms(await commsRes.json());
        setClients(await clientsRes.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComms();
  }, []);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    if (!templateId) return;

    const matchedClient = clients.find((c) => c.id === selectedClientId);
    const clientName = matchedClient ? `${matchedClient.firstName} ${matchedClient.lastName}` : 'Valued Client';

    const tpl = TEMPLATES.find((t) => t.id === templateId);
    if (tpl) {
      setSubject(tpl.subject);
      setContent(tpl.body(clientName));
      setCommType('EMAIL'); // Force email if template is loaded
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || !content) return;
    setSending(true);

    try {
      const res = await fetch('/api/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: selectedClientId,
          type: commType,
          direction: 'OUTBOUND',
          subject: commType === 'EMAIL' ? subject : undefined,
          content,
        }),
      });

      if (res.ok) {
        setSelectedClientId('');
        setSubject('');
        setContent('');
        // Reset template dropdown
        const select = document.getElementById('template-select') as HTMLSelectElement;
        if (select) select.value = '';
        
        toast.success('Message sent successfully!');
        fetchComms();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to record communication log');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const fetchInternalPeers = async () => {
    try {
      const res = await fetch('/api/internal-messages');
      if (res.ok) {
        const data = await res.json();
        setInternalPeers(data.peers || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInternalMessages = async (peerId: string) => {
    if (!peerId) return;
    setLoadingInternal(true);
    try {
      const res = await fetch(`/api/internal-messages?peerId=${peerId}`);
      if (res.ok) {
        const data = await res.json();
        setInternalMessages(data.messages || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInternal(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'INTERNAL') {
      fetchInternalPeers();
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedPeerId) {
      fetchInternalMessages(selectedPeerId);
    }
  }, [selectedPeerId]);

  const handleSendInternal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPeerId || !internalContent.trim()) return;
    setSending(true);
    try {
      const res = await fetch('/api/internal-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: selectedPeerId, content: internalContent }),
      });
      if (res.ok) {
        setInternalContent('');
        fetchInternalMessages(selectedPeerId);
      } else {
        toast.error('Failed to send message');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'EMAIL':
        return <Mail className="w-4 h-4 text-[#d4af37]" />;
      case 'WHATSAPP':
      case 'SMS':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'PHONE':
        return <Phone className="w-4 h-4 text-blue-400" />;
      default:
        return <FileText className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-serif text-[#f5f5f0] tracking-wide">Communication Hub</h1>
        <p className="text-xs text-[#8e8e88] uppercase tracking-widest mt-1">
          Coordinate custom updates and collaborate with your team
        </p>
      </div>

      <div className="flex items-center gap-4 border-b border-[#1f1b12] pb-2">
        {!isStaff && (
          <button 
            onClick={() => setActiveTab('CLIENT')}
            className={`text-xs uppercase tracking-widest font-bold pb-2 border-b-2 transition-all cursor-pointer ${activeTab === 'CLIENT' ? 'text-[#d4af37] border-[#d4af37]' : 'text-[#8e8e88] border-transparent hover:text-[#f5f5f0]'}`}
          >
            Client Comms
          </button>
        )}
        <button 
          onClick={() => setActiveTab('INTERNAL')}
          className={`text-xs uppercase tracking-widest font-bold pb-2 border-b-2 transition-all cursor-pointer ${activeTab === 'INTERNAL' ? 'text-[#d4af37] border-[#d4af37]' : 'text-[#8e8e88] border-transparent hover:text-[#f5f5f0]'}`}
        >
          Internal Team Chat
        </button>
      </div>

      {(!isStaff && activeTab === 'CLIENT') ? (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        {/* Left column: compose form */}
        <div className="bg-[#111] border border-[#1f1b12] rounded-xl p-6 h-[550px] overflow-y-auto">
          <h3 className="text-xs uppercase tracking-widest font-bold text-[#d4af37] border-b border-[#1f1b12]/50 pb-2 mb-4">
            Compose Message
          </h3>

          <form onSubmit={handleSend} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Select Client</label>
              <select
                required
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full luxury-input"
              >
                <option value="">-- Choose recipient --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName} ({c.email || 'No email'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Select Email Template</label>
              <select
                id="template-select"
                disabled={!selectedClientId}
                onChange={handleTemplateChange}
                className="w-full luxury-input disabled:opacity-50"
              >
                <option value="">-- Populate with template --</option>
                {TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Medium</label>
                <select
                  value={commType}
                  onChange={(e) => setCommType(e.target.value)}
                  className="w-full luxury-input"
                >
                  <option value="EMAIL">Email</option>
                  <option value="NOTE">Internal Note</option>
                </select>
              </div>
            </div>

            {commType === 'EMAIL' && (
              <div>
                <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full luxury-input"
                  placeholder="e.g. Setting up dress measurements fitting"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Content</label>
              <textarea
                rows={6}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full luxury-input resize-none font-sans"
                placeholder="Draft message content..."
              />
            </div>

            <button
              type="submit"
              disabled={sending || !selectedClientId}
              className="w-full luxury-btn-primary flex items-center justify-center gap-1.5 uppercase tracking-widest py-3 mt-2 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {sending ? 'Sending logs...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Right pane: list log history */}
        <div className="lg:col-span-2 bg-[#111] border border-[#1f1b12] rounded-xl p-6 h-[550px] overflow-y-auto">
          <h3 className="text-xs uppercase tracking-widest font-bold text-[#d4af37] border-b border-[#1f1b12]/50 pb-2 mb-4">
            Recent Communications Log
          </h3>

          {loading ? (
            <div className="text-center py-12 text-xs text-[#8e8e88] uppercase tracking-widest animate-pulse">Loading histories...</div>
          ) : comms.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#8e8e88] italic">No communication logs recorded.</div>
          ) : (
            <div className="space-y-4">
              {comms.map((comm) => (
                <div key={comm.id} className="border border-[#1f1b12]/60 rounded-lg p-4 bg-[#161616] space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(comm.type)}
                      <span className="font-semibold uppercase tracking-wider text-[#f5f5f0]">
                        {comm.type} Log to {comm.client.firstName} {comm.client.lastName}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#8e8e88] font-mono">
                      {new Date(comm.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {comm.subject && (
                    <p className="text-[11px] text-[#d4af37] font-semibold">Subject: {comm.subject}</p>
                  )}
                  <p className="text-[#8e8e88] leading-relaxed whitespace-pre-wrap pl-6 italic">
                    {comm.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        {/* Left: Chat list / Compose */}
        <div className="bg-[#111] border border-[#1f1b12] rounded-xl p-6 h-[550px] flex flex-col">
          <h3 className="text-xs uppercase tracking-widest font-bold text-[#d4af37] border-b border-[#1f1b12]/50 pb-2 mb-4 shrink-0">
            Select Team Member
          </h3>
          <select 
            value={selectedPeerId}
            onChange={(e) => setSelectedPeerId(e.target.value)}
            className="w-full luxury-input mb-6 shrink-0"
          >
            <option value="">-- Choose team member --</option>
            {internalPeers.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.name || (p.role === 'ADMIN' ? 'System Admin' : p.email || 'Unnamed Staff')} ({p.role})
              </option>
            ))}
          </select>

          {selectedPeerId ? (
            <form onSubmit={handleSendInternal} className="mt-auto space-y-4 shrink-0 border-t border-[#1f1b12]/50 pt-4">
              <div>
                <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={internalContent}
                  onChange={(e) => setInternalContent(e.target.value)}
                  className="w-full luxury-input resize-none font-sans"
                  placeholder="Type a message to your team member..."
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full luxury-btn-primary flex items-center justify-center gap-1.5 uppercase tracking-widest py-3 mt-2 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-[#8e8e88] italic text-center">
              Please select a team member from the dropdown above to start chatting.
            </div>
          )}
        </div>

        {/* Right: Chat History */}
        <div className="lg:col-span-2 bg-[#111] border border-[#1f1b12] rounded-xl p-6 h-[550px] flex flex-col space-y-4">
          <h3 className="text-xs uppercase tracking-widest font-bold text-[#d4af37] border-b border-[#1f1b12]/50 pb-2 shrink-0">
            Chat History
          </h3>
          
          {!selectedPeerId ? (
             <div className="flex-1 flex items-center justify-center text-xs text-[#8e8e88] italic">Select a team member to view chat history.</div>
          ) : loadingInternal ? (
             <div className="flex-1 flex items-center justify-center text-xs text-[#8e8e88] animate-pulse">Loading messages...</div>
          ) : internalMessages.length === 0 ? (
             <div className="flex-1 flex items-center justify-center text-xs text-[#8e8e88] italic">No messages yet. Say hello!</div>
          ) : (
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 pb-4">
              {internalMessages.map((msg) => {
                const isMine = msg.senderId === myId;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} gap-1 text-xs`}>
                    <span className="text-[9px] uppercase tracking-widest text-[#8e8e88] px-1">
                      {isMine ? 'You' : msg.sender.name} • {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    <div className={`p-3 rounded-xl max-w-[80%] ${isMine ? 'bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#f5f5f0]' : 'bg-[#161616] border border-[#1f1b12] text-[#8e8e88]'}`}>
                      {msg.content}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
