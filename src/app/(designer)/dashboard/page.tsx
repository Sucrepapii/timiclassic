'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Scissors,
  Users,
  Layers,
  Banknote,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Sparkles,
  TrendingUp,
  AlertCircle,
  X
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  client: { firstName: string; lastName: string };
  status: string;
  dueDate: string;
  totalAmount: number;
}

interface Analytics {
  metrics: {
    clientCount: number;
    activeOrders: number;
    tasksDue: number;
    revenueThisMonth: number;
    depositsThisMonth: number;
    allTimeRevenue: number;
  };
  charts: {
    revenueTrends: { name: string; revenue: number }[];
    popularGarments: { name: string; value: number }[];
  };
  recentOrders: Order[];
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<Analytics | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quick Action Modal States
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Form states
  const [clientForm, setClientForm] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', notes: '', portalPassword: '' });
  const [orderForm, setOrderForm] = useState({ clientId: '', totalAmount: '', depositPaid: '', dueDate: '', notes: '', garments: [{ name: '', description: '', fabricType: '', color: '' }] });
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'MEDIUM', orderId: '', dueDate: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = (session?.user as any)?.role === 'ADMIN';
  const isStaff = (session?.user as any)?.role === 'STAFF';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, clientsRes] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/clients'),
      ]);

      if (!analyticsRes.ok || !clientsRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const analyticsData = await analyticsRes.json();
      const clientsData = await clientsRes.json();

      setData(analyticsData);
      setClients(clientsData);
    } catch (err: any) {
      setError(err.message || 'An error occurred loading the dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Quick Action Handlers
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientForm),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create client');
      }
      setIsClientModalOpen(false);
      setClientForm({ firstName: '', lastName: '', email: '', phone: '', address: '', notes: '', portalPassword: '' });
      toast.success('Client created successfully!');
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderForm),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create order');
      }
      setIsOrderModalOpen(false);
      setOrderForm({ clientId: '', totalAmount: '', depositPaid: '', dueDate: '', notes: '', garments: [{ name: '', description: '', fabricType: '', color: '' }] });
      toast.success('Order initialized successfully!');
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskForm),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create task');
      }
      setIsTaskModalOpen(false);
      setTaskForm({ title: '', description: '', priority: 'MEDIUM', orderId: '', dueDate: '' });
      toast.success('Task created successfully!');
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs uppercase tracking-widest text-[#d4af37]">Assembling metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 bg-red-950/40 border border-red-900/60 text-red-200 p-5 rounded-lg text-sm">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  const { metrics, charts, recentOrders } = data!;

  // Mini Calendar generation
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
  const startDayOfWeek = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay();

  return (
    <div className="space-y-10">
      {/* Welcome Hero banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#111] to-[#161616] border border-[#1f1b12] rounded-xl p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-full bg-[#d4af37]/5 blur-[60px] pointer-events-none" />
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Welcome back
          </span>
          <h1 className="text-3xl font-serif text-[#f5f5f0] tracking-wide">
            Timi Classic Dashboard
          </h1>
          <p className="text-xs text-[#8e8e88] mt-1.5 uppercase tracking-widest max-w-lg">
            Manage your bespoke luxury items, measurement cards, and order pipelines from a single hub.
          </p>
        </div>

        {/* Quick action triggers */}
        <div className="flex flex-wrap gap-3.5 shrink-0 z-10">
          <button
            onClick={() => setIsClientModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase border border-[#d4af37] text-[#d4af37] px-4 py-2.5 rounded-lg hover:bg-[#d4af37]/5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Client
          </button>
          {!isStaff && (
            <>
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase border border-[#d4af37] text-[#d4af37] px-4 py-2.5 rounded-lg hover:bg-[#d4af37]/5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> New Order
              </button>
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase bg-[#d4af37] text-[#050505] px-4 py-2.5 rounded-lg hover:opacity-95 hover:shadow-[0_0_12px_rgba(212,175,55,0.3)] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-black" /> Add Task
              </button>
            </>
          )}
          {isAdmin && (
            <Link
              href="/staff"
              className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase border border-[#d4af37] text-[#d4af37] px-4 py-2.5 rounded-lg hover:bg-[#d4af37]/5 transition-all cursor-pointer"
            >
              <Users className="w-4 h-4" /> Manage Team
            </Link>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#111] border border-[#1f1b12] rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#8e8e88] font-semibold">Active Orders</p>
            <h3 className="text-3xl font-serif font-bold text-[#f5f5f0] mt-1">{metrics.activeOrders}</h3>
            <span className="text-[9px] text-[#d4af37] uppercase tracking-wider font-semibold mt-1 block">In Production</span>
          </div>
          <div className="w-12 h-12 bg-[#161616] border border-[#1f1b12] rounded-lg flex items-center justify-center text-[#d4af37]">
            <Scissors className="w-5 h-5" />
          </div>
        </div>

        {!isStaff && (
          <div className="bg-[#111] border border-[#1f1b12] rounded-xl p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#8e8e88] font-semibold">Revenue This Month</p>
              <h3 className="text-3xl font-serif font-bold text-[#f5f5f0] mt-1">
                ₦{metrics.revenueThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <span className="text-[9px] text-[#8e8e88] uppercase tracking-wider font-semibold mt-1 block">
                Deposits: ₦{metrics.depositsThisMonth.toLocaleString()}
              </span>
            </div>
            <div className="w-12 h-12 bg-[#161616] border border-[#1f1b12] rounded-lg flex items-center justify-center text-[#d4af37]">
              <Banknote className="w-5 h-5" />
            </div>
          </div>
        )}

        <div className="bg-[#111] border border-[#1f1b12] rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#8e8e88] font-semibold">Pending Tasks</p>
            <h3 className="text-3xl font-serif font-bold text-[#f5f5f0] mt-1">{metrics.tasksDue}</h3>
            <span className="text-[9px] text-[#d4af37] uppercase tracking-wider font-semibold mt-1 block">Requires Action</span>
          </div>
          <div className="w-12 h-12 bg-[#161616] border border-[#1f1b12] rounded-lg flex items-center justify-center text-[#d4af37]">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#111] border border-[#1f1b12] rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#8e8e88] font-semibold">Total Clients</p>
            <h3 className="text-3xl font-serif font-bold text-[#f5f5f0] mt-1">{metrics.clientCount}</h3>
            <span className="text-[9px] text-[#8e8e88] uppercase tracking-wider font-semibold mt-1 block">Registered Users</span>
          </div>
          <div className="w-12 h-12 bg-[#161616] border border-[#1f1b12] rounded-lg flex items-center justify-center text-[#d4af37]">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Analytics Trends Charts */}
      {!isStaff && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue SVG Chart */}
          <div className="bg-[#111] border border-[#1f1b12] rounded-xl p-6 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm uppercase tracking-widest font-semibold flex items-center gap-1 text-[#f5f5f0]">
              <TrendingUp className="w-4 h-4 text-[#d4af37]" /> Revenue Trend (Last 6 Months)
            </h3>
          </div>
          
          <div className="relative h-60 w-full flex items-end justify-between px-2 pt-8 border-b border-[#1f1b12]">
            {charts.revenueTrends.map((month, idx) => {
              const maxVal = Math.max(...charts.revenueTrends.map((t) => t.revenue), 100);
              const heightPct = (month.revenue / maxVal) * 80;
              return (
                <div key={idx} className="flex flex-col items-center flex-1 group">
                  {/* Tooltip */}
                  <span className="absolute bottom-24 opacity-0 group-hover:opacity-100 bg-[#161616] border border-[#d4af37]/30 text-[#d4af37] text-[10px] px-2 py-1 rounded transition-opacity shadow-md pointer-events-none">
                    ₦{month.revenue.toLocaleString()}
                  </span>
                  {/* Bar */}
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-8 xs:w-12 bg-gradient-to-t from-[#997420] to-[#d4af37] rounded-t-sm group-hover:opacity-90 transition-all shadow-[0_0_10px_rgba(212,175,55,0.15)]"
                  />
                  <span className="text-[10px] uppercase tracking-wider text-[#8e8e88] mt-3 font-semibold">
                    {month.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Categories */}
        <div className="bg-[#111] border border-[#1f1b12] rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-widest font-semibold text-[#f5f5f0]">
              Popular Garments
            </h3>
            {charts.popularGarments.length === 0 ? (
              <p className="text-xs text-[#8e8e88] italic py-8 text-center">No garment details logged yet.</p>
            ) : (
              <div className="space-y-4 pt-2">
                {charts.popularGarments.map((garment, idx) => {
                  const maxVal = Math.max(...charts.popularGarments.map((g) => g.value), 1);
                  const widthPct = (garment.value / maxVal) * 100;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-[#f5f5f0]">{garment.name}</span>
                        <span className="text-[#d4af37]">{garment.value} items</span>
                      </div>
                      <div className="w-full bg-[#161616] border border-[#1f1b12] h-2.5 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${widthPct}%` }}
                          className="bg-gradient-to-r from-[#997420] to-[#d4af37] h-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="border-t border-[#1f1b12]/50 pt-4 mt-6">
            <p className="text-[10px] text-[#8e8e88] uppercase tracking-widest font-semibold leading-relaxed">
              Timiclassic client garments distributions.
            </p>
          </div>
        </div>
      </div>
      )}

      {/* Recent Orders & Deadlines calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List */}
        <div className="bg-[#111] border border-[#1f1b12] rounded-xl p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1f1b12]/50 pb-3">
            <h3 className="text-sm uppercase tracking-widest font-semibold text-[#f5f5f0]">
              Recent Custom Orders
            </h3>
            <Link href="/orders" className="text-xs text-[#d4af37] hover:underline font-semibold uppercase tracking-wider">
              View All
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-[#8e8e88] italic py-10 text-center">No orders created yet.</p>
          ) : (
            <div className="divide-y divide-[#1f1b12]/40">
              {recentOrders.map((order) => (
                <div key={order.id} className="py-3.5 flex items-center justify-between text-xs">
                  <div>
                    <Link
                      href={`/orders/${order.id}`}
                      className="font-mono text-[#d4af37] hover:underline font-bold"
                    >
                      {order.orderNumber}
                    </Link>
                    <p className="text-[#f5f5f0] font-medium mt-0.5">
                      Client: {order.client.firstName} {order.client.lastName}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] tracking-wider uppercase font-semibold border border-[#d4af37]/20 bg-[#d4af37]/5 text-[#d4af37]">
                      {order.status}
                    </span>
                    <p className="text-[#8e8e88] text-[10px] mt-1 uppercase font-semibold">
                      Due: {order.dueDate ? new Date(order.dueDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Deadlines Calendar View */}
        <div className="bg-[#111] border border-[#1f1b12] rounded-xl p-6 space-y-4">
          <h3 className="text-sm uppercase tracking-widest font-semibold text-[#f5f5f0] flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-[#d4af37]" /> Upcoming Deadlines
          </h3>
          <p className="text-[11px] text-[#8e8e88] uppercase tracking-wider font-semibold">
            {currentMonthName} {new Date().getFullYear()}
          </p>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-[#8e8e88] font-bold uppercase tracking-wider border-b border-[#1f1b12]/50 pb-2">
            <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
          </div>

          <div className="grid grid-cols-7 gap-1 pt-1 font-mono">
            {/* Blank spaces for offset */}
            {Array.from({ length: startDayOfWeek }).map((_, idx) => (
              <div key={`blank-${idx}`} className="py-2.5" />
            ))}

            {/* Month days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const hasOrder = recentOrders.some((o) => o.dueDate && new Date(o.dueDate).getDate() === day);
              return (
                <div
                  key={`day-${day}`}
                  className={`py-2.5 text-center text-xs rounded transition-all flex flex-col items-center justify-center relative ${
                    hasOrder
                      ? 'border border-[#d4af37] bg-[#d4af37]/5 text-[#d4af37] font-bold'
                      : 'text-[#8e8e88] hover:bg-[#161616]'
                  }`}
                >
                  {day}
                  {hasOrder && (
                    <span className="w-1 h-1 bg-[#d4af37] rounded-full absolute bottom-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* OVERLAY MODAL: NEW CLIENT */}
      {isClientModalOpen && (
        <div className="fixed inset-0 bg-[#050505]/85 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-[#111] border border-[#1f1b12] rounded-xl p-6 relative">
            <button onClick={() => setIsClientModalOpen(false)} className="absolute top-4 right-4 text-[#8e8e88] hover:text-[#f5f5f0] cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-serif text-[#f5f5f0] mb-4 uppercase tracking-widest border-b border-[#1f1b12] pb-2">New Client Profile</h3>
            <form onSubmit={handleCreateClient} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">First Name</label>
                  <input type="text" required value={clientForm.firstName} onChange={(e) => setClientForm({ ...clientForm, firstName: e.target.value })} className="w-full luxury-input" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Last Name</label>
                  <input type="text" required value={clientForm.lastName} onChange={(e) => setClientForm({ ...clientForm, lastName: e.target.value })} className="w-full luxury-input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Email</label>
                  <input type="email" value={clientForm.email} onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })} className="w-full luxury-input" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Phone</label>
                  <input type="text" value={clientForm.phone} onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })} className="w-full luxury-input" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Notes</label>
                <textarea rows={3} value={clientForm.notes} onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })} className="w-full luxury-input resize-none" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full luxury-btn-primary uppercase tracking-widest py-3 mt-2 disabled:opacity-50">
                {isSubmitting ? 'Creating Profile...' : 'Add Client Profile'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* OVERLAY MODAL: NEW ORDER */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-[#050505]/85 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-[#111] border border-[#1f1b12] rounded-xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsOrderModalOpen(false)} className="absolute top-4 right-4 text-[#8e8e88] hover:text-[#f5f5f0] cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-serif text-[#f5f5f0] mb-4 uppercase tracking-widest border-b border-[#1f1b12] pb-2">New Clothing Order</h3>
            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Select Client</label>
                <select required value={orderForm.clientId} onChange={(e) => setOrderForm({ ...orderForm, clientId: e.target.value })} className="w-full luxury-input">
                  <option value="">-- Choose Client --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Total Cost (₦)</label>
                  <input type="number" required value={orderForm.totalAmount} onChange={(e) => setOrderForm({ ...orderForm, totalAmount: e.target.value })} className="w-full luxury-input" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Deposit Paid (₦)</label>
                  <input type="number" value={orderForm.depositPaid} onChange={(e) => setOrderForm({ ...orderForm, depositPaid: e.target.value })} className="w-full luxury-input" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Due Date</label>
                <input type="date" required value={orderForm.dueDate} onChange={(e) => setOrderForm({ ...orderForm, dueDate: e.target.value })} className="w-full luxury-input" />
              </div>
              <div className="border border-[#1f1b12] p-3 rounded-lg bg-[#161616] space-y-3">
                <p className="text-[10px] uppercase text-[#d4af37] font-semibold">Garment Information</p>
                <div>
                  <label className="block text-[9px] uppercase text-[#8e8e88] mb-1">Garment Name (e.g. Wedding Gown)</label>
                  <input type="text" required value={orderForm.garments[0].name} onChange={(e) => {
                    const updated = [...orderForm.garments];
                    updated[0].name = e.target.value;
                    setOrderForm({ ...orderForm, garments: updated });
                  }} className="w-full luxury-input bg-[#111]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] uppercase text-[#8e8e88] mb-1">Fabric Type</label>
                    <input type="text" value={orderForm.garments[0].fabricType} onChange={(e) => {
                      const updated = [...orderForm.garments];
                      updated[0].fabricType = e.target.value;
                      setOrderForm({ ...orderForm, garments: updated });
                    }} className="w-full luxury-input bg-[#111]" />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase text-[#8e8e88] mb-1">Color</label>
                    <input type="text" value={orderForm.garments[0].color} onChange={(e) => {
                      const updated = [...orderForm.garments];
                      updated[0].color = e.target.value;
                      setOrderForm({ ...orderForm, garments: updated });
                    }} className="w-full luxury-input bg-[#111]" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Notes / Instructions</label>
                <textarea rows={3} value={orderForm.notes} onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })} className="w-full luxury-input resize-none" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full luxury-btn-primary uppercase tracking-widest py-3 mt-2 disabled:opacity-50">
                {isSubmitting ? 'Initializing...' : 'Initialize Order'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* OVERLAY MODAL: ADD TASK */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-[#050505]/85 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-[#111] border border-[#1f1b12] rounded-xl p-6 relative">
            <button onClick={() => setIsTaskModalOpen(false)} className="absolute top-4 right-4 text-[#8e8e88] hover:text-[#f5f5f0] cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-serif text-[#f5f5f0] mb-4 uppercase tracking-widest border-b border-[#1f1b12] pb-2">Add New Work Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Linked Order</label>
                <select required value={taskForm.orderId} onChange={(e) => setTaskForm({ ...taskForm, orderId: e.target.value })} className="w-full luxury-input">
                  <option value="">-- Choose Order Number --</option>
                  {recentOrders.map((o) => (
                    <option key={o.id} value={o.id}>{o.orderNumber} ({o.client.firstName} {o.client.lastName})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Task Title</label>
                <input type="text" required value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} className="w-full luxury-input" placeholder="e.g. Fabric Sourcing, Sewing Blazer Sleeves" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Priority</label>
                  <select required value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })} className="w-full luxury-input">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Due Date</label>
                  <input type="date" required value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} className="w-full luxury-input" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Task Details</label>
                <textarea rows={3} value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} className="w-full luxury-input resize-none" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full luxury-btn-primary uppercase tracking-widest py-3 mt-2 disabled:opacity-50">
                {isSubmitting ? 'Adding...' : 'Add Task'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
