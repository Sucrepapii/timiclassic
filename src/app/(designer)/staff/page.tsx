'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, PowerOff, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StaffManagementPage() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === 'ADMIN';
  const router = useRouter();

  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [staffForm, setStaffForm] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ id: string, type: 'DEACTIVATE' | 'REACTIVATE' | 'DELETE' } | null>(null);

  useEffect(() => {
    if (!isAdmin && session) {
      router.push('/dashboard');
      return;
    }
    if (isAdmin) {
      fetchStaffList();
    }
  }, [isAdmin, session, router]);

  const fetchStaffList = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/staff');
      if (res.ok) {
        setStaffList(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingStaffId(null);
    setStaffForm({ name: '', email: '', password: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (staff: any) => {
    setEditingStaffId(staff.id);
    setStaffForm({ name: staff.name, email: staff.email, password: '' }); // password empty = no change
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingStaffId ? `/api/staff/${editingStaffId}` : '/api/staff';
      const method = editingStaffId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staffForm),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save staff account');
      }

      toast.success(`Staff account ${editingStaffId ? 'updated' : 'created'} successfully!`);
      setIsModalOpen(false);
      fetchStaffList();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeToggleActive = async () => {
    if (!confirmAction) return;
    const { id: staffId, type } = confirmAction;
    setConfirmAction(null);

    try {
      if (type === 'DELETE') {
        const res = await fetch(`/api/staff/${staffId}?hard=true`, {
          method: 'DELETE',
        });
        if (res.ok) {
          toast.success('Staff member permanently deleted');
          fetchStaffList();
        } else {
          const err = await res.json();
          toast.error(err.error || 'Failed to delete staff member');
        }
      } else {
        const isActive = type === 'REACTIVATE';
        const res = await fetch(`/api/staff/${staffId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive }),
        });
        if (res.ok) {
          toast.success(`Staff member ${!isActive ? 'deactivated' : 'reactivated'}`);
          fetchStaffList();
        } else {
          toast.error('Failed to change active status');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="space-y-6 h-full flex flex-col relative">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-[#f5f5f0] tracking-wide">Staff Management</h1>
          <p className="text-xs text-[#8e8e88] uppercase tracking-widest mt-1">
            Manage your design team and access controls
          </p>
        </div>
        <button onClick={openCreateModal} className="luxury-btn-primary flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest cursor-pointer">
          <Plus className="w-4 h-4" />
          Add Staff
        </button>
      </div>

      <div className="bg-[#111] border border-[#1f1b12] rounded-xl overflow-hidden shadow-2xl flex-1">
        {loading ? (
          <div className="text-center py-12 text-xs text-[#8e8e88] uppercase tracking-widest animate-pulse">Loading staff...</div>
        ) : staffList.length === 0 ? (
          <div className="text-center py-12 text-[#8e8e88] italic text-sm">No staff members found.</div>
        ) : (
          <table className="w-full text-left text-sm text-[#f5f5f0]">
            <thead className="text-[10px] uppercase tracking-widest text-[#8e8e88] bg-[#161616] border-b border-[#1f1b12]">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1b12]">
              {staffList.map((staff) => (
                <tr key={staff.id} className="hover:bg-[#161616]/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-[#d4af37] flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#8e8e88]" />
                    {staff.name}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{staff.email}</td>
                  <td className="px-6 py-4">
                    {staff.isActive ? (
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase tracking-widest rounded-full">Active</span>
                    ) : (
                      <span className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] uppercase tracking-widest rounded-full">Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => openEditModal(staff)} className="text-[#8e8e88] hover:text-[#d4af37] transition-colors cursor-pointer" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setConfirmAction({ id: staff.id, type: staff.isActive ? 'DEACTIVATE' : 'REACTIVATE' })} className={`${staff.isActive ? 'text-[#8e8e88] hover:text-amber-400' : 'text-[#8e8e88] hover:text-emerald-400'} transition-colors cursor-pointer`} title={staff.isActive ? 'Deactivate' : 'Reactivate'}>
                        <PowerOff className="w-4 h-4" />
                      </button>
                      <button onClick={() => setConfirmAction({ id: staff.id, type: 'DELETE' })} className="text-[#8e8e88] hover:text-red-400 transition-colors cursor-pointer" title="Permanently Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-[#1f1b12] rounded-xl p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-[#8e8e88] hover:text-[#f5f5f0] cursor-pointer">
              ✕
            </button>
            <h3 className="text-lg font-serif text-[#f5f5f0] mb-6 uppercase tracking-widest border-b border-[#1f1b12] pb-2">
              {editingStaffId ? 'Edit Staff Member' : 'Add Staff Member'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Full Name</label>
                <input type="text" required value={staffForm.name} onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })} className="w-full luxury-input" />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Email Address</label>
                <input type="email" required value={staffForm.email} onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })} className="w-full luxury-input" />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Password</label>
                <input type="text" required={!editingStaffId} value={staffForm.password} onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })} className="w-full luxury-input" placeholder={editingStaffId ? "Leave blank to keep unchanged" : "They will be forced to change this"} />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full luxury-btn-primary flex items-center justify-center gap-2 uppercase tracking-widest py-3 mt-4 disabled:opacity-50 cursor-pointer">
                {isSubmitting ? 'Saving...' : 'Save Staff Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM CONFIRMATION MODAL */}
      {confirmAction && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-[#1f1b12] rounded-xl p-8 max-w-sm w-full shadow-2xl relative text-center">
            <h3 className="text-lg font-serif text-[#f5f5f0] mb-2 uppercase tracking-widest">
              {confirmAction.type === 'DELETE' ? 'Permanently Delete Staff?' : confirmAction.type === 'DEACTIVATE' ? 'Deactivate Staff?' : 'Reactivate Staff?'}
            </h3>
            <p className="text-xs text-[#8e8e88] mb-8">
              {confirmAction.type === 'DELETE'
                ? 'This action is irreversible. It will completely delete their account if they have no tied records.'
                : confirmAction.type === 'DEACTIVATE'
                ? 'They will no longer be able to log in to the Timiclassic Command Center. Their history will remain intact.'
                : 'They will instantly regain access to log in with their existing credentials.'}
            </p>
            <div className="flex gap-4">
              <button onClick={() => setConfirmAction(null)} className="flex-1 px-4 py-2 text-xs uppercase tracking-widest text-[#8e8e88] hover:text-[#f5f5f0] border border-[#1f1b12] rounded-lg hover:bg-[#161616] transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={executeToggleActive} className={`flex-1 px-4 py-2 text-xs uppercase tracking-widest font-bold rounded-lg transition-colors cursor-pointer ${confirmAction.type === 'REACTIVATE' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/50 hover:bg-emerald-900/80' : 'bg-red-950/60 text-red-400 border border-red-900/50 hover:bg-red-900/80'}`}>
                {confirmAction.type === 'DELETE' ? 'Delete' : confirmAction.type === 'DEACTIVATE' ? 'Deactivate' : 'Reactivate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
