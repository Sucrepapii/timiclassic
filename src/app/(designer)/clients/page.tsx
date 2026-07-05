'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Scissors,
  Mail,
  Phone,
  MapPin,
  FileText,
  Clock,
  ChevronRight,
  Sparkles,
  Camera,
  Trash2,
  Calendar,
  X,
  Download,
  Edit2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  measurements: any; // { sets: [ { date: string, chest: number, waist: number, hips: number, length: number, shoulder: number, custom: string } ] }
  orders: { id: string; orderNumber: string; status: string; totalAmount: number; dueDate: string }[];
  communications: { id: string; type: string; direction: string; subject: string; content: string; createdAt: string }[];
  createdAt: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();
  const isStaff = (session?.user as any)?.role === 'STAFF';

  // Modals / forms states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMeasureModalOpen, setIsMeasureModalOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  
  // Custom Confirmation Modal
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  
  const [addForm, setAddForm] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', notes: '' });
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', notes: '' });
  const [measureForm, setMeasureForm] = useState({ chest: '', waist: '', hips: '', shoulder: '', sleeve: '', custom: '' });
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchClients = async () => {
    try {
      const res = await fetch(`/api/clients?search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setClients(data);
        // Sync selected client if it was loaded
        if (selectedClientId) {
          const matched = data.find((c: Client) => c.id === selectedClientId);
          if (matched) setSelectedClient(matched);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [search]);

  useEffect(() => {
    if (selectedClientId) {
      const matched = clients.find((c) => c.id === selectedClientId);
      if (matched) {
        setSelectedClient(matched);
        setEditForm({
          firstName: matched.firstName,
          lastName: matched.lastName,
          email: matched.email || '',
          phone: matched.phone || '',
          address: matched.address || '',
          notes: matched.notes || '',
        });
      }
    }
  }, [selectedClientId, clients]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      if (res.ok) {
        const newClient = await res.json();
        setIsAddModalOpen(false);
        setAddForm({ firstName: '', lastName: '', email: '', phone: '', address: '', notes: '' });
        toast.success('Client profile created!');
        fetchClients();
        if (newClient.tempPassword) {
          setTempPassword(newClient.tempPassword);
        }
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to add client');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/clients/${selectedClientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setIsEditModalOpen(false);
        toast.success('Client profile updated!');
        fetchClients();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to update client');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    const currentSets = selectedClient.measurements?.sets || [];
    const newSet = {
      date: new Date().toISOString().split('T')[0],
      ...measureForm,
    };

    const updatedMeasurements = {
      ...selectedClient.measurements,
      sets: [newSet, ...currentSets],
    };

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/clients/${selectedClient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          measurements: updatedMeasurements,
        }),
      });

      if (res.ok) {
        setIsMeasureModalOpen(false);
        setMeasureForm({ chest: '', waist: '', hips: '', shoulder: '', sleeve: '', custom: '' });
        toast.success('Measurements recorded successfully!');
        fetchClients();
      } else {
        toast.error('Failed to log measurements');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = async () => {
    if (!selectedClientId) return;
    
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Client',
      message: 'Are you sure you want to permanently delete this client and all associated orders? This action cannot be undone.',
      onConfirm: async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        try {
          const res = await fetch(`/api/clients/${selectedClientId}`, { method: 'DELETE' });
          if (res.ok) {
            setSelectedClientId(null);
            setSelectedClient(null);
            toast.success('Client deleted successfully!');
            fetchClients();
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  // Upload sketch/photo
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !selectedClient) return;
    setUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const currentPhotos = selectedClient.measurements?.photos || [];
        const updatedMeasurements = {
          ...selectedClient.measurements,
          photos: [data.url, ...currentPhotos],
        };

        const updateRes = await fetch(`/api/clients/${selectedClient.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...editForm,
            measurements: updatedMeasurements,
          }),
        });

        if (updateRes.ok) {
          toast.success('Design sketch uploaded!');
          fetchClients();
        } else {
          toast.error('Failed to link uploaded photo to client');
        }
      } else {
        toast.error('Failed to upload file');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#f5f5f0] tracking-wide">Client Directory</h1>
          <p className="text-xs text-[#8e8e88] uppercase tracking-widest mt-1">Manage measurements and client profiles</p>
        </div>
        {!isStaff && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="luxury-btn-primary flex items-center gap-2 text-xs uppercase tracking-widest font-semibold px-4 py-2.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Client
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        {/* Left column: search and list */}
        <div className="bg-[#111] border border-[#1f1b12] rounded-xl flex flex-col overflow-hidden h-[600px]">
          <div className="p-4 border-b border-[#1f1b12]/50 flex items-center gap-2 bg-[#161616]">
            <Search className="w-4 h-4 text-[#8e8e88]" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none text-xs text-[#f5f5f0] w-full focus:outline-none placeholder-[#8e8e88]"
            />
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#1f1b12]/50">
            {loading ? (
              <div className="text-center py-12 text-xs text-[#8e8e88] uppercase tracking-widest animate-pulse">Loading profiles...</div>
            ) : clients.length === 0 ? (
              <div className="text-center py-12 text-xs text-[#8e8e88] italic">No clients found.</div>
            ) : (
              clients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => setSelectedClientId(client.id)}
                  className={`w-full text-left p-4 hover:bg-[#161616] transition-all flex items-center justify-between group ${
                    selectedClientId === client.id ? 'bg-[#d4af37]/5 border-l-2 border-[#d4af37]' : ''
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#f5f5f0]">
                      {client.firstName} {client.lastName}
                    </h4>
                    <p className="text-[10px] text-[#8e8e88] font-mono mt-1">
                      {client.phone || client.email || 'No contact details'}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8e8e88] group-hover:text-[#d4af37] transition-all" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right column: detail view */}
        <div className="lg:col-span-2 bg-[#111] border border-[#1f1b12] rounded-xl p-6 h-[600px] overflow-y-auto relative">
          {selectedClient ? (
            <div className="space-y-8">
              {/* Header profile cards */}
              <div className="flex items-start justify-between border-b border-[#1f1b12]/50 pb-5">
                <div>
                  <h2 className="text-2xl font-serif text-[#f5f5f0]">
                    {selectedClient.firstName} {selectedClient.lastName}
                  </h2>
                  <p className="text-[10px] text-[#d4af37] uppercase tracking-widest font-semibold mt-1">
                    Client since {new Date(selectedClient.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {!isStaff && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="p-2 border border-[#1f1b12] text-[#8e8e88] hover:text-[#d4af37] hover:bg-[#161616] rounded-lg transition-all cursor-pointer"
                      title="Edit Profile"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleDeleteClient}
                      className="p-2 border border-red-950 text-red-800 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-all cursor-pointer"
                      title="Delete Client"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Client Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div className="flex items-center gap-2 text-[#8e8e88]">
                  <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span className="truncate">{selectedClient.email || 'No email registered'}</span>
                </div>
                <div className="flex items-center gap-2 text-[#8e8e88]">
                  <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span>{selectedClient.phone || 'No phone registered'}</span>
                </div>
                <div className="flex items-center gap-2 text-[#8e8e88]">
                  <MapPin className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span className="truncate">{selectedClient.address || 'No address registered'}</span>
                </div>
              </div>

              {/* Client Notes */}
              {selectedClient.notes && (
                <div className="bg-[#161616] p-4 border border-[#1f1b12] rounded-lg text-xs leading-relaxed">
                  <p className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold mb-1">Designer Notes</p>
                  <p className="text-[#8e8e88] italic">{selectedClient.notes}</p>
                </div>
              )}

              {/* Measurements Timeline */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#1f1b12]/50 pb-2">
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-[#f5f5f0] flex items-center gap-1.5">
                    <Scissors className="w-4 h-4 text-[#d4af37]" /> Measurement Log
                  </h3>
                  {!isStaff && (
                    <button
                      onClick={() => setIsMeasureModalOpen(true)}
                      className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-[#d4af37] hover:underline cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Log Measurements
                    </button>
                  )}
                </div>

                {!selectedClient.measurements?.sets || selectedClient.measurements.sets.length === 0 ? (
                  <p className="text-xs text-[#8e8e88] italic py-4">No measurements recorded yet.</p>
                ) : (
                  <div className="space-y-4">
                    {selectedClient.measurements.sets.map((set: any, idx: number) => (
                      <div key={idx} className="border border-[#1f1b12] rounded-lg bg-[#161616] p-4 text-xs">
                        <div className="flex items-center gap-1.5 text-[#d4af37] font-bold uppercase tracking-wider mb-3">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Logged on {set.date}</span>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3.5 text-center">
                          <div className="bg-[#111] p-2 border border-[#1f1b12]/50 rounded">
                            <span className="text-[9px] uppercase tracking-widest text-[#8e8e88] font-semibold">Chest</span>
                            <p className="text-sm font-semibold font-mono text-[#f5f5f0] mt-0.5">{set.chest || 'N/A'}"</p>
                          </div>
                          <div className="bg-[#111] p-2 border border-[#1f1b12]/50 rounded">
                            <span className="text-[9px] uppercase tracking-widest text-[#8e8e88] font-semibold">Waist</span>
                            <p className="text-sm font-semibold font-mono text-[#f5f5f0] mt-0.5">{set.waist || 'N/A'}"</p>
                          </div>
                          <div className="bg-[#111] p-2 border border-[#1f1b12]/50 rounded">
                            <span className="text-[9px] uppercase tracking-widest text-[#8e8e88] font-semibold">Hips</span>
                            <p className="text-sm font-semibold font-mono text-[#f5f5f0] mt-0.5">{set.hips || 'N/A'}"</p>
                          </div>
                          <div className="bg-[#111] p-2 border border-[#1f1b12]/50 rounded">
                            <span className="text-[9px] uppercase tracking-widest text-[#8e8e88] font-semibold">Shoulder</span>
                            <p className="text-sm font-semibold font-mono text-[#f5f5f0] mt-0.5">{set.shoulder || 'N/A'}"</p>
                          </div>
                          <div className="bg-[#111] p-2 border border-[#1f1b12]/50 rounded">
                            <span className="text-[9px] uppercase tracking-widest text-[#8e8e88] font-semibold">Sleeve</span>
                            <p className="text-sm font-semibold font-mono text-[#f5f5f0] mt-0.5">{set.sleeve || 'N/A'}"</p>
                          </div>
                        </div>
                        {set.custom && (
                          <p className="mt-3 text-[11px] text-[#8e8e88] border-t border-[#1f1b12]/50 pt-2 font-serif italic">
                            Custom specs: {set.custom}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reference Photos */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#1f1b12]/50 pb-2">
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-[#f5f5f0] flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#d4af37]" /> Fabric & Design Sketches
                  </h3>
                  <label className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-[#d4af37] hover:underline cursor-pointer">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
                  </label>
                </div>

                {uploading && (
                  <div className="text-center py-4 text-xs text-[#d4af37] animate-pulse uppercase tracking-widest">Uploading image buffer...</div>
                )}

                {!selectedClient.measurements?.photos || selectedClient.measurements.photos.length === 0 ? (
                  <p className="text-xs text-[#8e8e88] italic py-2">No design sketches uploaded.</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {selectedClient.measurements.photos.map((photoUrl: string, idx: number) => (
                      <div key={idx} className="relative aspect-square border border-[#1f1b12] rounded-lg overflow-hidden bg-[#161616] group">
                        <img src={photoUrl} alt="Garment Sketch" className="object-cover w-full h-full hover:scale-105 transition-all duration-300" />
                        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <a href={photoUrl} download target="_blank" rel="noopener noreferrer" className="p-1.5 bg-[#111]/80 border border-[#d4af37] text-[#d4af37] rounded-md cursor-pointer hover:bg-[#d4af37]/20" title="Download Sketch">
                            <Download className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => {
                              setConfirmConfig({
                                isOpen: true,
                                title: 'Delete Photo',
                                message: 'Are you sure you want to remove this design sketch?',
                                onConfirm: async () => {
                                  setConfirmConfig(prev => ({ ...prev, isOpen: false }));
                                  const updatedPhotos = selectedClient.measurements.photos.filter((url: string) => url !== photoUrl);
                                  const updatedMeasurements = { ...selectedClient.measurements, photos: updatedPhotos };
                                  await fetch(`/api/clients/${selectedClient.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ ...editForm, measurements: updatedMeasurements }),
                                  });
                                  toast.success('Photo deleted');
                                  fetchClients();
                                }
                              });
                            }}
                            className="p-1.5 bg-red-950/80 border border-red-800 text-red-200 rounded-md cursor-pointer hover:bg-red-900/80"
                            title="Delete Sketch"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Order History */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-[#f5f5f0] border-b border-[#1f1b12]/50 pb-2">
                  Active & Past Orders
                </h3>
                {selectedClient.orders.length === 0 ? (
                  <p className="text-xs text-[#8e8e88] italic py-2">No orders created for this client.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedClient.orders.map((order) => (
                      <div key={order.id} className="border border-[#1f1b12] rounded-lg p-4 bg-[#161616] flex flex-col justify-between text-xs gap-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[#d4af37] font-semibold">{order.orderNumber}</span>
                          <span className="px-2 py-0.5 rounded text-[9px] tracking-wider uppercase font-semibold border border-[#d4af37]/20 bg-[#d4af37]/5 text-[#d4af37]">
                            {order.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <span className="text-[10px] text-[#8e8e88] uppercase tracking-wider font-semibold">Total Cost</span>
                            <p className="font-bold text-[#f5f5f0]">${order.totalAmount || 0}</p>
                          </div>
                          <span className="text-[10px] text-[#8e8e88] font-semibold">Due: {new Date(order.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
              <Scissors className="w-12 h-12 text-[#1f1b12]" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#8e8e88]">No Client Selected</h3>
              <p className="text-xs text-[#8e8e88] max-w-sm uppercase tracking-wider font-semibold">
                Choose a profile from the left pane to view details, measurements logs, design sketches, and invoices.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* OVERLAY MODAL: EDIT CLIENT PROFILE */}
      {isEditModalOpen && selectedClient && (
        <div className="fixed inset-0 bg-[#050505]/85 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-[#111] border border-[#1f1b12] rounded-xl p-6 relative">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-[#8e8e88] hover:text-[#f5f5f0] cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-serif text-[#f5f5f0] mb-4 uppercase tracking-widest border-b border-[#1f1b12] pb-2">Edit Client Profile</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">First Name</label>
                  <input type="text" required value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} className="w-full luxury-input" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Last Name</label>
                  <input type="text" required value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} className="w-full luxury-input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Email</label>
                  <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full luxury-input" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Phone</label>
                  <input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full luxury-input" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Address</label>
                <input type="text" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} className="w-full luxury-input" />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Notes</label>
                <textarea rows={3} value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} className="w-full luxury-input resize-none" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full luxury-btn-primary uppercase tracking-widest py-3 mt-2 disabled:opacity-50">
                {isSubmitting ? 'Saving Updates...' : 'Save Profile Updates'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* OVERLAY MODAL: ADD MEASUREMENTS SET */}
      {isMeasureModalOpen && (
        <div className="fixed inset-0 bg-[#050505]/85 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-[#111] border border-[#1f1b12] rounded-xl p-6 relative">
            <button onClick={() => setIsMeasureModalOpen(false)} className="absolute top-4 right-4 text-[#8e8e88] hover:text-[#f5f5f0] cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-serif text-[#f5f5f0] mb-4 uppercase tracking-widest border-b border-[#1f1b12] pb-2">Log New Measurements Set</h3>
            <form onSubmit={handleAddMeasurement} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Chest (inches)</label>
                  <input type="number" step="0.1" value={measureForm.chest} onChange={(e) => setMeasureForm({ ...measureForm, chest: e.target.value })} className="w-full luxury-input" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Waist (inches)</label>
                  <input type="number" step="0.1" value={measureForm.waist} onChange={(e) => setMeasureForm({ ...measureForm, waist: e.target.value })} className="w-full luxury-input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Hips (inches)</label>
                  <input type="number" step="0.1" value={measureForm.hips} onChange={(e) => setMeasureForm({ ...measureForm, hips: e.target.value })} className="w-full luxury-input" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Shoulder (inches)</label>
                  <input type="number" step="0.1" value={measureForm.shoulder} onChange={(e) => setMeasureForm({ ...measureForm, shoulder: e.target.value })} className="w-full luxury-input" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Sleeve Length (inches)</label>
                <input type="number" step="0.1" value={measureForm.sleeve} onChange={(e) => setMeasureForm({ ...measureForm, sleeve: e.target.value })} className="w-full luxury-input" />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Custom Notes (Height, Back Width, etc.)</label>
                <input type="text" value={measureForm.custom} onChange={(e) => setMeasureForm({ ...measureForm, custom: e.target.value })} className="w-full luxury-input" placeholder="e.g. Height: 5ft 8in, Hollow to Hem: 56in" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full luxury-btn-primary uppercase tracking-widest py-3 mt-2 disabled:opacity-50">
                {isSubmitting ? 'Logging...' : 'Log New Specs'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* OVERLAY MODAL: ADD CLIENT PROFILE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#050505]/85 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-[#111] border border-[#1f1b12] rounded-xl p-6 relative">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-[#8e8e88] hover:text-[#f5f5f0] cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-serif text-[#f5f5f0] mb-4 uppercase tracking-widest border-b border-[#1f1b12] pb-2">Add New Client</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">First Name</label>
                  <input type="text" required value={addForm.firstName} onChange={(e) => setAddForm({ ...addForm, firstName: e.target.value })} className="w-full luxury-input" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Last Name</label>
                  <input type="text" required value={addForm.lastName} onChange={(e) => setAddForm({ ...addForm, lastName: e.target.value })} className="w-full luxury-input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Email (For Login)</label>
                  <input type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} className="w-full luxury-input" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Phone</label>
                  <input type="text" value={addForm.phone} onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })} className="w-full luxury-input" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Notes</label>
                <textarea rows={3} value={addForm.notes} onChange={(e) => setAddForm({ ...addForm, notes: e.target.value })} className="w-full luxury-input resize-none" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full luxury-btn-primary uppercase tracking-widest py-3 mt-2 disabled:opacity-50">
                {isSubmitting ? 'Creating...' : 'Create Profile'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* OVERLAY MODAL: TEMP PASSWORD DISPLAY */}
      {tempPassword && (
        <div className="fixed inset-0 bg-[#050505]/85 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-[#111] border border-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.15)] rounded-xl p-6 relative text-center">
            <h3 className="text-lg font-serif text-[#d4af37] mb-2 uppercase tracking-widest">Client Created!</h3>
            <p className="text-xs text-[#8e8e88] mb-4 leading-relaxed">
              Please copy and share this temporary password securely with the client. They will be forced to change it on their first login.
            </p>
            <div className="bg-[#161616] border border-[#1f1b12] p-4 rounded-lg mb-6">
              <p className="text-2xl font-mono text-[#f5f5f0] tracking-widest select-all">{tempPassword}</p>
            </div>
            <button onClick={() => setTempPassword(null)} className="w-full luxury-btn-primary uppercase tracking-widest py-3 font-semibold">
              I've copied it
            </button>
          </div>
        </div>
      )}

      {/* OVERLAY MODAL: CONFIRMATION */}
      {confirmConfig.isOpen && (
        <div className="fixed inset-0 bg-[#050505]/85 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-[#111] border border-red-900/50 shadow-[0_0_30px_rgba(153,27,27,0.15)] rounded-xl p-6 relative text-center">
            <h3 className="text-lg font-serif text-red-400 mb-2 uppercase tracking-widest">{confirmConfig.title}</h3>
            <p className="text-xs text-[#8e8e88] mb-6 leading-relaxed">
              {confirmConfig.message}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))} 
                className="flex-1 py-3 text-xs uppercase tracking-widest text-[#8e8e88] bg-[#161616] border border-[#1f1b12] rounded-md hover:text-[#f5f5f0] transition-colors font-semibold"
              >
                Cancel
              </button>
              <button 
                onClick={confirmConfig.onConfirm} 
                className="flex-1 py-3 text-xs uppercase tracking-widest text-red-100 bg-red-950/80 border border-red-800 rounded-md hover:bg-red-900 transition-colors font-semibold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
