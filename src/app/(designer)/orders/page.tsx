'use client';

import React, { useState, useEffect } from 'react';
import {
  Scissors,
  Plus,
  DollarSign,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  client: { firstName: string; lastName: string };
  status: string;
  priority: string;
  totalAmount: number | null;
  depositPaid: number | null;
  balanceDue: number | null;
  dueDate: string | null;
  garments: { id: string; name: string }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-neutral-900 border-neutral-800 text-neutral-400';
      case 'CONFIRMED':
        return 'bg-blue-950/20 border-blue-900/40 text-blue-400';
      case 'SEWING':
      case 'CUTTING':
        return 'bg-amber-950/20 border-amber-900/40 text-amber-400';
      case 'FITTING':
      case 'QUALITY_CHECK':
        return 'bg-purple-950/20 border-purple-900/40 text-purple-400';
      case 'COMPLETED':
      case 'DELIVERED':
        return 'bg-emerald-950/20 border-emerald-900/40 text-emerald-400';
      default:
        return 'bg-[#d4af37]/5 border-[#d4af37]/20 text-[#d4af37]';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'border-red-900/60 bg-red-950/20 text-red-400 font-bold';
      case 'HIGH':
        return 'border-amber-700 bg-amber-950/15 text-amber-400';
      case 'MEDIUM':
        return 'border-[#d4af37]/35 bg-[#d4af37]/5 text-[#d4af37]';
      default:
        return 'border-[#1f1b12] text-[#8e8e88]';
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const nameMatch = `${o.client.firstName} ${o.client.lastName}`.toLowerCase().includes(search.toLowerCase()) || o.orderNumber.toLowerCase().includes(search.toLowerCase());
    const statusMatch = !statusFilter || o.status === statusFilter;
    const priorityMatch = !priorityFilter || o.priority === priorityFilter;
    return nameMatch && statusMatch && priorityMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#f5f5f0] tracking-wide">Timiclassic Orders</h1>
          <p className="text-xs text-[#8e8e88] uppercase tracking-widest mt-1">Track garment designs, workflows, and invoice finances</p>
        </div>
      </div>

      {/* Filter panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#111] border border-[#1f1b12] p-4 rounded-xl">
        <div className="flex items-center gap-2 bg-[#161616] border border-[#1f1b12]/50 px-3 py-2 rounded-lg text-xs">
          <Search className="w-4 h-4 text-[#8e8e88]" />
          <input
            type="text"
            placeholder="Search by order or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none text-[#f5f5f0] focus:outline-none w-full placeholder-[#8e8e88]"
          />
        </div>

        <div className="flex items-center gap-2 bg-[#161616] border border-[#1f1b12]/50 px-3 py-2 rounded-lg text-xs">
          <Layers className="w-4 h-4 text-[#d4af37]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-none text-[#f5f5f0] focus:outline-none cursor-pointer w-full"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="DESIGN_PHASE">Design Phase</option>
            <option value="FABRIC_SOURCING">Sourcing</option>
            <option value="CUTTING">Cutting</option>
            <option value="SEWING">Sewing</option>
            <option value="FITTING">Fitting</option>
            <option value="QUALITY_CHECK">Quality Check</option>
            <option value="COMPLETED">Completed</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-[#161616] border border-[#1f1b12]/50 px-3 py-2 rounded-lg text-xs">
          <Filter className="w-4 h-4 text-[#d4af37]" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-transparent border-none text-[#f5f5f0] focus:outline-none cursor-pointer w-full"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      {/* Orders Table list */}
      <div className="bg-[#111] border border-[#1f1b12] rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#161616] border-b border-[#1f1b12]/50 uppercase tracking-widest text-[#8e8e88] font-bold text-[9px]">
                <th className="p-4">Order Number</th>
                <th className="p-4">Client Name</th>
                <th className="p-4">Garments</th>
                <th className="p-4">Status</th>
                <th className="p-4">Priority</th>
                <th className="p-4 text-right">Total Price</th>
                <th className="p-4 text-right">Deposit</th>
                <th className="p-4 text-right">Balance Due</th>
                <th className="p-4">Due Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1b12]/40 text-[#f5f5f0]">
              {loading ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-[#8e8e88] uppercase tracking-widest animate-pulse">Loading orders...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-[#8e8e88] italic">No custom clothing orders matching the filters.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const balance = order.balanceDue || 0;
                  return (
                    <tr key={order.id} className="hover:bg-[#161616]/50 transition-all">
                      <td className="p-4 font-mono font-bold text-[#d4af37]">{order.orderNumber}</td>
                      <td className="p-4 font-semibold uppercase tracking-wider">{order.client.firstName} {order.client.lastName}</td>
                      <td className="p-4 text-[#8e8e88] font-medium">
                        {order.garments?.[0]?.name || 'Unspecified'}
                        {order.garments.length > 1 && ` (+${order.garments.length - 1})`}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 border rounded text-[9px] font-bold uppercase tracking-wider ${getStatusBadgeColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-1.5 py-0.5 border rounded text-[9px] font-semibold tracking-wider ${getPriorityBadgeColor(order.priority)}`}>
                          {order.priority}
                        </span>
                      </td>
                      <td className="p-4 text-right font-semibold">${order.totalAmount?.toLocaleString() || '0.00'}</td>
                      <td className="p-4 text-right text-emerald-400 font-medium">${order.depositPaid?.toLocaleString() || '0.00'}</td>
                      <td className="p-4 text-right text-amber-500 font-bold">${balance.toLocaleString() || '0.00'}</td>
                      <td className="p-4 font-medium">
                        {order.dueDate ? new Date(order.dueDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4 text-center">
                        <Link
                          href={`/orders/${order.id}`}
                          className="inline-flex items-center gap-1 bg-transparent hover:bg-[#d4af37]/10 border border-[#1f1b12] hover:border-[#d4af37]/35 text-[#8e8e88] hover:text-[#d4af37] px-2.5 py-1.5 rounded transition-all font-semibold uppercase tracking-widest text-[9px]"
                        >
                          Details <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
