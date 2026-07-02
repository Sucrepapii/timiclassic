'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  AlertTriangle,
  Calendar,
  Filter,
  Scissors,
  ArrowRight,
  RefreshCw,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  client: { firstName: string; lastName: string };
  status: string;
  priority: string;
  dueDate: string | null;
  garments: { name: string }[];
  tasks: { id: string; status: string; dueDate: string | null }[];
}

const COLUMNS = [
  { id: 'DRAFT', name: 'Draft' },
  { id: 'CONFIRMED', name: 'Confirmed' },
  { id: 'DESIGN_PHASE', name: 'Design Phase' },
  { id: 'FABRIC_SOURCING', name: 'Sourcing' },
  { id: 'CUTTING', name: 'Cutting' },
  { id: 'SEWING', name: 'Sewing' },
  { id: 'FITTING', name: 'Fitting' },
  { id: 'QUALITY_CHECK', name: 'Quality Check' },
  { id: 'COMPLETED', name: 'Completed' },
  { id: 'DELIVERED', name: 'Delivered' },
  { id: 'CANCELLED', name: 'Cancelled' },
];

export default function KanbanPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [activeCol, setActiveCol] = useState(COLUMNS[0].id);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  // HTML5 Drag Handlers
  const handleDragStart = (e: React.DragEvent, orderId: string) => {
    e.dataTransfer.setData('text/plain', orderId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Required to allow dropping
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData('text/plain');
    if (!orderId) return;

    // Optimistic Update
    const previousOrders = [...orders];
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: targetStatus } : o))
    );

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus }),
      });

      if (!res.ok) {
        throw new Error('Update failed');
      }
    } catch (err) {
      // Revert on fail
      console.error(err);
      setOrders(previousOrders);
      toast.error('Could not update status. Reverting state.');
    }
  };

  // Helpers
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'border-red-650 bg-red-950/20 text-red-400';
      case 'HIGH':
        return 'border-amber-600 bg-amber-950/10 text-amber-400';
      case 'MEDIUM':
        return 'border-[#d4af37]/30 bg-[#d4af37]/5 text-[#d4af37]';
      default:
        return 'border-[#1f1b12] bg-[#161616] text-[#8e8e88]';
    }
  };

  const isOverdue = (dateStr: string | null) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date() && new Date(dateStr).toDateString() !== new Date().toDateString();
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (priorityFilter && o.priority !== priorityFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs uppercase tracking-widest text-[#d4af37]">Organizing kanban board...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#f5f5f0] tracking-wide flex items-center gap-2">
            Production Pipeline
          </h1>
          <p className="text-xs text-[#8e8e88] uppercase tracking-widest mt-1">
            Drag cards between columns to update sewing and design phases
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Priority filter */}
          <div className="flex items-center gap-2 bg-[#111] border border-[#1f1b12] px-3 py-2 rounded-lg text-xs">
            <Filter className="w-4 h-4 text-[#d4af37]" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent border-none text-[#f5f5f0] focus:outline-none cursor-pointer"
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          {/* Mobile column selector */}
          <div className="flex lg:hidden items-center gap-2 bg-[#111] border border-[#1f1b12] px-3 py-2 rounded-lg text-xs">
            <Layers className="w-4 h-4 text-[#d4af37]" />
            <select
              value={activeCol}
              onChange={(e) => setActiveCol(e.target.value)}
              className="bg-transparent border-none text-[#f5f5f0] focus:outline-none cursor-pointer"
            >
              {COLUMNS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRefresh}
            className={`p-2.5 border border-[#1f1b12] bg-[#111] text-[#8e8e88] hover:text-[#d4af37] rounded-lg transition-all cursor-pointer ${
              refreshing ? 'animate-spin text-[#d4af37]' : ''
            }`}
            title="Refresh Board"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Kanban Scroll Container */}
      <div className="flex-1 overflow-x-auto pb-4 flex gap-4 min-h-[550px] items-stretch">
        {COLUMNS.map((col) => {
          const colOrders = filteredOrders.filter((o) => o.status === col.id);
          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`w-full lg:w-72 bg-[#111] border border-[#1f1b12] rounded-xl flex-col shrink-0 overflow-hidden ${
                col.id === activeCol ? 'flex' : 'hidden lg:flex'
              }`}
            >
              {/* Column header */}
              <div className="p-4 border-b border-[#1f1b12]/50 bg-[#161616] flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest font-bold text-[#f5f5f0]">
                  {col.name}
                </span>
                <span className="text-[10px] bg-[#1f1b12] text-[#d4af37] px-2 py-0.5 rounded font-mono font-bold">
                  {colOrders.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[500px]">
                {colOrders.length === 0 ? (
                  <div className="h-full border border-dashed border-[#1f1b12]/50 rounded-lg flex items-center justify-center p-6 text-center text-[10px] text-[#8e8e88] uppercase tracking-wider font-semibold">
                    Drop items here
                  </div>
                ) : (
                  colOrders.map((order) => {
                    const overdue = isOverdue(order.dueDate);
                    const overdueTasksCount = order.tasks.filter((t) => t.status !== 'DONE' && t.dueDate && isOverdue(t.dueDate)).length;
                    return (
                      <div
                        key={order.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, order.id)}
                        className={`luxury-card p-4 space-y-3 cursor-grab active:cursor-grabbing relative overflow-hidden bg-[#161616] ${
                          overdue ? 'border-red-900/60 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : ''
                        }`}
                      >
                        {/* Overdue alert indicator line */}
                        {overdue && (
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-650" />
                        )}

                        {/* Top Line */}
                        <div className="flex items-center justify-between">
                          <Link
                            href={`/orders/${order.id}`}
                            className="font-mono text-xs text-[#d4af37] hover:underline font-bold"
                          >
                            {order.orderNumber}
                          </Link>
                          <div className="flex items-center gap-2">
                            <select
                              className="lg:hidden text-[9px] bg-[#111] border border-[#1f1b12] text-[#8e8e88] rounded px-1 outline-none py-0.5 cursor-pointer max-w-[80px]"
                              value={order.status}
                              onChange={async (e) => {
                                const newStatus = e.target.value;
                                const previousOrders = [...orders];
                                setOrders((prev) =>
                                  prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
                                );
                                try {
                                  const res = await fetch(`/api/orders/${order.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: newStatus }),
                                  });
                                  if (!res.ok) throw new Error('Update failed');
                                } catch (err) {
                                  setOrders(previousOrders);
                                  toast.error('Could not update status.');
                                }
                              }}
                            >
                              {COLUMNS.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[8px] tracking-wider uppercase font-bold border ${getPriorityColor(
                                order.priority
                              )}`}
                            >
                              {order.priority}
                            </span>
                          </div>
                        </div>

                        {/* Client details */}
                        <div>
                          <p className="text-[11px] font-medium text-[#f5f5f0] uppercase tracking-wider">
                            {order.client.firstName} {order.client.lastName}
                          </p>
                          <p className="text-[10px] text-[#8e8e88] mt-1.5 flex items-center gap-1 font-semibold">
                            <Scissors className="w-3.5 h-3.5 text-[#d4af37]" />
                            {order.garments?.[0]?.name || 'Custom item'}
                          </p>
                        </div>

                        {/* Footer card metrics */}
                        <div className="border-t border-[#1f1b12]/50 pt-2.5 flex items-center justify-between text-[9px] text-[#8e8e88] font-semibold uppercase tracking-wider">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span className={overdue ? 'text-red-400 font-bold' : ''}>
                              {order.dueDate ? new Date(order.dueDate).toLocaleDateString() : 'N/A'}
                            </span>
                          </span>

                          {overdueTasksCount > 0 && (
                            <span className="flex items-center gap-0.5 text-red-400 font-bold">
                              <AlertTriangle className="w-3 h-3 text-red-500" />
                              {overdueTasksCount} overdue
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
